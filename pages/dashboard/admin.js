import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

export default function AdminDashboard({ currentUser }) {
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [mentorApplications, setMentorApplications] = useState([])
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    exConvicts: 0,
    employers: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') return
    
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [usersRes, jobsRes, appsRes, mentorsRes] = await Promise.all([
          axios.get('/api/admin/users'),
          axios.get('/api/jobs'),
          axios.get('/api/jobs/applications'),
          axios.get('/api/admin/mentors')
        ])
        
        const allUsers = usersRes.data.users || []
        const allJobs = jobsRes.data.jobs || []
        const allApplications = appsRes.data.applications || []
        const allMentors = mentorsRes.data || []
        
        setUsers(allUsers)
        setJobs(allJobs)
        setApplications(allApplications)
        setMentorApplications(allMentors)
        
        // Calculate stats
        const exConvicts = allUsers.filter(u => u.role === 'EX_CONVICT').length
        const employers = allUsers.filter(u => u.role === 'EMPLOYER').length
        
        setStats({
          totalUsers: allUsers.length,
          totalJobs: allJobs.length,
          totalApplications: allApplications.length,
          exConvicts,
          employers
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser])

  const handleMentorAction = async (mentorId, action) => {
    try {
      await axios.post('/api/admin/mentors', {
        mentorId,
        action
      })

      // Update local state
      setMentorApplications(prev => 
        prev.map(mentor => 
          mentor.id === mentorId 
            ? { ...mentor, status: action }
            : mentor
        )
      )

      // Show success message
      alert(`Mentor application ${action.toLowerCase()} successfully!`)
    } catch (error) {
      alert('Failed to update mentor application')
      console.error(error)
    }
  }

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen">
        <Navbar currentUser={currentUser} />
        <div className="page-container text-center">
          <p>Access denied. This dashboard is for administrators only.</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Platform overview and management</p>
              </div>
              <div className="flex space-x-3">
                <Link href="/admin/reports" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Reports</Link>
                <Link href="/settings" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Settings</Link>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
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
                  <p className="text-sm font-medium text-gray-600">Ex-Convicts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.exConvicts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Employers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.employers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-red-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.slice(0, 5).map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{user.name || user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.role === 'EX_CONVICT' ? 'bg-green-100 text-green-800' :
                            user.role === 'EMPLOYER' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-xs text-gray-500">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-xs text-blue-600 hover:text-blue-800">View</button>
                        <button className="text-xs text-gray-600 hover:text-gray-800">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mentor Applications */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Mentor Applications</h2>
                <div className="flex space-x-2">
                  <span className="text-sm text-gray-500">
                    Pending: {mentorApplications.filter(m => m.status === 'PENDING').length}
                  </span>
                </div>
              </div>

              {mentorApplications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No mentor applications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mentorApplications.filter(m => m.status === 'PENDING').slice(0, 5).map(mentor => (
                    <div key={mentor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{mentor.user?.name || mentor.user?.email}</p>
                        <p className="text-xs text-gray-600 mt-1">{mentor.expertise}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Applied: {new Date(mentor.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleMentorAction(mentor.id, 'APPROVED')}
                          className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleMentorAction(mentor.id, 'REJECTED')}
                          className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => setSelectedMentor(mentor)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Platform Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Link href="/admin/activity" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>
              </div>

              <div className="space-y-4">
                {applications.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="bg-blue-500 p-2 rounded-full">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{app.user?.name || app.user?.email}</span>
                        {' applied to '}
                        <span className="font-medium">{app.job?.title}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}

                {jobs.slice(0, 3).map(job => (
                  <div key={`job-${job.id}`} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="bg-green-500 p-2 rounded-full">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        New job posted: <span className="font-medium">{job.title}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}