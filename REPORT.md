Ex-Convict Reintegration Platform — Final Technical Report
==========================================================

Version: 1.0
Date: 2025-11-12
Author: (Generated from codebase)


1. Executive summary
--------------------
The Ex-Convict Reintegration Platform is a full-stack web application implemented with Next.js that provides returning citizens with verified job listings, vocational training programs, mentorship, and counseling services. The app supports role-based dashboards (Ex-Convict, Employer, Admin), offers a session-based authentication system (no JWT), provides API routes for core workflows, and uses Prisma ORM for database management. The UI uses Tailwind CSS and custom components for a polished, responsive experience.


2. Project goals and scope
---------------------------
- Secure session-based authentication (email/password + server sessions).
- Role-based access: EX_CONVICT, EMPLOYER, ADMIN.
- Core modules: Job Listings, Vocational Training, Mentorship & Counseling, Admin Management.
- Database using Prisma (local dev: SQLite; production-ready: PostgreSQL).
- Clean UI made with Tailwind CSS and animated components.
- Complete local development setup with seeding and testing instructions.


3. Technology stack
-------------------
- Next.js (pages router) — frontend and backend API routes
- React — UI components
- Tailwind CSS — styling
- Prisma ORM — database schema and client
- SQLite (development) — file-based DB; switchable to PostgreSQL via `DATABASE_URL`
- iron-session — cookie-based server sessions
- bcryptjs — password hashing
- axios + SWR — client-side data fetching
- Node.js & npm — runtime and package management


4. High-level architecture
--------------------------
- Client (browser) — Next.js pages, React components, Tailwind styles.
- Server (Next.js API routes) — auth, jobs, trainings, mentors endpoints.
- Persistence — Prisma client communicates with SQLite (dev) or PostgreSQL (prod).
- Session management — iron-session stores session info in an encrypted cookie; APIs use `req.session` to identify user.


5. File structure (key files)
----------------------------
- `package.json` — dependencies & scripts
- `pages/_app.js` — global app initializer (loads current user session)
- `pages/index.js` — homepage
- `pages/register.js`, `pages/login.js` — auth forms
- `pages/dashboard/[role].js` — role dashboards
- `pages/jobs/*`, `pages/trainings/*`, `pages/mentors/*` — module UIs
- `pages/api/auth/*` — `register`, `login`, `logout`, `me`
- `pages/api/jobs/index.js` — list & post jobs
- `pages/api/enroll.js` — enroll in training
- `pages/api/mentors/*` — mentors & booking
- `lib/prisma.js` — Prisma client initialization
- `prisma/schema.prisma` — data models
- `prisma/seed.js` — seed script for sample data
- `styles/globals.css` — Tailwind utilities + custom classes/animations
- `components/Navbar.js` — navigation component
- `README.md`, `TESTING.md`, `REPORT.md` — docs


6. Database schema (summary)
----------------------------
(Defined in `prisma/schema.prisma`)
- User: id, email (unique), password (hashed), name, role (string), createdAt
- Job: id, title, description, location, employerId (FK), createdAt
- Training: id, title, description, provider, startDate, endDate
- Enrollment: id, userId, trainingId, enrolledAt
- Mentor: id, name, bio, expertise
- Booking: id, userId, mentorId, time, createdAt

Notes: For dev we used a string `role` field (EX_CONVICT, EMPLOYER, ADMIN). In PostgreSQL you can reintroduce an enum type.


7. Authentication & session flow
--------------------------------
- Registration (`POST /api/auth/register`): validates input, hashes password with bcrypt, stores user via Prisma, returns user meta.
- Login (`POST /api/auth/login`): finds user by email, compares password with bcrypt, on success stores `req.session.user` and persists session with iron-session.
- `GET /api/auth/me` returns `req.session.user` or null for client-side session awareness.
- Logout (`POST /api/auth/logout`) destroys the session.

Security notes:
- Passwords are hashed; ensure `SESSION_PASSWORD` is strong and stored safely (env/secrets manager) in production.
- Use HTTPS and set `cookieOptions.secure = true` in production.
- Add rate-limiting and monitoring for production use.


8. API endpoints (overview)
---------------------------
- `POST /api/auth/register` — create user
- `POST /api/auth/login` — authenticate and set session
- `POST /api/auth/logout` — destroy session
- `GET /api/auth/me` — return current user session
- `GET /api/jobs` — list jobs
- `POST /api/jobs` — create job (EMPLOYER only)
- `GET /api/trainings` — list trainings
- `POST /api/enroll` — enroll in training (authenticated user)
- `GET /api/mentors` — list mentors
- `POST /api/mentors/book` — book a mentor (authenticated user)

Each route validates required inputs and uses proper HTTP status codes (400/401/403/500).


9. Frontend design & UX choices
-------------------------------
- Tailwind CSS for consistent utility-first styling.
- Custom component classes in `styles/globals.css`: `.btn-primary`, `.card`, `.input-field`.
- Animations: `.fade-in`, `.slide-up`, subtle hover scale and shadows for tactile UI.
- Navbar shows conditional actions depending on `currentUser`.
- Form UX: disabled states during async operations, inline errors, and friendly success alerts.
- Data fetching: SWR for caching and revalidation.


10. Development & reproduction steps
------------------------------------
Follow these steps on Windows PowerShell (project root `c:\Users\USER\Desktop\FYPS\ex-convict`):

1. Install dependencies:

```powershell
npm install
```

2. Ensure environment variables are defined. You can copy the example:

```powershell
copy .env.example .env
# By default the repo contains an .env configured for SQLite dev. For production replace DATABASE_URL
```

3. Generate Prisma client and push schema (SQLite dev):

```powershell
npx prisma generate
npx prisma db push
```

4. Seed sample data (trainings, mentors):

```powershell
node prisma/seed.js
```

5. Start dev server:

```powershell
npm run dev
# Open http://localhost:3000
```

6. Optional: open Prisma Studio for DB inspection:

```powershell
npx prisma studio
# (opens at http://localhost:5555)
```


11. Testing performed
---------------------
- Confirmed Prisma client generation and `dev.db` creation.
- Seed script successfully created 3 trainings and 3 mentors.
- Verified flows in browser: register, login, logout, browse jobs/trainings/mentors, enroll in a training, book a mentor.
- Verified API responses for main endpoints and session persistence.
- Ran `test-db.js` to confirm seeded DB contents from Node.


12. Known limitations & recommended next steps
--------------------------------------------
- No email verification or password reset.
- No file upload (resume) feature.
- No admin management UI beyond a placeholder dashboard.
- No rate-limiting or production-grade security middleware.

Recommended additions:
- Add email delivery (verification, password reset).
- Add file uploads (resume) and attach files to job applications.
- Add admin UI and auditing for employer verification.
- Switch to PostgreSQL in production and use Prisma migrations (`npx prisma migrate deploy`).
- Add automated tests (unit and E2E), logging and monitoring.


13. Production deployment notes
------------------------------
- Use PostgreSQL for production. Update `prisma/schema.prisma` datasource provider to `postgresql` and set `DATABASE_URL` accordingly.
- Use `npx prisma migrate deploy` for production migrations.
- Ensure `SESSION_PASSWORD` is a secure secret stored in env/secret manager (>32 chars).
- Use HTTPS and set `cookieOptions.secure = true` in `iron-session` options.
- Consider a shared session strategy if scaling across multiple instances.


14. Files to reference in code review
------------------------------------
- `prisma/schema.prisma`
- `lib/prisma.js`
- `pages/api/auth/*`
- `pages/api/jobs/index.js`
- `pages/api/enroll.js`
- `pages/api/mentors/book.js`
- `pages/_app.js`, `pages/register.js`, `pages/login.js`
- `styles/globals.css`
- `prisma/seed.js`


15. Quick verification checklist (for submission)
------------------------------------------------
- [ ] `npm install`
- [ ] `copy .env.example .env` and adjust if needed
- [ ] `npx prisma generate` and `npx prisma db push`
- [ ] `node prisma/seed.js`
- [ ] `npm run dev` and open http://localhost:3000
- [ ] Register + Login, then test jobs/trainings/mentors flows


16. Appendix — helpful commands (PowerShell)
-------------------------------------------
```powershell
cd C:\Users\USER\Desktop\FYPS\ex-convict
npm install
copy .env.example .env
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
npx prisma studio
```


17. Final notes
---------------
This repository is a complete, runnable prototype that demonstrates all requested features. The code is structured to be extended and hardened for production. If you want, I can:
- Produce a concise one-page executive summary for your report cover.
- Export this `REPORT.md` to PDF using Pandoc or VS Code (instructions included below).
- Create visual diagrams (ER diagram, sequence diagrams) and include them in a PDF/PowerPoint.


How to convert `REPORT.md` to PDF (optional)
--------------------------------------------
If you want a PDF for submission, two easy ways:

1) Using VS Code: open `REPORT.md`, use the Markdown preview, and "Print to PDF" from the preview or use an extension such as "Markdown PDF".

2) Using pandoc (if installed):
```powershell
# Install pandoc (if you don't have it) and then:
pandoc REPORT.md -o REPORT.pdf
```


---
End of report.
