import React from 'react';
import { TrendingUp, TrendingDown, Activity, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '10 AM', cap: 42.1 },
  { name: '11 AM', cap: 42.3 },
  { name: '12 PM', cap: 41.8 },
  { name: '1 PM', cap: 42.5 },
  { name: '2 PM', cap: 42.6 },
  { name: '3 PM', cap: 42.8 },
  { name: '4 PM', cap: 43.1 },
];

const topMovers = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: '$420.50', change: '+5.2%', isUp: true },
  { symbol: 'AMD', name: 'Advanced Micro', price: '$110.20', change: '+3.8%', isUp: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$210.80', change: '-2.1%', isUp: false },
  { symbol: 'META', name: 'Meta Platforms', price: '$295.40', change: '+1.9%', isUp: true },
];

const MarketOverview = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Market Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Live market performance and global indexes.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-100 px-4 py-2.5 rounded-xl border border-emerald-200">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-0.5"></div>
          MARKET OPEN
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Global Market Cap', value: '$43.1T', change: '+1.2%', isUp: true, icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { title: '24h Volume', value: '$124.5B', change: '+5.4%', isUp: true, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
          { title: 'Avg Volatility', value: '1.8%', change: '-0.3%', isUp: false, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
          { title: 'Listed Entities', value: '4,192', change: '+12', isUp: true, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`flex items-center text-sm font-bold ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.isUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Total Market Capitalization</h3>
              <p className="text-slate-500 text-sm font-medium">Intraday performance (Trillions USD)</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#fad059]/50 transition-all">
              <option>Today</option>
              <option>1W</option>
              <option>1M</option>
              <option>YTD</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} prefix="$" suffix="T" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="cap" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorCap)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Movers */}
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Top Movers</h3>
            <p className="text-slate-500 text-sm font-medium">Highest volume & volatility</p>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            {topMovers.map((stock, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50 hover:bg-slate-50">
                <div>
                  <h4 className="font-bold text-slate-900">{stock.symbol}</h4>
                  <p className="text-xs text-slate-500 font-medium">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{stock.price}</p>
                  <p className={`text-xs font-bold flex items-center justify-end ${stock.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stock.change} {stock.isUp ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-5 py-3.5 text-sm font-bold text-[#fad059] hover:text-[#e8be48] transition-colors rounded-xl bg-slate-900 hover:bg-slate-800 shadow-sm">
            View All Equities
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
