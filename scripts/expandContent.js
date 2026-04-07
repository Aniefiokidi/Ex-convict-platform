const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function expandPlatformContent() {
  console.log('🚀 Expanding platform with more content...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create more employers
  const newEmployers = [
    {
      name: 'Maria Gonzalez',
      email: 'maria.gonzalez@techstart.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 111-2222',
      address: '400 Innovation Drive, Tech City'
    },
    {
      name: 'James Wilson',
      email: 'james.wilson@retailplus.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 222-3333',
      address: '500 Commerce Street, Retail Town'
    },
    {
      name: 'Dr. Emily Carter',
      email: 'emily.carter@healthcorp.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 333-4444',
      address: '600 Medical Plaza, Healthcare City'
    },
    {
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@greenenergy.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 444-5555',
      address: '700 Solar Avenue, Green Valley'
    },
    {
      name: 'Susan Lee',
      email: 'susan.lee@manufacturing.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 555-6666',
      address: '800 Factory Road, Industrial Park'
    }
  ]

  console.log('👔 Creating additional employers...')
  const createdEmployers = []
  for (const employer of newEmployers) {
    try {
      const user = await prisma.user.create({ data: employer })
      createdEmployers.push(user)
      console.log(`✅ Created employer: ${user.name}`)
    } catch (error) {
      console.log(`⚠️  Employer ${employer.email} may already exist`)
    }
  }

  // Create more mentors (users who can become mentors)
  const newMentorUsers = [
    {
      name: 'Patricia Johnson',
      email: 'patricia.johnson@mentor.com',
      password: hashedPassword,
      role: 'EX_CONVICT',
      phone: '(555) 777-8888',
      address: '900 Success Boulevard, Achievement City',
      skills: 'Financial Planning, Budgeting, Accounting',
      experience: 'Former accountant, now financial advisor helping with money management'
    },
    {
      name: 'Thomas Anderson',
      email: 'thomas.anderson@mentor.com',
      password: hashedPassword,
      role: 'EX_CONVICT',
      phone: '(555) 888-9999',
      address: '1000 Recovery Lane, Hope Springs',
      skills: 'Addiction Recovery, Counseling, Mental Health',
      experience: '10+ years sober, certified addiction counselor'
    },
    {
      name: 'Michelle Davis',
      email: 'michelle.davis@mentor.com',
      password: hashedPassword,
      role: 'EX_CONVICT',
      phone: '(555) 999-0000',
      address: '1100 Family Street, Reunion Town',
      skills: 'Parenting, Family Relationships, Legal Aid',
      experience: 'Rebuilt family relationships, works in family services'
    },
    {
      name: 'Kevin Brown',
      email: 'kevin.brown@mentor.com',
      password: hashedPassword,
      role: 'EX_CONVICT',
      phone: '(555) 000-1111',
      address: '1200 Trade Avenue, Skill City',
      skills: 'Automotive Repair, Technical Training, Apprenticeships',
      experience: 'Master mechanic, runs automotive training program'
    },
    {
      name: 'Lisa Garcia',
      email: 'lisa.garcia@mentor.com',
      password: hashedPassword,
      role: 'EX_CONVICT',
      phone: '(555) 111-0000',
      address: '1300 Community Drive, Service Town',
      skills: 'Community Outreach, Nonprofit Work, Volunteering',
      experience: 'Founded local nonprofit, expert in community service'
    }
  ]

  console.log('🌟 Creating additional mentor users...')
  const mentorUsers = []
  for (const mentorUser of newMentorUsers) {
    try {
      const user = await prisma.user.create({ data: mentorUser })
      mentorUsers.push(user)
      console.log(`✅ Created mentor user: ${user.name}`)
    } catch (error) {
      console.log(`⚠️  Mentor user ${mentorUser.email} may already exist`)
    }
  }

  // Create mentor applications for these users
  console.log('📝 Creating mentor applications...')
  const mentorApplications = [
    {
      userId: mentorUsers[0]?.id, // Patricia Johnson
      bio: 'After my release, I struggled with financial management and made many mistakes. Through hard work and education, I became a certified financial planner. I want to help others avoid the financial pitfalls I experienced and build stable, secure futures.',
      expertise: 'Financial Planning, Budgeting, Credit Repair, Banking',
      experience: 'CPA certification, 5+ years helping formerly incarcerated individuals with financial planning',
      availability: 'weekdays-evening',
      motivation: 'Financial stability is crucial for successful reintegration. I want to share the knowledge I gained the hard way.',
      status: 'APPROVED'
    },
    {
      userId: mentorUsers[1]?.id, // Thomas Anderson
      bio: 'I understand the challenges of addiction and the importance of mental health in successful reintegration. With over 10 years of sobriety and professional training, I help others find their path to recovery and stability.',
      expertise: 'Addiction Recovery, Mental Health, Support Groups, Coping Strategies',
      experience: '10+ years sober, certified addiction counselor, group therapy facilitator',
      availability: 'weekends-afternoon',
      motivation: 'Recovery is possible for everyone. I want to be the support I wish I had during my early recovery.',
      status: 'APPROVED'
    },
    {
      userId: mentorUsers[2]?.id, // Michelle Davis
      bio: 'Rebuilding family relationships after incarceration was one of my biggest challenges. Through patience, therapy, and legal support, I restored my family bonds and now help others do the same.',
      expertise: 'Family Reunification, Parenting Skills, Legal Rights, Relationship Building',
      experience: 'Family services coordinator, certified parent educator, legal aid volunteer',
      availability: 'weekdays-afternoon',
      motivation: 'Family support is essential for successful reintegration. I help others rebuild these crucial relationships.',
      status: 'APPROVED'
    },
    {
      userId: mentorUsers[3]?.id, // Kevin Brown
      bio: 'Trade skills gave me a second chance. After learning automotive repair, I built a successful career and now train others in technical skills that lead to stable, well-paying jobs.',
      expertise: 'Technical Training, Automotive Repair, Apprenticeships, Skilled Trades',
      experience: 'Master ASE certified mechanic, vocational training instructor, 15+ years experience',
      availability: 'weekends-morning',
      motivation: 'Skilled trades offer excellent opportunities for those willing to learn. I want to open these doors for others.',
      status: 'APPROVED'
    },
    {
      userId: mentorUsers[4]?.id, // Lisa Garcia
      bio: 'Giving back to the community transformed my life and gave me purpose. I founded a local nonprofit and now help others find meaningful ways to contribute to society and build positive identities.',
      expertise: 'Community Service, Nonprofit Leadership, Volunteer Coordination, Social Impact',
      experience: 'Nonprofit founder, community organizer, volunteer coordinator for 8+ years',
      availability: 'flexible',
      motivation: 'Service to others heals both the giver and receiver. I help people find their way to contribute positively.',
      status: 'APPROVED'
    }
  ]

  for (let i = 0; i < mentorApplications.length; i++) {
    const app = mentorApplications[i]
    if (app.userId) {
      try {
        await prisma.mentor.create({ data: app })
        console.log(`✅ Created mentor application: ${mentorUsers[i]?.name}`)
      } catch (error) {
        console.log(`⚠️  Mentor application for ${mentorUsers[i]?.name} may already exist`)
      }
    }
  }

  // Get all employers (existing + new)
  const allEmployers = await prisma.user.findMany({
    where: { role: 'EMPLOYER' }
  })

  // Create many more jobs
  const jobCategories = [
    // Tech Jobs
    {
      title: 'IT Support Specialist',
      company: 'TechStart Solutions',
      description: 'Entry-level IT support role. We provide comprehensive training for motivated individuals. Help desk experience preferred but not required. Strong problem-solving skills essential.',
      requirements: 'High school diploma, basic computer skills, willingness to learn, good communication',
      salary: '$18-22/hour',
      location: 'Tech City',
      employerId: allEmployers.find(e => e.email.includes('techstart'))?.id || allEmployers[0]?.id
    },
    {
      title: 'Data Entry Clerk',
      company: 'TechStart Solutions',
      description: 'Accurate data entry and file management. Training provided on our systems. Detail-oriented individuals encouraged to apply.',
      requirements: 'Typing skills, attention to detail, basic computer literacy',
      salary: '$15-17/hour',
      location: 'Tech City',
      employerId: allEmployers.find(e => e.email.includes('techstart'))?.id || allEmployers[0]?.id
    },
    
    // Retail Jobs
    {
      title: 'Sales Associate',
      company: 'RetailPlus Stores',
      description: 'Customer service focused retail position. We believe in second chances and provide a supportive environment for growth and advancement.',
      requirements: 'Customer service skills, reliable attendance, positive attitude',
      salary: '$14-16/hour plus commission',
      location: 'Retail Town',
      employerId: allEmployers.find(e => e.email.includes('retailplus'))?.id || allEmployers[1]?.id
    },
    {
      title: 'Inventory Specialist',
      company: 'RetailPlus Stores',
      description: 'Manage inventory, stock shelves, organize warehouse. Physical work with opportunities for advancement to management.',
      requirements: 'Ability to lift 40lbs, basic math skills, teamwork',
      salary: '$16-18/hour',
      location: 'Retail Town',
      employerId: allEmployers.find(e => e.email.includes('retailplus'))?.id || allEmployers[1]?.id
    },
    {
      title: 'Assistant Manager',
      company: 'RetailPlus Stores',
      description: 'Leadership role with growth potential. We promote from within and value experience over formal education.',
      requirements: 'Retail experience, leadership skills, customer service focus',
      salary: '$20-24/hour',
      location: 'Retail Town',
      employerId: allEmployers.find(e => e.email.includes('retailplus'))?.id || allEmployers[1]?.id
    },

    // Healthcare Jobs
    {
      title: 'Medical Office Assistant',
      company: 'HealthCorp Medical',
      description: 'Administrative support in medical office. Training provided for electronic health records and medical terminology.',
      requirements: 'High school diploma, communication skills, confidentiality awareness',
      salary: '$17-20/hour',
      location: 'Healthcare City',
      employerId: allEmployers.find(e => e.email.includes('healthcorp'))?.id || allEmployers[2]?.id
    },
    {
      title: 'Patient Transport',
      company: 'HealthCorp Medical',
      description: 'Transport patients within hospital facilities. Compassionate individuals who want to make a difference in healthcare.',
      requirements: 'Physical ability, compassionate nature, reliability',
      salary: '$15-18/hour',
      location: 'Healthcare City',
      employerId: allEmployers.find(e => e.email.includes('healthcorp'))?.id || allEmployers[2]?.id
    },
    {
      title: 'Environmental Services',
      company: 'HealthCorp Medical',
      description: 'Maintain clean, safe hospital environment. Essential role in patient care with opportunities for advancement.',
      requirements: 'Attention to detail, physical stamina, team oriented',
      salary: '$16-19/hour',
      location: 'Healthcare City',
      employerId: allEmployers.find(e => e.email.includes('healthcorp'))?.id || allEmployers[2]?.id
    },

    // Green Energy Jobs
    {
      title: 'Solar Panel Installer',
      company: 'Green Energy Solutions',
      description: 'Install residential and commercial solar systems. Comprehensive training provided. Growing field with excellent job security.',
      requirements: 'Physical fitness, comfort with heights, willingness to learn',
      salary: '$22-28/hour',
      location: 'Green Valley',
      employerId: allEmployers.find(e => e.email.includes('greenenergy'))?.id || allEmployers[3]?.id
    },
    {
      title: 'Energy Auditor',
      company: 'Green Energy Solutions',
      description: 'Assess homes and businesses for energy efficiency. Travel to client sites and provide recommendations.',
      requirements: 'Detail oriented, customer service skills, basic technical aptitude',
      salary: '$19-24/hour',
      location: 'Green Valley',
      employerId: allEmployers.find(e => e.email.includes('greenenergy'))?.id || allEmployers[3]?.id
    },

    // Manufacturing Jobs
    {
      title: 'Production Operator',
      company: 'Advanced Manufacturing',
      description: 'Operate production machinery in modern facility. Full training provided. Opportunities for overtime and advancement.',
      requirements: 'Mechanical aptitude, safety conscious, reliable attendance',
      salary: '$18-22/hour',
      location: 'Industrial Park',
      employerId: allEmployers.find(e => e.email.includes('manufacturing'))?.id || allEmployers[4]?.id
    },
    {
      title: 'Quality Control Inspector',
      company: 'Advanced Manufacturing',
      description: 'Inspect products for quality standards. Detail-oriented role with responsibility for maintaining high standards.',
      requirements: 'Attention to detail, basic math skills, quality mindset',
      salary: '$20-25/hour',
      location: 'Industrial Park',
      employerId: allEmployers.find(e => e.email.includes('manufacturing'))?.id || allEmployers[4]?.id
    },
    {
      title: 'Maintenance Technician',
      company: 'Advanced Manufacturing',
      description: 'Maintain and repair production equipment. Technical training provided for motivated individuals.',
      requirements: 'Mechanical skills, problem solving ability, safety focused',
      salary: '$24-30/hour',
      location: 'Industrial Park',
      employerId: allEmployers.find(e => e.email.includes('manufacturing'))?.id || allEmployers[4]?.id
    },

    // Additional Service Jobs
    {
      title: 'Security Guard',
      company: 'GoodCompany',
      description: 'Provide security services for commercial properties. Licensing assistance provided.',
      requirements: 'Clean background check, security license (or will obtain), reliable',
      salary: '$16-20/hour',
      location: 'Various Locations',
      employerId: allEmployers.find(e => e.email.includes('goodcompany'))?.id || allEmployers[0]?.id
    },
    {
      title: 'Landscaping Crew',
      company: 'GreenCorp Landscaping',
      description: 'Outdoor work maintaining commercial and residential properties. Seasonal work with overtime opportunities.',
      requirements: 'Physical fitness, outdoor work tolerance, team player',
      salary: '$16-20/hour',
      location: 'Multiple Cities',
      employerId: allEmployers[0]?.id // Use first available employer
    },
    {
      title: 'Janitorial Services',
      company: 'CleanPro Services',
      description: 'Commercial cleaning services. Flexible schedules available including evening and weekend shifts.',
      requirements: 'Reliable, detail oriented, able to work independently',
      salary: '$15-18/hour',
      location: 'Metro Area',
      employerId: allEmployers[1]?.id
    }
  ]

  console.log('💼 Creating additional job postings...')
  for (const job of jobCategories) {
    try {
      const createdJob = await prisma.job.create({ data: job })
      console.log(`✅ Created job: ${createdJob.title} at ${createdJob.company}`)
    } catch (error) {
      console.log(`⚠️  Job ${job.title} may already exist`)
    }
  }

  // Create comprehensive training programs
  const trainingPrograms = [
    {
      title: 'Basic Computer Skills',
      description: 'Learn essential computer skills including Microsoft Office, email, internet basics, and digital literacy for the modern workplace.',
      instructor: 'Tech Training Institute',
      duration: '4 weeks',
      schedule: 'Monday/Wednesday/Friday 6-8 PM',
      category: 'Technology',
      level: 'Beginner'
    },
    {
      title: 'Customer Service Excellence',
      description: 'Develop professional customer service skills, communication techniques, and conflict resolution strategies.',
      instructor: 'Professional Development Center',
      duration: '3 weeks',
      schedule: 'Tuesday/Thursday 7-9 PM',
      category: 'Professional Skills',
      level: 'Beginner'
    },
    {
      title: 'Construction Safety Certification',
      description: 'OSHA 10-hour construction safety certification. Required for most construction jobs. Includes hard hat and safety equipment.',
      instructor: 'Safety First Training',
      duration: '2 days',
      schedule: 'Saturday 8 AM - 5 PM',
      category: 'Construction',
      level: 'Certification'
    },
    {
      title: 'Food Service & Safety',
      description: 'Food handling certification, kitchen safety, and basic culinary skills. Includes ServSafe certification exam.',
      instructor: 'Culinary Skills Academy',
      duration: '1 week',
      schedule: 'Daily 9 AM - 3 PM',
      category: 'Food Service',
      level: 'Certification'
    },
    {
      title: 'Resume Writing & Interview Skills',
      description: 'Create professional resumes, practice interview techniques, and learn job search strategies.',
      instructor: 'Career Success Center',
      duration: '2 weeks',
      schedule: 'Monday 6-8 PM',
      category: 'Career Development',
      level: 'Essential'
    },
    {
      title: 'Financial Literacy',
      description: 'Personal finance, budgeting, banking basics, credit repair, and money management skills.',
      instructor: 'Financial Freedom Institute',
      duration: '6 weeks',
      schedule: 'Wednesday 7-9 PM',
      category: 'Life Skills',
      level: 'Essential'
    },
    {
      title: 'Automotive Repair Basics',
      description: 'Introduction to automotive repair, basic maintenance, and preparation for apprenticeship programs.',
      instructor: 'Metro Technical College',
      duration: '8 weeks',
      schedule: 'Tuesday/Thursday 6-9 PM',
      category: 'Technical Skills',
      level: 'Intermediate'
    },
    {
      title: 'Warehouse & Logistics',
      description: 'Forklift operation, inventory management, warehouse safety, and logistics basics.',
      instructor: 'Logistics Training Center',
      duration: '3 weeks',
      schedule: 'Monday/Wednesday/Friday 5-8 PM',
      category: 'Industrial',
      level: 'Beginner'
    },
    {
      title: 'Medical Office Administration',
      description: 'Medical terminology, electronic health records, medical billing basics, and healthcare communication.',
      instructor: 'Healthcare Training Institute',
      duration: '6 weeks',
      schedule: 'Tuesday/Thursday 6-9 PM',
      category: 'Healthcare',
      level: 'Intermediate'
    },
    {
      title: 'Entrepreneurship Basics',
      description: 'Business planning, licensing, marketing, and financial management for starting your own business.',
      instructor: 'Small Business Development Center',
      duration: '8 weeks',
      schedule: 'Saturday 10 AM - 2 PM',
      category: 'Business',
      level: 'Advanced'
    },
    {
      title: 'Digital Marketing',
      description: 'Social media marketing, basic web design, online advertising, and digital communication skills.',
      instructor: 'Digital Skills Academy',
      duration: '5 weeks',
      schedule: 'Monday/Wednesday 7-9 PM',
      category: 'Technology',
      level: 'Intermediate'
    },
    {
      title: 'Conflict Resolution & Communication',
      description: 'Advanced communication skills, conflict resolution, and workplace relationship management.',
      instructor: 'Professional Development Center',
      duration: '4 weeks',
      schedule: 'Thursday 6-8 PM',
      category: 'Professional Skills',
      level: 'Intermediate'
    }
  ]

  console.log('📚 Creating training programs...')
  for (const training of trainingPrograms) {
    try {
      const createdTraining = await prisma.training.create({ data: training })
      console.log(`✅ Created training: ${createdTraining.title}`)
    } catch (error) {
      console.log(`⚠️  Training ${training.title} may already exist`)
    }
  }

  console.log('🎉 Platform expansion completed!')
  
  // Summary
  const finalStats = {
    users: await prisma.user.count(),
    jobs: await prisma.job.count(),
    mentors: await prisma.mentor.count({ where: { status: 'APPROVED' } }),
    trainings: await prisma.training.count()
  }

  console.log('\n📊 Platform Content Summary:')
  console.log(`👥 Total Users: ${finalStats.users}`)
  console.log(`💼 Total Jobs: ${finalStats.jobs}`)
  console.log(`🌟 Approved Mentors: ${finalStats.mentors}`)
  console.log(`📚 Training Programs: ${finalStats.trainings}`)
}

expandPlatformContent()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })