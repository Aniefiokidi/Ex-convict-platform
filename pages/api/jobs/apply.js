import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const user = req.session.user
  if (!user) return res.status(401).json({ message: 'Unauthorized' })
  if (user.role !== 'EX_CONVICT') return res.status(403).json({ message: 'Only returning citizens can apply' })

  const { jobId, coverLetter, resumeUrl } = req.body
  if (!jobId) return res.status(400).json({ message: 'Missing jobId' })

  try {
    const job = await prisma.job.findUnique({ where: { id: Number(jobId) } })
    if (!job) return res.status(404).json({ message: 'Job not found' })

    const existing = await prisma.jobApplication.findFirst({ where: { userId: user.id, jobId: Number(jobId) } })
    if (existing) return res.status(400).json({ message: 'You already applied to this job' })

    const application = await prisma.jobApplication.create({
      data: {
        userId: user.id,
        jobId: parseInt(jobId),
        coverLetter: coverLetter || null,
        resumeUrl: resumeUrl || null
      }
    })

    // Create conversation between applicant and employer
    try {
      await prisma.conversation.create({
        data: {
          type: 'JOB_APPLICATION',
          title: `Job Application: ${job.title}`,
          relatedJobId: parseInt(jobId),
          participants: {
            create: [
              { userId: user.id },
              { userId: job.employerId }
            ]
          }
        }
      })
    } catch (convError) {
      // Don't fail the application if conversation creation fails
      console.error('Failed to create conversation:', convError)
    }

    return res.status(201).json({ application })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
