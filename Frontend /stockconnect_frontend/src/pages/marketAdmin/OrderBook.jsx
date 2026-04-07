import React from 'react';
import { BookOpen, Search, ArrowUp, ArrowDown } from 'lucide-react';

const orders = [
  { id: '#ord-1041', trader: 'N. Jean', company: 'BK', side: 'BUY', type: 'LIMIT', price: '278.00', qty: 200, filled: 0, status: 'PENDING', time: '09:42' },
  { id: '#ord-1040', trader: 'A. Mukiza', company: 'MTN', side: 'SELL', type: 'LIMIT', price: '92.00', qty: 500, filled: 200, status: 'PARTIAL', time: '09:38' },
  { id: '#ord-1039', trader: 'P. Umwali', company: 'BK', side: 'BUY', type: 'MARKET', price: '—', qty: 100, filled: 100, status: 'FILLED', time: '09:31' },
  { id: '#ord-1038', trader: 'C. Rusa', company: 'BRL', side: 'SELL', type: 'LIMIT', price: '141.00', qty: 300, filled: 0, status: 'PENDING', time: '09:28' },
];

const OrderBook = () => {
  const [filter, setFilter] = React.useState('All');

  const tabs = [
    { name: 'All', count: 412 },
    { name: 'Pending', count: 298 },
    { name: 'Partial', count: 47 },
    { name: 'Filled', count: 55 },
    { name: 'Cancelled', count: 12 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Book</h1>
          <p className="text-slate-500 font-bold mt-1">Direct management of all active and historical market orders.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setFilter(tab.name)}
              className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all border shadow-sm
                ${filter === tab.name 
                  ? 'bg-slate-900 text-[#fad059] border-slate-900' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
            >
              {tab.name} <span className="ml-2 opacity-50">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Trader</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Company</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Side</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Filled</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6 text-sm font-black text-slate-400 font-mono">{order.id}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900">{order.trader}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-600">{order.company}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest
                      ${order.side === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {order.side}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-500 tracking-tight">{order.type}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900">{order.price}</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-900">{order.qty}</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-500">{order.filled}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black border
                      ${order.status === 'PENDING' ? 'bg-slate-50 text-slate-500 border-slate-200' : 
                        order.status === 'PARTIAL' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-400 text-right">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
