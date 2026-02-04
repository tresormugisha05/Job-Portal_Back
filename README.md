# Job Portal Backend API

A comprehensive web-based backend system for managing job postings, applications, employers, and job seekers. This platform connects job seekers with employers and provides admin analytics for monitoring platform activity.

## 📋 Project Overview

The Job Portal Backend is a RESTful API built with Node.js, Express, and TypeScript, designed to support a modern job marketplace platform.

### Key Capabilities
- Job seekers can browse and apply for jobs
- Employers can create and manage job postings  
- Applications are tracked with status updates
- Admins can monitor activity and generate reports
- Secure authentication and role-based access control

## 👥 Team Members

- **Patrick Niyigena**
- **Polycarpe Tuyishime** 
- **Teta Huguette**
- **Tresor Mugisha**

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer / Cloudinary (for resumes and profiles)
- **API Style**: REST

## 📂 Project Structure

```
src/
├── config/          # Database & app configuration
├── controllers/     # Business logic
├── middleware/      # Auth, roles, error handling
├── models/          # Database schemas
├── routes/          # API routes
├── services/        # External services
├── utils/           # Helpers & utilities
└── server.ts        # Server entry point
```

## 🗄️ Core Models

### User (Job Seeker)
- FirstName
- LastName
- UserName
- Age
- PhoneNumber
- password (hashed)
- UserType (Employer | Applicant)
- resetPasswordToken
- resetPasswordExpires
- createdAt

### Employer
- companyName
- email
- password
- companyInfo
- verified
- createdAt

### Job
- title
- description
- requirements
- category
- location
- deadline
- employerId
- viewsCount
- applicationsCount
- createdAt

### Application
- userId
- jobId
- resume
- status (pending | reviewed | accepted | rejected)
- submissionDate

## 🔐 Authentication & Roles

The system uses JWT-based authentication with role-based access control:

- **Job Seeker (Applicant)**: Browse & apply for jobs
- **Employer**: Manage job postings & applications
- **Admin**: Manage users, employers, and analytics

## 🚀 API Endpoints Overview

### Authentication
- `POST /api/auth/user/register` - Register job seeker
- `POST /api/auth/user/login` - Login job seeker
- `POST /api/auth/employer/register` - Register employer
- `POST /api/auth/employer/login` - Login employer

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (Employer only)
- `PUT /api/jobs/:id` - Update job (Employer only)
- `DELETE /api/jobs/:id` - Delete job (Employer only)

### Applications
- `POST /api/applications/:jobId` - Apply for job
- `GET /api/applications/user` - Get user applications
- `GET /api/applications/job/:jobId` - Get job applications
- `PATCH /api/applications/:id/status` - Update application status

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/employers` - Get all employers
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/reports/most-viewed` - Get most viewed jobs

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/tresormugisha05/Job-Portal_Back.git
cd Job-Portal_Back
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/job_portal
JWT_SECRET=your_jwt_secret_here
```

### 4. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📊 Non-Functional Requirements

- API response time ≤ 3 seconds
- Supports 500+ concurrent users
- Secure password encryption with bcrypt
- Role-based access control
- Input validation and sanitization
- Error handling and logging

## 🔮 Future Enhancements

- AI-powered job recommendations
- Push & email notifications
- Employer premium subscriptions
- Mobile application support
- Advanced analytics dashboard
- Real-time chat between employers and applicants
- Job matching algorithm

## 📝 Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm test         # Run tests
```

## 🤝 Contributing

Each team member is responsible for specific modules. Please follow these guidelines:

1. Follow TypeScript best practices
2. Write clean, readable code
3. Use meaningful commit messages
4. Test your code before pushing
5. Document your API endpoints

## 📄 License

This project is developed for academic and learning purposes.

## 🚀 Getting Started

1. Make sure you have Node.js (v18+) and MongoDB installed
2. Follow the setup instructions above
3. The API will be available at `http://localhost:3000`
4. Use tools like Postman or Thunder Client to test endpoints

Happy coding! 🎉