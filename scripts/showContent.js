const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function showCurrentContent() {
  console.log('📊 Current Platform Content Overview\n')

  // Users breakdown
  const usersByRole = await prisma.user.groupBy({
    by: ['role'],
    _count: { role: true }
  })
  
  console.log('👥 Users by Role:')
  usersByRole.forEach(group => {
    console.log(`   ${group.role}: ${group._count.role} users`)
  })

  // Jobs breakdown
  const allJobs = await prisma.job.findMany({
    include: {
      employer: {
        select: { name: true }
      }
    }
  })
  
  console.log(`\n💼 Available Jobs (${allJobs.length} total):`)
  allJobs.forEach(job => {
    console.log(`   • ${job.title} at ${job.employer.name} (${job.location})`)
  })

  // Training programs
  const allTraining = await prisma.training.findMany({
    select: {
      title: true,
      category: true,
      duration: true,
      level: true
    }
  })

  console.log(`\n📚 Training Programs (${allTraining.length} total):`)
  allTraining.forEach(training => {
    console.log(`   • ${training.title} (${training.category} - ${training.level}) - ${training.duration}`)
  })

  // Mentors
  const mentors = await prisma.mentor.findMany({
    where: { status: 'APPROVED' },
    include: {
      user: {
        select: { name: true }
      }
    }
  })

  console.log(`\n🌟 Approved Mentors (${mentors.length} total):`)
  mentors.forEach(mentor => {
    console.log(`   • ${mentor.user?.name || 'Unknown'} - ${mentor.expertise}`)
  })

  // Job Applications
  const applications = await prisma.jobApplication.findMany({
    include: {
      user: { select: { name: true } },
      job: { select: { title: true } }
    }
  })

  console.log(`\n📋 Job Applications (${applications.length} total):`)
  applications.forEach(app => {
    console.log(`   • ${app.user.name} applied to ${app.job.title} - Status: ${app.status}`)
  })

  console.log('\n🎯 Content Status Summary:')
  console.log(`   Users: ${usersByRole.reduce((sum, group) => sum + group._count.role, 0)}`)
  console.log(`   Jobs: ${allJobs.length}`)
  console.log(`   Training: ${allTraining.length}`)
  console.log(`   Mentors: ${mentors.length}`)
  console.log(`   Applications: ${applications.length}`)
}

showCurrentContent()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })