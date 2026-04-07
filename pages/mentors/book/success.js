import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import { withIronSessionSsr } from 'iron-session/next'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

export default function BookingSuccess({ currentUser }) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  
  const { mentorName, sessionTime, mentorId } = router.query

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/dashboard/ex-convict')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <Navbar currentUser={currentUser} />
        <div className="page-container text-center">
          <p>Please log in to view this page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      
      <main className="page-container">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Session Booked Successfully!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your mentorship session has been confirmed
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Session Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mentor</p>
                  <p className="font-semibold text-gray-900">{mentorName || 'Your Mentor'}</p>
                </div>
              </div>

              {sessionTime && (
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Session Time</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(sessionTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">60 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">What Happens Next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📨 Message Your Mentor</h3>
                  <p className="text-gray-600 text-sm">
                    A conversation has been started with your mentor. Use the messaging system to introduce yourself and discuss your goals.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-green-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📝 Prepare for Your Session</h3>
                  <p className="text-gray-600 text-sm">
                    Think about what you'd like to discuss: career goals, challenges you're facing, or specific advice you need.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-purple-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🤝 Attend Your Session</h3>
                  <p className="text-gray-600 text-sm">
                    Your mentor will provide guidance, support, and practical advice to help you on your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips for Success */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">💡 Tips for a Successful Session</h2>
            
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Be open and honest about your goals and challenges</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Prepare specific questions in advance</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Take notes during your session</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Follow up with action items after the meeting</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/messages"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              💬 Message Your Mentor
            </Link>
            
            <Link 
              href="/dashboard/ex-convict"
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              📊 Go to Dashboard
            </Link>

            <Link 
              href="/mentors"
              className="px-6 py-3 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition-colors text-center"
            >
              👥 Book Another Session
            </Link>
          </div>

          {/* Auto-redirect Notice */}
          <div className="text-center text-sm text-gray-500">
            <p>Automatically redirecting to dashboard in {countdown} seconds...</p>
            <Link href="/dashboard/ex-convict" className="text-blue-600 hover:text-blue-800">
              Go to dashboard now
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return { props: { currentUser: req.session.user || null } }
}, sessionOptions)