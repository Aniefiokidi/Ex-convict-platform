import { useState } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import Navbar from '../components/Navbar'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'How do I get started on the platform?',
        a: 'Simply create an account by clicking "Get Started" and choose whether you\'re looking for employment opportunities or wanting to hire. Complete your profile to get the best experience.'
      },
      {
        q: 'Is the platform free to use?',
        a: 'Yes! Our platform is completely free for ex-convicts seeking opportunities. Employers have access to basic features for free, with premium options available.'
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.'
      }
    ]
  },
  {
    category: 'Job Seekers',
    questions: [
      {
        q: 'How do I apply for jobs?',
        a: 'Browse available jobs, click on any position you\'re interested in, and click "Apply Now". Make sure your profile is complete for the best chance of success.'
      },
      {
        q: 'Can I track my application status?',
        a: 'Yes! Go to your dashboard to see all your applications and their current status (Pending, Reviewed, Accepted, or Rejected).'
      },
      {
        q: 'How do I find mentorship opportunities?',
        a: 'Visit the Mentors page to browse available mentors. You can filter by industry, experience, and specialization to find the right match.'
      }
    ]
  },
  {
    category: 'Employers',
    questions: [
      {
        q: 'How do I post a job?',
        a: 'From your employer dashboard, click "Post New Job", fill in the job details, requirements, and company information, then publish.'
      },
      {
        q: 'How do I review applications?',
        a: 'Go to your dashboard where you\'ll see all applications for your jobs. Click on any application to view the candidate\'s profile and resume.'
      },
      {
        q: 'Can I contact applicants directly?',
        a: 'Yes! Once you review an application, you can send messages through our secure messaging system or provide contact details for interviews.'
      }
    ]
  }
]

const supportOptions = [
  {
    title: 'Email Support',
    description: 'Send us an email for detailed assistance',
    contact: 'support@exconvictplatform.com',
    icon: '✉️'
  },
  {
    title: 'Phone Support',
    description: 'Call us during business hours',
    contact: '1-800-SUPPORT',
    icon: '📞'
  },
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    contact: 'Available 9 AM - 5 PM EST',
    icon: '💬'
  },
  {
    title: 'Community Forum',
    description: 'Connect with other users and share experiences',
    contact: 'forum.exconvictplatform.com',
    icon: '👥'
  }
]

export default function Support({ currentUser }) {
  const [activeCategory, setActiveCategory] = useState('General')
  const [contactForm, setContactForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    subject: '',
    message: ''
  })
  const [formMessage, setFormMessage] = useState('')

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    // In a real app, this would send the contact form
    setFormMessage('Thank you for your message! We\'ll get back to you within 24 hours.')
    setContactForm({ ...contactForm, subject: '', message: '' })
  }

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help you succeed. Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-3xl mb-4">{option.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <div className="text-blue-600 font-medium">{option.contact}</div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* FAQ Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ Categories</h2>
                <div className="space-y-2">
                  {faqs.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveCategory(category.category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeCategory === category.category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{activeCategory} Questions</h2>
                <div className="space-y-6">
                  {faqs.find(cat => cat.category === activeCategory)?.questions.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                      <p className="text-gray-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Us</h2>
              
              {formMessage && (
                <div className="bg-green-100 border-green-500 text-green-700 p-4 rounded-lg mb-6">
                  {formMessage}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return { props: { currentUser: req.session.user || null } }
}, sessionOptions)