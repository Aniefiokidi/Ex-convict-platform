# Ex-Convict Reintegration Platform - Testing Guide

This document provides a comprehensive testing checklist for the platform.

## Quick Start Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the application:**
   Open http://localhost:3000 in your browser

## Testing Checklist

### ✅ **Authentication Flow**
- [ ] Navigate to registration page
- [ ] Create a new account (both ex-convict and employer roles)
- [ ] Login with created credentials
- [ ] Verify user session persistence
- [ ] Test logout functionality

### ✅ **Jobs Module**
- [ ] Browse job listings (accessible to all)
- [ ] Post a job (employer role required)
- [ ] Verify job appears in listings
- [ ] Test job application flow

### ✅ **Training Module**
- [ ] Browse training programs
- [ ] Enroll in a training (requires login)
- [ ] Verify enrollment confirmation

### ✅ **Mentorship Module**
- [ ] Browse available mentors
- [ ] Book a mentor session (requires login)
- [ ] Verify booking confirmation

### ✅ **UI/UX Testing**
- [ ] Verify responsive design on different screen sizes
- [ ] Test loading states and animations
- [ ] Check error handling and user feedback
- [ ] Verify navigation and page transitions

## Test Data

The platform comes pre-seeded with:
- **3 Training Programs:** Basic Computer Skills, Construction Safety, Food Handler Certification
- **3 Mentors:** Sarah Johnson (Life Skills), Michael Rodriguez (Career), Dr. Amanda Chen (Mental Health)

## API Endpoints Testing

You can test the APIs directly:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"EX_CONVICT"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user
curl -X GET http://localhost:3000/api/auth/me -b cookies.txt

# Get jobs
curl -X GET http://localhost:3000/api/jobs

# Get trainings
curl -X GET http://localhost:3000/api/trainings

# Get mentors
curl -X GET http://localhost:3000/api/mentors
```

## Known Limitations

1. **Database:** Currently uses SQLite for development (easy setup)
2. **Email:** No email verification implemented
3. **File Uploads:** No resume/document upload functionality
4. **Real-time:** No real-time notifications
5. **Payment:** No payment processing for premium features
6. **Mobile:** Responsive but could benefit from mobile app

## Production Deployment

For production deployment:

1. Update `.env` with production database URL (PostgreSQL recommended)
2. Set strong `SESSION_PASSWORD` 
3. Configure HTTPS and secure cookies
4. Add email service integration
5. Implement proper logging and monitoring
6. Add rate limiting and security headers

## Troubleshooting

**Common Issues:**

1. **Database errors:** Run `npx prisma db push` to sync schema
2. **Session issues:** Clear browser cookies and restart server
3. **Module not found:** Run `npm install` to ensure all dependencies
4. **Port in use:** Kill process on port 3000 or change PORT in .env

**Development Commands:**
```bash
# Reset database
npx prisma db push --force-reset

# View database
npx prisma studio

# Generate Prisma client
npx prisma generate

# Check for TypeScript errors
npx tsc --noEmit

# Run linting
npm run lint
```