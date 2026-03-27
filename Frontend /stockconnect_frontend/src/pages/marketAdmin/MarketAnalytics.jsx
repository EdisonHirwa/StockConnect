import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { DownloadCloud, Layers } from 'lucide-react';

const industryData = [
  { name: 'Technology', value: 400 },
  { name: 'Finance', value: 300 },
  { name: 'Healthcare', value: 300 },
  { name: 'Energy', value: 200 },
];
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const volumeData = [
  { name: 'Mon', buy: 4000, sell: 2400 },
  { name: 'Tue', buy: 3000, sell: 1398 },
  { name: 'Wed', buy: 2000, sell: 9800 },
  { name: 'Thu', buy: 2780, sell: 3908 },
  { name: 'Fri', buy: 1890, sell: 4800 },
];

const MarketAnalytics = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Market Analytics</h1>
          <p className="text-slate-500 mt-1 font-medium">Deep dive into market distribution and historical trading volume.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto">
          <DownloadCloud size={20} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Industry Distribution */}
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Industry Distribution</h3>
              <p className="text-slate-500 text-sm font-medium">Market share by sector</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><Layers size={20} /></div>
          </div>
          <div className="h-80 w-full flex justify-center items-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Inner Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
              <p className="text-3xl font-extrabold text-slate-900">1.2K</p>
              <p className="text-xs font-bold text-slate-400">COMPANIES</p>
            </div>
          </div>
        </div>

        {/* Volume Analysis */}
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Trading Volume Analysis</h3>
            <p className="text-slate-500 text-sm font-medium">Buy vs Sell orders by day (Millions)</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="buy" name="Buy Volume" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="sell" name="Sell Volume" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
      
      {/* Platform Insights */}
      <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm mt-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Insights</h3>
        <ul className="space-y-4 mt-5">
          <li className="flex gap-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">Technology sector saw a <span className="font-bold text-emerald-600">12% increase</span> in total volume over the last 48 hours compared to the 30-day moving average.</p>
          </li>
          <li className="flex gap-4 p-4 rounded-xl border border-orange-100 bg-orange-50/50">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">High volatility detected in Energy sector. Consider reviewing risk management thresholds manually.</p>
          </li>
          <li className="flex gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">Global total active users hit an all-time high of <span className="font-bold text-slate-900">4.2 Million</span> concurrently during yesterday's market open period.</p>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default MarketAnalytics;
