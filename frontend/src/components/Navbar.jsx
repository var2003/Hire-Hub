import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, User, LogOut, PlusCircle, Search, LayoutDashboard, FileText } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isApplicant, isRecruiter } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            padding: '0.55rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Briefcase size={22} color="white" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>
              Hire<span className="gradient-text">Hub</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Two-Role Job Portal
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
            <Search size={16} />
            <span>Browse Jobs</span>
          </Link>

          {user ? (
            <>
              {isRecruiter && (
                <>
                  <Link to="/recruiter-dashboard" className="btn btn-secondary btn-sm">
                    <LayoutDashboard size={16} />
                    <span>My Postings</span>
                  </Link>
                  <Link to="/post-job" className="btn btn-primary btn-sm">
                    <PlusCircle size={16} />
                    <span>Post a Job</span>
                  </Link>
                </>
              )}

              {isApplicant && (
                <Link to="/applicant-dashboard" className="btn btn-secondary btn-sm">
                  <FileText size={16} />
                  <span>My Applications</span>
                </Link>
              )}

              <Link to="/profile" className="btn btn-secondary btn-sm" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <User size={16} />
                <span>{user.name}</span>
                <span className={`badge ${isRecruiter ? 'badge-amber' : 'badge-emerald'}`} style={{ marginLeft: '0.3rem', fontSize: '0.68rem' }}>
                  {user.role}
                </span>
              </Link>

              <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Log Out">
                <LogOut size={16} />
                <span>Exit</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
