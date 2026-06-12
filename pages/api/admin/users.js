import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  const user = req.session.user
  if (!user) return res.status(401).json({ message: 'Unauthorized' })
  if (user.role !== 'ADMIN') return res.status(403).json({ message: 'Admins only' })

  // GET — list all users
  if (req.method === 'GET') {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    return res.json({ users })
  }

  // POST — create a new user
  if (req.method === 'POST') {
    const { name, email, password, role } = req.body
    if (!email || !password || !role) return res.status(400).json({ message: 'Email, password and role are required' })
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Email already registered' })
    const hashed = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({ data: { name, email, password: hashed, role } })
    return res.status(201).json({ user: newUser })
  }

  // PATCH — edit a user (name, role, optionally reset password)
  if (req.method === 'PATCH') {
    const { id, name, role, newPassword } = req.body
    if (!id) return res.status(400).json({ message: 'User ID required' })
    const updateData = { name, role }
    if (newPassword && newPassword.trim().length >= 6) {
      updateData.password = await bcrypt.hash(newPassword.trim(), 10)
    }
    const updated = await prisma.user.update({ where: { id: Number(id) }, data: updateData })
    return res.json({ user: updated })
  }

  // DELETE — remove a user
  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'User ID required' })
    if (Number(id) === user.id) return res.status(400).json({ message: 'You cannot delete your own account' })
    // Delete dependent records first to avoid FK constraint errors
    await prisma.jobApplication.deleteMany({ where: { userId: Number(id) } })
    await prisma.enrollment.deleteMany({ where: { userId: Number(id) } })
    await prisma.booking.deleteMany({ where: { userId: Number(id) } })
    await prisma.conversationParticipant.deleteMany({ where: { userId: Number(id) } })
    await prisma.message.deleteMany({ where: { OR: [{ senderId: Number(id) }, { receiverId: Number(id) }] } })
    // If employer, delete their jobs too
    await prisma.job.deleteMany({ where: { employerId: Number(id) } })
    // If mentor profile exists
    await prisma.mentor.deleteMany({ where: { userId: Number(id) } })
    await prisma.user.delete({ where: { id: Number(id) } })
    return res.json({ message: 'User deleted' })
  }

  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)
