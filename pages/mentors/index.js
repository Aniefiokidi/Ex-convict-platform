import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

const fetcher = url => axios.get(url).then(r => r.data)

export default function Mentors({ currentUser }) {
  const { data, error } = useSWR('/api/mentors', fetcher)
  const router = useRouter()
  const [booking, setBooking] = useState(null)

  const handleBook = async (mentorId) => {
    if (!currentUser) {
      alert('Please log in to book a session')
      return
    }
    
    // Get mentor details for success page
    const mentor = data.mentors.find(m => m.id === mentorId)
    
    setBooking(mentorId)
    try {
      const time = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
      const response = await axios.post('/api/mentors/book', { mentorId, time })
      
      // Redirect to success page with booking details
      router.push({
        pathname: '/mentors/book/success',
        query: {
          mentorName: mentor?.name || 'Your Mentor',
          mentorId: mentorId,
          sessionTime: time
        }
      })
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed')
    } finally {
      setBooking(null)
    }
  }

  const handleMessage = async (mentorId) => {
    if (!currentUser) {
      alert('Please log in to message mentors')
      return
    }

    try {
      // Create or get existing conversation with mentor
      const response = await axios.post('/api/conversations', {
        participantIds: [mentorId],
        type: 'DIRECT',
        title: `Conversation with ${data.mentors.find(m => m.id === mentorId)?.name}`
      })
      
      // Redirect to messages page
      router.push('/messages')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start conversation')
    }
  }

  if (error) return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="page-container text-center">
        <div className="text-red-600">Failed to load mentors</div>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="page-container text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading mentors...</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      
      <main className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Mentorship & Counseling</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Connect with experienced mentors and counselors who understand your journey
            </p>
            
            {/* Become a Mentor CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/mentors/become"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                🌟 Become a Mentor
              </Link>
              <p className="text-sm text-gray-500">
                Share your experience and help others succeed
              </p>
            </div>
          </div>

          {data.mentors.length === 0 ? (
            <div className="card text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Mentors Available</h3>
              <p className="text-gray-600">Check back soon for available mentors!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 slide-up">
              {data.mentors.map((mentor, index) => (
                <div 
                  key={mentor.id} 
                  className="card hover:shadow-2xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-800">{mentor.name}</h3>
                      {mentor.expertise && (
                        <p className="text-blue-600 font-medium text-sm">{mentor.expertise}</p>
                      )}
                    </div>
                  </div>
                  
                  {mentor.bio && (
                    <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{mentor.bio}</p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">Available</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">60 min sessions</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleMessage(mentor.id)}
                      className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium"
                    >
                      💬 Message
                    </button>
                    
                    <button 
                      onClick={() => handleBook(mentor.id)}
                      disabled={booking === mentor.id}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {booking === mentor.id ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Booking...
                        </div>
                      ) : (
                        '📅 Book Session'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
