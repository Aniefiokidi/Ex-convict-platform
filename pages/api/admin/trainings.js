import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

const DEFAULT_TRAININGS = [
  {
    title: 'Microsoft Office Suite Mastery',
    description: 'A hands-on programme covering Word, Excel, PowerPoint, and Outlook to the professional standard required by most Nigerian office employers. Participants will complete practical assignments modelled on real workplace scenarios.',
    instructor: 'TechSkills Academy Nigeria',
    duration: '6 weeks',
    schedule: 'Mon / Wed / Fri — 9:00 AM–11:00 AM',
    category: 'Technology',
    level: 'Beginner',
    provider: 'TechSkills Academy Nigeria',
  },
  {
    title: 'Professional Business Communication',
    description: 'Develop the written and verbal communication skills that Nigerian employers look for. Topics include business email etiquette, report writing, presentation delivery, active listening, and professional conduct in meetings.',
    instructor: 'CommPro Institute',
    duration: '4 weeks',
    schedule: 'Tue / Thu — 10:00 AM–12:00 PM',
    category: 'Business Skills',
    level: 'Beginner',
    provider: 'CommPro Institute',
  },
  {
    title: 'Project Management Fundamentals',
    description: 'An introduction to Agile, Scrum, and traditional project planning. Participants will learn to scope projects, create Gantt charts, manage stakeholders, and track deliverables using Trello and Asana.',
    instructor: 'PM Leadership Centre Lagos',
    duration: '8 weeks',
    schedule: 'Saturdays — 9:00 AM–1:00 PM',
    category: 'Management',
    level: 'Intermediate',
    provider: 'PM Leadership Centre Lagos',
  },
  {
    title: 'Data Entry & Spreadsheet Analysis',
    description: 'Master high-accuracy data entry and intermediate Excel skills including VLOOKUP, pivot tables, data validation, and basic charting. Graduates consistently achieve typing speeds above 60 WPM with over 98% accuracy.',
    instructor: 'DataReady Training NG',
    duration: '3 weeks',
    schedule: 'Mon–Fri — 2:00 PM–4:00 PM',
    category: 'Technology',
    level: 'Beginner',
    provider: 'DataReady Training NG',
  },
  {
    title: 'Customer Relations & CRM Tools',
    description: 'Learn how to deliver outstanding customer service and use industry-standard CRM platforms. The programme covers complaint handling, upselling techniques, and maintaining accurate customer records.',
    instructor: 'ServiceEdge Institute',
    duration: '5 weeks',
    schedule: 'Tue / Thu — 1:00 PM–3:00 PM',
    category: 'Business Skills',
    level: 'Beginner',
    provider: 'ServiceEdge Institute',
  },
  {
    title: 'Financial Literacy & Business Accounting',
    description: 'A practical introduction to personal and business finance in the Nigerian context. Covers budgeting, profit and loss statements, basic bookkeeping, payroll principles, and preparing financial summaries.',
    instructor: 'FinancePath Academy',
    duration: '6 weeks',
    schedule: 'Mon / Wed — 6:00 PM–8:00 PM',
    category: 'Finance',
    level: 'Beginner',
    provider: 'FinancePath Academy',
  },
  {
    title: 'Human Resources Essentials',
    description: 'Gain foundational HR knowledge covering Nigerian labour law basics, recruitment and onboarding processes, performance management frameworks, workplace conduct policies, and employee record-keeping.',
    instructor: 'HR Academy Nigeria',
    duration: '6 weeks',
    schedule: 'Fri — 10:00 AM–1:00 PM',
    category: 'Human Resources',
    level: 'Beginner',
    provider: 'HR Academy Nigeria',
  },
  {
    title: 'Digital Marketing Fundamentals',
    description: 'An end-to-end introduction to digital marketing covering SEO, social media strategy, email marketing campaigns, and performance analytics using Google Analytics. Participants build a sample campaign portfolio by graduation.',
    instructor: 'GrowthLab Digital NG',
    duration: '8 weeks',
    schedule: 'Tue / Thu / Sat — 10:00 AM–12:00 PM',
    category: 'Marketing',
    level: 'Beginner',
    provider: 'GrowthLab Digital NG',
  },
]

async function handler(req, res) {
  const user = req.session.user
  if (!user || user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' })

  if (req.method === 'GET') {
    const trainings = await prisma.training.findMany({ orderBy: { id: 'asc' } })
    return res.json({ trainings })
  }

  if (req.method === 'POST') {
    const { action, title, description, provider, duration, schedule, category, level, instructor } = req.body

    // Seed all default courses (only if none exist yet)
    if (action === 'seed') {
      const count = await prisma.training.count()
      if (count > 0) {
        return res.json({ message: `Already have ${count} trainings — no seed needed.`, seeded: false })
      }
      await prisma.training.createMany({ data: DEFAULT_TRAININGS })
      return res.json({ message: `Seeded ${DEFAULT_TRAININGS.length} training programmes.`, seeded: true })
    }

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' })
    }

    const training = await prisma.training.create({
      data: { title, description, provider, duration, schedule, category, level, instructor }
    })
    return res.status(201).json({ training })
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'ID required' })
    await prisma.enrollment.deleteMany({ where: { trainingId: Number(id) } })
    await prisma.training.delete({ where: { id: Number(id) } })
    return res.json({ message: 'Training deleted' })
  }

  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)
