const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearAndCreateFreshContent() {
  console.log('🧹 Clearing existing duplicate content...')
  
  // Keep only jobs with unique titles
  const allJobs = await prisma.job.findMany()
  console.log(`Found ${allJobs.length} existing jobs`)
  
  // Delete existing jobs to make room for organized content
  await prisma.job.deleteMany()
  console.log('Cleared existing jobs')
  
  // Delete existing training programs
  await prisma.training.deleteMany()
  console.log('Cleared existing training programs')

  // Now create fresh, organized content
  console.log('🚀 Creating fresh, organized content...')

  // Get all employers
  const employers = await prisma.user.findMany({
    where: { role: 'EMPLOYER' }
  })

  if (employers.length === 0) {
    console.log('No employers found!')
    return
  }

  // Create diverse job postings across all industries
  const freshJobs = [
    // Technology Jobs
    {
      title: 'IT Support Specialist',
      company: 'TechStart Solutions',
      description: 'Entry-level IT support role helping users with computer issues. We provide comprehensive training and certification opportunities. Great starting point for tech career.',
      requirements: 'High school diploma, basic computer skills, problem-solving mindset',
      salary: '$18-22/hour',
      location: 'Tech City'
    },
    {
      title: 'Data Entry Specialist',
      company: 'TechStart Solutions', 
      description: 'Accurate data input and database management. Remote work options available. Perfect for detail-oriented individuals.',
      requirements: 'Typing 40+ WPM, attention to detail, basic Excel knowledge',
      salary: '$15-18/hour',
      location: 'Tech City (Remote Available)'
    },
    {
      title: 'Junior Web Developer',
      company: 'TechStart Solutions',
      description: 'Learn web development while working on real projects. Mentorship and training provided for motivated beginners.',
      requirements: 'Basic HTML/CSS knowledge, willingness to learn, logical thinking',
      salary: '$20-25/hour',
      location: 'Tech City'
    },

    // Construction & Trades
    {
      title: 'Construction Laborer',
      company: 'ConstructionCorp',
      description: 'Ground-level construction work with advancement opportunities. Safety training provided. Build valuable trade skills.',
      requirements: 'Physical fitness, safety consciousness, reliable transportation',
      salary: '$18-23/hour',
      location: 'Builder Town'
    },
    {
      title: 'Apprentice Electrician',
      company: 'ConstructionCorp',
      description: 'Learn electrical trade through hands-on apprenticeship program. Excellent long-term career prospects.',
      requirements: 'Basic math skills, willingness to learn, physical ability',
      salary: '$16-20/hour (increases with training)',
      location: 'Builder Town'
    },
    {
      title: 'HVAC Technician Trainee',
      company: 'ConstructionCorp',
      description: 'Entry-level HVAC position with full training program. High-demand field with job security.',
      requirements: 'Mechanical aptitude, problem-solving skills, reliable attendance',
      salary: '$19-24/hour',
      location: 'Builder Town'
    },

    // Healthcare
    {
      title: 'Medical Office Assistant',
      company: 'HealthCorp Medical',
      description: 'Support medical staff with administrative duties. Training provided for medical software and terminology.',
      requirements: 'High school diploma, good communication, confidentiality awareness',
      salary: '$17-21/hour',
      location: 'Healthcare City'
    },
    {
      title: 'Patient Care Technician',
      company: 'HealthCorp Medical',
      description: 'Direct patient care support role. Certification assistance provided. Make a difference in patient lives.',
      requirements: 'Compassionate nature, physical ability, team-oriented mindset',
      salary: '$16-20/hour',
      location: 'Healthcare City'
    },
    {
      title: 'Environmental Services Specialist',
      company: 'HealthCorp Medical',
      description: 'Maintain sterile hospital environment. Essential role in patient safety with advancement opportunities.',
      requirements: 'Attention to detail, physical stamina, safety consciousness',
      salary: '$15-19/hour',
      location: 'Healthcare City'
    },

    // Retail & Customer Service
    {
      title: 'Sales Associate',
      company: 'RetailPlus Stores',
      description: 'Customer-focused retail position with commission opportunities. We believe in second chances and career growth.',
      requirements: 'Customer service attitude, communication skills, flexible schedule',
      salary: '$14-17/hour + commission',
      location: 'Retail Town'
    },
    {
      title: 'Inventory Coordinator',
      company: 'RetailPlus Stores',
      description: 'Manage stock levels, organize warehouse, coordinate deliveries. Leadership development opportunities.',
      requirements: 'Organizational skills, basic computer use, teamwork ability',
      salary: '$16-19/hour',
      location: 'Retail Town'
    },
    {
      title: 'Assistant Store Manager',
      company: 'RetailPlus Stores',
      description: 'Supervisory role with management training. We promote from within based on performance and attitude.',
      requirements: 'Leadership potential, retail experience preferred, customer focus',
      salary: '$20-25/hour',
      location: 'Retail Town'
    },

    // Manufacturing
    {
      title: 'Production Operator',
      company: 'Advanced Manufacturing',
      description: 'Operate modern production equipment in clean facility. Overtime opportunities and safety bonuses available.',
      requirements: 'Mechanical aptitude, safety focus, reliable attendance',
      salary: '$18-23/hour',
      location: 'Industrial Park'
    },
    {
      title: 'Quality Assurance Inspector',
      company: 'Advanced Manufacturing',
      description: 'Ensure product quality standards. Detail-oriented role with responsibility and respect.',
      requirements: 'Attention to detail, basic math, quality mindset',
      salary: '$20-26/hour',
      location: 'Industrial Park'
    },
    {
      title: 'Maintenance Mechanic',
      company: 'Advanced Manufacturing',
      description: 'Troubleshoot and repair production equipment. Technical training and certification opportunities.',
      requirements: 'Mechanical skills, problem-solving ability, electrical basics helpful',
      salary: '$24-32/hour',
      location: 'Industrial Park'
    },

    // Green Energy
    {
      title: 'Solar Panel Installer',
      company: 'Green Energy Solutions',
      description: 'Install residential and commercial solar systems. Growing renewable energy field with job security.',
      requirements: 'Physical fitness, comfort with heights, willingness to learn',
      salary: '$22-28/hour',
      location: 'Green Valley'
    },
    {
      title: 'Energy Efficiency Technician',
      company: 'Green Energy Solutions',
      description: 'Conduct home energy audits and efficiency improvements. Travel to customer sites.',
      requirements: 'Technical aptitude, customer service skills, reliable transportation',
      salary: '$19-25/hour',
      location: 'Green Valley'
    },

    // Food Service
    {
      title: 'Kitchen Prep Cook',
      company: 'Hospitality Group',
      description: 'Food preparation in professional kitchen. Learn culinary skills with advancement to line cook.',
      requirements: 'Food safety awareness, teamwork, fast-paced environment comfort',
      salary: '$15-18/hour',
      location: 'Hospitality City'
    },
    {
      title: 'Restaurant Server',
      company: 'Hospitality Group',
      description: 'Customer service role with tip income potential. Flexible scheduling and meal benefits.',
      requirements: 'Customer service attitude, multitasking ability, professional appearance',
      salary: '$12/hour + tips (typically $18-25/hour total)',
      location: 'Hospitality City'
    },

    // Logistics & Transportation
    {
      title: 'Warehouse Associate',
      company: 'GoodCompany Logistics',
      description: 'Order fulfillment and warehouse operations. Forklift training provided. Overtime available.',
      requirements: 'Physical ability, attention to detail, teamwork skills',
      salary: '$16-20/hour',
      location: 'Corporate City'
    },
    {
      title: 'Delivery Driver',
      company: 'GoodCompany Logistics',
      description: 'Local delivery routes in company vehicle. Good driving record required. Customer interaction.',
      requirements: 'Valid driver license, clean driving record, punctuality',
      salary: '$17-21/hour plus mileage',
      location: 'Corporate City'
    },
    {
      title: 'Logistics Coordinator',
      company: 'GoodCompany Logistics',
      description: 'Coordinate shipments and track deliveries. Office environment with growth potential.',
      requirements: 'Organizational skills, basic computer use, communication ability',
      salary: '$18-23/hour',
      location: 'Corporate City'
    },

    // Security & General Services
    {
      title: 'Security Officer',
      company: 'Professional Security Services',
      description: 'Provide security for commercial and residential properties. Licensing assistance and training provided.',
      requirements: 'Security license (or ability to obtain), reliability, professional demeanor',
      salary: '$16-21/hour',
      location: 'Multiple Locations'
    },
    {
      title: 'Custodial Supervisor',
      company: 'CleanPro Services',
      description: 'Lead cleaning teams at commercial facilities. Management experience with flexible scheduling.',
      requirements: 'Leadership skills, cleaning experience, reliable transportation',
      salary: '$18-22/hour',
      location: 'Metro Area'
    },
    {
      title: 'Landscaping Crew Leader',
      company: 'GreenScapes Landscaping',
      description: 'Lead landscaping teams maintaining commercial properties. Seasonal work with leadership growth.',
      requirements: 'Landscaping experience, team leadership, physical fitness',
      salary: '$19-24/hour',
      location: 'Various Cities'
    }
  ]

  // Assign employers to jobs
  for (let i = 0; i < freshJobs.length; i++) {
    freshJobs[i].employerId = employers[i % employers.length].id
  }

  // Create all jobs
  console.log('💼 Creating diverse job postings...')
  for (const job of freshJobs) {
    try {
      const createdJob = await prisma.job.create({ data: job })
      console.log(`✅ Created job: ${createdJob.title} at ${createdJob.company}`)
    } catch (error) {
      console.log(`❌ Failed to create ${job.title}: ${error.message}`)
    }
  }

  // Create comprehensive training programs
  const trainingPrograms = [
    {
      title: 'Computer Basics & Microsoft Office',
      description: 'Essential computer skills including Windows, Word, Excel, PowerPoint, email, and internet navigation. Perfect for beginners.',
      instructor: 'Tech Learning Center',
      duration: '4 weeks',
      schedule: 'Mon/Wed/Fri 6-8 PM',
      category: 'Technology',
      level: 'Beginner'
    },
    {
      title: 'Customer Service Excellence',
      description: 'Professional communication, conflict resolution, phone etiquette, and customer satisfaction strategies.',
      instructor: 'Professional Skills Institute',
      duration: '3 weeks', 
      schedule: 'Tue/Thu 7-9 PM',
      category: 'Professional Skills',
      level: 'Beginner'
    },
    {
      title: 'OSHA 10-Hour Safety Certification',
      description: 'Required safety certification for construction work. Covers workplace hazards, safety regulations, and protective equipment.',
      instructor: 'Safety Training Academy',
      duration: '2 days',
      schedule: 'Saturday 8 AM-6 PM',
      category: 'Safety & Compliance',
      level: 'Certification'
    },
    {
      title: 'Food Handler Certification',
      description: 'Food safety, proper handling, storage, and sanitation. Includes ServSafe certification exam.',
      instructor: 'Culinary Safety Institute',
      duration: '1 week',
      schedule: 'Daily 9 AM-12 PM',
      category: 'Food Service',
      level: 'Certification'
    },
    {
      title: 'Resume Writing & Interview Mastery',
      description: 'Create compelling resumes, practice interview techniques, salary negotiation, and job search strategies.',
      instructor: 'Career Success Center',
      duration: '3 weeks',
      schedule: 'Monday 6-8 PM',
      category: 'Career Development',
      level: 'Essential'
    },
    {
      title: 'Financial Literacy & Money Management',
      description: 'Personal budgeting, banking basics, credit repair, debt management, and financial planning.',
      instructor: 'Financial Empowerment Center',
      duration: '6 weeks',
      schedule: 'Wednesday 7-9 PM',
      category: 'Life Skills',
      level: 'Essential'
    },
    {
      title: 'Basic Automotive Maintenance',
      description: 'Car maintenance, basic repairs, diagnostic skills, and preparation for automotive careers.',
      instructor: 'Metro Technical College',
      duration: '8 weeks',
      schedule: 'Tue/Thu 6-9 PM',
      category: 'Technical Skills',
      level: 'Beginner'
    },
    {
      title: 'Warehouse Operations & Forklift',
      description: 'Warehouse safety, inventory management, forklift operation, and logistics basics.',
      instructor: 'Industrial Training Center',
      duration: '3 weeks',
      schedule: 'Mon/Wed/Fri 5-8 PM',
      category: 'Industrial Operations',
      level: 'Beginner'
    },
    {
      title: 'Medical Terminology & Office Skills',
      description: 'Healthcare terminology, medical records, patient interaction, and healthcare office procedures.',
      instructor: 'Healthcare Career Institute',
      duration: '6 weeks',
      schedule: 'Tue/Thu 6-9 PM',
      category: 'Healthcare',
      level: 'Intermediate'
    },
    {
      title: 'Small Business Entrepreneurship',
      description: 'Business planning, licensing, marketing, financial management, and startup strategies.',
      instructor: 'Small Business Development Center',
      duration: '10 weeks',
      schedule: 'Saturday 10 AM-2 PM',
      category: 'Business Development',
      level: 'Advanced'
    },
    {
      title: 'Digital Marketing & Social Media',
      description: 'Online marketing, social media management, basic web design, and digital communication.',
      instructor: 'Digital Skills Academy',
      duration: '5 weeks',
      schedule: 'Mon/Wed 7-9 PM',
      category: 'Digital Marketing',
      level: 'Intermediate'
    },
    {
      title: 'Leadership & Team Management',
      description: 'Leadership skills, team building, conflict resolution, and management fundamentals.',
      instructor: 'Leadership Development Institute',
      duration: '4 weeks',
      schedule: 'Thursday 6-8 PM',
      category: 'Leadership',
      level: 'Intermediate'
    },
    {
      title: 'Welding Fundamentals',
      description: 'Basic welding techniques, safety procedures, and preparation for welding certification programs.',
      instructor: 'Trade Skills Academy',
      duration: '6 weeks',
      schedule: 'Mon/Wed/Fri 5-8 PM',
      category: 'Skilled Trades',
      level: 'Beginner'
    },
    {
      title: 'Certified Nursing Assistant (CNA) Prep',
      description: 'Preparation for CNA certification including patient care, medical procedures, and clinical skills.',
      instructor: 'Healthcare Training Institute',
      duration: '8 weeks',
      schedule: 'Tue/Thu 6-10 PM + Clinical',
      category: 'Healthcare Certification',
      level: 'Certification'
    },
    {
      title: 'Commercial Driving License (CDL) Prep',
      description: 'Preparation for CDL exam including driving skills, safety regulations, and job placement assistance.',
      instructor: 'Professional Driving Academy',
      duration: '4 weeks',
      schedule: 'Mon-Fri 8 AM-4 PM',
      category: 'Transportation',
      level: 'Certification'
    },
    {
      title: 'Construction Trades Survey',
      description: 'Explore carpentry, plumbing, electrical work, and other construction trades to find your best fit.',
      instructor: 'Building Trades Institute',
      duration: '2 weeks',
      schedule: 'Saturday 9 AM-3 PM',
      category: 'Construction Exploration',
      level: 'Beginner'
    },
    {
      title: 'Retail Management Training',
      description: 'Inventory management, staff supervision, customer service management, and retail operations.',
      instructor: 'Retail Excellence Academy',
      duration: '5 weeks',
      schedule: 'Tuesday 6-9 PM',
      category: 'Retail Management',
      level: 'Intermediate'
    },
    {
      title: 'Basic Electrical Skills',
      description: 'Electrical safety, basic wiring, troubleshooting, and preparation for electrical apprenticeships.',
      instructor: 'Electrical Training Center',
      duration: '6 weeks',
      schedule: 'Tue/Thu 6-9 PM',
      category: 'Electrical Trades',
      level: 'Beginner'
    }
  ]

  console.log('📚 Creating comprehensive training programs...')
  for (const training of trainingPrograms) {
    try {
      const createdTraining = await prisma.training.create({ data: training })
      console.log(`✅ Created training: ${createdTraining.title}`)
    } catch (error) {
      console.log(`❌ Failed to create ${training.title}: ${error.message}`)
    }
  }

  // Final summary
  const stats = {
    users: await prisma.user.count(),
    jobs: await prisma.job.count(), 
    mentors: await prisma.mentor.count({ where: { status: 'APPROVED' } }),
    trainings: await prisma.training.count()
  }

  console.log('\n🎉 Platform fully populated!')
  console.log('📊 Final Content Summary:')
  console.log(`👥 Total Users: ${stats.users}`)
  console.log(`💼 Active Jobs: ${stats.jobs}`)
  console.log(`🌟 Approved Mentors: ${stats.mentors}`)
  console.log(`📚 Training Programs: ${stats.trainings}`)
  console.log('\n🚀 Platform is now rich with content and ready for comprehensive testing!')
}

clearAndCreateFreshContent()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })