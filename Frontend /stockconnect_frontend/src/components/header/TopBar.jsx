import React from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLE_COLORS = {
  TRADER:       'bg-emerald-100 text-emerald-700',
  MARKET_ADMIN: 'bg-blue-100 text-blue-700',
  COMPANY_REP:  'bg-amber-100 text-amber-700',
  SUPER_ADMIN:  'bg-purple-100 text-purple-700',
};

const ROLE_LABELS = {
  TRADER:       'Trader',
  MARKET_ADMIN: 'Market Admin',
  COMPANY_REP:  'Company Rep',
  SUPER_ADMIN:  'Super Admin',
};

const TopBar = () => {
  const { fullName, phoneNumber, role } = useAuth();

  // Generate initials from fullName
  const initials = fullName
    ? fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const roleLabel = ROLE_LABELS[role] || role || '';
  const roleColor = ROLE_COLORS[role] || 'bg-slate-100 text-slate-600';

  return (
    <div className="w-full h-20 px-8 flex items-center justify-between bg-white border-b border-slate-100 z-10 shrink-0">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search anything ..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-12 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
        />
      </div>

      {/* Profile */}
      <div className="flex items-center gap-4 ml-6">
        {/* Role badge */}
        {roleLabel && (
          <span className={`hidden sm:inline-flex text-xs font-bold px-3 py-1 rounded-full ${roleColor}`}>
            {roleLabel}
          </span>
        )}

        <div className="flex items-center gap-3 cursor-pointer py-2 px-4 rounded-full hover:bg-slate-50 transition-colors border border-slate-100">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800 leading-tight">
              {fullName || 'Loading…'}
            </span>
            <span className="text-xs text-slate-500 leading-tight">
              {phoneNumber || ''}
            </span>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm ${roleColor}`}>
            {initials}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
