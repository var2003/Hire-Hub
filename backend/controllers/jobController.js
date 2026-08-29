const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs (with optional search & filters)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const { keyword, location, jobType, experienceLevel } = req.query;
    let query = { status: 'active' };

    if (keyword) {
      const regex = new RegExp(keyword, 'i');
      query.$or = [
        { title: regex },
        { companyName: regex },
        { description: regex },
        { requiredSkills: { $in: [regex] } }
      ];
    }

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (experienceLevel && experienceLevel !== 'All') {
      query.experienceLevel = experienceLevel;
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email companyName companyWebsite')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'recruiter',
      'name email companyName companyWebsite'
    );

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter only)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      companyName,
      description,
      requiredSkills,
      location,
      jobType,
      experienceLevel,
      salary,
      deadline
    } = req.body;

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : requiredSkills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

    const job = await Job.create({
      recruiter: req.user._id,
      title,
      companyName: companyName || req.user.companyName || 'Tech Company',
      description,
      requiredSkills: skillsArray,
      location,
      jobType,
      experienceLevel: experienceLevel || 'Mid Level',
      salary,
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only - Owner)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Make sure user owns job posting
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this job' });
    }

    const {
      title,
      companyName,
      description,
      requiredSkills,
      location,
      jobType,
      experienceLevel,
      salary,
      deadline,
      status
    } = req.body;

    if (title) job.title = title;
    if (companyName) job.companyName = companyName;
    if (description) job.description = description;
    if (requiredSkills) {
      job.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (salary) job.salary = salary;
    if (deadline) job.deadline = deadline;
    if (status) job.status = status;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only - Owner)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this job' });
    }

    // Delete related applications
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.json({ message: 'Job posting and associated applications removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's posted jobs
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter only)
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    
    // Attach application count to each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicantCount
        };
      })
    );

    res.json(jobsWithCounts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs
};
