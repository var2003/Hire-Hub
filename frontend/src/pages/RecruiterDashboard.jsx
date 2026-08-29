import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import EditStatusModal from '../components/EditStatusModal';
import Toast from '../components/Toast';
import { PlusCircle, Users, Briefcase, FileText, CheckCircle, ExternalLink, Trash2, Edit3, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Expanded job state to view applicants
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [jobApplications, setJobApplications] = useState({});
  const [loadingApps, setLoadingApps] = useState(false);

  // Status edit modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const [toast, setToast] = useState(null);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/recruiter/my-jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const toggleApplicants = async (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }

    setExpandedJobId(jobId);
    if (!jobApplications[jobId]) {
      try {
        setLoadingApps(true);
        const res = await api.get(`/applications/job/${jobId}`);
        setJobApplications(prev => ({ ...prev, [jobId]: res.data }));
      } catch (err) {
        console.error('Error loading applicants:', err);
        setToast({ message: 'Failed to load applicants for job', type: 'error' });
      } finally {
        setLoadingApps(false);
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting and all applicant records?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      setToast({ message: 'Job posting deleted', type: 'success' });
      setJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) {
      setToast({ message: 'Failed to delete job', type: 'error' });
    }
  };

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async (appId, { status, notes }) => {
    try {
      setSavingStatus(true);
      const res = await api.put(`/applications/${appId}/status`, { status, notes });
      setToast({ message: 'Applicant status updated!', type: 'success' });
      
      // Update local state
      const updatedApp = res.data;
      setJobApplications(prev => {
        const jobId = updatedApp.job?._id || expandedJobId;
        const currentList = prev[jobId] || [];
        return {
          ...prev,
          [jobId]: currentList.map(a => a._id === appId ? updatedApp : a)
        };
      });
      setIsStatusModalOpen(false);
    } catch (err) {
      setToast({ message: 'Failed to update status', type: 'error' });
    } finally {
      setSavingStatus(false);
    }
  };

  // Compute stats
  const totalJobs = jobs.length;
  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicantCount || 0), 0);

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Recruiter Portal — <span className="gradient-text">{user?.companyName || user?.name}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your active job postings, review applicants, and update hiring statuses.</p>
        </div>

        <Link to="/post-job" className="btn btn-primary">
          <PlusCircle size={18} /> Post New Job
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid-stats" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Briefcase size={24} color="#818cf8" style={{ marginBottom: '0.3rem' }} />
          <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white' }}>{totalJobs}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Posted Jobs</span>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Users size={24} color="#38bdf8" style={{ marginBottom: '0.3rem' }} />
          <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white' }}>{totalApplicants}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Applications Received</span>
        </div>
      </div>

      {/* Posted Jobs List */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Your Job Postings
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading your job postings...
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <h3>No job postings yet.</h3>
            <p style={{ margin: '0.5rem 0 1.5rem 0' }}>Post a position to start receiving applications from top tech talent.</p>
            <Link to="/post-job" className="btn btn-primary">
              <PlusCircle size={16} /> Post Your First Job
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {jobs.map((job) => {
              const isExpanded = expandedJobId === job._id;
              const apps = jobApplications[job._id] || [];

              return (
                <div key={job._id} className="glass-card fade-in" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span className="badge badge-primary">{job.jobType}</span>
                        <span className="badge badge-cyan">{job.experienceLevel}</span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
                        {job.title}
                      </h3>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        📍 {job.location} | 💰 {job.salary} | Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        onClick={() => toggleApplicants(job._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.4rem', border: isExpanded ? '1px solid var(--primary)' : undefined }}
                      >
                        <Users size={16} color="#38bdf8" />
                        <span>Applicants ({job.applicantCount || 0})</span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      <button onClick={() => navigate(`/edit-job/${job._id}`)} className="btn btn-secondary btn-sm" title="Edit Job">
                        <Edit3 size={15} /> Edit
                      </button>

                      <button onClick={() => handleDeleteJob(job._id)} className="btn btn-danger btn-sm" title="Delete Job">
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Applicants Accordion Drawer */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '1.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <UserCheck size={18} color="var(--primary)" />
                        Applicants for "{job.title}"
                      </h4>

                      {loadingApps ? (
                        <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>Loading applicant details...</div>
                      ) : apps.length === 0 ? (
                        <div style={{ padding: '1rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                          No applications submitted for this job posting yet.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {apps.map((app) => {
                            const applicant = app.applicant || {};
                            return (
                              <div key={app._id} style={{
                                background: 'rgba(15, 23, 42, 0.7)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '10px',
                                padding: '1.25rem'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                  <div>
                                    <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                                      {applicant.name || 'Applicant'}
                                    </h5>
                                    <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>
                                      {applicant.headline || applicant.email}
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="badge badge-primary">{app.status}</span>
                                    <button onClick={() => handleOpenStatusModal(app)} className="btn btn-secondary btn-sm">
                                      <CheckCircle size={14} /> Update Status
                                    </button>
                                  </div>
                                </div>

                                {/* Skills list */}
                                {applicant.skills && applicant.skills.length > 0 && (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                                    {applicant.skills.map((s, i) => (
                                      <span key={i} style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Cover letter */}
                                {app.coverLetter && (
                                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '0.65rem 0.85rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                                    💬 <em>"{app.coverLetter}"</em>
                                  </p>
                                )}

                                {/* Footer link */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                                  <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                                  {(app.resumeUrl || applicant.resumeUrl) && (
                                    <a
                                      href={app.resumeUrl || applicant.resumeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}
                                    >
                                      <ExternalLink size={13} /> View Resume / Portfolio
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EditStatusModal
        application={selectedApp}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSave={handleSaveStatus}
        saving={savingStatus}
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

export default RecruiterDashboard;
