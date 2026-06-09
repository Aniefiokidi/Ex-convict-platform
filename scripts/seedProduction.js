const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Running production seed...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  // ── Employers (upsert — safe to re-run) ─────────────────────────────────────
  console.log('👔 Seeding employer accounts...')
  const employer1 = await prisma.user.upsert({
    where: { email: 'jennifer.chen@goodcompany.com' },
    update: {},
    create: {
      name: 'Jennifer Chen',
      email: 'jennifer.chen@goodcompany.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 456-7890',
      address: '100 Business Plaza, Corporate City',
    },
  })

  const employer2 = await prisma.user.upsert({
    where: { email: 'mike.thompson@buildtech.com' },
    update: {},
    create: {
      name: 'Michael Thompson',
      email: 'mike.thompson@buildtech.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 567-8901',
      address: '200 Innovation Drive, Tech District',
    },
  })

  const employer3 = await prisma.user.upsert({
    where: { email: 'lisa.anderson@horizonpeople.com' },
    update: {},
    create: {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@horizonpeople.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      phone: '(555) 678-9012',
      address: '300 Commerce Street, Business Park',
    },
  })

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@platform.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@platform.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '(555) 000-0001',
      address: 'Platform Headquarters',
    },
  })
  console.log('✅ Employer accounts ready.')

  // ── Jobs (only seed if table is empty) ──────────────────────────────────────
  const jobCount = await prisma.job.count()
  if (jobCount === 0) {
    console.log('💼 Seeding job listings...')
    await prisma.job.createMany({
      data: [
        {
          title: 'Administrative Officer',
          company: 'GoodCompany Group',
          description:
            'We are seeking a professional Administrative Officer to support our executive team and ensure smooth day-to-day office operations. Responsibilities include managing correspondence, scheduling meetings, maintaining filing systems, and coordinating cross-departmental activities. GoodCompany Group is a proud second-chance employer committed to workforce inclusion.',
          requirements:
            'Minimum OND/HND or equivalent; proficiency in Microsoft Office Suite; strong organisational and communication skills; ability to multitask and manage competing priorities. Prior administrative experience is an advantage.',
          salary: '$2,200–$2,800/month',
          location: 'Corporate City',
          employerId: employer1.id,
        },
        {
          title: 'Marketing Coordinator',
          company: 'GoodCompany Group',
          description:
            'GoodCompany Group is seeking a Marketing Coordinator to support the development and execution of marketing campaigns across digital and traditional channels. Responsibilities include coordinating content creation, managing social media calendars, tracking campaign performance, and liaising with external vendors. Full training is provided for candidates with the right attitude and aptitude.',
          requirements:
            'HND/BSc in Marketing, Communications, or related discipline; solid written and verbal communication skills; experience with social media platforms and basic design tools (Canva, Adobe); analytical mindset with attention to detail.',
          salary: '$2,300–$2,900/month',
          location: 'Corporate City',
          employerId: employer1.id,
        },
        {
          title: 'IT Support Technician',
          company: 'BuildTech Solutions',
          description:
            'BuildTech Solutions is hiring an IT Support Technician to provide first- and second-line technical support to staff across our offices. You will troubleshoot hardware and software issues, manage user accounts, maintain IT asset records, and support network infrastructure. We welcome applicants from all backgrounds and provide structured on-boarding and professional development.',
          requirements:
            'CompTIA A+ or equivalent certification (or demonstrated equivalent experience); knowledge of Windows 10/11 environments; strong diagnostic and problem-solving skills; excellent customer-service orientation.',
          salary: '$2,500–$3,200/month',
          location: 'Tech District',
          employerId: employer2.id,
        },
        {
          title: 'Financial Analyst (Entry-Level)',
          company: 'BuildTech Solutions',
          description:
            'This entry-level Financial Analyst role offers an outstanding opportunity to build a career in finance within a growing technology services company. You will assist with budget preparation, variance analysis, financial reporting, and forecasting. BuildTech Solutions mentors junior finance professionals and provides a clear progression path toward senior analyst and management roles.',
          requirements:
            'BSc/HND in Accounting, Finance, or Economics; understanding of financial statements and basic accounting principles; proficiency in Microsoft Excel; strong numerical reasoning and attention to detail. ICAN or ACCA student membership is a plus.',
          salary: '$2,800–$3,500/month',
          location: 'Tech District',
          employerId: employer2.id,
        },
        {
          title: 'Human Resources Assistant',
          company: 'Horizon People Services',
          description:
            'Horizon People Services is looking for a detail-oriented Human Resources Assistant to support our HR department. Key duties include maintaining employee records, coordinating recruitment logistics, onboarding new hires, and assisting with payroll processing. We believe every individual deserves a fair opportunity and actively practice inclusive hiring.',
          requirements:
            'Diploma or degree in Human Resources Management, Business Administration, or related field; familiarity with HRIS software; strong interpersonal and confidentiality skills; ability to work effectively in a team environment.',
          salary: '$2,000–$2,500/month',
          location: 'Business Park',
          employerId: employer3.id,
        },
        {
          title: 'Operations Coordinator',
          company: 'Horizon People Services',
          description:
            'Horizon People Services is recruiting an Operations Coordinator to streamline and improve internal business processes. You will monitor daily operational workflows, liaise between departments, prepare management reports, and identify opportunities for efficiency gains. The role carries genuine career progression potential within our rapidly expanding organisation.',
          requirements:
            'Degree or HND in Business Administration, Management, or a related field; strong analytical and project-management skills; proficiency with productivity tools (Microsoft 365 or Google Workspace); excellent communication and stakeholder-management abilities.',
          salary: '$2,400–$3,000/month',
          location: 'Business Park',
          employerId: employer3.id,
        },
        {
          title: 'Business Development Executive',
          company: 'GoodCompany Group',
          description:
            'Join our growing commercial team as a Business Development Executive. You will identify new business opportunities, build relationships with prospective clients, prepare proposals, and work closely with our marketing and delivery teams to close deals. Uncapped commission structure and career advancement on offer.',
          requirements:
            'BSc in Business, Sales, or Marketing; proven ability to build professional relationships; strong negotiation and presentation skills; CRM software experience preferred.',
          salary: '$2,500–$3,000/month + commission',
          location: 'Corporate City',
          employerId: employer1.id,
        },
        {
          title: 'Data Analyst',
          company: 'BuildTech Solutions',
          description:
            'BuildTech Solutions is looking for a Data Analyst to transform raw data into actionable business insights. You will design dashboards, run SQL queries, conduct statistical analyses, and present findings to senior management. This role is ideal for someone who is passionate about data and wants to grow into a senior analytics or data science position.',
          requirements:
            'Proficiency in SQL and Excel; experience with visualisation tools (Power BI or Tableau); degree in Statistics, Computer Science, or related field; strong attention to detail and ability to communicate findings clearly.',
          salary: '$2,800–$3,600/month',
          location: 'Tech District',
          employerId: employer2.id,
        },
        {
          title: 'Office Administrator',
          company: 'Horizon People Services',
          description:
            'We are seeking a reliable and proactive Office Administrator to keep our Business Park office running efficiently. Tasks include front-desk management, supplier liaison, procurement of office supplies, management of meeting-room bookings, and general administrative support to all departments.',
          requirements:
            'Minimum 1 year of office administration experience; strong organisational skills; proficiency in Microsoft Office; professional telephone and written communication manner; discretion with confidential information.',
          salary: '$1,800–$2,200/month',
          location: 'Business Park',
          employerId: employer3.id,
        },
      ],
    })
    console.log('✅ Job listings created.')
  } else {
    console.log(`⏭️  Jobs already seeded (${jobCount} found), skipping.`)
  }

  // ── Training programmes (only seed if table is empty) ───────────────────────
  const trainingCount = await prisma.training.count()
  if (trainingCount === 0) {
    console.log('📚 Seeding training programmes...')
    await prisma.training.createMany({
      data: [
        {
          title: 'Microsoft Office Suite Mastery',
          description:
            'A hands-on programme covering Word, Excel, PowerPoint, and Outlook to the professional standard required by most office employers. Participants will complete practical assignments modelled on real workplace scenarios.',
          instructor: 'TechSkills Academy',
          duration: '6 weeks',
          schedule: 'Mon / Wed / Fri — 9:00 AM–11:00 AM',
          category: 'Technology',
          level: 'Beginner',
          provider: 'TechSkills Academy',
        },
        {
          title: 'Professional Business Communication',
          description:
            'Develop the written and verbal communication skills that employers look for. Topics include business email etiquette, report writing, presentation delivery, active listening, and professional conduct in meetings.',
          instructor: 'CommPro Institute',
          duration: '4 weeks',
          schedule: 'Tue / Thu — 10:00 AM–12:00 PM',
          category: 'Business Skills',
          level: 'Beginner',
          provider: 'CommPro Institute',
        },
        {
          title: 'Project Management Fundamentals',
          description:
            'An introduction to Agile, Scrum, and traditional project planning methodologies. Participants will learn to scope projects, create Gantt charts, manage stakeholders, and track deliverables using free tools such as Trello and Asana.',
          instructor: 'PM Leadership Centre',
          duration: '8 weeks',
          schedule: 'Saturdays — 9:00 AM–1:00 PM',
          category: 'Management',
          level: 'Intermediate',
          provider: 'PM Leadership Centre',
        },
        {
          title: 'Data Entry & Spreadsheet Analysis',
          description:
            'Master high-accuracy data entry techniques and intermediate Excel skills including VLOOKUP, pivot tables, data validation, and basic charting. Graduates consistently achieve typing speeds above 60 WPM with over 98% accuracy.',
          instructor: 'DataReady Training',
          duration: '3 weeks',
          schedule: 'Mon–Fri — 2:00 PM–4:00 PM',
          category: 'Technology',
          level: 'Beginner',
          provider: 'DataReady Training',
        },
        {
          title: 'Customer Relations & CRM Tools',
          description:
            'Learn how to deliver outstanding customer service and how to use industry-standard CRM platforms (Salesforce and HubSpot). The programme covers complaint handling, upselling techniques, and maintaining accurate customer records.',
          instructor: 'ServiceEdge Institute',
          duration: '5 weeks',
          schedule: 'Tue / Thu — 1:00 PM–3:00 PM',
          category: 'Business Skills',
          level: 'Beginner',
          provider: 'ServiceEdge Institute',
        },
        {
          title: 'Financial Literacy & Business Accounting',
          description:
            'A practical introduction to personal and business finance. Covers budgeting, profit and loss statements, basic bookkeeping, payroll principles, and preparing financial summaries. Ideal preparation for roles in finance, admin, or operations.',
          instructor: 'FinancePath Academy',
          duration: '6 weeks',
          schedule: 'Mon / Wed — 6:00 PM–8:00 PM',
          category: 'Finance',
          level: 'Beginner',
          provider: 'FinancePath Academy',
        },
        {
          title: 'Human Resources Essentials',
          description:
            'Gain foundational HR knowledge covering employment law basics, recruitment and onboarding processes, performance management frameworks, workplace conduct policies, and employee record-keeping. Directly aligned with entry-level HR assistant roles.',
          instructor: 'HR Academy Africa',
          duration: '6 weeks',
          schedule: 'Fri — 10:00 AM–1:00 PM',
          category: 'Human Resources',
          level: 'Beginner',
          provider: 'HR Academy Africa',
        },
        {
          title: 'Digital Marketing Fundamentals',
          description:
            'An end-to-end introduction to digital marketing covering SEO, Google Ads, social media strategy, email marketing campaigns, and performance analytics using Google Analytics. Participants will build a sample campaign portfolio by graduation.',
          instructor: 'GrowthLab Digital',
          duration: '8 weeks',
          schedule: 'Tue / Thu / Sat — 10:00 AM–12:00 PM',
          category: 'Marketing',
          level: 'Beginner',
          provider: 'GrowthLab Digital',
        },
      ],
    })
    console.log('✅ Training programmes created.')
  } else {
    console.log(`⏭️  Training already seeded (${trainingCount} found), skipping.`)
  }

  // ── Mentors (only seed if table is empty) ───────────────────────────────────
  const mentorCount = await prisma.mentor.count()
  if (mentorCount === 0) {
    console.log('🌟 Seeding mentor profiles...')
    await prisma.mentor.createMany({
      data: [
        {
          name: 'Dr. Sarah Okafor',
          bio: 'Certified career counsellor with 12 years of experience supporting returning citizens into professional employment. Sarah has personally guided over 200 individuals into stable office careers across finance, HR, and administration.',
          expertise: 'Career Counselling & Professional Development',
          experience: '12 years in career guidance and workforce reintegration',
          availability: 'weekdays-morning',
          motivation: 'I believe a past conviction should never define a person\'s professional future. Every individual deserves a path back to dignity and meaningful work.',
          status: 'APPROVED',
        },
        {
          name: 'James Adeyemi',
          bio: 'Former HR Director who now dedicates his time to coaching job seekers from marginalised backgrounds. James specialises in interview preparation, CV writing, and salary negotiation for office and corporate roles.',
          expertise: 'Interview Coaching & CV Writing',
          experience: '15 years in human resources, 5 years as a reintegration mentor',
          availability: 'weekends-afternoon',
          motivation: 'I have seen first-hand how a single opportunity can transform someone\'s trajectory. My role is to help you present your best self to employers.',
          status: 'APPROVED',
        },
        {
          name: 'Ngozi Eze',
          bio: 'Entrepreneur and business consultant who rebuilt her career after a period of incarceration. Ngozi now runs a successful consulting firm and mentors others in business development, financial planning, and professional networking.',
          expertise: 'Entrepreneurship, Business Development & Financial Planning',
          experience: 'Built two successful businesses post-release; 8 years of mentoring experience',
          availability: 'weekdays-evening',
          motivation: 'My own journey taught me that resilience plus the right guidance is unstoppable. I am here to provide that guidance.',
          status: 'APPROVED',
        },
      ],
    })
    console.log('✅ Mentor profiles created.')
  } else {
    console.log(`⏭️  Mentors already seeded (${mentorCount} found), skipping.`)
  }

  console.log('\n🎉 Production seed complete!')
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
