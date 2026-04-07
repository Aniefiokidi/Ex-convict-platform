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
      let notifications = []
      
      if (user.role === 'EX_CONVICT') {
        // Get job application status updates
        const applications = await prisma.jobApplication.findMany({
          where: { userId: user.id },
          include: { job: { select: { title: true, company: true } } },
          orderBy: { createdAt: 'desc' }
        })
        
        notifications = applications.map(app => ({
          id: app.id,
          type: 'application_status',
          title: `Application ${app.status}`,
          message: `Your application for ${app.job.title} at ${app.job.company} is ${app.status.toLowerCase()}`,
          createdAt: app.createdAt,
          read: false
        }))
        
      } else if (user.role === 'EMPLOYER') {
        // Get new job applications
        const jobs = await prisma.job.findMany({
          where: { userId: user.id },
          include: {
            applications: {
              where: { status: 'PENDING' },
              include: { user: { select: { name: true, email: true } } }
            }
          }
        })
        
        notifications = jobs.flatMap(job => 
          job.applications.map(app => ({
            id: app.id,
            type: 'new_application',
            title: 'New Job Application',
            message: `${app.user.name || app.user.email} applied for ${job.title}`,
            createdAt: app.createdAt,
            read: false
          }))
        )
      }
      
      return res.json({ notifications })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
  }
  
  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)