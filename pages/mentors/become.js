import { useState } from 'react'
import { useRouter } from 'next/router'
import { withIronSessionSsr } from 'iron-session/next'
import Navbar from '../../components/Navbar'
import Link from 'next/link'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

export default function BecomeMentor({ currentUser }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    bio: '',
    expertise: '',
    experience: '',
    availability: '',
    motivation: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/mentors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ensure credentials are sent for session-based auth
        credentials: 'same-origin',
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log('[become mentor] response', response.status, data)
      
      if (response.ok) {
        setMessage('Application submitted successfully! We will review your application and get back to you soon.')
        setTimeout(() => {
          router.push('/mentors')
        }, 3000)
      } else {
        setMessage(data.message || 'Error submitting application')
      }
    } catch (error) {
      console.error('[become mentor] submit error', error)
      setMessage('Error submitting application')
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">Please log in to apply as a mentor.</p>
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Mentor</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Help others on their reintegration journey by sharing your experience, skills, and guidance.
              Make a meaningful impact in someone's life.
            </p>
          </div>

          {/* Why Mentor Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Become a Mentor?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Make an Impact</h3>
                <p className="text-gray-600">Guide someone through their reintegration journey and help them succeed</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Story</h3>
                <p className="text-gray-600">Use your experiences to inspire and motivate others</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Community</h3>
                <p className="text-gray-600">Be part of a supportive community working towards positive change</p>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mentor Application</h2>
            
            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.includes('success') 
                ? 'bg-green-100 border-green-500 text-green-700' 
                : 'bg-red-100 border-red-500 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Bio *
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Tell us about yourself, your background, and why you want to be a mentor.
                </p>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Share your story and what motivates you to help others..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Expertise *
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  What specific areas can you provide guidance in? (e.g., Job Search, Career Development, Life Skills, etc.)
                </p>
                <input
                  type="text"
                  id="expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Job Search, Career Development, Financial Planning"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Experience *
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Describe your professional background, education, or life experiences that qualify you as a mentor.
                </p>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your relevant experience, education, certifications, or personal journey..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Availability *
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  When are you typically available for mentoring sessions?
                </p>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select your availability</option>
                  <option value="weekdays-morning">Weekdays - Morning (9 AM - 12 PM)</option>
                  <option value="weekdays-afternoon">Weekdays - Afternoon (12 PM - 5 PM)</option>
                  <option value="weekdays-evening">Weekdays - Evening (5 PM - 8 PM)</option>
                  <option value="weekends-morning">Weekends - Morning (9 AM - 12 PM)</option>
                  <option value="weekends-afternoon">Weekends - Afternoon (12 PM - 5 PM)</option>
                  <option value="weekends-evening">Weekends - Evening (5 PM - 8 PM)</option>
                  <option value="flexible">Flexible - Can adjust schedule as needed</option>
                </select>
              </div>

              <div>
                <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
                  Motivation *
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Why do you want to become a mentor? What do you hope to achieve?
                </p>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Explain your motivation for becoming a mentor and what you hope to achieve..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Requirements Section */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mentor Requirements</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Commit to at least 3 months of mentoring
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Available for 1-2 hours per week
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Maintain professional boundaries and confidentiality
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Complete basic mentor training (provided)
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-6">
                <Link 
                  href="/mentors"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back to Mentors
                </Link>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return { props: { currentUser: req.session.user || null } }
}, sessionOptions)