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
      quote: "The training programs here completely changed my life. I went from having no tech skills to landing a full-time developer position in just 8 months."
    },
    {
      name: "Sarah Williams",
      role: "Restaurant Manager",
      company: "Local Bistro",
      quote: "The mentorship program connected me with an amazing mentor who helped me build confidence and navigate my career transition successfully."
    },
    {
      name: "David Chen",
      role: "Construction Supervisor",
      company: "BuildRight Inc",
      quote: "Thanks to this platform, I found an employer who gave me a second chance. Now I'm leading a team and helping other returning citizens."
    }
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar currentUser={currentUser} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text + CTAs */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Nigeria&apos;s #1 Second-Chance Employment Platform
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-5">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">RiseUp</span>
              </h1>

              <p className="text-xl text-blue-100/80 mb-8 max-w-md">
                Find jobs, gain skills, and connect with mentors who believe in second chances.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {!currentUser ? (
                  <>
                    <Link href="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 text-center text-lg">
                      Get Started — Free
                    </Link>
                    <Link href="/jobs" className="px-8 py-4 border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 text-center text-lg">
                      Browse Jobs
                    </Link>
                  </>
                ) : (
                  <Link href={`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 text-lg">
                    Go to Dashboard
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-6 mt-8 text-sm text-blue-200/70">
                <span className="flex items-center gap-1.5"><span className="text-green-400 font-bold">✓</span> Free to use</span>
                <span className="flex items-center gap-1.5"><span className="text-green-400 font-bold">✓</span> Verified employers</span>
                <span className="flex items-center gap-1.5"><span className="text-green-400 font-bold">✓</span> Confidential</span>
              </div>
            </div>

            {/* Right: Hero Photo */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10" style={{ height: '500px' }}>
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=80"
                  alt="Professional ready for new opportunities"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                {/* Stats overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                  <div className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="text-white font-black text-2xl">8,500+</div>
                    <div className="text-blue-200 text-sm">Jobs Secured</div>
                  </div>
                  <div className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="text-white font-black text-2xl">85%</div>
                    <div className="text-blue-200 text-sm">Success Rate</div>
                  </div>
                  <div className="flex-1 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="text-white font-black text-2xl">2,500+</div>
                    <div className="text-blue-200 text-sm">Companies</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-bounce">
                Hiring Now!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-800 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '15,000+', label: 'Lives Transformed' },
            { number: '8,500+', label: 'Jobs Secured' },
            { number: '2,500+', label: 'Partner Companies' },
            { number: '200+', label: 'Active Mentors' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-black text-white">{stat.number}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Everything You Need to Succeed</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '💼', title: 'Job Opportunities', desc: 'Thousands of verified openings from employers committed to second-chance hiring.', tags: ['Remote', 'Full Benefits', 'Career Growth'] },
              { icon: '🎓', title: 'Skills Training', desc: 'Industry-recognised certifications in high-demand fields, designed for rapid career entry.', tags: ['Tech Skills', 'Trades', 'Certificates'] },
              { icon: '🤝', title: 'Mentor Support', desc: '1-on-1 guidance from professionals who understand your journey.', tags: ['1-on-1', 'Network', 'Life Coaching'] },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-5xl mb-5">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Success Stories</h2>
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 lg:p-12">
            <blockquote className="text-xl text-gray-700 mb-8 leading-relaxed text-center">
              &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {testimonials[currentTestimonial].name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                <div className="text-gray-500 text-sm">{testimonials[currentTestimonial].role} · {testimonials[currentTestimonial].company}</div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Transform Your Future?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands who have already rebuilt their lives through RiseUp.</p>
          {!currentUser ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all">
                Get Started Now
              </Link>
              <Link href="/jobs" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <Link href={`/dashboard/${currentUser.role.toLowerCase().replace('_', '-')}`} className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all">
              Continue Your Journey
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.71.71m14.14 14.14.71.71M3 12H2m20 0h-1" />
                  </svg>
                </div>
                <span className="font-black text-xl">RiseUp</span>
              </div>
              <p className="text-gray-400">
                Empowering returning citizens with opportunities for successful reintegration and meaningful careers across Nigeria.
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
                <Link href="/help" className="block hover:text-white transition-colors">Help Center</Link>
                <a href="#" className="block hover:text-white transition-colors">Contact Us</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RiseUp Platform. All rights reserved.</p>
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
