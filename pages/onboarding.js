import { useState } from 'react'
import { useRouter } from 'next/router'
import { withIronSessionSsr } from 'iron-session/next'
import Navbar from '../components/Navbar'
import ProfilePhotoUpload from '../components/ProfilePhotoUpload'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

export default function Onboarding({ currentUser }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState({
    name: currentUser?.name || '',
    phone: '',
    address: '', 
    skills: '',
    experience: '',
    profilePhoto: currentUser?.profilePhoto || null,
    goals: [],
    interests: []
  })

  const totalSteps = 4

  const goals = [
    'Find immediate employment',
    'Develop new skills',
    'Get career guidance',
    'Build professional network',
    'Start my own business',
    'Get certified in my field'
  ]

  const interests = [
    'Technology',
    'Healthcare', 
    'Construction',
    'Customer Service',
    'Food Service',
    'Retail',
    'Transportation',
    'Manufacturing',
    'Education',
    'Finance'
  ]

  if (!currentUser) {
    router.push('/login')
    return null
  }

  const handleInputChange = (e) => {
    setUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleCheckboxChange = (type, value) => {
    setUserData(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        router.push(`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}?welcome=true`)
      } else {
        alert('Failed to complete onboarding. Please try again.')
      }
    } catch (error) {
      alert('Error completing onboarding. Please try again.')
    }
  }

  const handlePhotoUpdate = (photoUrl) => {
    setUserData(prev => ({ ...prev, profilePhoto: photoUrl }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome! Let's set up your profile</h2>
              <p className="text-gray-600">Tell us about yourself to help us find the best opportunities for you</p>
            </div>

            <div className="max-w-md mx-auto mb-8">
              <ProfilePhotoUpload
                currentPhoto={userData.profilePhoto}
                onPhotoUpdate={handlePhotoUpdate}
                size="large"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your background</h2>
              <p className="text-gray-600">This helps us match you with relevant opportunities</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills & Qualifications
                </label>
                <textarea
                  name="skills"
                  value={userData.skills}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Customer service, computer skills, forklift certified, bilingual, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Experience
                </label>
                <textarea
                  name="experience"
                  value={userData.experience}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your work history, including any volunteer work, freelance projects, or jobs you've held..."
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your goals?</h2>
              <p className="text-gray-600">Select all that apply to help us personalize your experience</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {goals.map((goal, index) => (
                <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userData.goals.includes(goal)}
                    onChange={() => handleCheckboxChange('goals', goal)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-gray-700">{goal}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What industries interest you?</h2>
              <p className="text-gray-600">We'll prioritize opportunities in these areas</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {interests.map((interest, index) => (
                <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userData.interests.includes(interest)}
                    onChange={() => handleCheckboxChange('interests', interest)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-gray-700">{interest}</span>
                </label>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      
      <main className="page-container">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={completeOnboarding}
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold"
              >
                Complete Setup
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && !userData.name.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center mt-4">
            <button
              onClick={() => router.push(`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip setup for now
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return { props: { currentUser: req.session.user || null } }
}, sessionOptions)