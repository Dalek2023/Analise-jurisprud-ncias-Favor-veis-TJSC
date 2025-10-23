
import React from 'react';

interface TabsProps {
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  return (
    <div className="border-b border-brand-border">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {children}
      </nav>
    </div>
  );
};

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  const activeClasses = 'border-brand-secondary text-brand-secondary';
  const inactiveClasses = 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500';
  
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 focus:outline-none ${isActive ? activeClasses : inactiveClasses}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </button>
  );
};
