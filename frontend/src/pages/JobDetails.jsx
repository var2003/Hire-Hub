import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';
import Toast from '../components/Toast';
import { Building, MapPin, DollarSign, Briefcase, Calendar, ArrowLeft, Send, CheckCircle2, ExternalLink } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isApplicant } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error('Error loading job details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    if (!user) {
      setToast({ message: 'Please sign in to apply.', type: 'error' });
      return;
    }
    if (!isApplicant) {
      setToast({ message: 'Only Applicant accounts can submit job applications.', type: 'error' });
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = async (applicationData) => {
    try {
      setSubmitting(true);
      await api.post('/applications', applicationData);
      setToast({ message: 'Application submitted successfully!', type: 'success' });
      setIsApplyModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading job posting details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Job posting not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem', gap: '0.4rem' }}>
        <ArrowLeft size={16} /> Back to Listings
      </button>

      <div className="glass-card fade-in" style={{ padding: '2.5rem' }}>
        {/* Header Header */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '1rem', marginBottom: '0.4rem' }}>
                <Building size={18} />
                <span>{job.companyName}</span>
                {job.recruiter?.companyWebsite && (
                  <a href={job.recruiter.companyWebsite} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
                {job.title}
              </h1>
            </div>

            <span className={`badge ${job.jobType === 'Full-time' ? 'badge-primary' : 'badge-cyan'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 0.9rem' }}>
              {job.jobType}
            </span>
          </div>

          {/* Quick info bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="#38bdf8" /> {job.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <DollarSign size={16} color="#34d399" /> {job.salary}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Briefcase size={16} color="#f472b6" /> {job.experienceLevel}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="#f59e0b" /> Deadline: {new Date(job.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Required Skills */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>
            Required Skills & Technologies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {job.requiredSkills && job.requiredSkills.map((skill, idx) => (
              <span key={idx} className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                <CheckCircle2 size={13} /> {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Job Description */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'white' }}>
            Job Description & Responsibilities
          </h3>
          <div style={{ color: 'var(--text-muted)', whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '1rem' }}>
            {job.description}
          </div>
        </div>

        {/* Apply CTA Section */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-accent)',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>Interested in this position?</h4>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Submit your resume and cover letter directly to the recruiter.</span>
          </div>

          <button onClick={handleApplyClick} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            <Send size={18} />
            <span>Apply Now</span>
          </button>
        </div>
      </div>

      <ApplyModal
        job={job}
        user={user}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplySubmit}
        submitting={submitting}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default JobDetails;
