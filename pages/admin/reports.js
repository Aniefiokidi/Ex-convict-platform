import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

export default function AdminReports({ currentUser }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') return
    Promise.all([
      axios.get('/api/admin/users'),
      axios.get('/api/jobs'),
      axios.get('/api/jobs/applications'),
      axios.get('/api/admin/mentors'),
    ])
      .then(([usersRes, jobsRes, appsRes, mentorsRes]) => {
        const users    = usersRes.data.users || []
        const jobs     = jobsRes.data.jobs || []
        const apps     = appsRes.data.applications || []
        const mentors  = mentorsRes.data || []
        setData({ users, jobs, apps, mentors })
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

  const exConvicts   = data?.users.filter(u => u.role === 'EX_CONVICT').length ?? 0
  const employers    = data?.users.filter(u => u.role === 'EMPLOYER').length ?? 0
  const approved     = data?.mentors.filter(m => m.status === 'APPROVED').length ?? 0
  const pending      = data?.mentors.filter(m => m.status === 'PENDING').length ?? 0
  const accepted     = data?.apps.filter(a => a.status === 'ACCEPTED').length ?? 0
  const appsByJob    = data?.jobs.map(j => ({
    title: j.title,
    company: j.company,
    count: data.apps.filter(a => a.jobId === j.id).length,
  })).sort((a, b) => b.count - a.count) ?? []

  const statCards = [
    { label: 'Total Users',        value: data?.users.length ?? 0,  color: 'bg-blue-500' },
    { label: 'Job Seekers',        value: exConvicts,                color: 'bg-green-500' },
    { label: 'Employers',          value: employers,                 color: 'bg-purple-500' },
    { label: 'Active Job Listings',value: data?.jobs.length ?? 0,   color: 'bg-yellow-500' },
    { label: 'Applications Filed', value: data?.apps.length ?? 0,   color: 'bg-red-500' },
    { label: 'Jobs Accepted',      value: accepted,                  color: 'bg-emerald-500' },
    { label: 'Approved Mentors',   value: approved,                  color: 'bg-indigo-500' },
    { label: 'Pending Mentors',    value: pending,                   color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/dashboard/admin" className="hover:text-blue-600">Admin Dashboard</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">Reports</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Reports</h1>
            <p className="text-gray-500 text-sm mt-0.5">Overview of platform activity and statistics</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map(card => (
                <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                    <span className="text-white font-bold text-lg">{card.value}</span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Applications by job */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Applications per Job Listing</h2>
              {appsByJob.length === 0 ? (
                <p className="text-gray-500 text-sm">No applications yet.</p>
              ) : (
                <div className="space-y-3">
                  {appsByJob.map((j, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{j.title}</p>
                        <p className="text-xs text-gray-500">{j.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-blue-200 rounded-full overflow-hidden w-32">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.min(100, (j.count / Math.max(...appsByJob.map(x => x.count), 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-6 text-right">{j.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">User Breakdown</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Job Seekers (Ex-Convicts)', count: exConvicts, color: 'bg-green-500' },
                    { label: 'Employers',                 count: employers,  color: 'bg-blue-500' },
                    { label: 'Admins',                    count: data?.users.filter(u => u.role === 'ADMIN').length ?? 0, color: 'bg-purple-500' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Application Status</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Pending Review', count: data?.apps.filter(a => a.status === 'PENDING').length ?? 0,  color: 'bg-yellow-500' },
                    { label: 'Under Review',   count: data?.apps.filter(a => a.status === 'REVIEWED').length ?? 0, color: 'bg-blue-500' },
                    { label: 'Accepted',       count: accepted,                                                     color: 'bg-green-500' },
                    { label: 'Rejected',       count: data?.apps.filter(a => a.status === 'REJECTED').length ?? 0, color: 'bg-red-500' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
