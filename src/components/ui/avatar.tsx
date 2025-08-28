import React from 'react';

export const Avatar: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`inline-flex items-center justify-center rounded-full bg-[var(--muted)] ${className}`}>{children}</div>
);

export const AvatarImage: React.FC<{ src?: string; alt?: string; className?: string }> = ({ src, alt = '', className = '' }) => (
  <img src={src} alt={alt} className={`rounded-full ${className}`} />
);

export const AvatarFallback: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = '', children }) => (
  <span className={className}>{children}</span>
);
