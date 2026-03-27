import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, ArrowRightLeft, Briefcase, Wallet, LogOut } from 'lucide-react';
import logo from '../../assets/logo.jpeg';
const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Discover', icon: Compass, path: '/discover' },
  { name: 'Trade', icon: ArrowRightLeft, path: '/trade' },
  { name: 'Portfolio', icon: Briefcase, path: '/portfolio' },
  { name: 'Wallet', icon: Wallet, path: '/wallet' },
];

const LeftSidebar = () => {
  return (
    <div className="w-[260px] h-full bg-slate-900 text-slate-300 flex flex-col justify-between p-6 shrink-0 transition-all duration-300">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10 text-white cursor-pointer group">
          <img src={logo} alt="StockConnect Logo" className="h-10 w-auto rounded-xl group-hover:scale-105 transition-transform duration-300" />
          <span className="text-2xl font-bold tracking-tight">StockConnect</span>
        </div>

        {/* Navigation */}

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium group ${isActive
                ? 'bg-[#fad059] text-slate-900 font-bold shadow-sm'
                : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-[#fad059] transition-colors'} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300 mt-auto">
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </div>
    </div>
  );
};

export default LeftSidebar;
