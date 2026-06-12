import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

const COMPANY_COLORS = [
  'from-blue-600 to-blue-800', 'from-purple-600 to-purple-800',
  'from-emerald-600 to-emerald-800', 'from-orange-500 to-orange-700',
  'from-rose-600 to-rose-800', 'from-indigo-600 to-indigo-800',
]
function getCompanyColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return COMPANY_COLORS[Math.abs(h) % COMPANY_COLORS.length]
}
function getInitials(name = '') {
  const w = name.trim().split(/\s+/)
  return w.length >= 2 ? (w[0][0] + w[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function AdminCompanies({ currentUser }) {
  const [employers, setEmployers] = useState([])
  const [jobs, setJobs]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  // Modals
  const [deleteCompany, setDeleteCompany] = useState(null)
  const [deleteJob, setDeleteJob]         = useState(null)
  const [showAddModal, setShowAddModal]   = useState(false)
  const [expandedId, setExpandedId]       = useState(null)

  // Add company form
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [formErr, setFormErr] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  // Add job form for existing company
  const [addJobFor, setAddJobFor]   = useState(null) // employer object
  const [jobForm, setJobForm]       = useState({ title: '', description: '', location: '', salary: '' })
  const [jobFormErr, setJobFormErr] = useState('')
  const [jobFormLoading, setJobFormLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [usersRes, jobsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/jobs'),
      ])
      setEmployers((usersRes.data.users || []).filter(u => u.role === 'EMPLOYER'))
      setJobs(jobsRes.data.jobs || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
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

  const filtered = employers.filter(e =>
    !search ||
    (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  )

  const jobsFor = (employerId) => jobs.filter(j => j.employerId === employerId)

  // ── Add company (employer account) ───────────────────────
  const handleAddCompany = async e => {
    e.preventDefault()
    setFormErr('')
    setFormLoading(true)
    try {
      await axios.post('/api/admin/users', { ...form, role: 'EMPLOYER' })
      setShowAddModal(false)
      setForm({ name: '', email: '', password: '' })
      load()
    } catch (err) {
      setFormErr(err.response?.data?.message || 'Failed to create company')
    } finally { setFormLoading(false) }
  }

  // ── Delete company ────────────────────────────────────────
  const handleDeleteCompany = async () => {
    if (!deleteCompany) return
    try {
      await axios.delete('/api/admin/users', { data: { id: deleteCompany.id } })
      setDeleteCompany(null)
      load()
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete') }
  }

  // ── Delete job ────────────────────────────────────────────
  const handleDeleteJob = async () => {
    if (!deleteJob) return
    try {
      await axios.delete('/api/jobs', { data: { id: deleteJob.id } })
      setDeleteJob(null)
      load()
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete job') }
  }

  // ── Add job for company ───────────────────────────────────
  const handleAddJob = async e => {
    e.preventDefault()
    setJobFormErr('')
    setJobFormLoading(true)
    try {
      // Post as admin on behalf of employer — we need a separate admin-job endpoint
      // For now, use the employer's company name from their profile
      await axios.post('/api/admin/jobs', {
        ...jobForm,
        company: addJobFor.name,
        employerId: addJobFor.id,
      })
      setAddJobFor(null)
      setJobForm({ title: '', description: '', location: '', salary: '' })
      load()
    } catch (err) {
      setJobFormErr(err.response?.data?.message || 'Failed to add job')
    } finally { setJobFormLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/dashboard/admin" className="hover:text-blue-600">Admin Dashboard</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">Companies</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {employers.length} registered companies · {jobs.length} active jobs
            </p>
          </div>
          <button
            onClick={() => { setForm({ name: '', email: '', password: '' }); setFormErr(''); setShowAddModal(true) }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Add Company
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies…"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Company list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">No companies found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(emp => {
              const companyJobs = jobsFor(emp.id)
              const color = getCompanyColor(emp.name || emp.email)
              const initials = getInitials(emp.name || emp.email)
              const isExpanded = expandedId === emp.id

              return (
                <div key={emp.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Company header */}
                  <div className="flex items-center gap-4 p-5">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <span className="text-white font-black text-lg">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 text-lg leading-tight">{emp.name || '(no name)'}</p>
                      <p className="text-sm text-gray-500 truncate">{emp.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {companyJobs.length} job{companyJobs.length !== 1 ? 's' : ''} posted
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : emp.id)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
                      >
                        {isExpanded ? 'Hide Jobs' : `Jobs (${companyJobs.length})`}
                      </button>
                      <button
                        onClick={() => { setAddJobFor(emp); setJobForm({ title: '', description: '', location: '', salary: '' }); setJobFormErr('') }}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        + Job
                      </button>
                      <button
                        onClick={() => setDeleteCompany(emp)}
                        className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Jobs list (expandable) */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {companyJobs.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-6">No jobs posted yet.</p>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {companyJobs.map(job => (
                            <div key={job.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm">{job.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {job.location && `📍 ${job.location}`}
                                  {job.salary && ` · 💰 ${job.salary}`}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link href={`/jobs/${job.id}`} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100">
                                  View
                                </Link>
                                <button
                                  onClick={() => setDeleteJob(job)}
                                  className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ── Add Company Modal ── */}
      {showAddModal && (
        <Modal title="Add New Company" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddCompany} className="space-y-4">
            {formErr && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{formErr}</p>}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
              <input
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Dangote Industries"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="company@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  required
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min 8 characters"
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={formLoading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {formLoading ? 'Adding…' : 'Add Company'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add Job for Company Modal ── */}
      {addJobFor && (
        <Modal title={`Add Job for ${addJobFor.name}`} onClose={() => setAddJobFor(null)}>
          <form onSubmit={handleAddJob} className="space-y-4">
            {jobFormErr && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{jobFormErr}</p>}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
              <input required value={jobForm.title} onChange={e => setJobForm(p => ({ ...p, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Administrative Officer" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea required rows={3} value={jobForm.description} onChange={e => setJobForm(p => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Job description…" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input value={jobForm.location} onChange={e => setJobForm(p => ({ ...p, location: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Lagos, Nigeria" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Salary</label>
              <input value={jobForm.salary} onChange={e => setJobForm(p => ({ ...p, salary: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. ₦150,000–₦200,000/month" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setAddJobFor(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={jobFormLoading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {jobFormLoading ? 'Adding…' : 'Add Job'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Company Confirm ── */}
      {deleteCompany && (
        <Modal title="Remove Company" onClose={() => setDeleteCompany(null)}>
          <p className="text-gray-600 text-sm mb-2">
            Remove <span className="font-semibold text-gray-900">{deleteCompany.name}</span>?
          </p>
          <p className="text-red-600 text-xs bg-red-50 p-3 rounded-lg mb-5">
            This will permanently delete this company, all their job listings, and applications.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteCompany(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleDeleteCompany} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
              Remove
            </button>
          </div>
        </Modal>
      )}

      {/* ── Delete Job Confirm ── */}
      {deleteJob && (
        <Modal title="Delete Job" onClose={() => setDeleteJob(null)}>
          <p className="text-gray-600 text-sm mb-5">
            Delete <span className="font-semibold text-gray-900">{deleteJob.title}</span>? All applications for this job will also be deleted.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteJob(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleDeleteJob} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
