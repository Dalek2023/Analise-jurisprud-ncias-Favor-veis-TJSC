
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-brand-surface border border-brand-border rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
    return <div className={`p-6 border-b border-brand-border ${className}`}>{children}</div>
}

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
    return <div className={`p-6 ${className}`}>{children}</div>
}
