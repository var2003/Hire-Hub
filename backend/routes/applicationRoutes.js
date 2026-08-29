const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getApplicantApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('applicant'), applyForJob);
router.get('/my-applications', protect, authorize('applicant'), getApplicantApplications);
router.delete('/:id', protect, authorize('applicant'), withdrawApplication);

router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
