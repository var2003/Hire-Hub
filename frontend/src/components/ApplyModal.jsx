import React, { useState } from 'react';
import { X, Send, Link, FileText } from 'lucide-react';

const ApplyModal = ({ job, user, isOpen, onClose, onSubmit, submitting }) => {
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [coverLetter, setCoverLetter] = useState('');

  if (!isOpen || !job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ jobId: job._id, resumeUrl, coverLetter });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Apply for {job.title}</h3>
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>{job.companyName}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FileText size={14} style={{ display: 'inline', marginRight: '4px' }} /> Applicant Name</label>
            <input type="text" className="form-input" value={user?.name || ''} disabled style={{ opacity: 0.7 }} />
          </div>

          <div className="form-group">
            <label><Link size={14} style={{ display: 'inline', marginRight: '4px' }} /> Resume URL / Document Link</label>
            <input
              type="url"
              className="form-input"
              placeholder="e.g. https://drive.google.com/your-resume or https://github.com/resume.pdf"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Provide a direct link to your PDF resume, Google Drive, or portfolio.
            </span>
          </div>

          <div className="form-group">
            <label>Cover Letter / Pitch</label>
            <textarea
              className="form-textarea"
              rows="5"
              placeholder="Explain why you are a great fit for this role and highlight your relevant experience..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Send size={16} />
              <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
