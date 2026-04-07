import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'

export default function PostJob({ currentUser }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await axios.post('/api/jobs', { title, description, location })
      router.push('/jobs')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <Navbar currentUser={currentUser} />
        <div className="page-container text-center">
          <div className="card max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please log in to post job opportunities.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      
      <main className="page-container">
        <div className="max-w-2xl mx-auto">
          <div className="card fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">Post a Job Opening</h2>
              <p className="text-gray-600">Help returning citizens find meaningful employment</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input 
                  required 
                  value={title} 
                  onChange={e=>setTitle(e.target.value)} 
                  placeholder="e.g., Customer Service Representative" 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input 
                  value={location} 
                  onChange={e=>setLocation(e.target.value)} 
                  placeholder="e.g., New York, NY or Remote" 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <textarea 
                  required 
                  value={description} 
                  onChange={e=>setDescription(e.target.value)} 
                  placeholder="Describe the role, responsibilities, requirements, and benefits..."
                  className="input-field min-h-[150px] resize-y" 
                />
                <p className="text-sm text-gray-500 mt-2">
                  Include information about your company's support for returning citizens.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Tips for Inclusive Job Postings:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Focus on skills and qualifications needed</li>
                  <li>• Mention your commitment to giving second chances</li>
                  <li>• Include any training or support you provide</li>
                  <li>• Be clear about any background check requirements</li>
                </ul>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Posting Job...
                  </div>
                ) : (
                  'Post Job Opening'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
