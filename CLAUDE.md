# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClipIt is a clipping marketplace connecting content creators with video clippers. Features a React TypeScript frontend and Express.js TypeScript backend with PostgreSQL database. The platform supports user authentication, job posting, job applications, and role-based dashboards.

## Development Commands

### Frontend (React App)
- `npm start` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm test` - Run tests with Jest
- `npm run eject` - Eject from Create React App (avoid unless necessary)

### Backend (Express API)
- `cd backend && npm run dev` - Start development server with nodemon (port 3001)
- `cd backend && npm run build` - Compile TypeScript to JavaScript
- `cd backend && npm start` - Start production server from compiled files

### Database Setup
- `brew services start postgresql@14` - Start PostgreSQL service (macOS)
- Database `clipit_db` should exist (auto-created by backend on first run)
- Tables are created automatically via `backend/src/config/database.ts`

## Architecture

### Frontend Structure
- Built with Create React App and TypeScript
- Uses React Router DOM for routing (v7.8.2)
- Styling with Tailwind CSS v4.1.12
- Icons with Lucide React
- JWT token stored in localStorage for authentication
- Role-based UI components and redirects

### Current Routes
- `/` - Landing page with login/signup buttons
- `/about` - About us page
- `/login` - User login (shared for creators and clippers)
- `/register` - User registration with role selection
- `/jobs` - Job marketplace with filtering and search
- `/jobs/:id` - Individual job details with application form
- `/creator-dashboard` - Creator dashboard (jobs, stats, applications)
- `/clipper-dashboard` - Clipper dashboard (opportunities, applications, earnings)

### User Roles
- **Creator**: Posts jobs, reviews applications, manages projects
- **Clipper**: Browses jobs, submits applications, creates clips

### Backend Structure
- Express.js API server with TypeScript
- PostgreSQL database with comprehensive schema
- JWT authentication with bcryptjs
- Role-based middleware (`requireRole`)
- File upload support with multer
- CORS configured for frontend communication

### API Endpoints
- `POST /api/auth/register` - User registration with role
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/jobs` - List jobs (with filtering: status, difficulty, budget, search)
- `GET /api/jobs/:id` - Get specific job details
- `POST /api/jobs` - Create new job (creators only)
- `POST /api/jobs/:id/apply` - Apply to job (clippers only)
- `GET /api/jobs/:id/applications` - Get job applications (job creator only)
- `GET /api/health` - Health check endpoint

### Database Schema
Key tables:
- `users` - User accounts with role (creator/clipper), ratings, earnings
- `jobs` - Job postings with budget, difficulty, requirements, tags
- `job_applications` - Applications from clippers to jobs
- `clips` - Submitted video clips for jobs
- `payments` - Payment tracking
- `reviews` - User reviews and ratings

## Environment Setup

### Prerequisites
- Node.js and npm
- PostgreSQL (installed via Homebrew on macOS)
- Database `clipit_db` (created automatically)

### Backend Environment Variables (backend/.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clipit_db
DB_USER=maximbelioglo
DB_PASSWORD=
JWT_SECRET=clipit_super_secret_jwt_key_2024_development_only_change_in_production_123456789
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Development Workflow

### Starting the Application
1. Start PostgreSQL: `brew services start postgresql@14`
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `npm start`
4. Backend API: http://localhost:3001
5. Frontend: http://localhost:3000
6. Health check: http://localhost:3001/api/health

### Authentication Flow
1. User registers with role selection (creator/clipper)
2. JWT token stored in localStorage
3. Role-based redirect to appropriate dashboard
4. Token sent in Authorization header for protected routes

### Job Application Flow
1. Creators post jobs via backend API
2. Jobs appear in marketplace with filtering
3. Clippers can view job details and apply
4. Applications tracked in database
5. Creators can view applications for their jobs

## Key Implementation Files

### Frontend Components
- `src/App.tsx` - Main routing with all application routes
- `src/LandingPage.tsx` - Homepage with login/signup buttons
- `src/Login.tsx` - Shared login form
- `src/Register.tsx` - Registration with role selection
- `src/JobMarketplace.tsx` - Job listings with search/filter
- `src/JobDetail.tsx` - Individual job view with application form
- `src/CreatorDashboard.tsx` - Creator dashboard with job management
- `src/ClipperDashboard.tsx` - Clipper dashboard with opportunities

### Backend Core Files
- `backend/src/index.ts` - Express server setup
- `backend/src/config/database.ts` - PostgreSQL connection and schema
- `backend/src/middleware/auth.ts` - JWT authentication and role checking
- `backend/src/routes/auth.ts` - Registration, login, user endpoints
- `backend/src/routes/jobs.ts` - Job CRUD and application management

## Current Development Status

- ✅ User authentication (login/register) with JWT
- ✅ Role-based dashboards (creator/clipper)
- ✅ Job marketplace with filtering and search
- ✅ Job application system for clippers
- ✅ Database schema and API endpoints
- ⚠️ Job creation form (placeholder buttons exist)
- ⚠️ Payment integration
- ⚠️ File upload for clips
- ⚠️ User profile management