import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

const VALID_STATUSES = ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED']

async function handler(req, res) {
  const user = req.session.user
  if (!user || user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' })

  if (req.method === 'PATCH') {
    const { id, status } = req.body
    if (!id || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid request' })
    }
    const updated = await prisma.jobApplication.update({
      where: { id: Number(id) },
      data: { status }
    })
    return res.json({ application: updated })
  }

  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)
