
import React from 'react';

const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-surface rounded-xl shadow-soft ring-1 ring-[var(--ring)] ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
