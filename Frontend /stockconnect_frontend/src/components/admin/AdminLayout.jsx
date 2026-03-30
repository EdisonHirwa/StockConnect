import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import logo from '../../assets/logo.jpeg';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from '../shared/LogoutModal';
import HeaderBar from '../shared/HeaderBar';

const adminNavItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Users Management', icon: Users, path: '/admin/users' },
  { name: 'System Settings', icon: Settings, path: '/admin/settings' },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="flex h-screen bg-[#f4f7f6] font-sans">
      {/* Sidebar */}
      <div className="w-[260px] h-full bg-slate-900 text-slate-300 flex flex-col justify-between p-6 shrink-0 transition-all duration-300">
        <div>
          <div className="flex items-center gap-3 px-2 mb-10 text-white cursor-pointer group">
            <img src={logo} alt="StockConnect Logo" className="h-10 w-auto rounded-xl group-hover:scale-105 transition-transform duration-300" />
            <span className="text-2xl font-bold tracking-tight text-[#fad059]">Admin</span>
          </div>

          <nav className="flex flex-col gap-2">
            {adminNavItems.map((item) => (
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

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 mt-auto w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout Admin</span>
        </button>

        {showModal && (
          <LogoutModal
            onConfirm={handleLogout}
            onCancel={() => setShowModal(false)}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <HeaderBar searchPlaceholder="Search users, transactions..." />

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#f4f7f6]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
