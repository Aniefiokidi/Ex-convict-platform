import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

export default function AdminActivity({ currentUser }) {
  const [applications, setApplications] = useState([])
  const [users, setUsers]               = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') return
    Promise.all([
      axios.get('/api/jobs/applications'),
      axios.get('/api/admin/users'),
    ])
      .then(([appsRes, usersRes]) => {
        setApplications(appsRes.data.applications || [])
        setUsers(usersRes.data.users || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [currentUser])

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen">
        <Navbar currentUser={currentUser} />
        <div className="page-container text-center">
          <p className="text-red-600 font-medium">Access denied. Admins only.</p>
          <Link href="/" className="text-blue-600 mt-4 inline-block">Return to home</Link>
        </div>
      </div>
    )
  }

  const STATUS_STYLE = {
    PENDING:  'bg-yellow-100 text-yellow-800',
    REVIEWED: 'bg-blue-100 text-blue-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }

  // Combine activity: job applications + new user registrations
  const appActivity = applications.map(a => ({
    id:   `app-${a.id}`,
    type: 'APPLICATION',
    text: `${a.user?.name || a.user?.email || 'Someone'} applied for ${a.job?.title || 'a job'}`,
    sub:  a.job?.company || '',
    date: new Date(a.appliedAt || a.createdAt),
    badge: a.status,
    badgeStyle: STATUS_STYLE[a.status] || 'bg-gray-100 text-gray-700',
  }))

  const userActivity = users.slice(0, 20).map(u => ({
    id:   `user-${u.id}`,
    type: 'REGISTRATION',
    text: `${u.name || u.email} registered as ${u.role.replace('_', ' ').toLowerCase()}`,
    sub:  u.email,
    date: new Date(u.createdAt),
    badge: u.role.replace('_', ' '),
    badgeStyle: u.role === 'EX_CONVICT' ? 'bg-green-100 text-green-800' :
                u.role === 'EMPLOYER'   ? 'bg-blue-100 text-blue-800'   :
                'bg-purple-100 text-purple-800',
  }))

  const feed = [...appActivity, ...userActivity]
    .sort((a, b) => b.date - a.date)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/dashboard/admin" className="hover:text-blue-600">Admin Dashboard</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Activity</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Activity</h1>
          <p className="text-gray-500 text-sm mt-0.5">Latest registrations and job applications</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : feed.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <p className="text-gray-500">No activity recorded yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {feed.map(item => (
              <div key={item.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.type === 'APPLICATION' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {item.type === 'APPLICATION' ? (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{item.text}</p>
                  {item.sub && <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badgeStyle}`}>
                    {item.badge}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {item.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
