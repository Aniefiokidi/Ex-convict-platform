const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const trainingCount = await prisma.training.count()
  if (trainingCount === 0) {
    await prisma.training.createMany({
      data: [
        {
          title: 'Microsoft Office Suite Mastery',
          description: 'A hands-on programme covering Word, Excel, PowerPoint, and Outlook to the professional standard required by most office employers.',
          instructor: 'TechSkills Academy',
          duration: '6 weeks',
          schedule: 'Mon / Wed / Fri — 9:00 AM–11:00 AM',
          category: 'Technology',
          level: 'Beginner',
          provider: 'TechSkills Academy',
        },
        {
          title: 'Professional Business Communication',
          description: 'Develop the written and verbal communication skills that employers look for, including business email, report writing, and presentations.',
          instructor: 'CommPro Institute',
          duration: '4 weeks',
          schedule: 'Tue / Thu — 10:00 AM–12:00 PM',
          category: 'Business Skills',
          level: 'Beginner',
          provider: 'CommPro Institute',
        },
        {
          title: 'Financial Literacy & Business Accounting',
          description: 'A practical introduction to personal and business finance covering budgeting, bookkeeping, payroll, and financial statements.',
          instructor: 'FinancePath Academy',
          duration: '6 weeks',
          schedule: 'Mon / Wed — 6:00 PM–8:00 PM',
          category: 'Finance',
          level: 'Beginner',
          provider: 'FinancePath Academy',
        },
      ],
    })
    console.log('Seed data created successfully!')
  } else {
    console.log('Training data already exists, skipping seed.')
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
