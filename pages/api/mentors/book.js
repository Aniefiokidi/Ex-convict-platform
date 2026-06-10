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
    const mentor = await prisma.mentor.findUnique({
      where: { id: parseInt(mentorId) },
      include: { user: { select: { id: true, name: true } } }
    })

    if (!mentor) return res.status(404).json({ message: 'Mentor not found' })

    // Duplicate booking check (same user + mentor + day)
    const bookingDay = new Date(time)
    bookingDay.setHours(0, 0, 0, 0)
    const nextDay = new Date(bookingDay)
    nextDay.setDate(nextDay.getDate() + 1)

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        mentorId: parseInt(mentorId),
        time: { gte: bookingDay, lt: nextDay }
      }
    })

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a session with this mentor on this day' })
    }

    const booking = await prisma.booking.create({
      data: { userId: user.id, mentorId: parseInt(mentorId), time: new Date(time) },
      include: { mentor: { include: { user: { select: { id: true, name: true } } } } }
    })

    // Only create conversation if mentor has a linked user account
    const mentorUserId = mentor.user?.id
    if (mentorUserId && mentorUserId !== user.id) {
      try {
        await prisma.conversation.create({
          data: {
            type: 'MENTOR_SESSION',
            title: `Mentorship session with ${mentor.user?.name || mentor.name || 'Mentor'}`,
            participants: {
              create: [{ userId: user.id }, { userId: mentorUserId }]
            },
            messages: {
              create: {
                senderId: user.id,
                receiverId: mentorUserId,
                conversationId: undefined,
                content: `Hello! I have just booked a mentorship session for ${new Date(time).toLocaleString('en-NG')}. Looking forward to our discussion!`
              }
            }
          }
        })
      } catch (convErr) {
        console.error('Conversation creation failed (non-fatal):', convErr)
      }
    }

    const mentorName = mentor.user?.name || mentor.name || 'your mentor'
    return res.status(201).json({ booking, message: `Session booked successfully with ${mentorName}!` })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
