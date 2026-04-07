import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Navbar({ currentUser }) {
  const router = useRouter()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
      router.push('/')
      window.location.reload()
    } catch (err) {
      console.error('Logout failed')
    }
  }

  const closeDropdown = () => {
    setIsProfileDropdownOpen(false)
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ER</span>
            </div>
            <span className="font-bold text-xl gradient-text">Ex-Convict Platform</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Jobs
            </Link>
            <Link href="/trainings" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Training
            </Link>
            <Link href="/mentors" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Mentors
            </Link>
            <Link href="/help" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Help
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                {/* Profile Dropdown Trigger */}
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1 transition-colors"
                >
                  {/* Profile Icon */}
                  <div className="w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden">
                    {currentUser.profilePhoto ? (
                      <img 
                        src={currentUser.profilePhoto} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="hidden md:block font-medium">Hello, {currentUser.name || currentUser.email}</span>
                  {/* Dropdown Arrow */}
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={closeDropdown}
                    ></div>
                    
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden">
                            {currentUser.profilePhoto ? (
                              <img 
                                src={currentUser.profilePhoto} 
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                  {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{currentUser.name || 'User'}</p>
                            <p className="text-sm text-gray-600 truncate">{currentUser.email}</p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              {currentUser.role.replace('_', ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link 
                          href={`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`}
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                          onClick={closeDropdown}
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m14 0H3m0 0l6 6m0 0l6-6" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Dashboard</p>
                            <p className="text-sm text-gray-500">View your overview</p>
                          </div>
                        </Link>
                        
                        <Link 
                          href="/messages"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                          onClick={closeDropdown}
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Messages</p>
                            <p className="text-sm text-gray-500">Chat with others</p>
                          </div>
                        </Link>
                        
                        <Link 
                          href="/profile"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                          onClick={closeDropdown}
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">My Profile</p>
                            <p className="text-sm text-gray-500">Update your information</p>
                          </div>
                        </Link>

                        <Link 
                          href="/settings"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                          onClick={closeDropdown}
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Settings</p>
                            <p className="text-sm text-gray-500">Preferences & security</p>
                          </div>
                        </Link>

                        {/* Role-specific menu items */}
                        {currentUser.role === 'EX_CONVICT' && (
                          <>
                            <div className="border-t border-gray-100 my-2"></div>
                            <div className="px-4 py-2">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</p>
                            </div>
                            <Link 
                              href="/jobs"
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                              onClick={closeDropdown}
                            >
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors">
                                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2M8 6v2a2 2 0 01-2 2H4" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">Browse Jobs</p>
                                <p className="text-sm text-gray-500">Find opportunities</p>
                              </div>
                            </Link>
                            <Link 
                              href="/mentors"
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                              onClick={closeDropdown}
                            >
                              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">Find Mentors</p>
                                <p className="text-sm text-gray-500">Get guidance</p>
                              </div>
                            </Link>
                          </>
                        )}

                        {currentUser.role === 'EMPLOYER' && (
                          <>
                            <div className="border-t border-gray-100 my-2"></div>
                            <div className="px-4 py-2">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</p>
                            </div>
                            <Link 
                              href="/jobs/create"
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                              onClick={closeDropdown}
                            >
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-200 transition-colors">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">Post New Job</p>
                                <p className="text-sm text-gray-500">Create job posting</p>
                              </div>
                            </Link>
                          </>
                        )}

                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <button
                          onClick={() => {
                            closeDropdown()
                            handleLogout()
                          }}
                          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Sign Out</p>
                            <p className="text-sm text-gray-500">Logout from account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}