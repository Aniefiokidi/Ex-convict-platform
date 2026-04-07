import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  const user = req.session.user
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  try {
    if (user.role === 'EMPLOYER') {
      // return applications for this employer's jobs
      const jobs = await prisma.job.findMany({ where: { employerId: user.id }, include: { applications: { include: { user: true } } }, orderBy: { createdAt: 'desc' } })
      return res.json({ jobs })
    }

    if (user.role === 'EX_CONVICT') {
      const applications = await prisma.jobApplication.findMany({ where: { userId: user.id }, include: { job: true }, orderBy: { appliedAt: 'desc' } })
      return res.json({ applications })
    }

    // admin: return all applications
    if (user.role === 'ADMIN') {
      const applications = await prisma.jobApplication.findMany({ include: { user: true, job: true }, orderBy: { appliedAt: 'desc' } })
      return res.json({ applications })
    }

    return res.status(403).json({ message: 'Not allowed' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
