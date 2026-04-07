const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createSampleConversations() {
  console.log('💬 Creating sample conversations and messages...')

  try {
    // Get some users
    const marcus = await prisma.user.findUnique({ where: { email: 'marcus.johnson@email.com' } })
    const jennifer = await prisma.user.findUnique({ where: { email: 'jennifer.chen@goodcompany.com' } })
    const robert = await prisma.user.findUnique({ where: { email: 'robert.jackson@mentor.com' } })
    const sarah = await prisma.user.findUnique({ where: { email: 'sarah.williams@email.com' } })
    const mike = await prisma.user.findUnique({ where: { email: 'mike.thompson@constructioncorp.com' } })

    if (!marcus || !jennifer || !robert || !sarah || !mike) {
      console.log('❌ Required users not found')
      return
    }

    // Get some jobs for context
    const jobs = await prisma.job.findMany({ take: 2 })

    // Create conversation 1: Marcus (ex-convict) and Jennifer (employer) about job application
    const conv1 = await prisma.conversation.create({
      data: {
        type: 'JOB_APPLICATION',
        title: `Job Application: ${jobs[0]?.title || 'Warehouse Associate'}`,
        relatedJobId: jobs[0]?.id,
        participants: {
          create: [
            { userId: marcus.id },
            { userId: jennifer.id }
          ]
        }
      }
    })

    // Add messages to conversation 1
    await prisma.message.createMany({
      data: [
        {
          content: 'Hi Jennifer, I just submitted my application for the Warehouse Associate position. I have 5 years of construction experience and I am very interested in this opportunity.',
          senderId: marcus.id,
          receiverId: jennifer.id,
          conversationId: conv1.id,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          content: 'Hello Marcus! Thank you for your application. I reviewed your background and I am impressed with your construction experience. Would you be available for a phone interview this week?',
          senderId: jennifer.id,
          receiverId: marcus.id,
          conversationId: conv1.id,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
        },
        {
          content: 'Absolutely! I am available any weekday after 2 PM or weekends. What time works best for you?',
          senderId: marcus.id,
          receiverId: jennifer.id,
          conversationId: conv1.id,
          createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        }
      ]
    })

    // Create conversation 2: Sarah (ex-convict) and Robert (mentor) - mentorship chat
    const conv2 = await prisma.conversation.create({
      data: {
        type: 'MENTOR_SESSION',
        title: 'Career Development Mentorship',
        participants: {
          create: [
            { userId: sarah.id },
            { userId: robert.id }
          ]
        }
      }
    })

    // Add messages to conversation 2
    await prisma.message.createMany({
      data: [
        {
          content: 'Hi Robert! I just booked a mentorship session with you. I would love to get advice on transitioning from retail to customer service roles and building my professional network.',
          senderId: sarah.id,
          receiverId: robert.id,
          conversationId: conv2.id,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          content: 'Hello Sarah! I am excited to help you with your career journey. Customer service is a great field with lots of growth opportunities. Let me share some strategies that worked for me...',
          senderId: robert.id,
          receiverId: sarah.id,
          conversationId: conv2.id,
          createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000)
        },
        {
          content: 'Thank you so much! Those tips about networking events and LinkedIn optimization are very helpful. I will start implementing them this week.',
          senderId: sarah.id,
          receiverId: robert.id,
          conversationId: conv2.id,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
        },
        {
          content: 'Great! Remember, building a professional network takes time, but every connection counts. Let me know how your LinkedIn profile updates go. We can schedule another session next week to review your progress.',
          senderId: robert.id,
          receiverId: sarah.id,
          conversationId: conv2.id,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ]
    })

    // Create conversation 3: Marcus and Mike (employer) about construction job
    const conv3 = await prisma.conversation.create({
      data: {
        type: 'JOB_APPLICATION',
        title: `Job Application: ${jobs[1]?.title || 'Construction Laborer'}`,
        relatedJobId: jobs[1]?.id,
        participants: {
          create: [
            { userId: marcus.id },
            { userId: mike.id }
          ]
        }
      }
    })

    // Add messages to conversation 3
    await prisma.message.createMany({
      data: [
        {
          content: 'Hi Mike, I applied for the Construction Laborer position at ConstructionCorp. With my 5 years of construction experience, I believe I would be a great fit for your team.',
          senderId: marcus.id,
          receiverId: mike.id,
          conversationId: conv3.id,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        },
        {
          content: 'Hello Marcus! Your experience looks solid. Can you tell me more about the specific types of construction work you have done? We mainly work on residential and commercial buildings.',
          senderId: mike.id,
          receiverId: marcus.id,
          conversationId: conv3.id,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
          content: 'I have worked on both residential homes and small commercial projects. My experience includes framing, concrete work, and general labor. I also have experience with safety protocols and team leadership.',
          senderId: marcus.id,
          receiverId: mike.id,
          conversationId: conv3.id,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ]
    })

    console.log(`✅ Created 3 conversations with realistic messages`)
    console.log(`✅ Job application conversations between applicants and employers`)
    console.log(`✅ Mentorship conversation between mentee and mentor`)
    console.log(`✅ Messages span different time periods for realistic testing`)
    
  } catch (error) {
    console.error('❌ Error creating conversations:', error)
  }
}

createSampleConversations()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })