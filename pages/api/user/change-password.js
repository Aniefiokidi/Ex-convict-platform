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

  if (req.method === 'POST') {
    const { password } = req.body
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password too short' })
    try {
      const hashed = await bcrypt.hash(password, 10)
      await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })
      return res.json({ message: 'Password updated' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)
