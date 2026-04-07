import { useState } from 'react'
import Link from 'next/link'
import { withIronSessionSsr } from 'iron-session/next'
import Navbar from '../components/Navbar'

export default function Home({ currentUser }) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Marcus Johnson",
      role: "Software Developer",
      company: "TechCorp",
      image: "/testimonials/marcus.jpg",
      quote: "The training programs here completely changed my life. I went from having no tech skills to landing a full-time developer position in just 8 months."
    },
    {
      name: "Sarah Williams", 
      role: "Restaurant Manager",
      company: "Local Bistro",
      image: "/testimonials/sarah.jpg", 
      quote: "The mentorship program connected me with an amazing mentor who helped me build confidence and navigate my career transition successfully."
    },
    {
      name: "David Chen",
      role: "Construction Supervisor", 
      company: "BuildRight Inc",
      image: "/testimonials/david.jpg",
      quote: "Thanks to this platform, I found an employer who gave me a second chance. Now I'm leading a team and helping other returning citizens."
    }
  ]

  const stats = [
    { number: "2,500+", label: "Lives Transformed" },
    { number: "95%", label: "Job Placement Rate" }, 
    { number: "500+", label: "Partner Employers" },
    { number: "150+", label: "Training Programs" }
  ]

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
        </svg>
      ),
      title: "Employment Opportunities", 
      description: "Access to verified employers offering second-chance hiring and career advancement"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Professional Training",
      description: "Industry-recognized certifications and skills training in high-demand fields"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Mentorship Network",
      description: "Connect with successful professionals who understand your journey and can guide your success"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Holistic Support",
      description: "Comprehensive resources including housing assistance, mental health support, and legal guidance"
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      <Navbar currentUser={currentUser} />
      
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 border border-blue-400 rounded-full animate-spin opacity-10" style={{ animationDuration: '20s' }}></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-purple-400 rounded-full animate-ping opacity-10" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg animate-bounce opacity-20" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse opacity-30"></div>
        </div>

        {/* Moving Background Waves */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-40" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
              className="fill-blue-600 opacity-30 animate-pulse"
            ></path>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 leading-tight">
              <span className="block animate-slide-in-left" style={{ animationDelay: '0.5s', lineHeight: '1.1' }}>
                Rebuildin<span className="inline-block transform hover:scale-110 transition-transform duration-300" style={{ marginRight: '0.1em' }}>g</span> Lives,
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-in-right" style={{ animationDelay: '0.8s', lineHeight: '1.1' }}>
                Creating Futures
              </span>
            </h1>
            
            <p className="max-w-4xl mx-auto text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
              Your past doesn't define your future. Join <span className="text-yellow-400 font-bold">thousands</span> who've transformed their lives through 
              employment opportunities, professional training, and supportive community.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
              {!currentUser ? (
                <>
                  <Link 
                    href="/register"
                    className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 animate-pulse"
                  >
                    <span className="relative z-10">🚀 Start Your Journey Today</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link 
                    href="/jobs"
                    className="w-full sm:w-auto border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-purple-900 transition-all duration-300 backdrop-blur-sm bg-white/10"
                  >
                    ✨ Explore Opportunities
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href={`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`}
                    className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  >
                    <span className="relative z-10">🏠 Go to Dashboard</span>
                  </Link>
                  <Link 
                    href="/profile"
                    className="w-full sm:w-auto border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-purple-900 transition-all duration-300 backdrop-blur-sm bg-white/10"
                  >
                    👤 Complete Profile
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators with Icons */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200 animate-fade-in-up" style={{ animationDelay: '1.7s' }}>
              <div className="flex items-center transform hover:scale-110 transition-transform">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">💯 Free to Use</span>
              </div>
              <div className="flex items-center transform hover:scale-110 transition-transform">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">✅ Verified Employers</span>
              </div>
              <div className="flex items-center transform hover:scale-110 transition-transform">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">🔒 Confidential & Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              🌟 Transforming Lives <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Every Day</span>
            </h2>
            <p className="text-xl text-blue-200 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Real impact, real numbers, real change
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center transform hover:scale-110 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-blue-500/50 animate-pulse">
                <span className="text-3xl">👥</span>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white mb-2 animate-glow">15,000+</div>
              <div className="text-blue-200 font-semibold">Lives Transformed</div>
            </div>
            
            <div className="group text-center transform hover:scale-110 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-green-500/50 animate-pulse">
                <span className="text-3xl">💼</span>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white mb-2 animate-glow">8,500+</div>
              <div className="text-blue-200 font-semibold">Jobs Secured</div>
            </div>
            
            <div className="group text-center transform hover:scale-110 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-purple-500/50 animate-pulse">
                <span className="text-3xl">🎓</span>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white mb-2 animate-glow">12,000+</div>
              <div className="text-blue-200 font-semibold">Training Completed</div>
            </div>
            
            <div className="group text-center transform hover:scale-110 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-yellow-500/50 animate-pulse">
                <span className="text-3xl">🏢</span>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white mb-2 animate-glow">2,500+</div>
              <div className="text-blue-200 font-semibold">Partner Companies</div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
            <div className="inline-block bg-gradient-to-r from-green-500 to-blue-500 rounded-full px-8 py-4">
              <span className="text-white font-black text-2xl">✅ 85% Success Rate</span>
            </div>
            <p className="text-blue-200 mt-4 text-lg">
              Our participants are 3x more likely to secure stable employment
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4 animate-fade-in-up">
              🚀 Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Success Journey</span>
            </h2>
            <p className="text-xl text-blue-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Everything you need to rebuild and thrive
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-6xl mb-6 animate-bounce">💼</div>
              <h3 className="text-2xl font-bold text-white mb-4">Job Opportunities</h3>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Access thousands of verified job openings from second-chance employers who value your potential over your past.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm">Remote Work</span>
                <span className="bg-green-500/30 text-green-200 px-3 py-1 rounded-full text-sm">Full Benefits</span>
                <span className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm">Career Growth</span>
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-6xl mb-6 animate-bounce" style={{ animationDelay: '0.5s' }}>🎓</div>
              <h3 className="text-2xl font-bold text-white mb-4">Skills Training</h3>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Learn in-demand skills through our comprehensive training programs designed for rapid career advancement.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-yellow-500/30 text-yellow-200 px-3 py-1 rounded-full text-sm">Tech Skills</span>
                <span className="bg-orange-500/30 text-orange-200 px-3 py-1 rounded-full text-sm">Trades</span>
                <span className="bg-red-500/30 text-red-200 px-3 py-1 rounded-full text-sm">Certificates</span>
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="text-6xl mb-6 animate-bounce" style={{ animationDelay: '1s' }}>🤝</div>
              <h3 className="text-2xl font-bold text-white mb-4">Mentor Support</h3>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Connect with successful professionals who understand your journey and are committed to your success.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-pink-500/30 text-pink-200 px-3 py-1 rounded-full text-sm">1-on-1 Guidance</span>
                <span className="bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full text-sm">Network Building</span>
                <span className="bg-teal-500/30 text-teal-200 px-3 py-1 rounded-full text-sm">Life Coaching</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Our comprehensive platform provides all the tools and support you need for successful reintegration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real people, real transformations, real opportunities
            </p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="text-center">
                <svg className="w-12 h-12 text-blue-500 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 10a7 7 0 1114 0 7 7 0 01-14 0zm7-3a3 3 0 00-3 3h6a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
                <blockquote className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                    <div className="text-sm text-gray-500">{testimonials[currentTestimonial].company}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of individuals who have successfully rebuilt their lives through our platform.
            Your journey to a better tomorrow starts today.
          </p>
          
          {!currentUser ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
              >
                Get Started Now
              </Link>
              <Link 
                href="/jobs"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <Link 
              href={`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`}
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
            >
              Continue Your Journey
            </Link>
          )}
        </div>
      </section>

      {/* Final Call-to-Action Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              🌟 Ready to <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Change Your Life</span>?
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Don't wait another day. Your future starts with a single click. Join thousands who've already transformed their lives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {!currentUser ? (
                <>
                  <Link 
                    href="/register"
                    className="group relative w-full sm:w-auto bg-white text-purple-600 px-12 py-6 rounded-2xl font-black text-2xl hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-2xl animate-glow"
                  >
                    <span className="relative z-10">🚀 Start Now - It's FREE!</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300 -z-10"></div>
                  </Link>
                  <Link 
                    href="/jobs"
                    className="w-full sm:w-auto border-3 border-white text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-white hover:text-purple-600 transition-all duration-300 backdrop-blur-sm"
                  >
                    💼 Browse Jobs First
                  </Link>
                </>
              ) : (
                <Link 
                  href={`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`}
                  className="group relative w-full sm:w-auto bg-white text-purple-600 px-12 py-6 rounded-2xl font-black text-2xl hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-2xl animate-glow"
                >
                  <span className="relative z-10">🏠 Go to Your Dashboard</span>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-bold">Instant Access</div>
                <div className="text-blue-100 text-sm">Get started in under 5 minutes</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-2">🔒</div>
                <div className="font-bold">100% Confidential</div>
                <div className="text-blue-100 text-sm">Your privacy is our priority</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-bold">Proven Results</div>
                <div className="text-blue-100 text-sm">85% success rate guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ER</span>
                </div>
                <span className="font-bold text-xl">Ex-Convict Platform</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering returning citizens with opportunities for successful reintegration and meaningful careers.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 text-gray-400">
                <Link href="/jobs" className="block hover:text-white transition-colors">Jobs</Link>
                <Link href="/trainings" className="block hover:text-white transition-colors">Training</Link>
                <Link href="/mentors" className="block hover:text-white transition-colors">Mentors</Link>
                <Link href="/support" className="block hover:text-white transition-colors">Support</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block hover:text-white transition-colors">Contact Us</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Ex-Convict Reintegration Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    return {
      props: {
        currentUser: req.session.user || null
      }
    }
  },
  {
    password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
    cookieName: 'exconvict_session',
    cookieOptions: { secure: process.env.NODE_ENV === 'production' }
  }
)