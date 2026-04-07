import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  if (req.method === 'GET') {
    const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } })
    return res.json({ jobs })
  }

  if (req.method === 'POST') {
    const user = req.session.user
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    if (user.role !== 'EMPLOYER') return res.status(403).json({ message: 'Only employers can post jobs' })
    const { title, description, location } = req.body
    if (!title || !description) return res.status(400).json({ message: 'Missing fields' })
    const job = await prisma.job.create({ data: { title, description, location, employerId: user.id } })
    return res.status(201).json({ job })
  }

  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)
