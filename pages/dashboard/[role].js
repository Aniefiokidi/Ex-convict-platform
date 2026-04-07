import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard({ currentUser }) {
  const router = useRouter()
  const { role } = router.query
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [error, setError] = useState(null)

  useEffect(()=>{
    if (!role || !currentUser) return
    setError(null)
    setLoading(true)

    const fetchData = async ()=>{
      try {
        if (role === 'EMPLOYER') {
          // fetch employer's jobs (reuse /api/jobs) and applications
          const jobsRes = await axios.get('/api/jobs')
          // filter to employer's own jobs
          const myJobs = jobsRes.data.jobs.filter(j => j.employerId === currentUser.id)
          setJobs(myJobs)
          const appsRes = await axios.get('/api/jobs/applications')
          setApplications(appsRes.data.jobs || [])
        } else if (role === 'EX_CONVICT') {
          const appsRes = await axios.get('/api/jobs/applications')
          setApplications(appsRes.data.applications || [])
          const jobsRes = await axios.get('/api/jobs')
          setJobs(jobsRes.data.jobs || [])
        } else if (role === 'ADMIN') {
          const usersRes = await axios.get('/api/admin/users')
          // reuse applications endpoint too
          const appsRes = await axios.get('/api/jobs/applications')
          setApplications(appsRes.data.applications || appsRes.data.jobs || [])
          // store users inside jobs to reuse rendering path (quick hack)
          setJobs(usersRes.data.users || [])
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [role, currentUser])

  if (!currentUser) {
    return <div className="p-6">Please <Link href="/login" className="text-blue-600">log in</Link>.</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{role} Dashboard</h1>
          <p className="text-gray-600">Welcome, {currentUser.name || currentUser.email}</p>
        </div>
        <div className="space-x-3">
          <Link href="/profile" className="px-4 py-2 border rounded">Profile</Link>
          <Link href="/settings" className="px-4 py-2 border rounded">Settings</Link>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700">{error}</div>}

      {loading && <div className="mb-4">Loading...</div>}

      {role === 'EX_CONVICT' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-3">Available Jobs</h2>
            {jobs.length === 0 && <p className="text-gray-600">No jobs available yet.</p>}
            <ul className="space-y-3">
              {jobs.map(job => (
                <li key={job.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{job.title}</div>
                    <div className="text-sm text-gray-600">{job.location || 'Remote'}</div>
                  </div>
                  <div className="space-x-2">
                    <Link href={`/jobs/${job.id}`} className="px-3 py-1 border rounded">View</Link>
                    <Link href={`/jobs/apply?jobId=${job.id}`} className="px-3 py-1 btn-primary">Apply</Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-3">My Applications</h2>
            {applications.length === 0 && <p className="text-gray-600">You haven't applied to any roles yet.</p>}
            <ul className="space-y-3">
              {applications.map(app => (
                <li key={app.id} className="p-3 border rounded">
                  <div className="font-semibold">{app.job?.title || '—'}</div>
                  <div className="text-sm text-gray-600">Status: {app.status || 'PENDING'}</div>
                  <div className="text-sm mt-2">Applied: {new Date(app.appliedAt || app.createdAt || Date.now()).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {role === 'EMPLOYER' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-3">My Job Postings</h2>
            <Link href="/jobs/post" className="mb-3 inline-block btn-primary">Post a Job</Link>
            {jobs.length === 0 && <p className="text-gray-600">You haven't posted any jobs yet.</p>}
            <ul className="space-y-3">
              {jobs.map(job => (
                <li key={job.id} className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{job.title}</div>
                      <div className="text-sm text-gray-600">{job.location || 'Remote'}</div>
                    </div>
                    <div className="space-x-2">
                      <Link href={`/jobs/${job.id}`} className="px-3 py-1 border rounded">View</Link>
                      <Link href={`/jobs/${job.id}/edit`} className="px-3 py-1">Edit</Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-3">Applicants</h2>
            {applications.length === 0 && <p className="text-gray-600">No applicants yet.</p>}
            {applications.map(job => (
              <div key={job.id} className="mb-4">
                <div className="font-semibold mb-2">{job.title}</div>
                <ul className="space-y-2">
                  {job.applications.map(app => (
                    <li key={app.id} className="p-2 border rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">{app.user?.name || app.user?.email}</div>
                        <div className="text-sm text-gray-600">{app.coverLetter || '—'}</div>
                      </div>
                      <div className="space-x-2">
                        <button className="px-3 py-1 border rounded">Message</button>
                        <button className="px-3 py-1 btn-primary">Shortlist</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {role === 'ADMIN' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Users</h2>
          {jobs.length === 0 && <p className="text-gray-600">No users found.</p>}
          <ul className="space-y-3">
            {jobs.map(u => (
              <li key={u.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{u.name || u.email}</div>
                  <div className="text-sm text-gray-600">Role: {u.role}</div>
                </div>
                <div className="space-x-2">
                  <button className="px-3 py-1">View</button>
                  <button className="px-3 py-1 border">Edit</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
