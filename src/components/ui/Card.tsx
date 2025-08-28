
import React from 'react';

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={`bg-surface rounded-xl shadow-soft ring-1 ring-[var(--ring)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
export { Card };

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...rest }) => (
  <div className={`p-4 border-b border-[var(--ring)] ${className}`} {...rest}>{children}</div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', children, ...rest }) => (
  <h3 className={`text-base font-semibold ${className}`} {...rest}>{children}</h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...rest }) => (
  <div className={`p-4 ${className}`} {...rest}>{children}</div>
);
