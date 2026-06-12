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
  const [resumeFile, setResumeFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (!jobId) return
    axios.get(`/api/jobs/${jobId}`).then(res => setJob(res.data.job)).catch(() => {})
  }, [jobId])

  function validate() {
    const errs = {}
    if (!coverLetter.trim()) {
      errs.coverLetter = 'Cover letter is required.'
    } else if (coverLetter.trim().length < 50) {
      errs.coverLetter = `Cover letter is too short (${coverLetter.trim().length}/50 characters minimum).`
    }
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    setMessage(null)

    let resumeUrl = ''

    if (resumeFile) {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', resumeFile)
        const uploadRes = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (uploadRes.data.skipped) {
          // Cloudinary not configured — proceed without resume, show a note
          setMessage({ type: 'info', text: uploadRes.data.message })
          resumeUrl = ''
        } else {
          resumeUrl = uploadRes.data.url
        }
      } catch (err) {
        // Upload failed but don't block submission — just warn and continue
        setMessage({ type: 'info', text: 'Resume could not be uploaded — your application will be submitted without it.' })
        resumeUrl = ''
      }
      setUploading(false)
    }

    try {
      await axios.post('/api/jobs/apply', { jobId, coverLetter, resumeUrl })
      router.push(`/jobs/apply/success?jobId=${jobId}&jobTitle=${encodeURIComponent(job?.title || 'Job')}`)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Application failed. Please try again.' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      <main className="page-container flex items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Apply to {job?.title || 'Job'}
              </h2>
              {job?.company && (
                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                  </svg>
                  {job.company}
                </div>
              )}
              {job?.location && (
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
              )}
            </div>

            {message && (
              <div className={`mb-5 p-4 rounded-xl text-sm font-medium ${
                message.type === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : message.type === 'info'
                  ? 'bg-amber-50 border border-amber-200 text-amber-700'
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={e => {
                    setCoverLetter(e.target.value)
                    if (errors.coverLetter) setErrors(prev => ({ ...prev, coverLetter: '' }))
                  }}
                  placeholder="Tell the employer why you're a great fit for this role. Mention your skills, experience, and what motivates you..."
                  className={`input-field h-40 w-full resize-none ${errors.coverLetter ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.coverLetter ? (
                    <p className="text-red-500 text-xs">{errors.coverLetter}</p>
                  ) : (
                    <p className="text-gray-400 text-xs">Minimum 50 characters</p>
                  )}
                  <p className={`text-xs ${coverLetter.trim().length < 50 ? 'text-gray-400' : 'text-green-600'}`}>
                    {coverLetter.trim().length} chars
                  </p>
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Resume / CV <span className="text-gray-400 font-normal text-xs">(PDF or Word — optional)</span>
                </label>

                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  resumeFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                }`}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={e => setResumeFile(e.target.files?.[0] || null)}
                  />
                  {resumeFile ? (
                    <div className="text-center px-4">
                      <div className="text-2xl mb-1">📄</div>
                      <p className="text-green-700 font-semibold text-sm truncate max-w-xs">{resumeFile.name}</p>
                      <p className="text-green-600 text-xs">{(resumeFile.size / 1024).toFixed(0)} KB — click to change</p>
                    </div>
                  ) : (
                    <div className="text-center px-4">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 text-sm font-medium">Click to upload your resume</p>
                      <p className="text-gray-400 text-xs mt-0.5">PDF, DOC or DOCX — max 5MB</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading resume...' : loading ? 'Submitting...' : 'Submit Application'}
                </button>
                <Link
                  href={`/jobs/${jobId}`}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
