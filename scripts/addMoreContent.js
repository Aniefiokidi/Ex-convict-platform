const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function addMoreContent() {
  console.log('🚀 Adding more rich content to the platform...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // Get existing employers to assign to new jobs
  const employers = await prisma.user.findMany({
    where: { role: 'EMPLOYER' }
  })

  console.log(`Found ${employers.length} employers to assign jobs to`)

  // Add many more jobs across different categories
  const additionalJobs = [
    // Entry-level tech jobs
    {
      title: 'Computer Repair Technician',
      company: 'TechFix Solutions',
      description: 'Learn to diagnose and repair computers, laptops, and mobile devices. Training provided for hardware and software troubleshooting.',
      requirements: 'Basic technical curiosity, problem-solving skills, willingness to learn',
      salary: '$17-21/hour',
      location: 'Tech District',
      employerId: employers[0]?.id
    },
    {
      title: 'Help Desk Support',
      company: 'Digital Support Corp',
      description: 'Provide technical support via phone and chat. Remote work available after training period. Growth opportunities.',
      requirements: 'Good communication skills, patience, basic computer knowledge',
      salary: '$16-20/hour + bonuses',
      location: 'Remote/Office Hybrid',
      employerId: employers[1]?.id
    },

    // Healthcare support roles
    {
      title: 'Hospital Orderly',
      company: 'Metro Medical Center',
      description: 'Transport patients, deliver supplies, maintain clean environment. Essential healthcare team member.',
      requirements: 'Physical ability, compassionate nature, team player',
      salary: '$15-18/hour + benefits',
      location: 'Downtown Medical',
      employerId: employers[2]?.id
    },
    {
      title: 'Medical Equipment Cleaner',
      company: 'HealthCare Services',
      description: 'Sanitize and maintain medical equipment. Critical role in patient safety. Training provided.',
      requirements: 'Attention to detail, reliability, safety consciousness',
      salary: '$16-19/hour',
      location: 'Medical District',
      employerId: employers[3]?.id
    },

    // Skilled trades
    {
      title: 'Plumbing Assistant',
      company: 'Master Plumbing Co.',
      description: 'Learn plumbing trade through hands-on apprenticeship. Excellent career growth potential.',
      requirements: 'Physical fitness, mechanical aptitude, reliable transportation',
      salary: '$18-24/hour (increases with skills)',
      location: 'Service Area Wide',
      employerId: employers[4]?.id
    },
    {
      title: 'Painting Contractor',
      company: 'Professional Painters',
      description: 'Interior and exterior painting for residential and commercial properties. Learn professional techniques.',
      requirements: 'Eye for detail, physical ability, willingness to work heights',
      salary: '$17-22/hour + project bonuses',
      location: 'Metro Region',
      employerId: employers[0]?.id
    },

    // Food service expansion
    {
      title: 'Bakery Assistant',
      company: 'Fresh Start Bakery',
      description: 'Early morning baking, customer service, learning pastry arts. Second chance employer.',
      requirements: 'Early riser, customer service attitude, food safety awareness',
      salary: '$15-18/hour + tips',
      location: 'Bakery District',
      employerId: employers[1]?.id
    },
    {
      title: 'Catering Helper',
      company: 'Events & More Catering',
      description: 'Event setup, food service, cleanup. Weekend and evening work available. Tips included.',
      requirements: 'Flexible schedule, professional appearance, team worker',
      salary: '$14-17/hour + tips',
      location: 'Various Event Venues',
      employerId: employers[2]?.id
    },

    // Transportation & logistics
    {
      title: 'Package Handler',
      company: 'QuickShip Logistics',
      description: 'Sort and load packages for delivery. Physical work with overtime opportunities. Benefits available.',
      requirements: 'Physical strength, reliable attendance, ability to lift 50lbs',
      salary: '$16-20/hour + overtime',
      location: 'Distribution Center',
      employerId: employers[3]?.id
    },
    {
      title: 'Moving Company Helper',
      company: 'Reliable Movers',
      description: 'Help families and businesses relocate. Physical work with customer interaction. Tips common.',
      requirements: 'Physical fitness, customer service attitude, reliable',
      salary: '$15-19/hour + tips',
      location: 'Metro Service Area',
      employerId: employers[4]?.id
    },

    // Retail variety
    {
      title: 'Pet Store Associate',
      company: 'Happy Pets Store',
      description: 'Care for animals, help customers, maintain store. Great for animal lovers. Pet care training provided.',
      requirements: 'Love of animals, customer service skills, reliability',
      salary: '$14-17/hour + employee discounts',
      location: 'Pet Plaza',
      employerId: employers[0]?.id
    },
    {
      title: 'Auto Parts Specialist',
      company: 'Auto Zone Plus',
      description: 'Help customers find car parts, learn automotive systems, inventory management.',
      requirements: 'Interest in cars, customer service, willingness to learn',
      salary: '$16-20/hour + commission',
      location: 'Auto District',
      employerId: employers[1]?.id
    },

    // Manufacturing variety
    {
      title: 'Packaging Line Worker',
      company: 'PackPro Manufacturing',
      description: 'Package products on assembly line. Clean facility, regular hours, advancement opportunities.',
      requirements: 'Attention to detail, ability to stand long periods, teamwork',
      salary: '$17-21/hour + shift differential',
      location: 'Manufacturing Zone',
      employerId: employers[2]?.id
    },
    {
      title: 'Machine Operator Trainee',
      company: 'Precision Parts Inc.',
      description: 'Learn to operate computerized machinery. High-tech manufacturing with growth potential.',
      requirements: 'Technical aptitude, attention to detail, willingness to learn',
      salary: '$19-25/hour (after training)',
      location: 'Industrial Campus',
      employerId: employers[3]?.id
    },

    // Service industry
    {
      title: 'Car Wash Attendant',
      company: 'Sparkle Clean Car Wash',
      description: 'Vehicle cleaning and customer service. Outdoor work with flexible scheduling.',
      requirements: 'Physical ability, customer service attitude, weather tolerance',
      salary: '$14-17/hour + tips',
      location: 'Multiple Locations',
      employerId: employers[4]?.id
    },
    {
      title: 'Laundromat Attendant',
      company: 'Clean & Fresh Laundry',
      description: 'Assist customers, maintain equipment, handle payments. Good entry-level opportunity.',
      requirements: 'Customer service skills, basic maintenance ability, reliability',
      salary: '$13-16/hour',
      location: 'Neighborhood Centers',
      employerId: employers[0]?.id
    },

    // Office and administrative
    {
      title: 'File Clerk',
      company: 'Document Solutions',
      description: 'Organize files, scan documents, basic office tasks. Quiet, organized work environment.',
      requirements: 'Organizational skills, basic computer use, attention to detail',
      salary: '$15-18/hour',
      location: 'Office Complex',
      employerId: employers[1]?.id
    },
    {
      title: 'Receptionist',
      company: 'Professional Services Group',
      description: 'Front desk operations, phone answering, basic administrative support.',
      requirements: 'Professional demeanor, phone skills, basic computer knowledge',
      salary: '$16-19/hour',
      location: 'Business District',
      employerId: employers[2]?.id
    },

    // Specialized opportunities
    {
      title: 'Greenhouse Worker',
      company: 'Green Thumb Gardens',
      description: 'Plant care, greenhouse maintenance, customer education. Perfect for those who love plants.',
      requirements: 'Interest in plants, physical ability, learning attitude',
      salary: '$15-18/hour + plant discounts',
      location: 'Garden Center',
      employerId: employers[3]?.id
    },
    {
      title: 'Fitness Equipment Cleaner',
      company: 'Healthy Life Gym',
      description: 'Sanitize gym equipment, basic maintenance, member assistance. Access to gym facilities.',
      requirements: 'Physical fitness, hygiene consciousness, friendly attitude',
      salary: '$14-17/hour + gym membership',
      location: 'Fitness Centers',
      employerId: employers[4]?.id
    }
  ]

  console.log('💼 Creating additional diverse job opportunities...')
  for (const job of additionalJobs) {
    try {
      const createdJob = await prisma.job.create({ data: job })
      console.log(`✅ Created job: ${createdJob.title}`)
    } catch (error) {
      console.log(`⚠️  Job ${job.title} may already exist`)
    }
  }

  // Add specialized training programs
  const moreTraining = [
    {
      title: 'Conflict Resolution & De-escalation',
      description: 'Learn to handle difficult situations professionally, manage conflict, and de-escalate tense encounters.',
      instructor: 'Professional Development Academy',
      duration: '2 weeks',
      schedule: 'Tuesday 6-8 PM',
      category: 'Professional Skills',
      level: 'Intermediate'
    },
    {
      title: 'Budgeting & Debt Management',
      description: 'Practical money management, paying off debt, saving strategies, and building credit.',
      instructor: 'Financial Recovery Center',
      duration: '4 weeks',
      schedule: 'Thursday 7-9 PM',
      category: 'Financial Literacy',
      level: 'Essential'
    },
    {
      title: 'Professional Communication',
      description: 'Email etiquette, professional writing, presentation skills, and workplace communication.',
      instructor: 'Communication Excellence Institute',
      duration: '3 weeks',
      schedule: 'Wednesday 6-8 PM',
      category: 'Communication',
      level: 'Intermediate'
    },
    {
      title: 'Time Management & Organization',
      description: 'Personal productivity, prioritization, goal setting, and organizational systems.',
      instructor: 'Success Skills Academy',
      duration: '2 weeks',
      schedule: 'Monday 7-9 PM',
      category: 'Life Skills',
      level: 'Beginner'
    },
    {
      title: 'Job Search Strategies',
      description: 'Online job searching, networking, application tracking, and follow-up techniques.',
      instructor: 'Career Navigation Center',
      duration: '3 weeks',
      schedule: 'Friday 6-8 PM',
      category: 'Career Development',
      level: 'Essential'
    },
    {
      title: 'Basic Home Repair',
      description: 'Practical home maintenance skills, basic repairs, tool usage, and safety.',
      instructor: 'Home Skills Workshop',
      duration: '4 weeks',
      schedule: 'Saturday 10 AM-12 PM',
      category: 'Practical Skills',
      level: 'Beginner'
    },
    {
      title: 'Digital Literacy',
      description: 'Smartphone usage, social media basics, online safety, and digital communication.',
      instructor: 'Digital Learning Center',
      duration: '3 weeks',
      schedule: 'Tuesday 10 AM-12 PM',
      category: 'Technology',
      level: 'Beginner'
    },
    {
      title: 'Stress Management & Wellness',
      description: 'Coping strategies, stress reduction techniques, mental health awareness, and self-care.',
      instructor: 'Wellness & Recovery Institute',
      duration: '4 weeks',
      schedule: 'Thursday 6-8 PM',
      category: 'Mental Health',
      level: 'Essential'
    }
  ]

  console.log('📚 Adding specialized training programs...')
  for (const training of moreTraining) {
    try {
      const createdTraining = await prisma.training.create({ data: training })
      console.log(`✅ Created training: ${createdTraining.title}`)
    } catch (error) {
      console.log(`⚠️  Training ${training.title} may already exist`)
    }
  }

  // Get final statistics
  const finalStats = {
    users: await prisma.user.count(),
    jobs: await prisma.job.count(),
    mentors: await prisma.mentor.count({ where: { status: 'APPROVED' } }),
    trainings: await prisma.training.count(),
    applications: await prisma.jobApplication.count()
  }

  console.log('\n🎉 Platform content expansion completed!')
  console.log('📊 Final Platform Statistics:')
  console.log(`👥 Total Users: ${finalStats.users}`)
  console.log(`💼 Available Jobs: ${finalStats.jobs}`)
  console.log(`🌟 Approved Mentors: ${finalStats.mentors}`)
  console.log(`📚 Training Programs: ${finalStats.trainings}`)
  console.log(`📋 Job Applications: ${finalStats.applications}`)
  console.log('\n🚀 Platform is now comprehensive with rich content across all areas!')
}

addMoreContent()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })