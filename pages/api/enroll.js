import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const user = req.session.user
  if (!user) return res.status(401).json({ message: 'Unauthorized' })
  const { trainingId } = req.body
  if (!trainingId) return res.status(400).json({ message: 'Missing trainingId' })

  try {
    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        trainingId: parseInt(trainingId)
      }
    })

    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this training' })
    }

    // Get training details
    const training = await prisma.training.findUnique({
      where: { id: parseInt(trainingId) }
    })

    if (!training) {
      return res.status(404).json({ message: 'Training not found' })
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({ 
      data: { 
        userId: user.id, 
        trainingId: parseInt(trainingId)
      },
      include: {
        training: true
      }
    })

    return res.status(201).json({ 
      enrollment,
      message: `Successfully enrolled in ${training.title}!`
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
