import React, { useState } from 'react';
import { Cpu, ShieldCheck, Info } from 'lucide-react';

interface NavbarProps {
  currentView: 'hero' | 'scanner';
  isVideoEnded: boolean;
  onNavigateHome: () => void;
  onOpenHowItWorks: () => void;
  onOpenPrivacy: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  isVideoEnded,
  onNavigateHome,
  onOpenHowItWorks,
  onOpenPrivacy,
  onOpenAbout,
}) => {
  const isElevated = currentView === 'scanner' || isVideoEnded;
  const [activeNavIndex, setActiveNavIndex] = useState<number | null>(null);

  const navItems = [
    {
      id: 'how-it-works',
      label: 'How It Works',
      icon: Cpu,
      action: onOpenHowItWorks,
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: ShieldCheck,
      action: onOpenPrivacy,
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      action: onOpenAbout,
    },
  ];

  const handleNavClick = (idx: number, action: () => void) => {
    setActiveNavIndex(idx);
    action();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 pointer-events-auto ${
        isElevated
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3.5'
          : 'bg-white/40 backdrop-blur-sm py-4'
      }`}
    >
      <div className="w-full px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onNavigateHome}
          className="group flex items-center gap-2.5 text-left focus:outline-none transition-opacity duration-300 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <span className="font-bold text-xs">AS</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs font-bold text-slate-900 tracking-tight leading-none">
              AadhaarScan AI
            </span>
            <span className="font-sans text-[10px] text-slate-500 mt-0.5">
              Scan. Extract. Verify.
            </span>
          </div>
        </button>

        {/* 
          ANIMATED SEGMENTED TABS IN TOP-RIGHT CORNER (LIGHT MINIMALIST)
          Styled matching reference design with modern sans font, capsule container,
          and smooth sliding active highlight animation
        */}
        <div className="flex items-center gap-3">
          <nav
            role="tablist"
            className="relative inline-flex items-center p-1 rounded-full bg-slate-100/90 border border-slate-200 shadow-xs"
          >
            {/* Animated Sliding Highlight Pill */}
            {activeNavIndex !== null && (
              <span
                className="absolute top-1 bottom-1 rounded-full bg-white border border-slate-200/90 shadow-xs transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: '4px',
                  width: `calc((100% - 8px) / ${navItems.length})`,
                  transform: `translateX(${activeNavIndex * 100}%)`,
                }}
              />
            )}

            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeNavIndex === idx;

              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleNavClick(idx, item.action)}
                  className={`group relative z-10 flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full font-sans text-xs font-medium transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors duration-200 ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {currentView === 'scanner' && (
            <button
              onClick={onNavigateHome}
              className="hidden sm:inline-flex font-sans text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-full bg-white transition-all cursor-pointer shadow-xs"
            >
              Demo Video
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
