import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

const STATUS_STYLES = {
  PENDING:  'bg-yellow-100 text-yellow-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function AdminApplications({ currentUser }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [viewApp, setViewApp]           = useState(null)
  const [updatingId, setUpdatingId]     = useState(null)

  const load = () => {
    setLoading(true)
    axios.get('/api/jobs/applications')
      .then(r => setApplications(r.data.applications || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') return
    load()
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

  const filtered = applications.filter(app => {
    const name = app.user?.name || app.user?.email || ''
    const job  = app.job?.title || ''
    const matchSearch  = !search || name.toLowerCase().includes(search.toLowerCase()) || job.toLowerCase().includes(search.toLowerCase())
    const matchStatus  = statusFilter === 'ALL' || app.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId)
    try {
      await axios.patch('/api/admin/applications', { id: appId, status: newStatus })
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
      if (viewApp?.id === appId) setViewApp(v => ({ ...v, status: newStatus }))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/dashboard/admin" className="hover:text-blue-600">Admin Dashboard</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">Applications</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
            <p className="text-gray-500 text-sm mt-0.5">{applications.length} total applications</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by applicant name or job title…"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No applications found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(app.user?.name || app.user?.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{app.user?.name || '—'}</p>
                            <p className="text-xs text-gray-400">{app.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{app.job?.title || '—'}</td>
                      <td className="px-6 py-4 text-gray-500">{app.job?.company || '—'}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[app.status] || 'bg-gray-100 text-gray-700'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setViewApp(app)}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* View / Status Modal */}
      {viewApp && (
        <Modal title="Application Details" onClose={() => setViewApp(null)}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Applicant</p>
                <p className="font-semibold text-gray-900">{viewApp.user?.name || viewApp.user?.email}</p>
                <p className="text-gray-500 text-xs">{viewApp.user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Applied For</p>
                <p className="font-semibold text-gray-900">{viewApp.job?.title}</p>
                <p className="text-gray-500 text-xs">{viewApp.job?.company}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Applied On</p>
              <p className="text-gray-700">{new Date(viewApp.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            {viewApp.coverLetter && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Cover Letter</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-xs leading-relaxed max-h-32 overflow-y-auto">{viewApp.coverLetter}</p>
              </div>
            )}

            {viewApp.resumeUrl && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Resume</p>
                <a
                  href={viewApp.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs font-medium"
                >
                  View Resume
                </a>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Update Status</p>
              <div className="grid grid-cols-2 gap-2">
                {['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map(s => (
                  <button
                    key={s}
                    disabled={viewApp.status === s || updatingId === viewApp.id}
                    onClick={() => handleStatusChange(viewApp.id, s)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      viewApp.status === s
                        ? STATUS_STYLES[s] + ' cursor-default'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {updatingId === viewApp.id ? 'Saving…' : s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => setViewApp(null)} className="mt-5 w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            Close
          </button>
        </Modal>
      )}
    </div>
  )
}
