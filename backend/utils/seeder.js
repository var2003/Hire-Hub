const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('Seeding initial demo data for Hire-Hub...');

    // Create Recruiters
    const hashedPassword = await bcrypt.hash('123456', 10);

    const recruiter1 = await User.create({
      name: 'Sarah Connor',
      email: 'recruiter@techcorp.com',
      password: hashedPassword,
      role: 'recruiter',
      headline: 'Tech Recruiter & Talent Lead',
      bio: 'Building top-tier engineering teams at TechCorp Global.',
      location: 'San Francisco, CA',
      companyName: 'TechCorp Global',
      companyWebsite: 'https://techcorp.example.com'
    });

    const recruiter2 = await User.create({
      name: 'Michael Scott',
      email: 'recruiter@innovate.io',
      password: hashedPassword,
      role: 'recruiter',
      headline: 'Head of People & Operations',
      bio: 'Empowering software leaders and product innovators.',
      location: 'New York, NY',
      companyName: 'Innovate Labs',
      companyWebsite: 'https://innovatelabs.example.com'
    });

    // Create Applicants
    const applicant1 = await User.create({
      name: 'Alex Rivera',
      email: 'applicant@gmail.com',
      password: hashedPassword,
      role: 'applicant',
      headline: 'Full Stack React & Node.js Developer',
      bio: 'Passionate MERN stack engineer with 3+ years building scalable cloud & web applications.',
      location: 'Austin, TX',
      skills: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Git'],
      experience: [
        {
          title: 'Frontend Developer',
          company: 'WebSphere Tech',
          duration: '2023 - Present',
          description: 'Developed high-performance single page applications using React and Redux Toolkit.'
        }
      ],
      education: [
        {
          degree: 'B.S. Computer Science',
          institution: 'University of Texas',
          year: '2022'
        }
      ],
      resumeUrl: 'https://github.com/alexrivera/resume.pdf'
    });

    const applicant2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@devhub.io',
      password: hashedPassword,
      role: 'applicant',
      headline: 'Senior Backend Engineer & Cloud Architect',
      bio: 'Specialized in microservices, distributed systems, Node.js, and MongoDB optimization.',
      location: 'Seattle, WA',
      skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript'],
      experience: [
        {
          title: 'Backend Engineer',
          company: 'CloudScale Solutions',
          duration: '2021 - 2024',
          description: 'Architected microservices handling over 5M daily requests.'
        }
      ],
      education: [
        {
          degree: 'M.S. Software Engineering',
          institution: 'UW Seattle',
          year: '2021'
        }
      ],
      resumeUrl: 'https://github.com/elenarostova/cv.pdf'
    });

    // Create Sample Jobs
    const job1 = await Job.create({
      recruiter: recruiter1._id,
      title: 'Senior Full Stack React / Node Engineer',
      companyName: 'TechCorp Global',
      description: 'We are seeking an experienced Full Stack Engineer proficient in React.js, Express, and MongoDB. You will design, build, and scale core features for our enterprise job management suite.',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'REST APIs'],
      location: 'San Francisco, CA (Hybrid)',
      jobType: 'Full-time',
      experienceLevel: 'Senior Level',
      salary: '$130,000 - $160,000 / year',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    const job2 = await Job.create({
      recruiter: recruiter1._id,
      title: 'Frontend UI/UX React Developer',
      companyName: 'TechCorp Global',
      description: 'Looking for a creative UI engineer to build modern, glassmorphic design systems, responsive layouts, and interactive component libraries using React and Tailwind CSS.',
      requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Figma'],
      location: 'Remote',
      jobType: 'Full-time',
      experienceLevel: 'Mid Level',
      salary: '$95,000 - $120,000 / year',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    const job3 = await Job.create({
      recruiter: recruiter2._id,
      title: 'Backend API Developer (Node.js & MongoDB)',
      companyName: 'Innovate Labs',
      description: 'Join Innovate Labs to build ultra-fast GraphQL and REST APIs using Express.js and MongoDB. Focus on authentication, security, caching, and database performance.',
      requiredSkills: ['Node.js', 'Express', 'MongoDB', 'JWT', 'REST API', 'Mongoose'],
      location: 'New York, NY',
      jobType: 'Contract',
      experienceLevel: 'Mid Level',
      salary: '$60 - $80 / hour',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    const job4 = await Job.create({
      recruiter: recruiter2._id,
      title: 'Junior Software Engineer Intern',
      companyName: 'Innovate Labs',
      description: 'Great entry-level opportunity for computer science graduates to work directly with senior engineers on web software, automated testing, and CI/CD pipelines.',
      requiredSkills: ['JavaScript', 'HTML', 'CSS', 'Git', 'Problem Solving'],
      location: 'Remote',
      jobType: 'Internship',
      experienceLevel: 'Entry Level',
      salary: '$30 - $40 / hour',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    // Create Sample Applications
    await Application.create({
      job: job1._id,
      applicant: applicant1._id,
      resumeUrl: applicant1.resumeUrl,
      coverLetter: 'I have 3+ years of MERN stack experience and would love to contribute to TechCorp Global.',
      status: 'Reviewing',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      notes: 'Strong candidate with impressive React experience.'
    });

    await Application.create({
      job: job3._id,
      applicant: applicant2._id,
      resumeUrl: applicant2.resumeUrl,
      coverLetter: 'Experienced backend specialist ready to take on API architecture challenges at Innovate Labs.',
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      notes: 'Scheduled initial technical screening interview.'
    });

    console.log('Seed completed successfully!');
    console.log('Demo Credentials created:');
    console.log('  Applicant: applicant@gmail.com / password: 123456');
    console.log('  Recruiter: recruiter@techcorp.com / password: 123456');
  } catch (error) {
    console.error('Error seeding demo data:', error.message);
  }
};

module.exports = seedData;
