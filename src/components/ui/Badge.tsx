import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'teal' | 'mint' | 'muted';
  className?: string;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'muted', className = '', icon }) => {
  const variantClasses = {
    blue: 'bg-blue-500/20 text-blue-900 ring-blue-500/30',
    teal: 'bg-teal-400/20 text-blue-900 ring-teal-400/30',
    mint: 'bg-mint-400/20 text-blue-900 ring-mint-400/30',
    muted: 'bg-muted text-subtext ring-subtext/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
