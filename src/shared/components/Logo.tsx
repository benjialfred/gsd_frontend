import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'dark' | 'light';
}

export default function Logo({ className = "", theme = 'dark' }: LogoProps) {
  // We ignore the theme prop here since the official logo is a static image,
  // but we keep it in the props to avoid breaking existing usages.
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src="/logo.png" alt="Le Grand Salon Divin" className="h-20 w-auto object-contain" />
    </div>
  );
}
