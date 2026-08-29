import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { LogIn, Mail, Lock, UserCheck, Briefcase, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const user = await login(email, password);
      setToast({ message: `Welcome back, ${user.name}!`, type: 'success' });
      setTimeout(() => {
        if (user.role === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else {
          navigate('/applicant-dashboard');
        }
      }, 800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      setSubmitting(true);
      const user = await login(demoEmail, demoPassword);
      setToast({ message: `Logged in as ${user.name} (${user.role})!`, type: 'success' });
      setTimeout(() => {
        if (user.role === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else {
          navigate('/applicant-dashboard');
        }
      }, 800);
    } catch (err) {
      setToast({ message: 'Quick demo login failed', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div className="glass-card fade-in" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            <LogIn size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to your Hire-Hub account</p>
        </div>

        {/* Demo Quick Logins */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
            <Zap size={14} color="#f59e0b" /> Quick Demo Credentials
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('applicant@gmail.com', '123456')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              <UserCheck size={16} /> Sign In as Applicant (Alex Rivera)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('recruiter@techcorp.com', '123456')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'flex-start', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.3)' }}
            >
              <Briefcase size={16} /> Sign In as Recruiter (Sarah Connor)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
            <LogIn size={18} />
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Create Account
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

export default Login;
