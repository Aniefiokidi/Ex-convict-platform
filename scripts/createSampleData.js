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
      title: 'Administrative Officer',
      company: 'GoodCompany Group',
      description: 'We are seeking a professional Administrative Officer to support our executive team and ensure smooth day-to-day office operations. Responsibilities include managing correspondence, scheduling meetings, maintaining filing systems, and coordinating cross-departmental activities. GoodCompany Group is a proud second-chance employer committed to workforce inclusion.',
      requirements: 'Minimum OND/HND or equivalent; proficiency in Microsoft Office Suite; strong organisational and communication skills; ability to multitask and manage competing priorities. Prior administrative experience is an advantage.',
      salary: '$2,200-$2,800/month',
      location: 'Corporate City',
      employerId: employerUsers[0]?.id
    },
    {
      title: 'IT Support Technician',
      company: 'BuildTech Solutions',
      description: 'BuildTech Solutions is hiring an IT Support Technician to provide first- and second-line technical support to staff across our offices. You will troubleshoot hardware and software issues, manage user accounts, maintain IT asset records, and support network infrastructure. We welcome applicants from all backgrounds and provide structured on-boarding and professional development.',
      requirements: 'CompTIA A+ or equivalent certification (or demonstrated equivalent experience); knowledge of Windows 10/11 environments; strong diagnostic and problem-solving skills; excellent customer-service orientation.',
      salary: '$2,500-$3,200/month',
      location: 'Tech District',
      employerId: employerUsers[1]?.id
    },
    {
      title: 'Human Resources Assistant',
      company: 'Horizon People Services',
      description: 'Horizon People Services is looking for a detail-oriented Human Resources Assistant to support our HR department. Key duties include maintaining employee records, coordinating recruitment logistics, onboarding new hires, and assisting with payroll processing. We believe every individual deserves a fair opportunity and actively practice inclusive hiring.',
      requirements: 'Diploma or degree in Human Resources Management, Business Administration, or related field; familiarity with HRIS software; strong interpersonal and confidentiality skills; ability to work effectively in a team environment.',
      salary: '$2,000-$2,500/month',
      location: 'Business Park',
      employerId: employerUsers[2]?.id
    },
    {
      title: 'Marketing Coordinator',
      company: 'GoodCompany Group',
      description: 'GoodCompany Group is seeking a Marketing Coordinator to support the development and execution of marketing campaigns across digital and traditional channels. Responsibilities include coordinating content creation, managing social media calendars, tracking campaign performance, and liaising with external vendors. Full training is provided for candidates with the right attitude and aptitude.',
      requirements: 'HND/BSc in Marketing, Communications, or related discipline; solid written and verbal communication skills; experience with social media platforms and basic design tools (Canva, Adobe); analytical mindset with attention to detail.',
      salary: '$2,300-$2,900/month',
      location: 'Corporate City',
      employerId: employerUsers[0]?.id
    },
    {
      title: 'Financial Analyst (Entry-Level)',
      company: 'BuildTech Solutions',
      description: 'This entry-level Financial Analyst role offers an outstanding opportunity to build a career in finance within a growing technology services company. You will assist with budget preparation, variance analysis, financial reporting, and forecasting. BuildTech Solutions mentors junior finance professionals and provides a clear progression path toward senior analyst and management roles.',
      requirements: 'BSc/HND in Accounting, Finance, or Economics; understanding of financial statements and basic accounting principles; proficiency in Microsoft Excel; strong numerical reasoning and attention to detail. ICAN or ACCA student membership is a plus.',
      salary: '$2,800-$3,500/month',
      location: 'Tech District',
      employerId: employerUsers[1]?.id
    },
    {
      title: 'Operations Coordinator',
      company: 'Horizon People Services',
      description: 'Horizon People Services is recruiting an Operations Coordinator to streamline and improve internal business processes. You will monitor daily operational workflows, liaise between departments, prepare management reports, and identify opportunities for efficiency gains. The role carries genuine career progression potential within our rapidly expanding organisation.',
      requirements: 'Degree or HND in Business Administration, Management, or a related field; strong analytical and project-management skills; proficiency with productivity tools (Microsoft 365 or Google Workspace); excellent communication and stakeholder-management abilities.',
      salary: '$2,400-$3,000/month',
      location: 'Business Park',
      employerId: employerUsers[2]?.id
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