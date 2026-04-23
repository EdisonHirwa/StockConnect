import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, TrendingUp, BookOpen, Repeat, PlayCircle, Trophy, LogOut, ChevronRight } from 'lucide-react';
import logo from '../../assets/logo.jpeg';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from '../shared/LogoutModal';
import HeaderBar from '../shared/HeaderBar';
import { marketAdminService } from '../../services/marketAdminService';

const MarketAdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingOrderCount, setPendingOrderCount] = useState(null);

  useEffect(() => {
    marketAdminService.getAllOrders()
      .then(orders => {
        const pending = orders.filter(o => o.status === 'PENDING').length;
        setPendingOrderCount(pending);
      })
      .catch(() => setPendingOrderCount(null));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const marketSection = [
    { name: 'Market Dashboard', icon: LayoutDashboard, path: '/market-admin/dashboard' },
    { name: 'Companies', icon: Building2, path: '/market-admin/companies' },
    { name: 'Order Book', icon: BookOpen, path: '/market-admin/order-book', badge: pendingOrderCount },
    { name: 'Trades', icon: Repeat, path: '/market-admin/trades' },
  ];

  const sessionSection = [
    { name: 'Session Control', icon: PlayCircle, path: '/market-admin/session-control' },
    { name: 'Leaderboard', icon: Trophy, path: '/market-admin/leaderboard' },
  ];

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-[280px] h-full bg-slate-900 text-slate-300 flex-col p-6 shrink-0 transition-transform duration-300`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 px-2 mb-8 text-white">
            <img src={logo} alt="Logo" className="h-10 w-auto rounded-xl shadow-lg border border-slate-700" />
            <div>
                <p className="text-xl font-extrabold tracking-tight text-[#fad059] leading-tight flex items-center gap-1.5">
                  StockConnect
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Market Admin</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {/* Market Section */}
            <div className="mb-8">
              <p className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">Market</p>
              <nav className="flex flex-col gap-1.5">
                {marketSection.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-xl cursor-default transition-all duration-300 font-bold group ${isActive 
                      ? 'bg-[#fad059] text-slate-900 shadow-[0_4px_20px_-4px_rgba(250,208,89,0.3)]' 
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                    }`}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className={isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-[#fad059] transition-colors'} />
                          <span className="text-sm font-bold tracking-tight">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${isActive ? 'bg-slate-900/10' : 'bg-red-500/20 text-red-400'}`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Session Section */}
            <div>
              <p className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">Session</p>
              <nav className="flex flex-col gap-1.5">
                {sessionSection.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl cursor-default transition-all duration-300 font-bold group ${isActive 
                      ? 'bg-[#fad059] text-slate-900 shadow-[0_4px_20px_-4px_rgba(250,208,89,0.3)]' 
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                    }`}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={18} className={isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-[#fad059] transition-colors'} />
                        <span className="text-sm font-bold tracking-tight">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-slate-800/50">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full font-bold text-sm"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <HeaderBar searchPlaceholder="Search market metrics, companies..." onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#f4f7f6]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MarketAdminLayout;
