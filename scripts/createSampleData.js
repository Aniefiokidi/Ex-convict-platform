const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🎯 Creating sample data...')

  // Sample passwords (all will be 'password123')
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create sample users
  const users = [
    // Ex-convicts
    {
      name: 'Marcus Johnson',
      email: 'marcus.johnson@email.com',
      password: hashedPassword,
      role: 'EX_CONVICT',
      phone: '(555) 123-4567',
      address: '123 Hope Street, Renewal City',
      skills: 'Construction, Carpentry, Leadership',
      experience: '5 years in construction, former team lead'
    },
    {
      name: 'Sarah Williams',
      email: 'sarah.williams@email.com',
      password: hashedPassword,
      role: 'EX_CONVICT',
      phone: '(555) 234-5678',
      address: '456 Second Chance Ave, New Start Town',
      skills: 'Customer Service, Computer Skills, Communication',
      experience: 'Former retail manager, excellent with people'
    },
    {
      name: 'David Rodriguez',
      email: 'david.rodriguez@email.com',
      password: hashedPassword,
      role: 'EX_CONVICT',
      phone: '(555) 345-6789',
      address: '789 Fresh Start Blvd, Opportunity City',
      skills: 'Cooking, Food Service, Time Management',
      experience: 'Culinary training, worked in restaurant kitchens'
    },
    
    // Employers
    {
      name: 'Jennifer Chen',
      email: 'jennifer.chen@goodcompany.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 456-7890',
      address: '100 Business Plaza, Corporate City'
    },
    {
      name: 'Michael Thompson',
      email: 'mike.thompson@constructioncorp.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 567-8901',
      address: '200 Industry Drive, Builder Town'
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@hospitalitygroup.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 678-9012',
      address: '300 Service Street, Hospitality City'
    },

    // Mentors (successful ex-convicts)
    {
      name: 'Robert Jackson',
      email: 'robert.jackson@mentor.com',
      password: hashedPassword,
      role: 'EX_CONVICT',
      phone: '(555) 789-0123',
      address: '400 Success Lane, Achievement Town',
      skills: 'Business Development, Entrepreneurship, Motivation',
      experience: 'Started own business after release, now successful entrepreneur'
    },
    {
      name: 'Angela Martinez',
      email: 'angela.martinez@mentor.com',
      password: hashedPassword,
      role: 'EX_CONVICT',
      phone: '(555) 890-1234',
      address: '500 Inspiration Drive, Hope City',
      skills: 'Education, Counseling, Life Coaching',
      experience: 'Obtained degree post-release, now works in social services'
    },

    // Admin
    {
      name: 'Admin User',
      email: 'admin@platform.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '(555) 000-0001',
      address: 'Platform Headquarters'
    }
  ]

  console.log('👥 Creating users...')
  const createdUsers = []
  for (const userData of users) {
    try {
      const user = await prisma.user.create({
        data: userData
      })
      createdUsers.push(user)
      console.log(`✅ Created user: ${user.name} (${user.email})`)
    } catch (error) {
      console.log(`⚠️  User ${userData.email} may already exist`)
    }
  }

  // Create mentor applications for successful ex-convicts
  console.log('\n🌟 Creating mentor applications...')
  const mentorUsers = createdUsers.filter(u => 
    u.email.includes('@mentor.com') && u.role === 'EX_CONVICT'
  )

  for (const mentorUser of mentorUsers) {
    try {
      const mentor = await prisma.mentor.create({
        data: {
          userId: mentorUser.id,
          bio: mentorUser.name === 'Robert Jackson' 
            ? 'Successfully reintegrated into society and started my own construction business. I understand the challenges of rebuilding life after incarceration and want to help others succeed.'
            : 'Overcame many obstacles to earn my degree in social work. Now working as a counselor helping others navigate their reintegration journey. Passionate about education and personal growth.',
          expertise: mentorUser.name === 'Robert Jackson' 
            ? 'Entrepreneurship, Business Development, Construction, Job Search'
            : 'Education, Career Planning, Personal Development, Mental Health',
          experience: mentorUser.experience,
          availability: 'weekends-afternoon',
          motivation: 'I want to give back to the community and help others avoid the mistakes I made while building successful lives.',
          status: 'APPROVED'
        }
      })
      console.log(`✅ Created mentor: ${mentorUser.name}`)
    } catch (error) {
      console.log(`⚠️  Mentor for ${mentorUser.name} may already exist`)
    }
  }

  // Create sample jobs
  console.log('\n💼 Creating jobs...')
  const employerUsers = createdUsers.filter(u => u.role === 'EMPLOYER')
  
  const jobs = [
    {
      title: 'Warehouse Associate',
      company: 'GoodCompany Logistics',
      description: 'Entry-level warehouse position with opportunities for advancement. We provide on-the-job training and support career development.',
      requirements: 'Ability to lift 50lbs, reliable transportation, willingness to learn',
      salary: '$16-18/hour',
      location: 'Corporate City',
      employerId: employerUsers[0]?.id
    },
    {
      title: 'Construction Laborer',
      company: 'ConstructionCorp',
      description: 'Join our team building homes and commercial buildings. Second chance employer with comprehensive training program.',
      requirements: 'Physical fitness, safety-minded, team player',
      salary: '$18-22/hour',
      location: 'Builder Town',
      employerId: employerUsers[1]?.id
    },
    {
      title: 'Kitchen Staff',
      company: 'Hospitality Group',
      description: 'Kitchen prep and cooking positions available. We believe in second chances and provide a supportive work environment.',
      requirements: 'Food safety knowledge preferred, reliable, fast-paced environment',
      salary: '$15-17/hour',
      location: 'Hospitality City',
      employerId: employerUsers[2]?.id
    },
    {
      title: 'Customer Service Representative',
      company: 'GoodCompany',
      description: 'Handle customer inquiries via phone and email. Training provided. Looking for people with strong communication skills.',
      requirements: 'High school diploma, good communication skills, computer literacy',
      salary: '$17-20/hour',
      location: 'Corporate City',
      employerId: employerUsers[0]?.id
    },
    {
      title: 'Maintenance Technician',
      company: 'ConstructionCorp',
      description: 'Maintain and repair equipment and facilities. Great opportunity to learn technical skills.',
      requirements: 'Basic mechanical knowledge, problem-solving skills, attention to detail',
      salary: '$20-25/hour',
      location: 'Builder Town',
      employerId: employerUsers[1]?.id
    },
    {
      title: 'Delivery Driver',
      company: 'GoodCompany Logistics',
      description: 'Local delivery routes. Clean driving record required. Company vehicle provided.',
      requirements: 'Valid driver license, clean driving record, punctual',
      salary: '$16-19/hour plus tips',
      location: 'Corporate City',
      employerId: employerUsers[0]?.id
    }
  ]

  for (const jobData of jobs) {
    if (jobData.employerId) {
      try {
        const job = await prisma.job.create({
          data: jobData
        })
        console.log(`✅ Created job: ${job.title} at ${job.company}`)
      } catch (error) {
        console.log(`⚠️  Job ${jobData.title} may already exist`)
      }
    }
  }

  console.log('\n🎉 Sample data creation completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })