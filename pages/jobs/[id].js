import { useRouter } from 'next/router'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import Navbar from '../../components/Navbar'
import Link from 'next/link'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

export default function JobDetail({ currentUser }) {
  const router = useRouter()
  const { id } = router.query
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState(null)

  useEffect(()=>{
    if (!id) return
    setLoading(true)
    axios.get(`/api/jobs/${id}`)
      .then(res => {
        setJob(res.data.job)
        
        // Check if current user has already applied
        if (currentUser?.role === 'EX_CONVICT' && res.data.job.applications) {
          const userApplication = res.data.job.applications.find(
            app => app.userId === currentUser.id
          )
          if (userApplication) {
            setHasApplied(true)
            setApplicationStatus(userApplication.status)
          }
        }
      })
      .catch(err=>setError(err.response?.data?.message || err.message))
      .finally(()=>setLoading(false))
  }, [id, currentUser])

  const getApplicationStatusDisplay = () => {
    switch(applicationStatus) {
      case 'PENDING':
        return { text: 'Application Submitted', color: 'text-yellow-600 bg-yellow-100', icon: '⏳' }
      case 'REVIEWED':
        return { text: 'Under Review', color: 'text-blue-600 bg-blue-100', icon: '👀' }
      case 'ACCEPTED':
        return { text: 'Application Accepted', color: 'text-green-600 bg-green-100', icon: '✅' }
      case 'REJECTED':
        return { text: 'Application Declined', color: 'text-red-600 bg-red-100', icon: '❌' }
      default:
        return { text: 'Applied', color: 'text-gray-600 bg-gray-100', icon: '📝' }
    }
  }

  const startConversation = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantIds: [job.employerId],
          type: 'JOB_APPLICATION',
          title: `Job Application: ${job.title}`,
          relatedJobId: parseInt(id)
        })
      })
      
      if (response.ok) {
        router.push('/messages')
      } else {
        console.error('Failed to start conversation')
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
    }
  }

  if (loading || !job) return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading job details...</span>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/jobs" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Browse All Jobs
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            
            {/* Job Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <span className="mr-4">📍 {job.location || 'Remote'}</span>
                <span className="mr-4">🏢 {job.company}</span>
                <span>📅 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                </div>
              </div>
            )}

            {/* Application Section */}
            <div className="border-t border-gray-200 pt-6">
              {currentUser?.role === 'EX_CONVICT' ? (
                hasApplied ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`px-4 py-2 rounded-lg font-medium ${getApplicationStatusDisplay().color}`}>
                        {getApplicationStatusDisplay().icon} {getApplicationStatusDisplay().text}
                      </div>
                    </div>
                    <div className="space-x-3">
                      {hasApplied && (
                        <button 
                          onClick={startConversation}
                          className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50"
                        >
                          💬 Message Employer
                        </button>
                      )}
                      <Link 
                        href={`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        View All Applications
                      </Link>
                      <Link 
                        href="/jobs"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Browse More Jobs
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to apply?</h3>
                      <p className="text-gray-600">Submit your application and take the next step in your career.</p>
                    </div>
                    <Link 
                      href={`/jobs/apply?jobId=${job.id}`} 
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </Link>
                  </div>
                )
              ) : currentUser?.role === 'EMPLOYER' && currentUser.id === job.userId ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Job Posting</h3>
                    <p className="text-gray-600">Manage your job posting and review applications.</p>
                  </div>
                  <div className="space-x-3">
                    <Link 
                      href={`/jobs/${job.id}/edit`} 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Edit Posting
                    </Link>
                    <Link 
                      href={`/dashboard/employer`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      View Applications
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    {!currentUser ? 'Please log in to apply for this position' : 'This feature is available for job seekers'}
                  </p>
                  {!currentUser && (
                    <Link 
                      href="/login" 
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Log In to Apply
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Applications for Employer */}
            {currentUser?.role === 'EMPLOYER' && currentUser.id === job.userId && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Applications ({job.applications?.length || 0})
                </h2>
                {!job.applications || job.applications.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">No applications yet</p>
                    <p className="text-sm text-gray-500">Applications will appear here when candidates apply</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {job.applications.map(app => (
                      <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900">{app.user?.name || app.user?.email}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' :
                                app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                            {app.coverLetter && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Cover Letter:</p>
                                <p className="text-sm text-gray-600 mt-1">{app.coverLetter}</p>
                              </div>
                            )}
                          </div>
                          <div className="ml-4 space-y-2">
                            <button className="block w-full px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                              View Profile
                            </button>
                            <button className="block w-full px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return { props: { currentUser: req.session.user || null } }
}, sessionOptions)
