import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { UserPlus, User, Mail, Lock, Building, Globe, UserCheck, Briefcase } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('applicant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    headline: '',
    companyName: '',
    companyWebsite: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const user = await register({ ...formData, role });
      setToast({ message: `Account created! Welcome, ${user.name}`, type: 'success' });
      setTimeout(() => {
        if (user.role === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else {
          navigate('/applicant-dashboard');
        }
      }, 800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '2rem auto' }}>
      <div className="glass-card fade-in" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <UserPlus size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Join Hire-Hub as an Applicant or Recruiter</p>
        </div>

        {/* Role Toggle Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0.35rem',
          borderRadius: '10px',
          marginBottom: '1.75rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => setRole('applicant')}
            style={{
              padding: '0.65rem',
              borderRadius: '8px',
              border: 'none',
              background: role === 'applicant' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
              color: role === 'applicant' ? 'white' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'var(--transition)'
            }}
          >
            <UserCheck size={16} /> Job Applicant
          </button>

          <button
            type="button"
            onClick={() => setRole('recruiter')}
            style={{
              padding: '0.65rem',
              borderRadius: '8px',
              border: 'none',
              background: role === 'recruiter' ? 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)' : 'transparent',
              color: role === 'recruiter' ? 'white' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'var(--transition)'
            }}
          >
            <Briefcase size={16} /> Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder={role === 'applicant' ? 'e.g. Alex Rivera' : 'e.g. Sarah Connor'}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Password (min 6 characters)</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          {role === 'applicant' ? (
            <div className="form-group">
              <label>Professional Title / Headline</label>
              <input
                type="text"
                name="headline"
                className="form-input"
                placeholder="e.g. Full Stack React & Node Developer"
                value={formData.headline}
                onChange={handleChange}
              />
            </div>
          ) : (
            <>
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

              <div className="form-group">
                <label><Globe size={14} style={{ display: 'inline', marginRight: '4px' }} /> Company Website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  className="form-input"
                  placeholder="https://company.example.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem' }}>
            <UserPlus size={18} />
            <span>{submitting ? 'Creating Account...' : `Register as ${role === 'applicant' ? 'Applicant' : 'Recruiter'}`}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
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

export default Register;
