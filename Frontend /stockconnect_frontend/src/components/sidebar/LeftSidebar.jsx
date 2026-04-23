import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, ArrowRightLeft, Briefcase, Wallet, LogOut } from 'lucide-react';
import logo from '../../assets/logo.jpeg';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from '../shared/LogoutModal';
const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Discover', icon: Compass, path: '/discover' },
  { name: 'Trade', icon: ArrowRightLeft, path: '/trade' },
  { name: 'Portfolio', icon: Briefcase, path: '/portfolio' },
  { name: 'Wallet', icon: Wallet, path: '/wallet' },
];

const LeftSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-[260px] h-full bg-slate-900 text-slate-300 flex flex-col justify-between p-6 shrink-0 transition-transform duration-300`}>
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
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 mt-auto w-full"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>

      {showModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
    </>
  );
};

export default LeftSidebar;
