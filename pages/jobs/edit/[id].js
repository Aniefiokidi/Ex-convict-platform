import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import { withIronSessionSsr } from 'iron-session/next'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

export default function EditJob({ currentUser }) {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({ title: '', description: '', location: '', salary: '', company: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!id) return
    axios.get(`/api/jobs/${id}`)
      .then(r => {
        const j = r.data.job
        setForm({ title: j.title || '', description: j.description || '', location: j.location || '', salary: j.salary || '', company: j.company || '' })
      })
      .catch(() => setError('Job not found.'))
      .finally(() => setLoading(false))
  }, [id])

  if (!currentUser || (currentUser.role !== 'EMPLOYER' && currentUser.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen"><Navbar currentUser={currentUser} />
        <div className="page-container text-center"><p className="text-red-600">Access denied.</p></div>
      </div>
    )
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await axios.patch(`/api/jobs/${id}`, form)
      setSuccess(true)
      setTimeout(() => router.push(`/jobs/${id}`), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job')
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/dashboard/employer" className="hover:text-blue-600">Dashboard</Link>
          <span>/</span>
          <Link href={`/jobs/${id}`} className="hover:text-blue-600">Job</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Edit</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-6">Edit Job Posting</h1>

          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-5">{error}</p>}
          {success && <p className="text-green-700 text-sm bg-green-50 p-3 rounded-lg mb-5">Job updated! Redirecting…</p>}

          {loading ? (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Administrative Officer" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your company name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Lagos Island, Lagos" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Salary</label>
                <input value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. ₦150,000–₦200,000/month" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea required rows={6} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe the role, responsibilities and requirements…" />
              </div>
              <div className="flex gap-3 pt-2">
                <Link href={`/jobs/${id}`} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 text-center">
                  Cancel
                </Link>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => ({
  props: { currentUser: req.session.user || null }
}), sessionOptions)
