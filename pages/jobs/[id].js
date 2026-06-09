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

function getCategoryInfo(title = '') {
  const t = title.toLowerCase()
  if (t.includes('it ') || t.includes('tech') || t.includes('software') || t.includes('data') || t.includes('developer') || t.includes('support technician') || t.includes('network') || t.includes('systems'))
    return { label: 'Technology', color: 'bg-blue-100 text-blue-700' }
  if (t.includes('finance') || t.includes('financial') || t.includes('accountant') || t.includes('analyst') || t.includes('audit') || t.includes('treasury'))
    return { label: 'Finance', color: 'bg-emerald-100 text-emerald-700' }
  if (t.includes('human resources') || t.includes('hr ') || t.includes('recruitment') || t.includes('people') || t.includes('talent'))
    return { label: 'Human Resources', color: 'bg-purple-100 text-purple-700' }
  if (t.includes('marketing') || t.includes('brand') || t.includes('communication') || t.includes('media') || t.includes('content'))
    return { label: 'Marketing', color: 'bg-orange-100 text-orange-700' }
  if (t.includes('health') || t.includes('medical') || t.includes('nurse') || t.includes('clinical') || t.includes('patient'))
    return { label: 'Healthcare', color: 'bg-red-100 text-red-700' }
  return { label: 'Operations', color: 'bg-slate-100 text-slate-700' }
}

function getInitials(company = '', title = '') {
  const source = company || title
  const words = source.trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return source.substring(0, 2).toUpperCase()
}

const STATUS_MAP = {
  PENDING:  { text: 'Application Submitted',  badge: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⏳' },
  REVIEWED: { text: 'Under Review',            badge: 'bg-blue-100 text-blue-800 border-blue-200',       icon: '👀' },
  ACCEPTED: { text: 'Application Accepted',    badge: 'bg-green-100 text-green-800 border-green-200',    icon: '✅' },
  REJECTED: { text: 'Application Declined',    badge: 'bg-red-100 text-red-800 border-red-200',          icon: '❌' },
}

export default function JobDetail({ currentUser }) {
  const router = useRouter()
  const { id } = router.query
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axios.get(`/api/jobs/${id}`)
      .then(res => {
        setJob(res.data.job)
        if (currentUser?.role === 'EX_CONVICT' && res.data.job.applications) {
          const mine = res.data.job.applications.find(a => a.userId === currentUser.id)
          if (mine) { setHasApplied(true); setApplicationStatus(mine.status) }
        }
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [id, currentUser])

  const startConversation = async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantIds: [job.employerId],
          type: 'JOB_APPLICATION',
          title: `Job Application: ${job.title}`,
          relatedJobId: parseInt(id),
        }),
      })
      if (res.ok) router.push('/messages')
    } catch (e) { console.error(e) }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-700"></div>
          <span className="text-gray-600">Loading job details…</span>
        </div>
      </div>
    </div>
  )

  if (error || !job) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h1>
        <p className="text-gray-500 mb-6">{error || 'This position may no longer be available.'}</p>
        <Link href="/jobs" className="px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium">
          Browse All Jobs
        </Link>
      </div>
    </div>
  )

  const catInfo = getCategoryInfo(job.title)
  const initials = getInitials(job.company, job.title)
  const statusInfo = STATUS_MAP[applicationStatus] || STATUS_MAP.PENDING

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />

      {/* Hero header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-lg tracking-wide">{initials}</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${catInfo.color}`}>
                  {catInfo.label}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/20">
                  Full-time
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-200 border border-green-400/20">
                  Actively Recruiting
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 leading-tight">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
                {job.company && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {job.company}
                  </span>
                )}
                {job.location && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Posted {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main content */}
          <div className="flex-1 space-y-6">

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-slate-700 rounded-full inline-block"></span>
                Job Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full inline-block"></span>
                  Requirements &amp; Qualifications
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{job.requirements}</p>
              </div>
            )}

            {/* Application action card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              {currentUser?.role === 'EX_CONVICT' ? (
                hasApplied ? (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Your Application</h2>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium mb-5 ${statusInfo.badge}`}>
                      <span>{statusInfo.icon}</span>
                      <span>{statusInfo.text}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-6">
                      Your application is being processed. You can message the employer or browse other opportunities below.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={startConversation}
                        className="px-5 py-2.5 border-2 border-slate-800 text-slate-800 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Message Employer
                      </button>
                      <Link
                        href={`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        My Applications
                      </Link>
                      <Link
                        href="/jobs"
                        className="px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Browse More Jobs
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Apply?</h2>
                      <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                        Submit your application and take the next step in your professional career. Our inclusive employers welcome all qualified candidates.
                      </p>
                    </div>
                    <Link
                      href={`/jobs/apply?jobId=${job.id}`}
                      className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors text-sm whitespace-nowrap shadow-md"
                    >
                      Apply Now
                    </Link>
                  </div>
                )
              ) : currentUser?.role === 'EMPLOYER' ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Your Job Posting</h2>
                    <p className="text-gray-600 text-sm">Manage applicants and edit your posting details.</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/dashboard/employer`} className="px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                      View Applications
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4 text-sm">
                    {!currentUser ? 'Please sign in to apply for this position.' : 'This feature is available for registered job seekers.'}
                  </p>
                  {!currentUser && (
                    <Link href="/login" className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                      Sign In to Apply
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Employer: applications list */}
            {currentUser?.role === 'EMPLOYER' && currentUser.id === job.userId && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Applications <span className="text-gray-400 font-normal">({job.applications?.length || 0})</span>
                </h2>
                {!job.applications?.length ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 font-medium mb-1">No applications yet</p>
                    <p className="text-sm text-gray-400">Applications will appear here once candidates apply.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {job.applications.map(app => (
                      <div key={app.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900">{app.user?.name || app.user?.email}</h3>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                app.status === 'PENDING'  ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800'    :
                                app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800'  :
                                'bg-red-100 text-red-800'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                              Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            {app.coverLetter && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Cover Letter</p>
                                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{app.coverLetter}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <button className="px-4 py-1.5 text-xs font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              View Profile
                            </button>
                            <button className="px-4 py-1.5 text-xs font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
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

          {/* Sidebar */}
          <div className="lg:w-72 space-y-6">

            {/* Key details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Position Details</h3>
              <dl className="space-y-4">
                {job.salary && (
                  <div>
                    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Salary</dt>
                    <dd className="text-sm font-semibold text-emerald-700">{job.salary}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Employment Type</dt>
                  <dd className="text-sm text-gray-700">Full-time</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Industry</dt>
                  <dd className="text-sm text-gray-700">{catInfo.label}</dd>
                </div>
                {job.location && (
                  <div>
                    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Location</dt>
                    <dd className="text-sm text-gray-700">{job.location}</dd>
                  </div>
                )}
                {job.company && (
                  <div>
                    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Company</dt>
                    <dd className="text-sm text-gray-700">{job.company}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Second-chance pledge */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">Second-Chance Employer</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This employer is committed to fair and inclusive hiring practices, evaluating candidates on their skills, potential, and commitment.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/jobs" className="block text-center px-4 py-3 border-2 border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:border-slate-500 hover:text-slate-900 transition-colors">
              ← Browse All Positions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return { props: { currentUser: req.session.user || null } }
}, sessionOptions)
