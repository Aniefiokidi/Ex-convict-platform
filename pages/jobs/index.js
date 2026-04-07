import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

const fetcher = url => axios.get(url).then(r => r.data)

export default function Jobs({ currentUser }) {
  const { data, error } = useSWR('/api/jobs', fetcher)

  if (error) return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="page-container text-center">
        <div className="text-red-600">Failed to load jobs</div>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <div className="page-container text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading opportunities...</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      
      <main className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Job Opportunities</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover meaningful employment opportunities with supportive employers
            </p>
            
            {currentUser?.role === 'EMPLOYER' && (
              <div className="mt-6">
                <Link href="/jobs/post" className="btn-primary">
                  Post a Job Opening
                </Link>
              </div>
            )}
          </div>

          {data.jobs.length === 0 ? (
            <div className="card text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Jobs Available</h3>
              <p className="text-gray-600">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 slide-up">
              {data.jobs.map((job, index) => (
                <div 
                  key={job.id} 
                  className="card hover:shadow-2xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2" />
                      </svg>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      New
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{job.title}</h3>
                  
                  {job.location && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{job.location}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-500">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <Link href={`/jobs/${job.id}`} className="btn-secondary text-sm px-4 py-2">View / Apply</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
