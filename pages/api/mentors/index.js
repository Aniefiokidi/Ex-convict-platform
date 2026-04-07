import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const mentors = await prisma.mentor.findMany({ 
        where: { status: 'APPROVED' },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' } 
      })
      
      // Format the data for the frontend
      const formattedMentors = mentors.map(mentor => ({
        id: mentor.id,
        name: mentor.user.name || mentor.user.email,
        bio: mentor.bio,
        expertise: mentor.expertise,
        experience: mentor.experience,
        availability: mentor.availability,
        userId: mentor.user.id
      }))
      
      return res.json({ mentors: formattedMentors })
    } catch (error) {
      console.error('Error fetching mentors:', error)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  return res.status(405).end()
}