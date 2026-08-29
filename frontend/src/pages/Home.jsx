import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import Toast from '../components/Toast';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, Filter, Briefcase, Users, Building, Sparkles } from 'lucide-react';

const Home = () => {
  const { user, isApplicant } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');

  // Modal & Toast state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (jobType !== 'All') params.jobType = jobType;
      if (experienceLevel !== 'All') params.experienceLevel = experienceLevel;

      const res = await api.get('/jobs', { params });
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApplyClick = (job) => {
    if (!user) {
      setToast({ message: 'Please sign in as an Applicant to apply for jobs.', type: 'error' });
      return;
    }
    if (!isApplicant) {
      setToast({ message: 'Only Applicant accounts can submit job applications.', type: 'error' });
      return;
    }
    setSelectedJob(job);
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

  return (
    <div>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '3rem 1rem 4rem 1rem', position: 'relative' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '999px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#a5b4fc',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} color="#818cf8" />
          <span>Next-Generation Two-Role Recruitment Platform</span>
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: '1.15', marginBottom: '1rem' }}>
          Connect <span className="gradient-text">Talent</span> with <span className="gradient-text-cyan">Opportunity</span>
        </h1>
        
        <p style={{ maxWidth: '650px', margin: '0 auto 2.5rem auto', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Hire-Hub simplifies technical recruitment for Applicants and Recruiters. Explore thousands of active listings or post positions instantly.
        </p>

        {/* Quick Demo Credentials Info Banner */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 3rem auto',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-accent)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.88rem'
        }}>
          <div>
            <strong style={{ color: '#6ee7b7', display: 'block' }}>Applicant Demo Account:</strong>
            <span style={{ color: 'var(--text-muted)' }}>Email: <code>applicant@gmail.com</code> | Pass: <code>123456</code></span>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', height: '30px', display: 'none' }} />
          <div>
            <strong style={{ color: '#fcd34d', display: 'block' }}>Recruiter Demo Account:</strong>
            <span style={{ color: 'var(--text-muted)' }}>Email: <code>recruiter@techcorp.com</code> | Pass: <code>123456</code></span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearchSubmit} className="glass-card" style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Job title, skill, or keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <MapPin size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Location or Remote..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <select className="form-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="All">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <select className="form-select" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
              <option value="All">All Experience Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
            <Filter size={16} />
            <span>Search Jobs</span>
          </button>
        </form>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid-stats" style={{ marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Briefcase size={28} color="#818cf8" style={{ marginBottom: '0.4rem' }} />
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{jobs.length}+</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Job Postings</span>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Building size={28} color="#38bdf8" style={{ marginBottom: '0.4rem' }} />
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>120+</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Verified Hiring Companies</span>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Users size={28} color="#34d399" style={{ marginBottom: '0.4rem' }} />
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>1,400+</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Registered Candidates</span>
        </div>
      </div>

      {/* Job Postings Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={22} color="var(--primary)" />
          <span>Explore Open Positions</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
            ({jobs.length} jobs available)
          </span>
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading job postings...
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <h3>No jobs found matching your criteria.</h3>
            <p style={{ marginTop: '0.5rem' }}>Try broadening your search keywords or resetting filters.</p>
          </div>
        ) : (
          <div className="grid-2">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApplyClick={handleApplyClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <ApplyModal
        job={selectedJob}
        user={user}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplySubmit}
        submitting={submitting}
      />

      {/* Toast Notification */}
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

export default Home;
