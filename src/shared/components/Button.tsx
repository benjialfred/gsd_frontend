import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle = 'inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 transform rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none -skew-x-12';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/95 text-white focus:ring-primary shadow-lg',
    secondary: 'bg-ivory dark:bg-dark border border-gray-200 dark:border-gray-800 text-primary dark:text-ivory hover:bg-gray-50 dark:hover:bg-gray-900 focus:ring-primary',
    gold: 'bg-gradient-to-r from-gold to-[#ebd18b] hover:from-[#ebd18b] hover:to-gold text-[#071b36] focus:ring-gold shadow-md shadow-gold/20',
    outline: 'border-2 border-primary/30 hover:bg-primary hover:text-white text-primary dark:text-ivory focus:ring-primary',
    danger: 'bg-error hover:bg-error/90 text-white focus:ring-error shadow-lg',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-8 py-3.5 text-[11px]',
    lg: 'px-12 py-5 text-[13px]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="transform skew-x-12 flex items-center justify-center gap-2">
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </span>
    </button>
  );
}
