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
    // Get messages for a specific conversation
    const { conversationId, limit = 50, offset = 0 } = req.query

    if (!conversationId) {
      return res.status(400).json({ message: 'Conversation ID required' })
    }

    try {
      // Verify user is participant in conversation
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: parseInt(conversationId),
          participants: {
            some: { userId: user.id }
          }
        }
      })

      if (!conversation) {
        return res.status(403).json({ message: 'Not authorized to view this conversation' })
      }

      // Get messages
      const messages = await prisma.message.findMany({
        where: { conversationId: parseInt(conversationId) },
        include: {
          sender: {
            select: { id: true, name: true, email: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      })

      // Mark messages as read for current user
      await prisma.message.updateMany({
        where: {
          conversationId: parseInt(conversationId),
          receiverId: user.id,
          isRead: false
        },
        data: { isRead: true }
      })

      // Update participant's lastReadAt
      await prisma.conversationParticipant.updateMany({
        where: {
          conversationId: parseInt(conversationId),
          userId: user.id
        },
        data: { lastReadAt: new Date() }
      })

      res.json({ messages: messages.reverse() })
    } catch (error) {
      console.error('Error fetching messages:', error)
      res.status(500).json({ message: 'Failed to fetch messages' })
    }
  } else if (req.method === 'POST') {
    // Send a new message
    const { conversationId, content, messageType = 'TEXT' } = req.body

    if (!conversationId || !content) {
      return res.status(400).json({ message: 'Conversation ID and content required' })
    }

    try {
      // Verify user is participant in conversation
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: parseInt(conversationId),
          participants: {
            some: { userId: user.id }
          }
        },
        include: {
          participants: {
            where: { userId: { not: user.id } },
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        }
      })

      if (!conversation) {
        return res.status(403).json({ message: 'Not authorized to send messages in this conversation' })
      }

      // Get receiver (for direct conversations)
      const receiver = conversation.participants[0]?.user

      // Create message
      const message = await prisma.message.create({
        data: {
          content,
          senderId: user.id,
          receiverId: receiver?.id,
          conversationId: parseInt(conversationId),
          messageType
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      })

      // Update conversation's updatedAt
      await prisma.conversation.update({
        where: { id: parseInt(conversationId) },
        data: { updatedAt: new Date() }
      })

      res.status(201).json({ message })
    } catch (error) {
      console.error('Error sending message:', error)
      res.status(500).json({ message: 'Failed to send message' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)