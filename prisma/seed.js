import prisma from '../lib/prisma.js'

async function main() {
  // Create sample trainings
  await prisma.training.createMany({
    data: [
      {
        title: 'Basic Computer Skills',
        description: 'Learn fundamental computer and internet skills.',
        provider: 'TechForGood'
      },
      {
        title: 'Construction Safety Certification',
        description: 'OSHA 10-hour construction safety certification program.',
        provider: 'SafeBuild Institute'
      },
      {
        title: 'Food Handler Certification',
        description: 'Get certified to work in restaurants and food service.',
        provider: 'Food Safety Center'
      }
    ]
  })

  // Create sample mentors
  await prisma.mentor.createMany({
    data: [
      {
        name: 'Sarah Johnson',
        bio: 'Former social worker with 10 years of experience helping people reintegrate.',
        expertise: 'Life Skills & Emotional Support'
      },
      {
        name: 'Michael Rodriguez',
        bio: 'Career counselor specializing in employment for returning citizens.',
        expertise: 'Job Search & Interview Preparation'
      },
      {
        name: 'Dr. Amanda Chen',
        bio: 'Licensed therapist providing counseling and mental health support.',
        expertise: 'Mental Health & Counseling'
      }
    ]
  })

  console.log('Seed data created successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })