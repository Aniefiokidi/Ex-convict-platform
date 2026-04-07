import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const trainings = await prisma.training.findMany({ orderBy: { id: 'asc' } })
    return res.json({ trainings })
  }

  // For simplicity, only GET implemented. Admin could POST new trainings later.
  return res.status(405).end()
}
