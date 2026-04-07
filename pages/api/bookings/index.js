import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const user = req.session.user
  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        mentor: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: { time: 'desc' }
    })

    return res.json({ bookings })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)