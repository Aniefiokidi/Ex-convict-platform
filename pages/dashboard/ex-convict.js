import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

export default function ExConvictDashboard({ currentUser }) {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'EX_CONVICT') return
    
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [jobsRes, appsRes, trainingsRes, mentorsRes, enrollmentsRes, bookingsRes] = await Promise.all([
          axios.get('/api/jobs'),
          axios.get('/api/jobs/applications'),
          axios.get('/api/trainings'),
          axios.get('/api/mentors'),
          axios.get('/api/enrollments'),
          axios.get('/api/bookings')
        ])
        
        setJobs(jobsRes.data.jobs || [])
        setApplications(appsRes.data.applications || [])
        setEnrollments(enrollmentsRes.data.enrollments || [])
        setBookings(bookingsRes.data.bookings || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser])

  if (!currentUser || currentUser.role !== 'EX_CONVICT') {
    return (
      <div className="min-h-screen">
        <Navbar currentUser={currentUser} />
        <div className="page-container text-center">
          <p>Access denied. This dashboard is for returning citizens only.</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser.name || currentUser.email}</h1>
                <p className="text-gray-600 mt-1">Your journey to success continues here</p>
              </div>
              <div className="flex space-x-3">
                <Link href="/profile" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Profile</Link>
                <Link href="/settings" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Settings</Link>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Link href="/jobs" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Find Jobs</h3>
                  <p className="text-xs text-gray-500">Browse opportunities</p>
                </div>
              </div>
            </Link>

            <Link href="/trainings" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-green-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Training</h3>
                  <p className="text-xs text-gray-500">Develop skills</p>
                </div>
              </div>
            </Link>

            <Link href="/mentors" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-purple-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Mentorship</h3>
                  <p className="text-xs text-gray-500">Get guidance</p>
                </div>
              </div>
            </Link>

            <Link href="/mentors/become" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-orange-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Become a Mentor</h3>
                  <p className="text-xs text-gray-500">Help others succeed</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Job Applications */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Applications</h2>
                <Link href="/jobs" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No applications yet</p>
                  <Link href="/jobs" className="text-blue-600 text-sm hover:text-blue-800">Find jobs to apply</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 3).map(app => (
                    <div key={app.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm">{app.job?.title || 'Job Title'}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status || 'PENDING'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Jobs */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Latest Jobs</h2>
                <Link href="/jobs" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>
              </div>
              
              {jobs.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No jobs available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 3).map(job => (
                    <div key={job.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm">{job.title}</h4>
                      <p className="text-gray-600 text-xs mt-1">{job.location || 'Remote'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        <Link href={`/jobs/${job.id}`} className="text-xs text-blue-600 hover:text-blue-800">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Training Enrollments */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Training</h2>
                <Link href="/trainings" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No training enrollments yet</p>
                  <Link href="/trainings" className="text-blue-600 text-sm hover:text-blue-800">Explore training courses</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments.slice(0, 3).map(enrollment => (
                    <div key={enrollment.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{enrollment.training?.title || 'Training Course'}</h4>
                          <p className="text-gray-600 text-xs mt-1">{enrollment.training?.description?.substring(0, 100)}...</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">
                              📅 Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                            </span>
                            {enrollment.training?.schedule && (
                              <span className="text-xs text-gray-500">
                                🕒 {enrollment.training.schedule}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Mentor Sessions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Mentor Sessions</h2>
                <Link href="/mentors" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>
              </div>
              
              {bookings.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No mentor sessions yet</p>
                  <Link href="/mentors" className="text-blue-600 text-sm hover:text-blue-800">Book a session with a mentor</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 3).map(booking => (
                    <div key={booking.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{booking.mentor?.user?.name || 'Mentor Session'}</h4>
                          <p className="text-gray-600 text-xs mt-1">{booking.mentor?.expertise || 'General Mentorship'}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">
                              📅 {new Date(booking.time).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              🕒 {new Date(booking.time).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            new Date(booking.time) > new Date() 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {new Date(booking.time) > new Date() ? 'Upcoming' : 'Completed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Applications Sent</span>
                    <span className="font-medium">{applications.length}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Training Courses</span>
                    <span className="font-medium">{enrollments.length}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Mentor Sessions</span>
                    <span className="font-medium">{bookings.length}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/profile" className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Complete Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}