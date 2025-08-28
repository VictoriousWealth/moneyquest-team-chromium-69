
import React from 'react';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-surface rounded-xl shadow-soft ring-1 ring-[var(--ring)] ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
