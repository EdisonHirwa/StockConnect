import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, ClipboardList, ShieldCheck } from 'lucide-react';
import logo from '../../assets/logo.jpeg';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from '../shared/LogoutModal';
import HeaderBar from '../shared/HeaderBar';

const adminNavItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Users Management', icon: Users, path: '/admin/users' },
  { name: 'Audit Logs', icon: ClipboardList, path: '/admin/logs' },
  { name: 'System Settings', icon: Settings, path: '/admin/settings' },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#f4f7f6] font-sans overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-[260px] h-full bg-[#1a1c1e] text-slate-300 flex flex-col justify-between p-6 shrink-0 transition-transform duration-300`}>
        <div>
          <div className="flex items-center gap-3 px-2 mb-10 text-white cursor-pointer group">
            <div className="w-10 h-10 bg-[#fad059]/10 rounded-xl flex items-center justify-center border border-[#fad059]/20">
              <ShieldCheck className="text-[#fad059]" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#fad059]">Admin</span>
          </div>

          <nav className="flex flex-col gap-2">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-bold text-sm group ${isActive
                  ? 'bg-[#fad059] text-slate-900 shadow-[0_4px_20px_rgba(250,208,89,0.25)]'
                  : 'hover:bg-slate-800 hover:text-white text-slate-500'
                  }`}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-[#fad059] transition-colors'} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 mt-auto w-full font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Logout Admin</span>
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
        <HeaderBar searchPlaceholder="Search users, transactions..." onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#f4f7f6]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
