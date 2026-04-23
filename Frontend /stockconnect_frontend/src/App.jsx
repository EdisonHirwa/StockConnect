import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import MainContent from './components/dashboard/MainContent';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LandingPage from './pages/LandingPage';
import Discover from './pages/trader/Discover';
import Trade from './pages/trader/Trade';
import Portfolio from './pages/trader/Portfolio';
import Wallet from './pages/trader/Wallet';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SystemSettings from './pages/admin/SystemSettings';
import AuditLogs from './pages/admin/AuditLogs';
import MarketAdminLayout from './components/marketAdmin/MarketAdminLayout';
import CompanyManagement from './pages/marketAdmin/CompanyManagement';
import MarketOverview from './pages/marketAdmin/MarketOverview';
import MarketAnalytics from './pages/marketAdmin/MarketAnalytics';
import MarketLeaderboard from './pages/marketAdmin/MarketLeaderboard';
import OrderBook from './pages/marketAdmin/OrderBook';
import TradeHistory from './pages/marketAdmin/TradeHistory';
import SessionControl from './pages/marketAdmin/SessionControl';
import { SearchProvider } from './context/SearchContext';
import { Toaster } from 'react-hot-toast';
import WebSocketAlerts from './components/WebSocketAlerts';
import './App.css';

function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <WebSocketAlerts />
        <Toaster />
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<MainContent />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/wallet" element={<Wallet />} />
          </Route>

          {/* Super Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="logs" element={<AuditLogs />} />
          </Route>

          {/* Market Admin Routes */}
          <Route path="/market-admin" element={<MarketAdminLayout />}>
            <Route index element={<Navigate to="/market-admin/dashboard" replace />} />
            <Route path="dashboard" element={<MarketOverview />} />
            <Route path="companies" element={<CompanyManagement />} />
            <Route path="analytics" element={<MarketAnalytics />} />
            <Route path="order-book" element={<OrderBook />} />
            <Route path="trades" element={<TradeHistory />} />
            <Route path="session-control" element={<SessionControl />} />
            <Route path="leaderboard" element={<MarketLeaderboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;

