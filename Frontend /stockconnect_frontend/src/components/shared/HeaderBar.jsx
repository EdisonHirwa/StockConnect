import React, { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../context/SearchContext';
import ProfileModal from '../shared/ProfileModal';

const ROLE_COLORS = {
  TRADER:       'bg-emerald-100 text-emerald-700',
  MARKET_ADMIN: 'bg-blue-100 text-blue-700',
  COMPANY_REP:  'bg-amber-100 text-amber-700',
  SUPER_ADMIN:  'bg-purple-100 text-purple-700',
};

const BELL_COLORS = {
  TRADER:       'bg-emerald-500',
  MARKET_ADMIN: 'bg-blue-500',
  COMPANY_REP:  'bg-amber-500',
  SUPER_ADMIN:  'bg-purple-500',
};

/**
 * Shared header bar used by ALL layouts.
 * Shows search, notification bell, and a clickable profile chip.
 * On click, opens ProfileModal showing real user data from AuthContext.
 */
const HeaderBar = ({ searchPlaceholder = 'Search anything ...' }) => {
  const { fullName, role } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();
  const [showProfile, setShowProfile] = useState(false);

  const initials = fullName
    ? fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const avatarColor = ROLE_COLORS[role]  ?? 'bg-slate-100 text-slate-600';
  const bellColor   = BELL_COLORS[role]  ?? 'bg-red-500';

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        {/* Left — search */}
        <div className="flex items-center gap-4 flex-1">
          <button className="lg:hidden text-slate-500 hover:text-slate-700">
            <Menu size={24} />
          </button>
          <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-[#fad059]/50 focus-within:border-[#fad059] transition-all">
            <Search className="text-slate-400 mr-3 shrink-0" size={18} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right — bell + profile */}
        <div className="flex items-center gap-6">
          <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
            <Bell size={22} />
            <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${bellColor} border-2 border-white rounded-full`} />
          </button>

          {/* Clickable profile */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 cursor-pointer pl-6 border-l border-slate-200 hover:opacity-80 transition-opacity"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shadow-sm ${avatarColor}`}>
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-tight">{fullName || 'Loading…'}</p>
              <p className="text-xs text-slate-500 font-medium leading-tight">{role?.replace('_', ' ') ?? ''}</p>
            </div>
          </button>
        </div>
      </header>

      {/* Profile modal */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default HeaderBar;
