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

  if (req.method === 'POST') {
    const { bio, expertise, experience, availability, motivation } = req.body

    console.log('[mentor apply] session user:', req.session?.user)
    console.log('[mentor apply] request body:', req.body)

    // Validate required fields
    if (!bio || !expertise || !experience || !availability || !motivation) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    try {
      // Check if user already has a mentor application
      const existingMentor = await prisma.mentor.findUnique({
        where: { userId: user.id }
      })

      if (existingMentor) {
        return res.status(400).json({ 
          message: 'You have already submitted a mentor application. Check your dashboard for status updates.' 
        })
      }

      // Create mentor application (include motivation)
      const mentorApplication = await prisma.mentor.create({
        data: {
          userId: user.id,
          bio,
          expertise,
          experience,
          availability,
          motivation,
          status: 'PENDING'
        }
      })

      return res.status(201).json({ 
        message: 'Mentor application submitted successfully!',
        application: {
          id: mentorApplication.id,
          status: mentorApplication.status,
          createdAt: mentorApplication.createdAt
        }
      })

    } catch (error) {
      console.error('Error creating mentor application:', error)
      // Return the error message for easier debugging (non-production)
      return res.status(500).json({ message: error.message || 'Server error creating application' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}

export default withIronSessionApiRoute(handler, sessionOptions)