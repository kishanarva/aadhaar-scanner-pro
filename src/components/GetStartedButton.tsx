import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface GetStartedButtonProps {
  onClick: () => void;
  className?: string;
  isTransitioning?: boolean;
}

export const GetStartedButton: React.FC<GetStartedButtonProps> = ({
  onClick,
  className = '',
  isTransitioning = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isTransitioning}
      id="get-started-cta"
      aria-label="Get Started with Aadhaar Vision Scanner"
      className={`group relative inline-flex items-center justify-center gap-3.5 px-8 py-4 
        rounded-xl select-none cursor-pointer transition-all duration-200
        bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs md:text-sm font-semibold tracking-wider uppercase
        shadow-md hover:shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 border border-slate-800
        ${isTransitioning ? 'opacity-70 scale-98 pointer-events-none' : ''}
        ${className}
      `}
    >
      {/* Light subtle glimmer sweep */}
      <span className="sweep-glimmer" aria-hidden="true" />

      {/* Blue Accent Dot */}
      <span className="relative flex h-2 w-2 items-center justify-center" aria-hidden="true">
        <span
          className={`absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 transition-transform duration-300 ${
            isHovered ? 'scale-150 animate-ping' : ''
          }`}
        />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500 shadow-sm" />
      </span>

      {/* Button Text */}
      <span className="transition-colors duration-200">
        GET STARTED
      </span>

      {/* Chevron indicator */}
      <ArrowRight
        className={`w-4 h-4 text-white/70 transition-all duration-200 ${
          isHovered ? 'translate-x-1 text-white opacity-100' : 'opacity-70'
        }`}
        aria-hidden="true"
      />
    </button>
  );
};
