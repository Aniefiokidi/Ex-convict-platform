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
    const { name, email, phone, address, skills, experience } = req.body
    
    try {
      const updateData = {}
      if (name) updateData.name = name
      if (email) updateData.email = email
      if (phone) updateData.phone = phone
      if (address) updateData.address = address
      if (skills) updateData.skills = skills
      if (experience) updateData.experience = experience

      const updated = await prisma.user.update({ 
        where: { id: user.id }, 
        data: updateData 
      })
      
      // Update session copy
      req.session.user = { 
        ...req.session.user, 
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        skills: updated.skills,
        experience: updated.experience
      }
      await req.session.save()
      
      return res.json({ 
        message: 'Profile updated successfully',
        user: { 
          id: updated.id, 
          email: updated.email, 
          name: updated.name, 
          role: updated.role,
          phone: updated.phone,
          address: updated.address,
          skills: updated.skills,
          experience: updated.experience
        } 
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error updating profile' })
    }
  }

  return res.status(405).end()
}

export default withIronSessionApiRoute(handler, sessionOptions)
