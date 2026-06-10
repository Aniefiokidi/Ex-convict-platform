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
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      <main className="page-container flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black gradient-text mb-2">Create Account</h2>
              <p className="text-gray-500 text-sm">Join our community and start your journey</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection Cards */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">I am joining as...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('EX_CONVICT')}
                    className={`relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      role === 'EX_CONVICT'
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      role === 'EX_CONVICT' ? 'bg-blue-600' : 'bg-gray-100'
                    }`}>
                      <svg className={`w-6 h-6 ${role === 'EX_CONVICT' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className={`font-bold text-sm mb-1 ${role === 'EX_CONVICT' ? 'text-blue-700' : 'text-gray-700'}`}>
                      Returning Citizen
                    </span>
                    <span className="text-xs text-gray-500 leading-snug">Find jobs, training &amp; mentorship</span>
                    {role === 'EX_CONVICT' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('EMPLOYER')}
                    className={`relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      role === 'EMPLOYER'
                        ? 'border-emerald-600 bg-emerald-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      role === 'EMPLOYER' ? 'bg-emerald-600' : 'bg-gray-100'
                    }`}>
                      <svg className={`w-6 h-6 ${role === 'EMPLOYER' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                      </svg>
                    </div>
                    <span className={`font-bold text-sm mb-1 ${role === 'EMPLOYER' ? 'text-emerald-700' : 'text-gray-700'}`}>
                      Employer
                    </span>
                    <span className="text-xs text-gray-500 leading-snug">Post jobs &amp; hire talent</span>
                    {role === 'EMPLOYER' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {role === 'EMPLOYER' ? 'Company / Organization Name' : 'Full Name'}
                </label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={role === 'EMPLOYER' ? 'Enter your company name' : 'Enter your full name'}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  placeholder="Create a strong password (min 8 chars)"
                  minLength={8}
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
                    Creating Account...
                  </div>
                ) : (
                  `Create ${role === 'EMPLOYER' ? 'Employer' : 'Citizen'} Account`
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
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
