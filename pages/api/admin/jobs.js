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
  if (user.role !== 'ADMIN') return res.status(403).json({ message: 'Admins only' })

  if (req.method === 'POST') {
    const { title, description, location, salary, company, employerId } = req.body
    if (!title || !description || !employerId) return res.status(400).json({ message: 'Title, description and employerId are required' })
    const job = await prisma.job.create({ data: { title, description, location, salary, company, employerId: Number(employerId) } })
    return res.status(201).json({ job })
  }

  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)
