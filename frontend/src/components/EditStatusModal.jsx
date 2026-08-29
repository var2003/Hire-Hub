import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

const EditStatusModal = ({ application, isOpen, onClose, onSave, saving }) => {
  const [status, setStatus] = useState(application?.status || 'Applied');
  const [notes, setNotes] = useState(application?.notes || '');

  if (!isOpen || !application) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(application._id, { status, notes });
  };

  const applicant = application.applicant || {};

  return (
    <div className="modal-backdrop">
      <div className="modal-content fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Review Applicant</h3>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{applicant.name || 'Candidate'}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Application Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Applied">Applied</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Accepted">Accepted</option>
            </select>
          </div>

          <div className="form-group">
            <label>Recruiter Notes / Feedback for Candidate</label>
            <textarea
              className="form-textarea"
              rows="4"
              placeholder="e.g. Scheduled for technical interview on Friday at 2 PM, or feedback on skills..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <CheckCircle size={16} />
              <span>{saving ? 'Updating...' : 'Update Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStatusModal;
