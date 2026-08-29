# Hire-Hub — Two Role Job Portal System

Hire-Hub is a modern full-stack web application designed to connect job seekers (**Applicants**) with hiring managers (**Recruiters**). Built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with JWT authentication and role-based authorization.

---

## 🚀 How to Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` (packaged with Node.js)

---

### 1️⃣ Start the Backend API Server

Open a terminal and execute:

```bash
cd backend
npm install
npm start
```

- **Server URL**: `http://localhost:5000`
- **Database**: Automatically connects to local MongoDB or initializes an in-memory database (`mongodb-memory-server`) with demo seed data!

---

### 2️⃣ Start the Frontend React App

Open a second terminal window and execute:

```bash
cd frontend
npm install
npm run dev
```

- **Web App URL**: `http://localhost:5173`

---

## 🔐 Demo Credentials (Auto-Populated)

You can instantly log in using pre-seeded test accounts or click the **"Quick Demo Credentials"** buttons on the login page:

| User Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Applicant** | `applicant@gmail.com` | `123456` | Browse jobs, apply with resume & pitch, track application status, edit profile & skills |
| **Recruiter** | `recruiter@techcorp.com` | `123456` | Post jobs, edit/delete listings, review applicants, update candidate hiring status & notes |

---

## ✨ Features Breakdown

### 💼 Applicant Features
1. **Register & Log In**: Role-selected authentication with secure JWT tokens.
2. **Search & Filter Jobs**: Filter listings by title, skills, keyword, location, job type (Full-time, Remote, Contract, etc.), and experience level.
3. **Job Details & Apply**: View full descriptions, required skills pills, salary ranges, and submit applications with resume URLs and cover letters.
4. **Application Tracking**: Monitor real-time status updates (`Applied`, `Reviewing`, `Shortlisted`, `Rejected`, `Accepted`) and view recruiter notes.
5. **Candidate Profile**: Manage skills, work experience history, education details, and portfolio links.

### 🏢 Recruiter Features
1. **Recruiter Portal**: Overview dashboard displaying posted job counts and total applicant submissions.
2. **Post & Edit Jobs**: Create detailed job listings with company info, salary ranges, deadlines, required skills, and job types.
3. **Applicant Review**: Accordion view for each posting to review candidate profiles, skills, cover notes, and attached resumes.
4. **Hiring Workflow**: Single-click status updates (`Reviewing`, `Shortlisted`, `Accepted`, `Rejected`) with feedback notes.
5. **Job Lifecycle**: Edit active job details or delete postings along with associated application records.

---

## 📁 Project Directory Structure

```text
major-hire-hub/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & memory server fallback
│   ├── controllers/
│   │   ├── applicationController.js # Application logic
│   │   ├── authController.js        # Authentication & profile management
│   │   └── jobController.js         # Job CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT protection middleware
│   │   ├── errorMiddleware.js       # Express error handler
│   │   └── roleMiddleware.js        # Role-based authorization guard
│   ├── models/
│   │   ├── Application.js           # Schema for job applications
│   │   ├── Job.js                   # Schema for job postings
│   │   └── User.js                  # Schema for users & roles
│   ├── routes/
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   ├── utils/
│   │   └── seeder.js                # Auto-seeder for demo users & postings
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── server.js                    # Express app entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Navbar, Footer, JobCard, Modals, Toast
│   │   ├── context/                 # AuthContext (state, login, register, profile)
│   │   ├── pages/                   # Home, JobDetails, Dashboards, Post/Edit Job, Profile
│   │   ├── services/                # Axios API client
│   │   ├── styles/                  # Glassmorphism dark mode CSS rules
│   │   ├── App.jsx                  # React Router configuration
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```
