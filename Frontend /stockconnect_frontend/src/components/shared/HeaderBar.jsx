import React, { useState } from 'react';
import { Bell, Search, Menu, CheckCircle2 } from 'lucide-react';
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
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: 'trade', title: 'Buy Order Executed', message: 'Your order for 100 shares of BK was filled at 300 RWF.', time: '2 mins ago', unread: true },
    { id: 2, type: 'market', title: 'Market Open', message: 'Main session has officially opened. Trading is now live.', time: '1 hr ago', unread: true },
    { id: 3, type: 'alert', title: 'Scenario Alert', message: 'Rate hike — National: The NBR raised the repo rate by 0.5%...', time: '3 hrs ago', unread: false },
  ];

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
        <div className="flex items-center gap-6 relative">
          
          <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 rounded-full transition-colors border border-transparent ${showNotifications ? 'bg-slate-100/80 text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <Bell size={22} className={showNotifications ? 'fill-slate-100' : ''} />
              <span className={`absolute top-2.5 right-2.5 w-2 h-2 ${bellColor} border-[1.5px] border-white rounded-full`} />
            </button>

            {/* Notification Dropdown Table */}
            {showNotifications && (
              <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="font-black text-slate-800 text-sm tracking-wide">Notifications</h3>
                      <span className={`text-[10px] font-black ${ROLE_COLORS[role]?.split(' ')[1] || 'text-emerald-700'} ${ROLE_COLORS[role]?.split(' ')[0] || 'bg-emerald-100'} px-2 py-0.5 rounded-lg border border-transparent uppercase tracking-widest`}>2 New</span>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100/60 custom-scrollbar block w-full">
                      <table className="w-full text-left border-collapse">
                          <tbody>
                              {notifications.map((notif) => (
                                <tr key={notif.id} className={`hover:bg-slate-50/80 cursor-pointer transition-colors group ${notif.unread ? `${ROLE_COLORS[role]?.split(' ')[0]?.replace('100', '50/30') || 'bg-emerald-50/30'}` : ''}`}>
                                  <td className="p-4 align-top w-full">
                                      <div className="flex justify-between items-start mb-1.5">
                                        <h4 className={`text-[13px] font-bold ${notif.unread ? `text-slate-900 group-hover:${ROLE_COLORS[role]?.split(' ')[1] || 'text-emerald-700'}` : 'text-slate-700'} transition-colors`}>
                                          {notif.title}
                                        </h4>
                                        <span className="text-[10px] font-black text-slate-400 whitespace-nowrap ml-4 tracking-wider uppercase">{notif.time}</span>
                                      </div>
                                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 pr-2">{notif.message}</p>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                    <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                      <button className="text-[11px] font-black tracking-widest uppercase text-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 w-full py-1">
                        <CheckCircle2 size={14} />
                        Mark all as read
                      </button>
                    </div>
                  </div>
              </>
            )}
          </div>

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
