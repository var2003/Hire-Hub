import React from 'react';
import { Building, MapPin, Calendar, FileText, CheckCircle2, Clock, XCircle, AlertCircle, Award } from 'lucide-react';

const ApplicationCard = ({ application, onWithdraw }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return <span className="badge badge-emerald"><Award size={14} /> Accepted</span>;
      case 'Shortlisted':
        return <span className="badge badge-cyan"><CheckCircle2 size={14} /> Shortlisted</span>;
      case 'Reviewing':
        return <span className="badge badge-amber"><Clock size={14} /> Under Review</span>;
      case 'Rejected':
        return <span className="badge badge-rose"><XCircle size={14} /> Rejected</span>;
      default:
        return <span className="badge badge-primary"><AlertCircle size={14} /> Applied</span>;
    }
  };

  const job = application.job || {};

  return (
    <div className="glass-card fade-in" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem' }}>
            <Building size={16} />
            <span>{job.companyName || 'Company'}</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginTop: '0.2rem' }}>
            {job.title || 'Job Title'}
          </h3>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={13} /> {job.location || 'Location'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={13} /> Applied on {new Date(application.appliedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          {getStatusBadge(application.status)}
        </div>
      </div>

      {/* Cover Letter preview */}
      {application.coverLetter && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          borderLeft: '3px solid var(--primary)'
        }}>
          <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>Cover Note:</strong>
          {application.coverLetter}
        </div>
      )}

      {/* Recruiter Feedback Notes if any */}
      {application.notes && (
        <div style={{
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          fontSize: '0.88rem',
          color: '#a5f3fc',
          marginBottom: '1rem'
        }}>
          <strong style={{ display: 'block', marginBottom: '0.2rem' }}>💬 Recruiter Feedback:</strong>
          {application.notes}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.85rem' }}>
        {application.resumeUrl ? (
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
          >
            <FileText size={14} /> Attached Resume Link
          </a>
        ) : <span />}

        {onWithdraw && (
          <button onClick={() => onWithdraw(application._id)} className="btn btn-danger btn-sm">
            Withdraw Application
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
