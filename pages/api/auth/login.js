import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { withIronSessionApiRoute } from 'iron-session/next'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' })

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    // set session
    req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role }
    await req.session.save()
    return res.json({ user: req.session.user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
