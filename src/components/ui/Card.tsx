import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-surface rounded-lg shadow-soft ring-1 ring-[var(--ring)] ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;