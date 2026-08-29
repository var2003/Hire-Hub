const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a job description']
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please add required skills']
    },
    location: {
      type: String,
      required: [true, 'Please add job location']
    },
    jobType: {
      type: String,
      required: [true, 'Please specify job type'],
      enum: ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']
    },
    experienceLevel: {
      type: String,
      required: [true, 'Please specify experience level'],
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
      default: 'Mid Level'
    },
    salary: {
      type: String,
      required: [true, 'Please specify salary range']
    },
    postedDate: {
      type: Date,
      default: Date.now
    },
    deadline: {
      type: Date,
      required: [true, 'Please specify application deadline']
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Job', JobSchema);
