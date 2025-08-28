import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'blue' | 'teal' | 'mint' | 'muted' | 'outline' | 'secondary';
  className?: string;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'muted', className = '', icon, ...rest }) => {
  const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
    blue: 'bg-blue-500/20 text-blue-900 ring-blue-500/30',
    teal: 'bg-teal-400/20 text-blue-900 ring-teal-400/30',
    mint: 'bg-mint-400/20 text-blue-900 ring-mint-400/30',
    muted: 'bg-muted text-subtext ring-subtext/20',
    outline: 'bg-transparent text-[var(--text)] ring-1 ring-inset ring-[var(--ring)]',
    secondary: 'bg-[var(--secondary)] text-[var(--secondary-ink)]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
export { Badge };
