import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast fade-in" style={{
      borderColor: type === 'error' ? '#f43f5e' : type === 'success' ? '#10b981' : '#6366f1'
    }}>
      {type === 'error' ? (
        <AlertTriangle size={18} color="#f43f5e" />
      ) : (
        <CheckCircle2 size={18} color="#10b981" />
      )}
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto' }}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
