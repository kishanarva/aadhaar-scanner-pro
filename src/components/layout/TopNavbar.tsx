import React, { useState } from 'react';
import { Search, Bell, MapPin, ChevronDown } from 'lucide-react';
import type { PageId } from './Sidebar';

interface TopNavbarProps {
  currentPage: PageId;
  onSearch?: (query: string) => void;
  onNavigate: (page: PageId) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentPage,
  onSearch,
  onNavigate,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'dashboard':
        return 'Dashboard';
      case 'scan':
        return 'Scan Aadhaar';
      case 'result':
        return 'Scan Result';
      case 'history':
        return 'Scan History';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="h-16 px-6 glass-panel rounded-2xl flex items-center justify-between sticky top-0 z-30 select-none shadow-xl">
      {/* Left: Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-white tracking-tight">
          {getPageTitle(currentPage)}
        </h1>
      </div>

      {/* Right: Search, Actions, Profile */}
      <div className="flex items-center gap-3">
        {/* Global Search Pill */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scans..."
            value={searchVal}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 text-xs glass-input rounded-full placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          />
        </div>

        {/* Location / Target Icon */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title="Location Node"
        >
          <div className="relative">
            <MapPin className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 text-[8px] font-bold text-blue-400">+</span>
          </div>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 glass-panel rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn text-xs border border-white/15">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-blue-400 font-medium cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-semibold text-white text-[11px]">OCR Engine Online</p>
                  <p className="text-[10px] text-slate-300">
                    Neural pipeline active at 99.1% accuracy.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-semibold text-white text-[11px]">Masking Active</p>
                  <p className="text-[10px] text-slate-300">
                    UIDAI compliant 8-digit masking enforced.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer border border-white/10 bg-white/5"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 bg-blue-900/60 shrink-0 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
              alt="Lakshmi Ar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-xs font-bold text-white">LA</span>';
              }}
            />
          </div>
          <span className="text-xs font-sans font-medium text-white hidden sm:inline">
            Lakshmi Ar
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </header>
  );
};
