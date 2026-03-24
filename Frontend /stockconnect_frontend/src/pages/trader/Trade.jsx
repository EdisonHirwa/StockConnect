import React, { useState } from 'react';
import { Search, TrendingUp, Wallet as WalletIcon, Download, Upload } from 'lucide-react';

const primaryTabs = ['Markets', 'Positions', 'Orders', 'Transactions', 'Wallet'];
const secondaryTabs = ['Currencies', 'Stocks', 'ETFs', 'Metals', 'Energies', 'Indices', 'Agriculture'];

const currenciesData = [
  { name: 'Euro vs US Dollar', ticker: 'EURUSD', buy: '1.09427', sell: '1.09381', initials: 'EU' },
  { name: 'Great Britain Pound vs US Dollar', ticker: 'GBPUSD', buy: '1.26222', sell: '1.26174', initials: 'GU' },
  { name: 'US Dollar vs Japanese Yen', ticker: 'USDJPY', buy: '142.003', sell: '141.936', initials: 'UJ' },
  { name: 'Great Britain Pound vs Japanese Yen', ticker: 'GBPJPY', buy: '179.202', sell: '179.117', initials: 'GJ' }
];

const Trade = () => {
  const [activePrimary, setActivePrimary] = useState('Markets');
  const [activeSecondary, setActiveSecondary] = useState('Currencies');

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          Trade <span className="text-sm font-medium text-slate-500 tracking-normal mt-2">by StockConnect</span>
        </h1>
      </div>

      {/* Primary Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
        {primaryTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePrimary(tab)}
            className={`pb-4 px-1 text-sm font-bold transition-all relative ${
              activePrimary === tab 
                ? 'text-slate-900 border-b-2 border-[#fad059]' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activePrimary === 'Markets' && (
        <>
          {/* Secondary Tabs */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
            {secondaryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSecondary(tab)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeSecondary === tab
                    ? 'bg-slate-900 text-[#fad059] shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeSecondary === 'Currencies' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              {/* Category Header */}
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Trade Currencies</h2>
                    <p className="text-sm text-slate-500 font-medium">Buy and sell currencies</p>
                  </div>
                </div>

                <div className="relative group w-full md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search Currencies"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Currencies</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Buy</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Sell</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currenciesData.map((row, idx) => (
                      <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-sm font-bold text-slate-600 group-hover:scale-105 transition-transform flex-shrink-0">
                              {row.initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-500">{row.name}</span>
                              <span className="text-base font-bold text-slate-900">{row.ticker}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-bold text-slate-900">{row.buy}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-bold text-slate-900">{row.sell}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {activePrimary === 'Positions' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden mt-2">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Trade Positions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Instrument</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Transaction Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Symbol</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Position</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Open Price</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Current Price</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Number of Lots</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Profit/Loss</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="9" className="py-12 text-center bg-white">
                    <p className="text-sm font-medium text-slate-500">You have no open positions.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activePrimary === 'Transactions' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden mt-2">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Trade Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Transaction Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Transaction Type</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="py-12 text-center bg-white">
                    <p className="text-sm font-medium text-slate-500">You have no transactions.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activePrimary === 'Wallet' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden mt-2 pt-6">
          <div className="px-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Trade Wallet</h2>
          </div>
          
          <div className="px-6 flex flex-col md:flex-row gap-8 mb-10">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pl-1">Wallet Balance</h3>
              <div className="border border-slate-200 rounded-2xl p-6 shadow-sm h-32 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2 text-slate-700">
                  <WalletIcon size={16} />
                  <span className="font-bold text-xs uppercase tracking-wide">Trade Wallet</span>
                </div>
                <div className="mb-1 text-slate-900 font-extrabold text-lg">Balance: loading...</div>
                <div className="text-xs text-slate-400 font-medium">Last updated: March 24th, 2026</div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pl-1">Deposit/Withdraw from your Wallet</h3>
              <div className="flex gap-4 h-32">
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm text-slate-700 active:scale-95">
                  <Upload size={24} className="text-slate-500 mb-1" />
                  <span className="font-bold text-sm">Deposit</span>
                </button>
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm text-slate-700 active:scale-95">
                  <Download size={24} className="text-slate-500 mb-1" />
                  <span className="font-bold text-sm">Withdraw</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-6 mb-4">
             <h3 className="text-sm font-bold text-slate-900 pl-1">Deposit/Withdrawal Transactions</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-t border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Transaction Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Transaction Type</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap text-right">Amount</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="py-12 text-center bg-white border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-500">You have no transactions.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trade;
