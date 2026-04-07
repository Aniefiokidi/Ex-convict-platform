import { useState } from 'react'
import { useRouter } from 'next/router'
import { withIronSessionSsr } from 'iron-session/next'
import Navbar from '../components/Navbar'
import ProfilePhotoUpload from '../components/ProfilePhotoUpload'
import FileUpload from '../components/FileUpload'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

export default function Profile({ currentUser }) {
  const router = useRouter()
  const [user, setUser] = useState(currentUser)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    skills: currentUser?.skills || '',
    experience: currentUser?.experience || ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  if (!currentUser) {
    router.push('/login')
    return null
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        setUser(prev => ({ ...prev, ...formData }))
        setEditing(false)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpdate = (photoUrl) => {
    setUser(prev => ({ ...prev, profilePhoto: photoUrl }))
    setMessage({ type: 'success', text: 'Profile photo updated!' })
  }

  const handleResumeUpload = (result) => {
    setUser(prev => ({ ...prev, resumeUrl: result.fileUrl }))
    setMessage({ type: 'success', text: 'Resume uploaded successfully!' })
  }

  const handleUploadError = (error) => {
    setMessage({ type: 'error', text: error })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={user} />
      
      <main className="page-container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your account information and documents</p>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Photo & Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 text-center">Profile Photo</h2>
                
                <ProfilePhotoUpload 
                  currentPhoto={user.profilePhoto}
                  onPhotoUpdate={handlePhotoUpdate}
                  size="large"
                />
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">{user.name || 'No name set'}</h3>
                    <p className="text-gray-500">{user.email}</p>
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                        {user.role?.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    {editing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.address || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    {editing ? (
                      <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="e.g., Customer Service, Data Entry, Construction..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.skills || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    {editing ? (
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="Describe your work experience..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.experience || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {editing && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Resume & Documents</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <FileUpload
                      type="resume"
                      label="Upload Resume"
                      description="Upload your resume (PDF, DOC, or DOCX)"
                      acceptedTypes=".pdf,.doc,.docx"
                      maxSizeMB={10}
                      currentFile={user.resumeUrl}
                      onUploadSuccess={handleResumeUpload}
                      onUploadError={handleUploadError}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Current Documents</h3>
                    
                    {user.resumeUrl ? (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">Resume</p>
                              <p className="text-sm text-gray-500">PDF Document</p>
                            </div>
                          </div>
                          <a
                            href={user.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No resume uploaded yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return { props: { currentUser: req.session.user || null } }
}, sessionOptions)