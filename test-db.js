const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('Testing database connectivity...')
    
    const trainings = await prisma.training.findMany()
    console.log(`✅ Found ${trainings.length} training programs:`)
    trainings.forEach(t => console.log(`  - ${t.title}`))
    
    const mentors = await prisma.mentor.findMany()
    console.log(`✅ Found ${mentors.length} mentors:`)
    mentors.forEach(m => console.log(`  - ${m.name} (${m.expertise})`))
    
    const users = await prisma.user.count()
    console.log(`✅ Total users: ${users}`)
    
    const jobs = await prisma.job.count()
    console.log(`✅ Total jobs: ${jobs}`)
    
    console.log('\n🎉 Database is working correctly!')
    
  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()