import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'dark' | 'light';
}

export default function Logo({ className = "", theme = 'dark' }: LogoProps) {
  const isDark = theme === 'dark';
  const textColor1 = isDark ? 'text-white' : 'text-[#082a5e]';
  const crossColor = isDark ? '#ffffff' : '#082a5e';
  const handsColor = isDark ? '#ffffff' : '#082a5e';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-[45px] h-[45px] shrink-0">
        {/* Golden Globe Grid */}
        <circle cx="50" cy="48" r="25" fill="none" stroke="#ebd18b" strokeWidth="2.5"/>
        <ellipse cx="50" cy="48" rx="10" ry="25" fill="none" stroke="#ebd18b" strokeWidth="2"/>
        <line x1="25" y1="48" x2="75" y2="48" stroke="#ebd18b" strokeWidth="2"/>
        
        {/* Cross */}
        <path d="M46 15 h8 v25 h12 v8 h-12 v18 h-8 v-18 h-12 v-8 h12 z" fill={crossColor} />

        {/* Hands */}
        <path d="M 23 68 C 30 85, 45 90, 50 90 C 55 90, 70 85, 77 68 C 70 75, 60 82, 50 82 C 40 82, 30 75, 23 68 Z" fill={handsColor} />
        {/* Thumb accents */}
        <path d="M 17 65 C 22 75 25 78 30 75 C 25 70 20 62 17 65 Z" fill={handsColor} />
        <path d="M 83 65 C 78 75 75 78 70 75 C 75 70 80 62 83 65 Z" fill={handsColor} />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className={`${textColor1} font-bold tracking-widest text-[13px] uppercase`}>LE GRAND</span>
        <span className="text-[#ebd18b] font-bold tracking-widest text-[13px] uppercase">SALON DIVIN</span>
      </div>
    </div>
  );
}
