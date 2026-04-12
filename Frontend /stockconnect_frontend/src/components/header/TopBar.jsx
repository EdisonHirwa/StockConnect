import React, { useState } from 'react';
import { Search, Bell, CheckCircle2 } from 'lucide-react';
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
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate initials from fullName
  const initials = fullName
    ? fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const roleLabel = ROLE_LABELS[role] || role || '';
  const roleColor = ROLE_COLORS[role] || 'bg-slate-100 text-slate-600';

  const notifications = [
    { id: 1, type: 'trade', title: 'Buy Order Executed', message: 'Your order for 100 shares of BK was filled at 300 RWF.', time: '2 mins ago', unread: true },
    { id: 2, type: 'market', title: 'Market Open', message: 'Main session has officially opened. Trading is now live.', time: '1 hr ago', unread: true },
    { id: 3, type: 'alert', title: 'Scenario Alert', message: 'Rate hike — National: The NBR raised the repo rate by 0.5%...', time: '3 hrs ago', unread: false },
  ];

  return (
    <div className="w-full h-20 px-8 flex items-center justify-between bg-white border-b border-slate-100 z-50 shrink-0">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search anything ..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-12 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
        />
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-4 ml-6 relative">
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-full transition-all relative border border-transparent ${showNotifications ? 'bg-slate-100 border-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Bell size={22} className={showNotifications ? 'fill-slate-100' : ''} />
            {/* Unread badge */}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-[1.5px] border-white"></span>
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
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 uppercase tracking-widest">2 New</span>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100/60 custom-scrollbar block w-full">
                    <table className="w-full text-left border-collapse">
                        <tbody>
                            {notifications.map((notif) => (
                              <tr key={notif.id} className={`hover:bg-slate-50/80 cursor-pointer transition-colors group ${notif.unread ? 'bg-emerald-50/20' : ''}`}>
                                <td className="p-4 align-top w-full">
                                    <div className="flex justify-between items-start mb-1.5">
                                      <h4 className={`text-[13px] font-bold ${notif.unread ? 'text-slate-900 group-hover:text-emerald-600' : 'text-slate-700'} transition-colors`}>
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
                    <button className="text-[11px] font-black tracking-widest uppercase text-slate-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1.5 w-full py-1">
                      <CheckCircle2 size={14} />
                      Mark all as read
                    </button>
                  </div>
                </div>
            </>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        {/* Role badge */}
        {roleLabel && (
          <span className={`hidden sm:inline-flex text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase border border-slate-900/5 ${roleColor}`}>
            {roleLabel}
          </span>
        )}

        <div className="flex items-center gap-3 cursor-pointer py-1.5 px-1.5 pr-4 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-[13px] shadow-sm ${roleColor}`}>
            {initials}
          </div>
          <div className="flex flex-col items-start hidden sm:flex">
            <span className="text-[13px] font-bold text-slate-800 leading-tight">
              {fullName || 'Loading…'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
