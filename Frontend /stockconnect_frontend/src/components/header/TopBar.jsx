import React from 'react';
import { Search } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="w-full h-20 px-8 flex items-center justify-between bg-white border-b border-slate-100 z-10 shrink-0">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search anything ..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-12 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
        />
      </div>

      {/* Right Side Actions / Profile */}
      <div className="flex items-center gap-6 ml-6">
        <div className="flex items-center gap-3 cursor-pointer py-2 px-4 rounded-full hover:bg-slate-50 transition-colors border border-slate-100">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800">EdisonHirwa</span>
            <span className="text-xs text-slate-500">+250790391805</span>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
            CN
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
