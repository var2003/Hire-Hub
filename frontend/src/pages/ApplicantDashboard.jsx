import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ApplicationCard from '../components/ApplicationCard';
import Toast from '../components/Toast';
import { FileText, CheckCircle2, Clock, Award, Search, User } from 'lucide-react';

const ApplicantDashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my-applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await api.delete(`/applications/${applicationId}`);
      setToast({ message: 'Application withdrawn', type: 'success' });
      setApplications(prev => prev.filter(app => app._id !== applicationId));
    } catch (err) {
      setToast({ message: 'Failed to withdraw application', type: 'error' });
    }
  };

  // Compute summary stats
  const totalApps = applications.length;
  const inReview = applications.filter(a => a.status === 'Reviewing' || a.status === 'Applied').length;
  const shortlisted = applications.filter(a => a.status === 'Shortlisted').length;
  const accepted = applications.filter(a => a.status === 'Accepted').length;

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Track all your active job applications and recruiters' feedback in one place.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/profile" className="btn btn-secondary">
            <User size={16} /> Edit My Profile
          </Link>
          <Link to="/" className="btn btn-primary">
            <Search size={16} /> Browse New Jobs
          </Link>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid-stats" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <FileText size={24} color="#818cf8" style={{ marginBottom: '0.3rem' }} />
          <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white' }}>{totalApps}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Applications</span>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Clock size={24} color="#fcd34d" style={{ marginBottom: '0.3rem' }} />
          <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white' }}>{inReview}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending / In Review</span>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <CheckCircle2 size={24} color="#67e8f9" style={{ marginBottom: '0.3rem' }} />
          <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white' }}>{shortlisted}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Shortlisted</span>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Award size={24} color="#6ee7b7" style={{ marginBottom: '0.3rem' }} />
          <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white' }}>{accepted}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Offers Accepted</span>
        </div>
      </div>

      {/* Applications List */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          My Job Applications
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading your applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <h3>No applications submitted yet.</h3>
            <p style={{ margin: '0.5rem 0 1.5rem 0' }}>Discover tech jobs matching your skills and start applying today!</p>
            <Link to="/" className="btn btn-primary">
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          <div>
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onWithdraw={handleWithdraw}
              />
            ))}
          </div>
        )}
      </div>

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

export default ApplicantDashboard;
