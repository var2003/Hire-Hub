import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Calendar, Building, Clock } from 'lucide-react';

const JobCard = ({ job, isRecruiter, onDelete, onEdit }) => {
  const formattedDate = new Date(job.createdAt || job.postedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedDeadline = job.deadline ? new Date(job.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : null;

  return (
    <div className="glass-card fade-in" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      gap: '1.25rem'
    }}>
      <div>
        {/* Top bar: Company & Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.2rem' }}>
              <Building size={16} />
              <span>{job.companyName}</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', lineHeight: '1.3' }}>
              {job.title}
            </h3>
          </div>
          <span className={`badge ${job.jobType === 'Full-time' ? 'badge-primary' : job.jobType === 'Remote' ? 'badge-cyan' : 'badge-amber'}`}>
            {job.jobType}
          </span>
        </div>

        {/* Job metadata details */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={14} color="#38bdf8" />
            <span>{job.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <DollarSign size={14} color="#34d399" />
            <span>{job.salary}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Briefcase size={14} color="#f472b6" />
            <span>{job.experienceLevel}</span>
          </div>
        </div>

        {/* Short description preview */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.25rem' }}>
          {job.description}
        </p>

        {/* Skills pill list */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {job.requiredSkills && job.requiredSkills.map((skill, idx) => (
            <span key={idx} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--text-main)',
              fontSize: '0.75rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        paddingTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        marginTop: '0.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          <span>Posted: {formattedDate}</span>
          {formattedDeadline && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b' }}>
              <Clock size={12} /> Deadline: {formattedDeadline}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isRecruiter ? (
            <>
              <button onClick={() => onEdit(job)} className="btn btn-secondary btn-sm">
                Edit
              </button>
              <button onClick={() => onDelete(job._id)} className="btn btn-danger btn-sm">
                Delete
              </button>
            </>
          ) : (
            <Link to={`/job/${job._id}`} className="btn btn-primary btn-sm">
              View Details & Apply
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
