import React from 'react';
import { Briefcase, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(11, 15, 25, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '2.5rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Briefcase size={20} color="#6366f1" />
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>Hire-Hub</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>— Two Role Job Portal System</span>
        </div>

        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>Crafted with</span>
          <Heart size={14} color="#ec4899" fill="#ec4899" />
          <span>using Node.js, Express, MongoDB & React</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
