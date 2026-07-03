import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
  rows?: number;
  children?: React.ReactNode;
}

export default function Input({
  label,
  error,
  as = 'input',
  className = '',
  id,
  children,
  ...props
}: InputProps) {
  const baseInputStyle = 'w-full p-3.5 rounded-xl border bg-background text-foreground placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none transition-all focus:ring-1 focus:ring-gold';
  const borderStyle = error
    ? 'border-error focus:border-error focus:ring-error/20'
    : 'border-gray-200 dark:border-gray-800 focus:border-gold';

  const renderElement = () => {
    if (as === 'textarea') {
      return (
        <textarea
          id={id}
          className={`${baseInputStyle} ${borderStyle} resize-none ${className}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }
    if (as === 'select') {
      return (
        <select
          id={id}
          className={`${baseInputStyle} ${borderStyle} cursor-pointer appearance-none ${className}`}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {children}
        </select>
      );
    }
    return (
      <input
        id={id}
        className={`${baseInputStyle} ${borderStyle} ${className}`}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-[10px] font-extrabold text-[#082a5e] dark:text-ivory mb-1.5 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {renderElement()}
      </div>
      {error && (
        <span className="block text-[10px] text-error mt-1 font-bold uppercase tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}
