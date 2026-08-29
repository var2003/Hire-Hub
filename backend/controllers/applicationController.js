const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Applicant only)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    if (job.status === 'closed') {
      return res.status(400).json({ message: 'This job posting is closed for applications' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeUrl: resumeUrl || req.user.resumeUrl || '',
      coverLetter: coverLetter || ''
    });

    const populatedApp = await Application.findById(application._id).populate('job');

    res.status(201).json(populatedApp);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by applicant
// @route   GET /api/applications/my-applications
// @access  Private (Applicant only)
const getApplicantApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'recruiter', select: 'name email companyName' }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job (Recruiter)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email headline bio location skills experience education resumeUrl')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status & recruiter notes
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify recruiter owns the job
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update status for this job application' });
    }

    if (status) application.status = status;
    if (notes !== undefined) application.notes = notes;

    const updatedApp = await application.save();

    const result = await Application.findById(updatedApp._id)
      .populate('applicant', 'name email headline bio skills resumeUrl')
      .populate('job', 'title companyName');

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Applicant only)
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    await application.deleteOne();
    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getApplicantApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication
};
