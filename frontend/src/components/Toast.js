import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`} onClick={onClose}>
      <span>{type === 'success' ? '\u2713' : '\u2717'}</span>
      {message}
    </div>
  );
}
