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

  if (req.method === 'GET') {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id },
        include: {
          training: true
        },
        orderBy: { enrolledAt: 'desc' }
      })

      res.json({ enrollments })
    } catch (error) {
      console.error('Error fetching enrollments:', error)
      res.status(500).json({ message: 'Failed to fetch enrollments' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)