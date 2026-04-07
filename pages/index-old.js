import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Home({ currentUser }) {
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      
      <main className="page-container">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Rebuilding Lives,</span><br />
              <span className="text-gray-800">Creating Opportunities</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empowering returning citizens with access to meaningful employment, professional training, 
              mentorship, and support services for successful reintegration into society.
            </p>
            
            {!currentUser ? (
              <div className="space-x-4 mb-16">
                <Link href="/register" className="btn-primary text-lg px-8 py-4">
                  Start Your Journey
                </Link>
                <Link href="/jobs" className="btn-secondary text-lg px-8 py-4">
                  Browse Opportunities
                </Link>
              </div>
            ) : (
              <div className="space-x-4 mb-16">
                <Link 
                  href={`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Go to Dashboard
                </Link>
                <Link href="/jobs" className="btn-secondary text-lg px-8 py-4">
                  Browse Opportunities
                </Link>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 slide-up">
            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Opportunities</h3>
              <p className="text-gray-600">Access verified employment opportunities from supportive employers</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Skills Training</h3>
              <p className="text-gray-600">Professional vocational training programs to develop marketable skills</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mentorship</h3>
              <p className="text-gray-600">Connect with experienced mentors for guidance and support</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Counseling Support</h3>
              <p className="text-gray-600">Professional counseling and mental health resources</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 slide-up">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-gray-600">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">150+</div>
              <div className="text-gray-600">Partner Employers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">25+</div>
              <div className="text-gray-600">Training Programs</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
