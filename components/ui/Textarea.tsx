
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = (props) => {
  return (
    <textarea
      className="w-full p-4 bg-brand-surface border border-brand-border rounded-lg text-brand-text focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition-colors disabled:bg-gray-600"
      {...props}
    />
  );
};
