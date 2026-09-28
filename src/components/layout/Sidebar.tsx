import React from 'react';
import {
  Home,
  Camera,
  History,
  Settings,
  HelpCircle,
  Play,
  ChevronRight,
  Fingerprint,
} from 'lucide-react';

export type PageId = 'dashboard' | 'scan' | 'result' | 'history' | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onWatchDemo?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onWatchDemo,
}) => {
  const navItems = [
    {
      id: 'dashboard' as PageId,
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'scan' as PageId,
      label: 'Scan Aadhaar',
      icon: Camera,
    },
    {
      id: 'history' as PageId,
      label: 'Scan History',
      icon: History,
    },
    {
      id: 'settings' as PageId,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 glass-panel rounded-3xl p-4 flex flex-col justify-between shrink-0 select-none min-h-[calc(100vh-2.5rem)] shadow-2xl">
      {/* Top Branding & Main Nav */}
      <div>
        {/* Brand Logo - AadhaarScan AI */}
        <div className="px-2 py-3 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-inner shrink-0">
            <Fingerprint className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-sm font-bold text-white tracking-tight leading-none">
              AadhaarScan <span className="text-blue-400">AI</span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (item.id === 'scan' && currentPage === 'result');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-sans tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.id === 'scan' && !isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
              </button>
            );
          })}

          {onWatchDemo && (
            <div className="pt-2">
              <button
                onClick={onWatchDemo}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-sans text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center text-[10px] font-bold group-hover:scale-105 transition-transform">
                  <Play className="w-2.5 h-2.5 fill-blue-300 ml-0.5" />
                </div>
                <span>Cinematic Demo</span>
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Section: Help & User Profile */}
      <div className="space-y-3 pt-4">
        {/* Help & Support */}
        <button
          onClick={() => onNavigate('settings')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-sans text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help & Support</span>
        </button>

        {/* User Profile Pill */}
        <div
          onClick={() => onNavigate('settings')}
          className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-blue-900/60 shrink-0 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                alt="Lakshmi Ar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback avatar
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-xs font-bold text-white">LA</span>';
                }}
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-sans font-semibold text-white truncate">Lakshmi Ar</p>
              <p className="text-[10px] font-sans text-slate-400 truncate">User</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
};
