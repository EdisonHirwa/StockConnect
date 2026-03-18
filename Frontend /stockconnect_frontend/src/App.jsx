import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import MainContent from './components/dashboard/MainContent';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<MainContent />} />
          <Route path="discover" element={<div className="p-8 font-bold text-slate-800 text-2xl">Discover Page</div>} />
          <Route path="trade" element={<div className="p-8 font-bold text-slate-800 text-2xl">Trade Page</div>} />
          <Route path="portfolio" element={<div className="p-8 font-bold text-slate-800 text-2xl">Portfolio Page</div>} />
          <Route path="wallet" element={<div className="p-8 font-bold text-slate-800 text-2xl">Wallet Page</div>} />
          <Route path="community" element={<div className="p-8 font-bold text-slate-800 text-2xl">Community Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

