import { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

const fetcher = url => axios.get(url).then(r => r.data)

const CATEGORIES = ['All', 'Technology', 'Finance', 'Human Resources', 'Marketing', 'Operations', 'Healthcare']

const COMPANY_COLORS = [
  'from-blue-600 to-blue-800',
  'from-purple-600 to-purple-800',
  'from-emerald-600 to-emerald-800',
  'from-orange-500 to-orange-700',
  'from-rose-600 to-rose-800',
  'from-indigo-600 to-indigo-800',
  'from-teal-600 to-teal-800',
  'from-amber-600 to-amber-800',
]

function getCompanyColor(company = '') {
  let hash = 0
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash)
  return COMPANY_COLORS[Math.abs(hash) % COMPANY_COLORS.length]
}

function getCategoryInfo(title = '') {
  const t = title.toLowerCase()
  if (t.includes('tech') || t.includes('software') || t.includes('data') || t.includes('developer') || t.includes('network') || t.includes('systems'))
    return { label: 'Technology', color: 'bg-blue-100 text-blue-700' }
  if (t.includes('finance') || t.includes('financial') || t.includes('accountant') || t.includes('analyst') || t.includes('audit'))
    return { label: 'Finance', color: 'bg-emerald-100 text-emerald-700' }
  if (t.includes('human resources') || t.includes('hr ') || t.includes('recruitment') || t.includes('talent'))
    return { label: 'Human Resources', color: 'bg-purple-100 text-purple-700' }
  if (t.includes('marketing') || t.includes('brand') || t.includes('communication') || t.includes('content'))
    return { label: 'Marketing', color: 'bg-orange-100 text-orange-700' }
  if (t.includes('health') || t.includes('medical') || t.includes('nurse') || t.includes('clinical'))
    return { label: 'Healthcare', color: 'bg-red-100 text-red-700' }
  if (t.includes('admin') || t.includes('operations') || t.includes('manager') || t.includes('officer') || t.includes('assistant'))
    return { label: 'Operations', color: 'bg-slate-100 text-slate-700' }
  return { label: 'General', color: 'bg-indigo-100 text-indigo-700' }
}

function getInitials(company = '') {
  const words = company.trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return company.substring(0, 2).toUpperCase()
}

function isNew(createdAt) {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-4/5 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  )
}

function JobCard({ job }) {
  const catInfo = getCategoryInfo(job.title)
  const initials = getInitials(job.company)
  const companyColor = getCompanyColor(job.company)
  const fresh = isNew(job.createdAt)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col group">
      <div className="p-6 flex flex-col flex-1">
        {/* Company header — the star of the card */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${companyColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
            <span className="text-white font-black text-lg tracking-wide">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 text-lg leading-tight truncate">{job.company}</p>
            <p className="text-sm text-gray-500 truncate mt-0.5">is hiring a</p>
          </div>
          {fresh && (
            <span className="flex-shrink-0 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
              NEW
            </span>
          )}
        </div>

        {/* Job title */}
        <h3 className="font-bold text-blue-700 text-xl mb-4 leading-snug">{job.title}</h3>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${catInfo.color}`}>
            {catInfo.label}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            Full-time
          </span>
        </div>

        {job.location && (
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <svg className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
        )}

        {job.salary && (
          <div className="flex items-center text-emerald-700 text-sm font-semibold mb-4">
            <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.salary}
          </div>
        )}

        <p className="text-gray-500 text-sm line-clamp-2 flex-1 leading-relaxed">{job.description}</p>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <Link
          href={`/jobs/${job.id}`}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          View & Apply
        </Link>
      </div>
    </div>
  )
}

function ByCompanyView({ jobs }) {
  const grouped = jobs.reduce((acc, job) => {
    const key = job.company || 'Unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(job)
    return acc
  }, {})

  const companies = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)

  return (
    <div className="space-y-10">
      {companies.map(([company, companyJobs]) => {
        const initials = getInitials(company)
        const color = getCompanyColor(company)
        return (
          <div key={company} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Company header */}
            <div className={`bg-gradient-to-r ${color} px-6 py-5 flex items-center gap-4`}>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">{initials}</span>
              </div>
              <div>
                <h2 className="text-white font-black text-2xl">{company}</h2>
                <p className="text-white/80 text-sm">
                  {companyJobs.length} open position{companyJobs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Jobs list */}
            <div className="divide-y divide-gray-100">
              {companyJobs.map(job => {
                const catInfo = getCategoryInfo(job.title)
                const fresh = isNew(job.createdAt)
                return (
                  <div key={job.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-gray-900 text-base">{job.title}</span>
                        {fresh && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">NEW</span>}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catInfo.color}`}>{catInfo.label}</span>
                        {job.location && <span>📍 {job.location}</span>}
                        {job.salary && <span className="text-emerald-700 font-semibold">💰 {job.salary}</span>}
                      </div>
                    </div>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Jobs({ currentUser }) {
  const { data, error } = useSWR('/api/jobs', fetcher, { refreshInterval: 30000 })
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [view, setView] = useState('grid') // 'grid' | 'company'

  const filtered = (data?.jobs || []).filter(job => {
    const matchSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(search.toLowerCase())
    const cat = getCategoryInfo(job.title)
    const matchCategory = activeCategory === 'All' || cat.label === activeCategory
    return matchSearch && matchCategory
  })

  const totalEmployers = data
    ? [...new Set(data.jobs.map(j => j.company).filter(Boolean))].length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            Career Opportunities
          </span>
          <h1 className="text-4xl lg:text-5xl font-black mb-3 tracking-tight">
            Find Your Next Role
          </h1>
          <p className="text-slate-300 text-base mb-8 max-w-xl mx-auto">
            Real positions from verified employers committed to second-chance hiring.
          </p>
          <div className="max-w-2xl mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by job title, company, or location…"
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* Stats + actions row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-8">
            {data ? (
              <>
                <div>
                  <div className="text-2xl font-black text-slate-800">{data.jobs.length}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Open Positions</div>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div>
                  <div className="text-2xl font-black text-slate-800">{totalEmployers}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Hiring Companies</div>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700 font-semibold uppercase tracking-wider">Live</span>
                </div>
              </>
            ) : (
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1 gap-1">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${view === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-500 hover:text-slate-700'}`}
              >
                By Role
              </button>
              <button
                onClick={() => setView('company')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${view === 'company' ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-500 hover:text-slate-700'}`}
              >
                By Company
              </button>
            </div>

            {currentUser?.role === 'EMPLOYER' && (
              <Link href="/jobs/post" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
                + Post a Job
              </Link>
            )}
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-slate-400 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {data && (
          <p className="text-sm text-gray-500 mb-6">
            Showing <span className="font-semibold text-gray-800">{filtered.length}</span> position{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            {search ? ` matching "${search}"` : ''}
          </p>
        )}

        {/* Loading */}
        {!data && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-600 text-lg font-medium">Failed to load job listings.</p>
            <p className="text-gray-500 text-sm mt-1">Please refresh the page or try again later.</p>
          </div>
        )}

        {/* Empty state */}
        {data && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No positions found</h3>
            <p className="text-gray-500 text-sm">Try a different keyword or select a different category.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All') }}
              className="mt-4 text-blue-600 text-sm font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Content */}
        {data && filtered.length > 0 && (
          view === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <ByCompanyView jobs={filtered} />
          )
        )}
      </main>
    </div>
  )
}
