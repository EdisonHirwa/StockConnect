import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from '../sidebar/LeftSidebar';
import RightSidebar from '../sidebar/RightSidebar';
import TopBar from '../header/TopBar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full bg-[#f4f7f6] overflow-hidden text-slate-800 font-sans">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-tl-[2rem] rounded-bl-[2rem] shadow-[-10px_0_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
          <Outlet />
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};

export default DashboardLayout;
