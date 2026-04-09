import React, { useEffect, useState } from 'react';
import { BookOpen, Search, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { marketAdminService } from '../../services/marketAdminService';

const OrderBook = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await marketAdminService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'All') return true;
    return order.status === filter.toUpperCase();
  });

  const getCount = (status) => {
    if (status === 'All') return orders.length;
    return orders.filter(o => o.status === status.toUpperCase()).length;
  };

  const tabs = [
    { name: 'All', count: getCount('All') },
    { name: 'Pending', count: getCount('Pending') },
    { name: 'Partial', count: getCount('Partial') },
    { name: 'Filled', count: getCount('Filled') },
    { name: 'Cancelled', count: getCount('Cancelled') },
  ];

  const fmtDate = (dt) => 
    new Date(dt).toLocaleTimeString('en-US', { hour: false, hour12: false, minute: '2-digit', second: '2-digit' });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
            <p className="text-slate-500 font-bold mt-1">Direct management of all active and historical market orders.</p>
          </div>
          <button 
            onClick={loadOrders}
            className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
          </button>
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
              {tab.name} <span className="ml-2 opacity-50">({loading ? '—' : tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold">Scanning market depth...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-medium">No orders found in this category.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6 text-sm font-black text-slate-400 font-mono">#{order.id.substring(0, 8)}</td>
                    <td className="px-8 py-6 text-sm font-black text-slate-900">{order.tickerSymbol}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest
                        ${order.side === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {order.side}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500 tracking-tight">{order.type}</td>
                    <td className="px-8 py-6 text-sm font-black text-slate-900">RWF {Number(order.targetPrice).toLocaleString()}</td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-900">{order.totalQuantity}</td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{order.filledQuantity}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black border
                        ${order.status === 'PENDING' ? 'bg-slate-50 text-slate-500 border-slate-200' : 
                          order.status === 'PARTIAL' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          order.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-slate-400 text-right">{fmtDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
