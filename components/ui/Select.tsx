
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id || label} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={props.id || label}
        className="w-full p-3 bg-brand-surface border border-brand-border rounded-md text-brand-text focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition-colors disabled:bg-gray-600"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-brand-dark">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
