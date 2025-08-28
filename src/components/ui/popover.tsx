import React, { createContext, useContext } from 'react';

const PopoverCtx = createContext({});

export const Popover: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const PopoverTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const PopoverContent: React.FC<{ className?: string; align?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`bg-surface border border-[var(--ring)] rounded-xl shadow-soft p-3 ${className}`}>{children}</div>
);
