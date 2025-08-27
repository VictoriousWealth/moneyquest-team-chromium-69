import React from 'react';

// @notes: Extended to support lg size used across the app

type Variant = 'primary' | 'accent' | 'muted' | 'outline' | 'ghost';
// Extend size to include 'lg'
type Size = 'default' | 'sm' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'default', fullWidth, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--blue-500)] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95';

  const styles: Record<Variant, string> = {
    primary: 'bg-[var(--primary)] text-[var(--primary-ink)] hover:brightness-110 shadow-soft',
    accent:  'bg-[var(--accent)] text-[var(--accent-ink)] ring-1 ring-inset ring-[#bde76d] hover:brightness-95',
    muted:   'bg-[var(--muted)] text-[var(--text)] hover:bg-opacity-80',
    outline: 'bg-transparent text-[var(--text)] ring-1 ring-inset ring-[var(--ring)] hover:bg-[var(--muted)]',
    ghost: 'bg-transparent text-text hover:bg-muted/50',
  };

  const sizeStyles: Record<Size, string> = {
    default: 'px-4 py-2.5 text-sm',
    sm: 'px-2 py-1 text-xs',
    lg: 'px-6 py-3 text-base',
  };

  const width = fullWidth ? 'w-full' : '';
  return <button className={`${base} ${styles[variant]} ${sizeStyles[size]} ${width} ${className}`} {...props} />;
};

export default Button;
