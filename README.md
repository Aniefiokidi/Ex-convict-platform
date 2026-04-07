# Ex-Convict Reintegration Platform

A Next.js full-stack app providing returning citizens with job opportunities, vocational training, and mentorship support.

## Setup

1. Copy `.env.example` to `.env` and update the PostgreSQL connection string:

```bash
cp .env.example .env
```

2. Update `.env` with your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/exconvictdb"
SESSION_PASSWORD="a-strong-32-character-minimum-password"
```

3. Install dependencies:
```bash
npm install
```

4. Install required packages (SWR for data fetching):
```bash
npm install swr iron-session
```

5. Generate Prisma client and create database schema:
```bash
npm run prisma:generate
npx prisma db push
```

6. Seed sample data:
```bash
npx prisma db seed
```

7. Start the dev server:
```bash
npm run dev
```

Visit http://localhost:3000

## Deploying To Vercel

1. Import this repository in Vercel.
2. Add environment variables in Vercel Project Settings:
	- `DATABASE_URL`
	- `SESSION_PASSWORD` (minimum 32 characters)
	- `NEXT_PUBLIC_SITE_URL` (set to your production URL)
	- `CLOUDINARY_CLOUD_NAME` (if uploads are used)
	- `CLOUDINARY_API_KEY` (if uploads are used)
	- `CLOUDINARY_API_SECRET` (if uploads are used)
3. Deploy with the default Next.js settings.

Note: `postinstall` runs `prisma generate` automatically during install so Prisma Client is available at build/runtime.

## Architecture

- **Frontend**: Next.js pages with Tailwind CSS styling
- **Backend**: Next.js API routes  
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Session-based with iron-session and bcrypt

## Features

- Registration/login for ex-convicts and employers
- Job listings and posting
- Vocational training enrollment
- Mentor booking system
- Role-based dashboards

## Roles

- **Ex-Convict**: Browse and apply for jobs, enroll in training, book mentors
- **Employer**: Post job listings
- **Admin**: Manage platform (future enhancement)

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Current user
- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Post job (employers)
- `GET /api/trainings` - List trainings
- `POST /api/enroll` - Enroll in training
- `GET /api/mentors` - List mentors
- `POST /api/mentors/book` - Book mentor session

## Development

The project uses:
- Next.js 13.5 for frontend and API
- Prisma 4.20 for database management
- Tailwind CSS for styling
- iron-session for secure session handling
- bcryptjs for password hashing

To modify the database schema, update `prisma/schema.prisma` and run:
```bash
npx prisma db push
```