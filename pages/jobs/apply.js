import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import Link from 'next/link'

export default function JobApply({ currentUser }) {
  const router = useRouter()
  const { jobId } = router.query
  const [job, setJob] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(()=>{
    if (!jobId) return
    axios.get(`/api/jobs/${jobId}`).then(res=>setJob(res.data.job)).catch(()=>{})
  }, [jobId])

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try{
      await axios.post('/api/jobs/apply', { jobId, coverLetter, resumeUrl })
      // Redirect to confirmation page with job and application details
      router.push(`/jobs/apply/success?jobId=${jobId}&jobTitle=${encodeURIComponent(job?.title || 'Job')}`)
    }catch(err){
      setMessage(err.response?.data?.message || 'Application failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} />
      <main className="page-container flex items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="card">
            <h2 className="text-2xl font-bold mb-2">Apply to {job?.title || 'Job'}</h2>
            <p className="text-gray-600 mb-4">{job?.location || 'Remote'}</p>

            {message && <div className="mb-4 p-3 bg-green-50 border rounded">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                <textarea value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} className="input-field h-32 w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL (optional)</label>
                <input value={resumeUrl} onChange={e=>setResumeUrl(e.target.value)} placeholder="https://..." className="input-field w-full" />
              </div>

              <div className="flex items-center space-x-3">
                <button type="submit" disabled={loading} className="btn-primary px-4 py-2">{loading ? 'Submitting...' : 'Submit Application'}</button>
                <Link href={`/jobs/${jobId}`} className="px-4 py-2 border">Back to Job</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
