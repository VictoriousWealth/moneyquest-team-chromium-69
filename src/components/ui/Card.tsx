
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
export { Card };

export const CardHeader: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`p-4 border-b border-[var(--ring)] ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = '', children }) => (
  <h3 className={`text-base font-semibold ${className}`}>{children}</h3>
);

export const CardContent: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
