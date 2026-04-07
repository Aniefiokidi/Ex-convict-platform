import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

export default function EmployerDashboard({ currentUser }) {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, pendingApplications: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'EMPLOYER') return
    
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [jobsRes, appsRes] = await Promise.all([
          axios.get('/api/jobs'),
          axios.get('/api/jobs/applications')
        ])
        
        // Filter jobs to employer's own jobs
        const myJobs = jobsRes.data.jobs.filter(j => j.employerId === currentUser.id)
        setJobs(myJobs)
        
        const myApplications = appsRes.data.jobs || []
        setApplications(myApplications)
        
        // Calculate stats
        const totalApplications = myApplications.reduce((sum, job) => sum + (job.applications?.length || 0), 0)
        const pendingApplications = myApplications.reduce((sum, job) => 
          sum + (job.applications?.filter(app => app.status === 'PENDING').length || 0), 0)
        
        setStats({
          totalJobs: myJobs.length,
          totalApplications,
          pendingApplications
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser])

  if (!currentUser || currentUser.role !== 'EMPLOYER') {
    return (
      <div className="min-h-screen">
        <Navbar currentUser={currentUser} />
        <div className="page-container text-center">
          <p>Access denied. This dashboard is for employers only.</p>
          <Link href="/" className="text-blue-600">Return to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      
      <main className="page-container">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {currentUser.name || currentUser.email}</p>
              </div>
              <div className="flex space-x-3">
                <Link href="/jobs/post" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Post New Job</Link>
                <Link href="/profile" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Profile</Link>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Job Postings */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Job Postings</h2>
                <Link href="/jobs/post" className="text-sm text-blue-600 hover:text-blue-800">Post new job</Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2" />
                  </svg>
                  <p className="text-gray-500 text-sm mb-4">You haven't posted any jobs yet</p>
                  <Link href="/jobs/post" className="btn-primary text-sm px-4 py-2">Post your first job</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 5).map(job => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{job.location || 'Remote'}</p>
                          <p className="text-gray-500 text-xs mt-2">
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/jobs/${job.id}`} className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                          <Link href={`/jobs/${job.id}/edit`} className="text-sm text-gray-600 hover:text-gray-800">Edit</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                <Link href="/applications" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map(job => (
                    <div key={job.id}>
                      <h4 className="font-medium text-gray-900 mb-2">{job.title}</h4>
                      {job.applications?.slice(0, 3).map(app => (
                        <div key={app.id} className="border rounded-lg p-3 mb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{app.user?.name || app.user?.email}</p>
                              <p className="text-gray-600 text-xs">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' :
                                app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {app.status || 'PENDING'}
                              </span>
                              <button className="text-xs text-blue-600 hover:text-blue-800">Review</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}