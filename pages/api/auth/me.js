import { withIronSessionApiRoute } from 'iron-session/next'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  const user = req.session.user || null
  res.json({ user })
}

export default withIronSessionApiRoute(handler, sessionOptions)
