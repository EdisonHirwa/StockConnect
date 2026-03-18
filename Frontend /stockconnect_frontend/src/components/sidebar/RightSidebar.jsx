import React from 'react';
import { Download, Upload, Wallet } from 'lucide-react';

const RightSidebar = () => {
  return (
    <div className="w-[320px] h-full bg-slate-50 flex flex-col p-6 overflow-y-auto no-scrollbar border-l border-slate-200 shrink-0">
      
      {/* Portfolio Section */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">Portfolio</h2>
      <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3 relative z-10">
          <Wallet size={16} /> Portfolio Value
        </div>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight relative z-10">$ 0.00</div>
      </div>

      {/* Transactions Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Transactions</h2>
      </div>
      <div className="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-slate-100 min-h-[160px] flex flex-col">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider px-2">
          <span>Stock</span>
          <span>Transaction</span>
          <span>Amount</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400">
          You have no holdings
        </div>
      </div>

      {/* Wallets Section */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">Wallets</h2>
      <div className="bg-white rounded-2xl p-2 mb-6 shadow-sm border border-slate-100 flex gap-1">
        <button className="flex-1 py-2 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl transition-colors">
          USD Wallet
        </button>
        <button className="flex-1 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
          FTB Wallet
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-100 flex items-center justify-center text-2xl font-extrabold text-slate-900 tracking-tight">
        KES 0
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-4">
        <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
          <Download size={18} /> Deposit
        </button>
        <button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-4 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 hover:border-slate-300">
          <Upload size={18} /> Withdraw
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
