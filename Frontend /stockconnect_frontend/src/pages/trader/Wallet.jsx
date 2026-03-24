import React from 'react';
import { Eye, Wallet as WalletIcon, Upload, Download, ArrowUpDown } from 'lucide-react';

const Wallet = () => {
  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900">Manage Your Wallets</h1>
        <button className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <Eye size={24} />
        </button>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[140px] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            <WalletIcon size={16} />
            <span className="font-bold text-xs uppercase tracking-wide">USD Wallet</span>
          </div>
          <div className="mb-2 text-slate-900 font-extrabold text-lg">Balance: KES XXXXXX</div>
          <div className="text-xs text-slate-400 font-medium">Last updated: 2/5/2026</div>
        </div>
        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[140px] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            <WalletIcon size={16} />
            <span className="font-bold text-xs uppercase tracking-wide">USD Wallet</span>
          </div>
          <div className="mb-2 text-slate-900 font-extrabold text-lg">Balance: $ XXXXXX</div>
          <div className="text-xs text-slate-400 font-medium">Last updated: 2/5/2026</div>
        </div>
        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[140px] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            <WalletIcon size={16} />
            <span className="font-bold text-xs uppercase tracking-wide">FIB Wallet</span>
          </div>
          <div className="mb-2 text-slate-900 font-extrabold text-lg">Balance: KES XXXXXX</div>
          <div className="text-xs text-slate-200 font-medium invisible">Last updated:</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center flex-wrap gap-6 mb-16">
        <button className="bg-slate-100 hover:bg-slate-200 transition-colors rounded-2xl w-40 h-24 flex flex-col items-center justify-center gap-2 shadow-sm text-slate-800 active:scale-95 border border-slate-200">
          <Upload size={24} className="text-slate-500 mb-1" />
          <span className="font-bold text-sm">Deposit</span>
        </button>
        <button className="bg-slate-100 hover:bg-slate-200 transition-colors rounded-2xl w-40 h-24 flex flex-col items-center justify-center gap-2 shadow-sm text-slate-800 active:scale-95 border border-slate-200">
          <Download size={24} className="text-slate-500 mb-1" />
          <span className="font-bold text-sm">Withdraw</span>
        </button>
        <button className="bg-slate-100 hover:bg-slate-200 transition-colors rounded-2xl w-40 h-24 flex flex-col items-center justify-center gap-2 shadow-sm text-slate-800 active:scale-95 border border-slate-200">
          <ArrowUpDown size={24} className="text-slate-500 mb-1" />
          <span className="font-bold text-sm">Transfer</span>
        </button>
      </div>

      {/* History Sections */}
      <div className="space-y-16">
        
        {/* Deposit/Withdrawal History */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-8">Deposit/Withdrawal History</h2>
          <div className="mb-8 flex justify-center py-4">
            <p className="text-sm font-medium text-slate-500">You have no transactions</p>
          </div>
          
          <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-8">
            <button className="px-5 py-2.5 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed transition-colors">Previous</button>
            <div className="text-slate-800 border border-slate-200 px-6 py-2.5 rounded-xl bg-white shadow-sm">Page 1 of 1</div>
            <button className="px-5 py-2.5 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-8">Transaction History</h2>
          <div className="mb-8 flex justify-center py-4">
            <p className="text-sm font-medium text-slate-500">You have no transactions</p>
          </div>
          
          <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-8">
            <button className="px-5 py-2.5 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed transition-colors">Previous</button>
            <div className="text-slate-800 border border-slate-200 px-6 py-2.5 rounded-xl bg-white shadow-sm">Page 1 of 0</div>
            <button className="px-5 py-2.5 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-8">Order History</h2>
          <div className="mb-8 flex justify-center py-4">
            <p className="text-sm font-medium text-slate-500">You have no transactions</p>
          </div>
          
          <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-8">
            <button className="px-5 py-2.5 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed transition-colors">Previous</button>
            <div className="text-slate-800 border border-slate-200 px-6 py-2.5 rounded-xl bg-white shadow-sm">Page 1 of 0</div>
            <button className="px-5 py-2.5 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Wallet;
