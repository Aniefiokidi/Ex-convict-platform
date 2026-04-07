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
  if (user.role !== 'ADMIN') return res.status(403).json({ message: 'Only admins can access' })

  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
      return res.json({ users })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)
