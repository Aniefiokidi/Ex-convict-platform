import { ironSession } from 'iron-session/edge' // use edge-compatible handler for Next.js

// Note: For pages/api (Node) we will import from 'iron-session'

export const sessionOptions = {
  cookieName: 'exconvict_session',
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  // secure: true in production
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
}

export function withSession(handler) {
  // wrapper for next api handlers (non-edge)
  // We'll use iron-session (non-edge) import in APIs directly to avoid complex edge issues
  return handler
}
