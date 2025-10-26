# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClipIt is a revolutionary platform that connects content creators with clippers to solve expensive social media advertising through viral content creation.

### The Problem
Social media advertising is expensive for both new creators and established projects. Traditional advertising methods are costly and often generate less engaged traffic. For long-form content (podcasts, talk shows, educational content), virality is crucial for success - and clippers are the key to creating that virality.

### The Solution
ClipIt allows content creators to post jobs with assigned payout amounts. Clippers can sign up for jobs, clip content, edit it, and post it on their own or dedicated pages. Success depends on the clippers' ability to create viral content.

### Value Proposition

**For Content Creators:**
- Risk-free exposure: Pay only for successful viral clips
- Much cheaper than traditional social media advertising
- Generates highly engaged traffic (new followers, views, engagement)
- Worst case: Pay viral clippers but still cost less than ads
- Focus on content creation while clippers handle viral marketing

**For Clippers:**
- Risk-free opportunity: Success depends entirely on their viral skills
- Extremely rewarding when clips go viral
- Build portfolio and reputation through successful campaigns
- Monetize creativity and social media expertise
- Flexible work - choose jobs that match their style

### Business Model
The platform takes a fee/percentage from successful transactions. The exact payment structure (membership vs. percentage of revenue) and payment allocation system are still being defined and will be implemented as the platform evolves.

### Technical Implementation
Features a React TypeScript frontend and Express.js TypeScript backend with PostgreSQL database. The platform supports user authentication, job posting, job applications, and role-based dashboards.

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
- Centralized authentication state management with React Context
- JWT token persisted in localStorage with auto-restoration on page load
- Protected routes with automatic redirects based on authentication status
- Role-based UI components and dashboard navigation

### Current Routes
- `/` - Landing page with adaptive navigation (shows dashboard for authenticated users)
- `/about` - About us page with comprehensive platform information
- `/legal` - Legal information page
- `/integrations` - Integrations page (placeholder)
- `/login` - User login (shared for creators and clippers)
- `/register` - User registration with role selection
- `/jobs` - Job marketplace with filtering and search
- `/jobs/:id` - Individual job details with application form
- `/job-creation` - Job creation form for creators
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
2. JWT token and user data managed through AuthContext
3. Automatic persistence to localStorage with page refresh restoration
4. Role-based redirect to appropriate dashboard
5. Protected routes prevent unauthorized access
6. Landing page navigation adapts based on authentication status
7. Token sent in Authorization header for protected API requests

### Job Application Flow
1. Creators post jobs via backend API
2. Jobs appear in marketplace with filtering
3. Clippers can view job details and apply
4. Applications tracked in database
5. Creators can view applications for their jobs

## Key Implementation Files

### Frontend Components
- `src/App.tsx` - Main routing with AuthProvider and protected routes including `/creator-analytics`
- `src/AuthContext.tsx` - Centralized authentication state management with React Context
- `src/ProtectedRoute.tsx` - Route protection component with role-based access control
- `src/LandingPage.tsx` - Modern Apple-inspired homepage with adaptive navigation
- `src/Login.tsx` - Shared login form with complete header/footer structure
- `src/Register.tsx` - Registration with role selection and consistent header/footer
- `src/JobMarketplace.tsx` - Job listings with dashboard-style header for authenticated users
- `src/JobDetail.tsx` - Individual job view with authentication-aware header and notifications
- `src/CreatorAnalytics.tsx` - Dedicated analytics page with professional dashboard layout
- `src/JobCreation.tsx` - Advanced job creation form with multi-step workflow
- `src/CreatorDashboard.tsx` - Creator dashboard with comprehensive job management and glassmorphism footer
- `src/ClipperDashboard.tsx` - Clipper dashboard with opportunities and consistent header styling
- `src/AboutUs.tsx` - Comprehensive about page with detailed platform information
- `src/Legal.tsx` - Legal information page with professional header/footer and sample content
- `src/Integrations.tsx` - Integrations page with platform cards and authentication-aware CTAs

### Backend Core Files
- `backend/src/index.ts` - Express server setup
- `backend/src/config/database.ts` - PostgreSQL connection and schema
- `backend/src/middleware/auth.ts` - JWT authentication and role checking
- `backend/src/routes/auth.ts` - Registration, login, user endpoints
- `backend/src/routes/jobs.ts` - Job CRUD and application management

## Landing Page Design

The landing page features a modern, Apple-inspired design with:

### Visual Design
- **Gradient Background**: Gray-900 → Blue-900 → Purple-900 gradient
- **Glassmorphism Effects**: Frosted glass components with backdrop blur
- **Clean Typography**: Large headlines with proper hierarchy (5xl to 8xl)
- **Minimal Color Palette**: Blues, purples, whites with high contrast
- **Rounded Design Language**: 2xl border radius throughout

### Interactive Features
- **Scroll-Adaptive Navigation**: Transparent → solid with color transitions
- **Staggered Animations**: Progressive entrance animations with delays
- **Intersection Observer**: Feature cards animate on scroll
- **Auto-Rotating Testimonials**: 4-second carousel rotation
- **Micro-Interactions**: Scale transforms, icon animations, smooth transitions

### Sections
1. **Hero Section**: Main headline with animated badge and CTAs
2. **Features Section**: Three feature cards (Lightning Fast, Expert Network, Premium Quality)
3. **Testimonials**: Rotating customer reviews with avatars
4. **Final CTA**: Conversion-focused call-to-action
5. **Footer**: Clean branding and copyright

### Responsive Design
- **Mobile-First**: Breakpoints at sm:/md:/lg: with proper scaling
- **Typography Scaling**: Text responsive from mobile to desktop
- **Grid Layouts**: Cards stack on mobile, grid on larger screens
- **Navigation Adaptation**: Simplified nav on small screens

## Current Development Status

- ✅ **Authentication System**: Complete JWT authentication with React Context
  - Centralized state management with AuthContext
  - Automatic token persistence and restoration
  - Protected routes with role-based access control
  - Landing page adaptive navigation for authenticated users

- ✅ **Navigation & UX**: Comprehensive navigation system
  - Home buttons on all pages for easy navigation back to landing page
  - Consistent styling with Lucide React icons
  - Adaptive navigation based on authentication status
  - Role-based dashboard navigation
  - Footer redesigned with links under ClipIt branding

- ✅ **Core Features**: 
  - User registration and login with role selection
  - Job marketplace with advanced filtering and search
  - Job application system for clippers
  - Creator and clipper dashboards with comprehensive interfaces
  - Modern Apple-inspired landing page with animations
  - About page with detailed platform information

- ✅ **Job Management System**: FULLY FUNCTIONAL
  - **Job Creation**: Complete job creation form with file upload support
  - **Multiple Content Sources**: Upload files, YouTube integration, Twitch integration
  - **Advanced Form**: Multi-step workflow with payout settings, difficulty levels, tags
  - **Database Integration**: Full CRUD operations with PostgreSQL
  - **Field Mapping**: Frontend-backend integration with proper data transformation
  - **File Upload**: Basic file upload handling for manual content creation

- ✅ **Creator Dashboard**: FULLY FUNCTIONAL
  - **Real-time Data**: Job performance counters with actual database statistics
  - **User-specific Filtering**: Backend properly filters jobs by creator (`creator=me` parameter)
  - **Sidebar Navigation**: Auto-highlighting sidebar matching About Us page styling
  - **Job Status Tracking**: Live counters for active, completed, and paused jobs
  - **Important Updates Modal**: "See all updates" feature with comprehensive notification system
  - **Intersection Observer**: Automatic section highlighting during scroll
  - **Dedicated Analytics Page**: Separated analytics into standalone page with professional dashboard layout

- ✅ **Navigation & User Experience**: COMPREHENSIVE OVERHAUL
  - **Unified Branding**: ClipIt logo in all page headers linking to landing page (Apple-style)
  - **Dashboard-Style Headers**: Notifications, settings, and logout buttons for authenticated users
  - **Role-Based Navigation**: LayoutDashboard icons linking to appropriate dashboards
  - **Authentication-Aware**: Headers adapt based on login status across all pages
  - **Consistent Footer**: Professional footer with Legal, Integrations, About Us links on all pages
  - **Notifications System**: Functional notification modals with unread indicators and animations
  - **Responsive Design**: Proper header/footer structures replacing floating buttons

- ✅ **Technical Infrastructure**:
  - Database schema and API endpoints
  - Express.js backend with PostgreSQL
  - React TypeScript frontend with Tailwind CSS
  - **Backend Fixes**: Proper array handling for tags, JWT authentication, user filtering
  - **API Enhancements**: Creator-specific job filtering, proper error handling

- ⚠️ **Future Implementation**:
  - Payment integration and payout processing
  - Actual file upload processing and storage (currently placeholder URLs)
  - User profile management and settings
  - Clip submission and review system
  - Video processing and thumbnail generation

## Development Workflow Notes

### Daily Shutdown Procedure
To conserve laptop resources when done working:
1. Stop React dev server: `Ctrl+C` in npm start terminal
2. Stop backend server: `Ctrl+C` in backend terminal (or it's handled automatically)
3. Stop PostgreSQL: `brew services stop postgresql@14`

### Daily Startup Procedure  
1. Start PostgreSQL: `brew services start postgresql@14`
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `npm start`

### Git Authentication
- Uses personal access tokens (not password authentication)
- Credentials cached in macOS keychain via `osxkeychain` helper
- Repository: `https://github.com/mbeliogl/clippitt.git`

## Recent Major Updates & Bug Fixes

### Job Creation System (COMPLETED)
- ✅ Fixed PostgreSQL array format issues for tags field
- ✅ Resolved frontend-backend field name mismatches (`payoutPer1000Views` → `budget`)
- ✅ Added proper difficulty level mapping (`beginner/intermediate/advanced` → `easy/medium/hard`)
- ✅ Implemented file upload support for manual job creation
- ✅ Added content source selection (Upload, YouTube, Twitch)

### Creator Dashboard Enhancements (COMPLETED)
- ✅ Fixed `creator=me` API parameter handling for user-specific job filtering
- ✅ Resolved JWT token parsing issues for user identification
- ✅ Implemented real-time job performance counters with accurate database statistics
- ✅ Added "See all updates" modal with comprehensive notification system
- ✅ Applied About Us page styling to sidebar with glassmorphism effects
- ✅ Fixed intersection observer for automatic section highlighting during scroll
- ✅ Corrected status mapping (active jobs = "in progress" counter)

### UI/UX Improvements (COMPLETED)
- ✅ Redesigned landing page footer with proper link placement under ClipIt branding
- ✅ Enhanced sidebar styling consistency across About Us and Creator Dashboard
- ✅ Improved responsive design and glassmorphism effects

### Backend API Fixes (COMPLETED)
- ✅ Fixed tags array handling - converts comma-separated strings to PostgreSQL arrays
- ✅ Enhanced job filtering with `creator=me` parameter support
- ✅ Added proper JWT token validation and user ID extraction
- ✅ Improved error handling and debugging logs