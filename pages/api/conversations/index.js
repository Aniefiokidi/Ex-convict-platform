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
    // Get user's conversations
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { userId: user.id }
          }
        },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, name: true, email: true, role: true }
              }
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Get latest message
            include: {
              sender: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          _count: {
            select: {
              messages: {
                where: {
                  isRead: false,
                  senderId: { not: user.id }
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })

      res.json({ conversations })
    } catch (error) {
      console.error('Error fetching conversations:', error)
      res.status(500).json({ message: 'Failed to fetch conversations' })
    }
  } else if (req.method === 'POST') {
    // Create new conversation or get existing
    const { participantIds, type = 'DIRECT', title, relatedJobId, relatedMentorId } = req.body

    if (!participantIds || participantIds.length === 0) {
      return res.status(400).json({ message: 'At least one participant required' })
    }

    // Add current user to participants if not included
    const allParticipants = [...new Set([user.id, ...participantIds])]

    try {
      // For direct conversations, check if conversation already exists
      if (type === 'DIRECT' && allParticipants.length === 2) {
        const existingConversation = await prisma.conversation.findFirst({
          where: {
            type: 'DIRECT',
            participants: {
              every: {
                userId: { in: allParticipants }
              }
            }
          },
          include: {
            participants: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, role: true }
                }
              }
            }
          }
        })

        if (existingConversation) {
          return res.json({ conversation: existingConversation })
        }
      }

      // Create new conversation
      const conversation = await prisma.conversation.create({
        data: {
          title,
          type,
          relatedJobId,
          relatedMentorId,
          participants: {
            create: allParticipants.map(userId => ({ userId }))
          }
        },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, name: true, email: true, role: true }
              }
            }
          }
        }
      })

      res.status(201).json({ conversation })
    } catch (error) {
      console.error('Error creating conversation:', error)
      res.status(500).json({ message: 'Failed to create conversation' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)