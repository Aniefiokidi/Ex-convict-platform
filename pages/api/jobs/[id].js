import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  const {
    query: { id },
    method
  } = req

  if (method === 'GET') {
    try {
      const job = await prisma.job.findUnique({ where: { id: Number(id) }, include: { employer: true, applications: { include: { user: true } } } })
      if (!job) return res.status(404).json({ message: 'Job not found' })
      return res.json({ job })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  if (method === 'PATCH') {
    const user = req.session.user
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    const job = await prisma.job.findUnique({ where: { id: Number(id) } })
    if (!job) return res.status(404).json({ message: 'Job not found' })
    if (job.employerId !== user.id && user.role !== 'ADMIN') return res.status(403).json({ message: 'Not your job' })
    const { title, description, location, salary, company } = req.body
    const updated = await prisma.job.update({ where: { id: Number(id) }, data: { title, description, location, salary, company } })
    return res.json({ job: updated })
  }

  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)
