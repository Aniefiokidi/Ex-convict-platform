import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import Navbar from '../../components/Navbar'

const fetcher = url => axios.get(url).then(r => r.data)

export default function Trainings({ currentUser }) {
  const { data, error, mutate } = useSWR('/api/trainings', fetcher)
  const [enrolling, setEnrolling] = useState(null)

  const handleEnroll = async (trainingId) => {
    if (!currentUser) {
      alert('Please log in to enroll')
      return
    }
    
    setEnrolling(trainingId)
    try {
      const response = await axios.post('/api/enroll', { trainingId })
      
      if (response.data.enrollment) {
        // Redirect to success page with training details
        const training = response.data.enrollment.training
        const searchParams = new URLSearchParams({
          trainingId: training.id.toString(),
          trainingTitle: training.title
        })
        
        window.location.href = `/trainings/enroll/success?${searchParams.toString()}`
      }
      
      mutate() // Refresh data
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Enrollment failed'
      alert(errorMessage)
    } finally {
      setEnrolling(null)
    }
  }

  if (error) return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="page-container text-center">
        <div className="text-red-600">Failed to load training programs</div>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="page-container text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading training programs...</span>
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
              <span className="gradient-text">Vocational Training</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Develop new skills and advance your career with our comprehensive training programs
            </p>
          </div>

          {data.trainings.length === 0 ? (
            <div className="card text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Training Programs Available</h3>
              <p className="text-gray-600">Check back soon for new programs!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 slide-up">
              {data.trainings.map((training, index) => (
                <div 
                  key={training.id} 
                  className="card hover:shadow-2xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      Available
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{training.title}</h3>
                  
                  {training.provider && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                      </svg>
                      <span className="text-sm font-medium">{training.provider}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-6 flex-grow">{training.description}</p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleEnroll(training.id)}
                      disabled={enrolling === training.id}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling === training.id ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enrolling...
                        </div>
                      ) : (
                        'Enroll Now'
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
