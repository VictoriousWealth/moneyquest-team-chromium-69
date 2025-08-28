import React, { createContext } from 'react';

const DialogContext = createContext({});

export const Dialog: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const DialogContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`bg-surface rounded-xl shadow-soft p-6 ${className}`}>{children}</div>
);

export const DialogHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const DialogTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <h2 className={`h3 ${className}`}>{children}</h2>
);

export const DialogDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <p className={`text-muted ${className}`}>{children}</p>
);

export const DialogClose: React.FC<{ className?: string; children?: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...props }) => (
  <button className={className} {...props}>{children ?? 'Close'}</button>
);
