import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import { ArrowLeft, Save, Briefcase, Building, MapPin, DollarSign, Calendar } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    requiredSkills: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Mid Level',
    salary: '',
    deadline: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        const job = res.data;

        setFormData({
          title: job.title || '',
          companyName: job.companyName || '',
          description: job.description || '',
          requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : job.requiredSkills || '',
          location: job.location || '',
          jobType: job.jobType || 'Full-time',
          experienceLevel: job.experienceLevel || 'Mid Level',
          salary: job.salary || '',
          deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
          status: job.status || 'active'
        });
      } catch (err) {
        setToast({ message: 'Failed to load job details', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.put(`/jobs/${id}`, formData);
      setToast({ message: 'Job updated successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/recruiter-dashboard');
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update job';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading job details...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem', gap: '0.4rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="glass-card fade-in" style={{ padding: '2.5rem' }}>
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Edit Job <span className="gradient-text">Posting</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Update details for "{formData.title}"</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label><Briefcase size={14} style={{ display: 'inline', marginRight: '4px' }} /> Job Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
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
              <label>Posting Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
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

          <div className="form-group">
            <label>Required Skills (comma separated)</label>
            <input
              type="text"
              name="requiredSkills"
              className="form-input"
              value={formData.requiredSkills}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Detailed Job Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="6"
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
              <Save size={16} />
              <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
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

export default EditJob;
