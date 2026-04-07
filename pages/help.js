import { useState } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import Navbar from '../components/Navbar'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

export default function HelpCenter({ currentUser }) {
  const [openFaq, setOpenFaq] = useState(null)

  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click 'Register' in the top navigation, choose your role (Ex-Convict, Employer, or Mentor), and fill out the registration form. You'll receive a confirmation email to verify your account."
        },
        {
          question: "Is this platform really free to use?",
          answer: "Yes! Our platform is completely free for ex-convicts seeking employment and training opportunities. We're supported by grants and donations to ensure accessibility for everyone."
        },
        {
          question: "How do I complete my profile?",
          answer: "Go to your profile page and fill out all sections including personal information, skills, experience, and upload your resume and profile photo. A complete profile increases your chances of getting noticed by employers."
        }
      ]
    },
    {
      title: "Finding Jobs",
      faqs: [
        {
          question: "How do I search for jobs?",
          answer: "Visit the Jobs page to browse all available positions. You can filter by location, industry, job type, and other criteria. Use the search bar to find specific roles or companies."
        },
        {
          question: "What types of employers use this platform?",
          answer: "We partner with second-chance employers who are committed to inclusive hiring. This includes restaurants, construction companies, tech firms, retail stores, and many other industries."
        },
        {
          question: "How do I apply for a job?",
          answer: "Click on any job listing to view details, then click 'Apply Now'. You can include a cover letter and your application will be sent directly to the employer along with your profile information."
        },
        {
          question: "Will employers know about my background?",
          answer: "Employers using our platform are specifically looking to hire individuals with criminal backgrounds. You have control over what information to share in your profile and applications."
        }
      ]
    },
    {
      title: "Training & Education",
      faqs: [
        {
          question: "What training programs are available?",
          answer: "We offer training in various fields including technology, healthcare, skilled trades, customer service, and more. Programs range from basic skills to advanced certifications."
        },
        {
          question: "Are the training programs recognized by employers?",
          answer: "Yes! Our training programs are designed with industry input and many lead to recognized certifications that employers value."
        },
        {
          question: "How do I enroll in training?",
          answer: "Browse training programs, read the requirements and schedule, then click 'Enroll Now'. Some programs may have prerequisites or limited capacity."
        },
        {
          question: "Can I attend training while working?",
          answer: "Many programs offer flexible scheduling including evening and weekend options to accommodate working schedules."
        }
      ]
    },
    {
      title: "Mentorship",
      faqs: [
        {
          question: "What is mentorship and how does it help?",
          answer: "Mentorship connects you with successful professionals who provide guidance, support, and advice for your career journey. Mentors can help with job searching, skill development, and professional networking."
        },
        {
          question: "How are mentors selected?",
          answer: "All mentors go through a screening process and are professionals who volunteer their time to help others succeed. They come from various industries and backgrounds."
        },
        {
          question: "How do I find a mentor?",
          answer: "Browse mentor profiles to find someone whose background and expertise align with your goals. You can message them directly or book a session to get started."
        },
        {
          question: "Is mentorship free?",
          answer: "Yes, mentorship services are provided by volunteers at no cost to you."
        }
      ]
    },
    {
      title: "Account & Privacy",
      faqs: [
        {
          question: "How is my personal information protected?",
          answer: "We take privacy seriously and use industry-standard security measures. Your information is only shared with employers when you apply for jobs, and you control what details are included in your profile."
        },
        {
          question: "Can I update my information after registering?",
          answer: "Yes, you can update your profile information, skills, experience, and other details at any time through your profile page."
        },
        {
          question: "How do I reset my password?",
          answer: "On the login page, click 'Forgot Password' and enter your email. You'll receive instructions to reset your password."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account at any time. Contact our support team and we'll help you remove all your information from our system."
        }
      ]
    }
  ]

  const quickLinks = [
    {
      title: "Get Started Guide",
      description: "Step-by-step guide to set up your account and find opportunities",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      link: "#getting-started"
    },
    {
      title: "Profile Tips",
      description: "How to create a compelling profile that attracts employers",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      link: "#profile-tips"
    },
    {
      title: "Job Search Strategy",
      description: "Best practices for finding and applying to jobs",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
        </svg>
      ),
      link: "#job-search"
    },
    {
      title: "Contact Support",
      description: "Get help with any questions or issues",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
        </svg>
      ),
      link: "mailto:support@example.com"
    }
  ]

  const toggleFaq = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`
    setOpenFaq(openFaq === key ? null : key)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      
      <main className="page-container">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions and get the support you need to succeed on your journey
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.link}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {link.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
                <p className="text-gray-600 text-sm">{link.description}</p>
              </a>
            ))}
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-900">{category.title}</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {category.faqs.map((faq, faqIndex) => {
                    const isOpen = openFaq === `${categoryIndex}-${faqIndex}`
                    
                    return (
                      <div key={faqIndex}>
                        <button
                          onClick={() => toggleFaq(categoryIndex, faqIndex)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                            <svg
                              className={`w-5 h-5 text-gray-500 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white mt-16">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-blue-100 mb-6">
              Our support team is here to help you succeed. Don't hesitate to reach out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@example.com"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Email Support
              </a>
              <a
                href="tel:+1-555-0123"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Call (555) 012-3456
              </a>
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