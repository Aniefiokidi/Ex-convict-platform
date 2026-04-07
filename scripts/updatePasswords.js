const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function updatePasswords() {
  console.log('🔐 Updating all user passwords to use bcryptjs...')

  // Hash the password with bcryptjs (same as login system)
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  try {
    // Update all users with the new hashed password
    const result = await prisma.user.updateMany({
      data: {
        password: hashedPassword
      }
    })

    console.log(`✅ Updated ${result.count} user passwords`)
    console.log('🎉 All accounts now use password: password123')
    
  } catch (error) {
    console.error('❌ Error updating passwords:', error)
  }
}

updatePasswords()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })