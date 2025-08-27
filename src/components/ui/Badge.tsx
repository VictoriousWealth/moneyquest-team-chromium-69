import React from 'react';

type BadgeVariant = 'mint' | 'teal' | 'blue' | 'muted' | 'default' | 'secondary';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '', ...props }) => {
  const base = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
  
  const styles: Record<BadgeVariant, string> = {
    mint: 'bg-[var(--mint-400)]/10 text-[var(--mint-400)] ring-1 ring-inset ring-[var(--mint-400)]/20',
    teal: 'bg-[var(--teal-400)]/10 text-[var(--teal-400)] ring-1 ring-inset ring-[var(--teal-400)]/20',
    blue: 'bg-[var(--blue-500)]/10 text-[var(--blue-500)] ring-1 ring-inset ring-[var(--blue-500)]/20',
    muted: 'bg-[var(--muted)] text-[var(--subtext)]',
    default: 'bg-[var(--muted)] text-[var(--text)]',
    secondary: 'bg-[var(--muted)] text-[var(--subtext)]',
  };

  return (
    <span className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;