import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

const ROLE_STYLES = {
  EX_CONVICT: 'bg-green-100 text-green-800',
  EMPLOYER:   'bg-blue-100 text-blue-800',
  ADMIN:      'bg-purple-100 text-purple-800',
  MENTOR:     'bg-yellow-100 text-yellow-800',
}

const ROLES = ['EX_CONVICT', 'EMPLOYER', 'ADMIN', 'MENTOR']

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

export default function AdminUsers({ currentUser }) {
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  // Modals
  const [viewUser, setViewUser]   = useState(null)
  const [editUser, setEditUser]   = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Add/Edit form state
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'EX_CONVICT', newPassword: '' })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)

  const load = () => {
    setLoading(true)
    axios.get('/api/admin/users')
      .then(r => setUsers(r.data.users || []))
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

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchSearch && matchRole
  })

  // ── Add user ──────────────────────────────────────────────
  const openAdd = () => {
    setFormData({ name: '', email: '', password: '', role: 'EX_CONVICT' })
    setFormError('')
    setShowAddModal(true)
  }
  const handleAdd = async e => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)
    try {
      await axios.post('/api/admin/users', formData)
      setShowAddModal(false)
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user')
    } finally {
      setFormLoading(false)
    }
  }

  // ── Edit user ─────────────────────────────────────────────
  const openEdit = u => {
    setEditUser(u)
    setFormData({ name: u.name || '', role: u.role, newPassword: '' })
    setFormError('')
    setShowEditPassword(false)
  }
  const handleEdit = async e => {
    e.preventDefault()
    setFormError('')
    if (formData.newPassword && formData.newPassword.length < 6) {
      setFormError('New password must be at least 6 characters')
      return
    }
    setFormLoading(true)
    try {
      await axios.patch('/api/admin/users', { id: editUser.id, name: formData.name, role: formData.role, newPassword: formData.newPassword || undefined })
      setEditUser(null)
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update user')
    } finally {
      setFormLoading(false)
    }
  }

  // ── Delete user ───────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteUser) return
    try {
      await axios.delete('/api/admin/users', { data: { id: deleteUser.id } })
      setDeleteUser(null)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
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
              <span className="text-gray-800 font-medium">Users</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
            <p className="text-gray-500 text-sm mt-0.5">{users.length} registered accounts</p>
          </div>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Add User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="EX_CONVICT">Ex-Convict</option>
            <option value="EMPLOYER">Employer</option>
            <option value="ADMIN">Admin</option>
            <option value="MENTOR">Mentor</option>
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
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{user.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[user.role] || 'bg-gray-100 text-gray-700'}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewUser(user)}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEdit(user)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
                          >
                            Edit
                          </button>
                          {user.id !== currentUser.id && (
                            <button
                              onClick={() => setDeleteUser(user)}
                              className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── View Modal ── */}
      {viewUser && (
        <Modal title="User Details" onClose={() => setViewUser(null)}>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {(viewUser.name || viewUser.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">{viewUser.name || '—'}</p>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[viewUser.role] || 'bg-gray-100 text-gray-700'}`}>
                  {viewUser.role.replace('_', ' ')}
                </span>
              </div>
            </div>
            {[
              ['Email', viewUser.email],
              ['Phone', viewUser.phone || '—'],
              ['Address', viewUser.address || '—'],
              ['Skills', viewUser.skills || '—'],
              ['Experience', viewUser.experience || '—'],
              ['Joined', new Date(viewUser.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-400 w-24 flex-shrink-0">{label}</span>
                <span className="text-gray-800 break-all">{value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setViewUser(null)} className="mt-5 w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            Close
          </button>
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {editUser && (
        <Modal title="Edit User" onClose={() => setEditUser(null)}>
          <form onSubmit={handleEdit} className="space-y-4">
            {formError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{formError}</p>}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Reset Password <span className="text-gray-400 font-normal text-xs">(leave blank to keep current)</span></label>
              <div className="relative">
                <input
                  type={showEditPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={e => setFormData(p => ({ ...p, newPassword: e.target.value }))}
                  className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New password (min 6 characters)"
                />
                <button type="button" onClick={() => setShowEditPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showEditPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditUser(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={formLoading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {formLoading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteUser && (
        <Modal title="Delete User" onClose={() => setDeleteUser(null)}>
          <p className="text-gray-600 text-sm mb-2">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteUser.name || deleteUser.email}</span>?
          </p>
          <p className="text-red-600 text-xs bg-red-50 p-3 rounded-lg mb-5">
            This will permanently delete the user and all their jobs, applications, and bookings.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteUser(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
              Delete User
            </button>
          </div>
        </Modal>
      )}

      {/* ── Add User Modal ── */}
      {showAddModal && (
        <Modal title="Add New User" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            {formError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{formError}</p>}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min 8 characters"
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
              <select
                value={formData.role}
                onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={formLoading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {formLoading ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
