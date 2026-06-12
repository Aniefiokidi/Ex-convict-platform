import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  if (req.method === 'GET') {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: { employer: { select: { name: true } } }
    })
    // Fallback: use employer name if company field is blank
    const enriched = jobs.map(j => ({
      ...j,
      company: j.company || j.employer?.name || 'Company'
    }))
    return res.json({ jobs: enriched })
  }

  if (req.method === 'POST') {
    const user = req.session.user
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    if (user.role !== 'EMPLOYER') return res.status(403).json({ message: 'Only employers can post jobs' })
    const { title, description, location, company, salary } = req.body
    if (!title || !description) return res.status(400).json({ message: 'Missing fields' })
    const job = await prisma.job.create({ data: { title, description, location, company, salary, employerId: user.id } })
    return res.status(201).json({ job })
  }

  // DELETE — admin can remove a job
  if (req.method === 'DELETE') {
    const user = req.session.user
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    if (user.role !== 'ADMIN') return res.status(403).json({ message: 'Admins only' })
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'Job ID required' })
    await prisma.jobApplication.deleteMany({ where: { jobId: Number(id) } })
    await prisma.job.delete({ where: { id: Number(id) } })
    return res.json({ message: 'Job deleted' })
  }

  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)
