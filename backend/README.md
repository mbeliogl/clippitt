# ClipIt Backend API

A Node.js/Express backend for the ClipIt marketplace platform where creators post clipping jobs and clippers can apply and submit clips.

## Features

- **User Authentication**: JWT-based auth with role-based access (creators/clippers)
- **Job Management**: Create, browse, and apply to clipping jobs
- **Clip Submission**: Submit, approve/reject clips with performance tracking
- **Payment System**: Handle payments between creators and clippers
- **Database**: PostgreSQL with comprehensive schema

## Tech Stack

- Node.js + Express + TypeScript
- PostgreSQL with pg driver
- JWT authentication
- bcryptjs for password hashing
- Comprehensive API endpoints

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and JWT settings
   ```

3. **Set up PostgreSQL**:
   - Install PostgreSQL
   - Create database: `clipit_db`
   - Update connection details in `.env`

4. **Run in development**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id/stats` - Get user statistics

### Jobs
- `GET /api/jobs` - Get all jobs (with filtering)
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create job (creators only)
- `POST /api/jobs/:id/apply` - Apply to job (clippers only)
- `GET /api/jobs/:id/applications` - Get job applications (job creator only)

### Clips
- `GET /api/clips/job/:jobId` - Get clips for a job
- `GET /api/clips/my-clips` - Get user's clips
- `POST /api/clips` - Submit a clip
- `PUT /api/clips/:id/status` - Approve/reject clip (job creator only)
- `PUT /api/clips/:id/performance` - Update clip performance data

### Payments
- `GET /api/payments/history` - Get payment history
- `POST /api/payments` - Create payment for approved clip
- `PUT /api/payments/:id/status` - Update payment status
- `GET /api/payments/stats` - Get payment statistics

## Database Schema

### Core Tables:
- **users** - User accounts (creators/clippers)
- **jobs** - Clipping job postings
- **job_applications** - Applications from clippers
- **clips** - Submitted clips with performance data
- **payments** - Payment transactions
- **reviews** - User ratings and reviews

### Key Features:
- UUID primary keys
- Foreign key constraints
- Indexes for performance
- ENUM constraints for status fields
- Timestamp tracking

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clipit_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Development

- `npm run dev` - Start with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Start production server

## Database Setup

The application automatically creates all required tables on startup. Just ensure your PostgreSQL connection details are correct in the `.env` file.

## API Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized  
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error