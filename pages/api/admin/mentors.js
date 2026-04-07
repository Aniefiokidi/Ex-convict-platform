import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  const user = req.session.user
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' })
  }

  if (req.method === 'GET') {
    // Get all mentor applications
    try {
      const mentors = await prisma.mentor.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      res.json(mentors)
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch mentor applications' })
    }
  } else if (req.method === 'POST') {
    // Approve or reject mentor application
    const { mentorId, action } = req.body

    if (!mentorId || !action || !['APPROVED', 'REJECTED'].includes(action)) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    try {
      const updatedMentor = await prisma.mentor.update({
        where: { id: parseInt(mentorId) },
        data: { status: action },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      res.json({ 
        message: `Mentor application ${action.toLowerCase()} successfully`, 
        mentor: updatedMentor 
      })
    } catch (error) {
      res.status(500).json({ message: 'Failed to update mentor application' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)