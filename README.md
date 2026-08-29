# 🚀 Hire-Hub — Two-Role Job Portal System

Hire-Hub is a full-stack job portal designed to connect **Applicants** with **Recruiters** through a role-based hiring platform. The system provides separate workflows for candidates and recruiters, allowing applicants to discover opportunities and track their applications while recruiters can create job postings, review candidates, and manage the hiring process.

The application is built using the **MERN stack — MongoDB, Express.js, React.js, and Node.js** with **JWT-based authentication and role-based authorization**.

---

## 🎯 Project Goal

The main goal of Hire-Hub is to simplify the recruitment workflow by bringing job discovery, applications, candidate profiles, and recruiter management into a single platform.

Instead of handling recruitment activities manually, the system provides separate dashboards and workflows for applicants and recruiters.

---

## 👥 Two-Role Architecture

### 👨‍💼 Applicant

Applicants can:

- Create an account and securely log in
- Search and filter available jobs
- View complete job descriptions
- Apply for jobs
- Submit resume links and cover letters
- Track application progress
- Manage skills and work experience
- Maintain education and portfolio information
- View recruiter feedback and hiring notes

### 🏢 Recruiter

Recruiters can:

- Create and manage recruiter accounts
- View recruitment statistics
- Create new job postings
- Edit existing job postings
- Delete job postings
- View applicants for individual jobs
- Review candidate profiles and skills
- View submitted resumes
- Update candidate hiring status
- Add feedback/notes during the hiring process

---

## 🔄 Application Workflow

```text
Applicant
   │
   ├── Register / Login
   │
   ├── Search Jobs
   │
   ├── View Job Details
   │
   ├── Submit Application
   │
   └── Track Application
           │
           ▼
       Recruiter
           │
           ├── Create Job
           ├── View Applicants
           ├── Review Candidate
           ├── Update Status
           └── Add Hiring Notes
