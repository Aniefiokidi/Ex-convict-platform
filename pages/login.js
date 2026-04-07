import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Login({ currentUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const userData = response.data.user
      
      // Navigate to role-specific dashboard
      if (userData.role === 'EX_CONVICT') {
        window.location.href = '/dashboard/ex-convict'
      } else if (userData.role === 'EMPLOYER') {
        window.location.href = '/dashboard/employer'
      } else if (userData.role === 'ADMIN') {
        window.location.href = '/dashboard/admin'
      } else {
        window.location.href = '/'
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
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
              <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue your journey</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password" 
                  className="input-field" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
