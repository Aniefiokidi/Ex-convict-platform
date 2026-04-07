import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Register({ currentUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('EX_CONVICT')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await axios.post('/api/auth/register', { email, password, name, role })
      router.push('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      
      <main className="page-container flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="card fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">Create Account</h2>
              <p className="text-gray-600">Join our community and start your journey</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  required 
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  placeholder="Enter your full name" 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  required 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  type="email" 
                  placeholder="Enter your email" 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  required 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  type="password" 
                  placeholder="Create a strong password" 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                <select 
                  value={role} 
                  onChange={e=>setRole(e.target.value)} 
                  className="input-field"
                >
                  <option value="EX_CONVICT">Returning Citizen</option>
                  <option value="EMPLOYER">Employer</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
