import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import Navbar from '../../../components/Navbar'
import Link from 'next/link'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

export default function ApplicationSuccess({ currentUser }) {
  const router = useRouter()
  const { jobId, jobTitle } = router.query
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Auto-redirect to dashboard after 5 seconds
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    const redirectTimer = setTimeout(() => {
      router.push(`/dashboard/${currentUser?.role?.toLowerCase().replace('_', '-') || 'ex-convict'}`)
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [router, currentUser])

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">Please log in to view this page.</p>
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully! 🎉
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Your application for <span className="font-semibold text-blue-600">{jobTitle || 'the position'}</span> has been sent to the employer.
            </p>

            {/* What Happens Next */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Employer Review</h3>
                    <p className="text-gray-600">The employer will review your application and profile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Status Updates</h3>
                    <p className="text-gray-600">You'll receive notifications about your application status</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Interview Invitation</h3>
                    <p className="text-gray-600">If selected, the employer will contact you for an interview</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href={`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Applications
                </Link>
                <Link 
                  href="/jobs"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse More Jobs
                </Link>
              </div>

              <div className="text-sm text-gray-500">
                Automatically redirecting to your dashboard in {countdown} seconds...
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-8 p-6 bg-yellow-50 rounded-lg text-left">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Tips for Success</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Complete your profile to increase your chances</li>
                <li>• Follow up politely if you don't hear back within a week</li>
                <li>• Continue applying to similar positions to maximize opportunities</li>
                <li>• Consider reaching out to mentors for interview preparation</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return { props: { currentUser: req.session.user || null } }
}, sessionOptions)