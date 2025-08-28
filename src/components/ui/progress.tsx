import React from 'react';

export const Progress: React.FC<{ value?: number; className?: string }> = ({ value = 0, className = '' }) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full bg-[var(--muted)] rounded-full overflow-hidden ${className}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped} role="progressbar">
      <div className="h-full bg-[var(--primary)]" style={{ width: `${clamped}%` }} />
    </div>
  );
};
