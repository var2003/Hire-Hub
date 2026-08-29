import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Briefcase, Building, MapPin, DollarSign, Calendar, ArrowLeft, Send } from 'lucide-react';

const PostJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    companyName: user?.companyName || '',
    description: '',
    requiredSkills: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Mid Level',
    salary: '',
    deadline: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/jobs', formData);
      setToast({ message: 'Job posted successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/recruiter-dashboard');
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to post job';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem', gap: '0.4rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="glass-card fade-in" style={{ padding: '2.5rem' }}>
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Post a New <span className="gradient-text">Job Opportunity</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Fill in the details below to attract top applicants.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label><Briefcase size={14} style={{ display: 'inline', marginRight: '4px' }} /> Job Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Senior Full Stack Engineer"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label><Building size={14} style={{ display: 'inline', marginRight: '4px' }} /> Company Name</label>
              <input
                type="text"
                name="companyName"
                className="form-input"
                placeholder="e.g. TechCorp Global"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. San Francisco, CA or Remote"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label><DollarSign size={14} style={{ display: 'inline', marginRight: '4px' }} /> Salary Range</label>
              <input
                type="text"
                name="salary"
                className="form-input"
                placeholder="e.g. $100,000 - $130,000 / year"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label>Job Type</label>
              <select name="jobType" className="form-select" value={formData.jobType} onChange={handleChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select name="experienceLevel" className="form-select" value={formData.experienceLevel} onChange={handleChange}>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div className="form-group">
              <label><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Application Deadline</label>
              <input
                type="date"
                name="deadline"
                className="form-input"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Required Skills (comma separated)</label>
            <input
              type="text"
              name="requiredSkills"
              className="form-input"
              placeholder="e.g. React, Node.js, Express, MongoDB, TypeScript"
              value={formData.requiredSkills}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Detailed Job Description & Requirements</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="6"
              placeholder="Describe role responsibilities, team culture, expected deliverables, and perks..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              <Send size={16} />
              <span>{submitting ? 'Posting...' : 'Publish Job Posting'}</span>
            </button>
          </div>
        </form>
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

export default PostJob;
