import { withIronSessionApiRoute } from 'iron-session/next'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  req.session.destroy()
  res.json({ ok: true })
}

export default withIronSessionApiRoute(handler, sessionOptions)
