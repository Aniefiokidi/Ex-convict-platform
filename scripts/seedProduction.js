const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Running production seed...')
  const hashedPassword = await bcrypt.hash('Admin@2025', 10)
  const userPassword   = await bcrypt.hash('password123', 10)

  // ── Admin ────────────────────────────────────────────────────────────────────
  console.log('🔐 Seeding admin account...')
  await prisma.user.upsert({
    where: { email: 'admin@reintegrate.ng' },
    update: {},
    create: {
      name: 'Platform Administrator',
      email: 'admin@reintegrate.ng',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '08000000001',
      address: 'Platform Headquarters, Abuja (FCT)',
    },
  })
  console.log('✅ Admin ready — email: admin@reintegrate.ng | password: Admin@2025')

  // ── Employers (Nigerian names & companies) ───────────────────────────────────
  console.log('👔 Seeding employer accounts...')
  const employer1 = await prisma.user.upsert({
    where: { email: 'chisom.okonkwo@adewaleassociates.ng' },
    update: {},
    create: {
      name: 'Chisom Okonkwo',
      email: 'chisom.okonkwo@adewaleassociates.ng',
      password: userPassword,
      role: 'EMPLOYER',
      phone: '08012345678',
      address: '14 Broad Street, Lagos Island, Lagos',
    },
  })

  const employer2 = await prisma.user.upsert({
    where: { email: 'emeka.nwachukwu@zenithtechhub.ng' },
    update: {},
    create: {
      name: 'Emeka Nwachukwu',
      email: 'emeka.nwachukwu@zenithtechhub.ng',
      password: userPassword,
      role: 'EMPLOYER',
      phone: '08023456789',
      address: '7 Adeola Odeku Street, Victoria Island, Lagos',
    },
  })

  const employer3 = await prisma.user.upsert({
    where: { email: 'amaka.obi@harmonycorporate.ng' },
    update: {},
    create: {
      name: 'Amaka Obi',
      email: 'amaka.obi@harmonycorporate.ng',
      password: userPassword,
      role: 'EMPLOYER',
      phone: '08034567890',
      address: 'Plot 1234, Wuse Zone 5, Abuja (FCT)',
    },
  })
  console.log('✅ Employer accounts ready.')

  // ── Mentor user accounts (MUST exist before mentor profiles) ─────────────────
  console.log('🌟 Seeding mentor user accounts...')
  const mentorUser1 = await prisma.user.upsert({
    where: { email: 'funmilayo.adeyemi@mentors.reintegrate.ng' },
    update: {},
    create: {
      name: 'Dr. Funmilayo Adeyemi',
      email: 'funmilayo.adeyemi@mentors.reintegrate.ng',
      password: userPassword,
      role: 'EX_CONVICT',
      phone: '08045678901',
      address: 'Ikeja, Lagos',
      skills: 'Career Counselling, Professional Development, Life Coaching',
      experience: '12 years in career guidance and workforce reintegration',
    },
  })

  const mentorUser2 = await prisma.user.upsert({
    where: { email: 'chukwuemeka.okafor@mentors.reintegrate.ng' },
    update: {},
    create: {
      name: 'Chukwuemeka Okafor',
      email: 'chukwuemeka.okafor@mentors.reintegrate.ng',
      password: userPassword,
      role: 'EX_CONVICT',
      phone: '08056789012',
      address: 'Garki, Abuja (FCT)',
      skills: 'HR Management, Interview Coaching, CV Writing',
      experience: '15 years in human resources, 5 years as a reintegration mentor',
    },
  })

  const mentorUser3 = await prisma.user.upsert({
    where: { email: 'ngozi.eze@mentors.reintegrate.ng' },
    update: {},
    create: {
      name: 'Ngozi Eze',
      email: 'ngozi.eze@mentors.reintegrate.ng',
      password: userPassword,
      role: 'EX_CONVICT',
      phone: '08067890123',
      address: 'GRA Phase 2, Port Harcourt, Rivers State',
      skills: 'Entrepreneurship, Business Development, Financial Planning',
      experience: 'Built two successful businesses post-release; 8 years of mentoring',
    },
  })

  // ── Mentor profiles (upsert by userId — safe to re-run) ──────────────────────
  await prisma.mentor.upsert({
    where: { userId: mentorUser1.id },
    update: {},
    create: {
      userId: mentorUser1.id,
      bio: 'Certified career counsellor with 12 years of experience supporting returning citizens into professional employment across Nigeria. Dr. Adeyemi has personally guided over 200 individuals into stable office careers in finance, HR, and administration.',
      expertise: 'Career Counselling & Professional Development',
      experience: '12 years in career guidance and workforce reintegration',
      availability: 'weekdays-morning',
      motivation: 'I believe a past conviction should never define a person\'s professional future. Every individual deserves a path back to dignity and meaningful work.',
      status: 'APPROVED',
    },
  })

  await prisma.mentor.upsert({
    where: { userId: mentorUser2.id },
    update: {},
    create: {
      userId: mentorUser2.id,
      bio: 'Former HR Director who now dedicates his time to coaching job seekers from marginalised backgrounds across Nigeria. Chukwuemeka specialises in interview preparation, CV writing, and salary negotiation for office and corporate roles.',
      expertise: 'Interview Coaching & CV Writing',
      experience: '15 years in human resources, 5 years as a reintegration mentor',
      availability: 'weekends-afternoon',
      motivation: 'I have seen first-hand how a single opportunity can transform someone\'s trajectory. My role is to help you present your best self to employers.',
      status: 'APPROVED',
    },
  })

  await prisma.mentor.upsert({
    where: { userId: mentorUser3.id },
    update: {},
    create: {
      userId: mentorUser3.id,
      bio: 'Entrepreneur and business consultant based in Port Harcourt who rebuilt her career after incarceration. Ngozi now runs a successful consulting firm and mentors others in business development, financial planning, and professional networking.',
      expertise: 'Entrepreneurship, Business Development & Financial Planning',
      experience: 'Built two successful businesses post-release; 8 years of mentoring experience',
      availability: 'weekdays-evening',
      motivation: 'My own journey taught me that resilience plus the right guidance is unstoppable. I am here to provide that guidance.',
      status: 'APPROVED',
    },
  })
  console.log('✅ Mentor profiles ready.')

  // ── Jobs (seed if empty, Nigerian locations & Naira salaries) ────────────────
  const jobCount = await prisma.job.count()
  if (jobCount === 0) {
    console.log('💼 Seeding job listings...')
    await prisma.job.createMany({
      data: [
        {
          title: 'Administrative Officer',
          company: 'Adewale & Associates',
          description:
            'We are seeking a professional Administrative Officer to support our executive team and ensure smooth day-to-day office operations. Responsibilities include managing correspondence, scheduling meetings, maintaining filing systems, and coordinating cross-departmental activities. Adewale & Associates is a proud second-chance employer committed to workforce inclusion.',
          requirements:
            'Minimum OND/HND or equivalent; proficiency in Microsoft Office Suite; strong organisational and communication skills; ability to multitask and manage competing priorities. Prior administrative experience is an advantage.',
          salary: '₦150,000–₦200,000/month',
          location: 'Lagos Island, Lagos',
          employerId: employer1.id,
        },
        {
          title: 'Marketing Coordinator',
          company: 'Adewale & Associates',
          description:
            'Adewale & Associates is seeking a Marketing Coordinator to support the development and execution of marketing campaigns across digital and traditional channels. Responsibilities include coordinating content creation, managing social media calendars, tracking campaign performance, and liaising with external vendors. Full training is provided.',
          requirements:
            'HND/BSc in Marketing, Communications, or a related discipline; solid written and verbal communication skills; experience with social media platforms and basic design tools (Canva or Adobe); analytical mindset with attention to detail.',
          salary: '₦180,000–₦230,000/month',
          location: 'Victoria Island, Lagos',
          employerId: employer1.id,
        },
        {
          title: 'Business Development Executive',
          company: 'Adewale & Associates',
          description:
            'Join our growing commercial team as a Business Development Executive. You will identify new business opportunities, build relationships with prospective clients in Nigeria, prepare proposals, and work closely with our marketing and delivery teams to close deals. Uncapped commission structure and career advancement are on offer.',
          requirements:
            'BSc in Business, Sales, or Marketing; proven ability to build professional relationships; strong negotiation and presentation skills; CRM software experience preferred.',
          salary: '₦200,000–₦280,000/month + commission',
          location: 'Lekki Phase 1, Lagos',
          employerId: employer1.id,
        },
        {
          title: 'IT Support Technician',
          company: 'Zenith TechHub',
          description:
            'Zenith TechHub is hiring an IT Support Technician to provide first- and second-line technical support to staff across our Lagos offices. You will troubleshoot hardware and software issues, manage user accounts, maintain IT asset records, and support network infrastructure. We welcome applicants from all backgrounds and provide structured on-boarding.',
          requirements:
            'CompTIA A+ or equivalent certification (or demonstrated equivalent experience); knowledge of Windows 10/11 environments; strong diagnostic and problem-solving skills; excellent customer-service orientation.',
          salary: '₦200,000–₦260,000/month',
          location: 'Victoria Island, Lagos',
          employerId: employer2.id,
        },
        {
          title: 'Financial Analyst (Entry-Level)',
          company: 'Zenith TechHub',
          description:
            'This entry-level Financial Analyst role offers an outstanding opportunity to build a career in finance within a growing Nigerian technology company. You will assist with budget preparation, variance analysis, financial reporting, and forecasting. Zenith TechHub mentors junior finance professionals with a clear progression path to senior roles.',
          requirements:
            'BSc/HND in Accounting, Finance, or Economics; understanding of financial statements and basic accounting principles; proficiency in Microsoft Excel; strong numerical reasoning. ICAN or ACCA student membership is a plus.',
          salary: '₦220,000–₦300,000/month',
          location: 'Victoria Island, Lagos',
          employerId: employer2.id,
        },
        {
          title: 'Data Analyst',
          company: 'Zenith TechHub',
          description:
            'Zenith TechHub is looking for a Data Analyst to transform raw business data into actionable insights. You will design dashboards, run SQL queries, conduct statistical analyses, and present findings to senior management. This role is ideal for someone passionate about data who wants to grow into a senior analytics position.',
          requirements:
            'Proficiency in SQL and Excel; experience with visualisation tools (Power BI or Tableau); degree in Statistics, Computer Science, or related field; strong attention to detail and ability to communicate findings clearly.',
          salary: '₦250,000–₦320,000/month',
          location: 'Abuja (FCT)',
          employerId: employer2.id,
        },
        {
          title: 'Human Resources Assistant',
          company: 'Harmony Corporate Services',
          description:
            'Harmony Corporate Services is looking for a detail-oriented Human Resources Assistant to support our HR department. Key duties include maintaining employee records, coordinating recruitment logistics, onboarding new hires, and assisting with payroll processing. We actively practise inclusive hiring and welcome second-chance applicants.',
          requirements:
            'Diploma or degree in Human Resources Management, Business Administration, or a related field; familiarity with HRIS software; strong interpersonal and confidentiality skills; ability to work effectively in a team.',
          salary: '₦150,000–₦190,000/month',
          location: 'Wuse, Abuja (FCT)',
          employerId: employer3.id,
        },
        {
          title: 'Operations Coordinator',
          company: 'Harmony Corporate Services',
          description:
            'Harmony Corporate Services is recruiting an Operations Coordinator to streamline and improve internal business processes across our Abuja office. You will monitor daily operational workflows, liaise between departments, prepare management reports, and identify opportunities for efficiency gains.',
          requirements:
            'Degree or HND in Business Administration, Management, or a related field; strong analytical and project-management skills; proficiency with Microsoft 365 or Google Workspace; excellent communication and stakeholder-management abilities.',
          salary: '₦180,000–₦240,000/month',
          location: 'Maitama, Abuja (FCT)',
          employerId: employer3.id,
        },
        {
          title: 'Office Administrator',
          company: 'Harmony Corporate Services',
          description:
            'We are seeking a reliable and proactive Office Administrator to keep our Abuja office running efficiently. Tasks include front-desk management, supplier liaison, procurement of office supplies, management of meeting-room bookings, and general administrative support to all departments.',
          requirements:
            'Minimum 1 year of office administration experience; strong organisational skills; proficiency in Microsoft Office; professional telephone and written manner; discretion with confidential information.',
          salary: '₦120,000–₦160,000/month',
          location: 'Garki, Abuja (FCT)',
          employerId: employer3.id,
        },
      ],
    })
    console.log('✅ Job listings created.')
  } else {
    console.log(`⏭️  Jobs already seeded (${jobCount} found), skipping.`)
  }

  // ── Training programmes ───────────────────────────────────────────────────────
  const trainingCount = await prisma.training.count()
  if (trainingCount === 0) {
    console.log('📚 Seeding training programmes...')
    await prisma.training.createMany({
      data: [
        {
          title: 'Microsoft Office Suite Mastery',
          description:
            'A hands-on programme covering Word, Excel, PowerPoint, and Outlook to the professional standard required by most Nigerian office employers. Participants will complete practical assignments modelled on real workplace scenarios.',
          instructor: 'TechSkills Academy Nigeria',
          duration: '6 weeks',
          schedule: 'Mon / Wed / Fri — 9:00 AM–11:00 AM',
          category: 'Technology',
          level: 'Beginner',
          provider: 'TechSkills Academy Nigeria',
        },
        {
          title: 'Professional Business Communication',
          description:
            'Develop the written and verbal communication skills that Nigerian employers look for. Topics include business email etiquette, report writing, presentation delivery, active listening, and professional conduct in meetings.',
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
            'An introduction to Agile, Scrum, and traditional project planning. Participants will learn to scope projects, create Gantt charts, manage stakeholders, and track deliverables using Trello and Asana.',
          instructor: 'PM Leadership Centre Lagos',
          duration: '8 weeks',
          schedule: 'Saturdays — 9:00 AM–1:00 PM',
          category: 'Management',
          level: 'Intermediate',
          provider: 'PM Leadership Centre Lagos',
        },
        {
          title: 'Data Entry & Spreadsheet Analysis',
          description:
            'Master high-accuracy data entry and intermediate Excel skills including VLOOKUP, pivot tables, data validation, and basic charting. Graduates consistently achieve typing speeds above 60 WPM with over 98% accuracy.',
          instructor: 'DataReady Training NG',
          duration: '3 weeks',
          schedule: 'Mon–Fri — 2:00 PM–4:00 PM',
          category: 'Technology',
          level: 'Beginner',
          provider: 'DataReady Training NG',
        },
        {
          title: 'Customer Relations & CRM Tools',
          description:
            'Learn how to deliver outstanding customer service and use industry-standard CRM platforms. The programme covers complaint handling, upselling techniques, and maintaining accurate customer records.',
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
            'A practical introduction to personal and business finance in the Nigerian context. Covers budgeting, profit and loss statements, basic bookkeeping, payroll principles, and preparing financial summaries.',
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
            'Gain foundational HR knowledge covering Nigerian labour law basics, recruitment and onboarding processes, performance management frameworks, workplace conduct policies, and employee record-keeping.',
          instructor: 'HR Academy Nigeria',
          duration: '6 weeks',
          schedule: 'Fri — 10:00 AM–1:00 PM',
          category: 'Human Resources',
          level: 'Beginner',
          provider: 'HR Academy Nigeria',
        },
        {
          title: 'Digital Marketing Fundamentals',
          description:
            'An end-to-end introduction to digital marketing covering SEO, social media strategy, email marketing campaigns, and performance analytics using Google Analytics. Participants build a sample campaign portfolio by graduation.',
          instructor: 'GrowthLab Digital NG',
          duration: '8 weeks',
          schedule: 'Tue / Thu / Sat — 10:00 AM–12:00 PM',
          category: 'Marketing',
          level: 'Beginner',
          provider: 'GrowthLab Digital NG',
        },
      ],
    })
    console.log('✅ Training programmes created.')
  } else {
    console.log(`⏭️  Training already seeded (${trainingCount} found), skipping.`)
  }

  console.log('\n🎉 Production seed complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin login  →  admin@reintegrate.ng')
  console.log('Password     →  Admin@2025')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
