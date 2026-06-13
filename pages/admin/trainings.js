import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

const CATEGORY_COLORS = {
  'Technology':       'bg-blue-100 text-blue-800',
  'Business Skills':  'bg-purple-100 text-purple-800',
  'Management':       'bg-orange-100 text-orange-800',
  'Finance':          'bg-green-100 text-green-800',
  'Human Resources':  'bg-pink-100 text-pink-800',
  'Marketing':        'bg-yellow-100 text-yellow-800',
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const EMPTY_FORM = { title: '', description: '', provider: '', duration: '', schedule: '', category: '', level: 'Beginner', instructor: '' }

export default function AdminTrainings({ currentUser }) {
  const [trainings, setTrainings]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [seeding, setSeeding]         = useState(false)
  const [showAdd, setShowAdd]         = useState(false)
  const [formData, setFormData]       = useState(EMPTY_FORM)
  const [formError, setFormError]     = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [successMsg, setSuccessMsg]   = useState('')

  const load = () => {
    setLoading(true)
    axios.get('/api/admin/trainings')
      .then(r => setTrainings(r.data.trainings || []))
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

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const r = await axios.post('/api/admin/trainings', { action: 'seed' })
      setSuccessMsg(r.data.message)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Seed failed')
    } finally {
      setSeeding(false)
    }
  }

  const handleAdd = async e => {
    e.preventDefault()
    setFormError('')
    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Title and description are required.')
      return
    }
    setFormLoading(true)
    try {
      await axios.post('/api/admin/trainings', formData)
      setShowAdd(false)
      setFormData(EMPTY_FORM)
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create training')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await axios.delete('/api/admin/trainings', { data: { id: deleteTarget.id } })
      setDeleteTarget(null)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={formData[key]}
          onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type={type}
          value={formData[key]}
          onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/dashboard/admin" className="hover:text-blue-600">Admin Dashboard</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">Trainings</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Training Programmes</h1>
            <p className="text-gray-500 text-sm mt-0.5">{trainings.length} programmes in the system</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {trainings.length === 0 && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {seeding ? 'Seeding…' : 'Load Default Courses'}
              </button>
            )}
            <button
              onClick={() => { setFormData(EMPTY_FORM); setFormError(''); setShowAdd(true) }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Add Training
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {successMsg}
          </div>
        )}

        {/* Trainings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : trainings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm text-center py-16">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="font-semibold text-gray-700 mb-1">No training programmes yet</h3>
            <p className="text-gray-400 text-sm mb-4">Click "Load Default Courses" to add 8 pre-made programmes, or add one manually.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {trainings.map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">{t.title}</h3>
                    {t.provider && <p className="text-xs text-gray-500 mt-0.5">{t.provider}</p>}
                  </div>
                  {t.category && (
                    <span className={`ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[t.category] || 'bg-gray-100 text-gray-600'}`}>
                      {t.category}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed flex-1 mb-3 line-clamp-3">{t.description}</p>

                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  {t.duration && <p><span className="font-medium text-gray-700">Duration:</span> {t.duration}</p>}
                  {t.schedule && <p><span className="font-medium text-gray-700">Schedule:</span> {t.schedule}</p>}
                  {t.level    && <p><span className="font-medium text-gray-700">Level:</span> {t.level}</p>}
                </div>

                <button
                  onClick={() => setDeleteTarget(t)}
                  className="w-full py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Add Training Programme" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            {formError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{formError}</p>}
            {field('title', 'Title *', 'text', 'e.g. Microsoft Office Suite Mastery')}
            {field('description', 'Description *', 'textarea', 'Brief overview of the course content…')}
            {field('provider', 'Provider / Institution', 'text', 'e.g. TechSkills Academy Nigeria')}
            {field('duration', 'Duration', 'text', 'e.g. 6 weeks')}
            {field('schedule', 'Schedule', 'text', 'e.g. Mon / Wed — 9:00 AM–11:00 AM')}
            {field('category', 'Category', 'text', 'e.g. Technology, Finance, Marketing…')}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Level</label>
              <select
                value={formData.level}
                onChange={e => setFormData(p => ({ ...p, level: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={formLoading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {formLoading ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <Modal title="Delete Training" onClose={() => setDeleteTarget(null)}>
          <p className="text-gray-600 text-sm mb-2">
            Delete <span className="font-semibold text-gray-900">{deleteTarget.title}</span>?
          </p>
          <p className="text-red-600 text-xs bg-red-50 p-3 rounded-lg mb-5">
            This will also remove all enrolment records for this course.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
