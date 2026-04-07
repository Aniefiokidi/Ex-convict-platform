import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const user = req.session.user
  if (!user) return res.status(401).json({ message: 'Unauthorized' })
  const { mentorId, time } = req.body
  if (!mentorId || !time) return res.status(400).json({ message: 'Missing fields' })

  try {
    // Check if mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: parseInt(mentorId) },
      include: { user: true }
    })

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' })
    }

    // Check for duplicate bookings (same user, mentor, and day)
    const bookingDay = new Date(time)
    bookingDay.setHours(0, 0, 0, 0)
    const nextDay = new Date(bookingDay)
    nextDay.setDate(nextDay.getDate() + 1)

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        mentorId: parseInt(mentorId),
        time: {
          gte: bookingDay,
          lt: nextDay
        }
      }
    })

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a session with this mentor on this day' })
    }

    // Create the booking
    const booking = await prisma.booking.create({ 
      data: { userId: user.id, mentorId: parseInt(mentorId), time: new Date(time) },
      include: {
        mentor: {
          include: { user: true }
        }
      }
    })

    // Create conversation between user and mentor
    try {
      await prisma.conversation.create({
        data: {
          participants: {
            create: [
              { userId: user.id },
              { userId: mentor.user.id }
            ]
          },
          messages: {
            create: {
              senderId: user.id,
              content: `Hi! I've just booked a mentorship session with you for ${new Date(time).toLocaleString()}. Looking forward to our discussion!`
            }
          }
        }
      })
    } catch (conversationErr) {
      console.error('Failed to create conversation:', conversationErr)
      // Continue even if conversation creation fails
    }
    
    return res.status(201).json({ 
      booking,
      message: `Mentorship session booked successfully with ${mentor.user.name}!`
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)