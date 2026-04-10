import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { DownloadCloud, Layers, RefreshCw } from 'lucide-react';
import { marketAdminService } from '../../services/marketAdminService';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const MarketAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await marketAdminService.getAnalytics();
      setData(result);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const industryChartData = data?.industryDistribution 
    ? Object.entries(data.industryDistribution).map(([name, value]) => ({ name, value }))
    : [];

  const volumeChartData = data?.volumeHistory 
    ? data.volumeHistory.map(v => ({ name: v.date, buy: Number(v.buyVolume), sell: Number(v.sellVolume) }))
    : [];

  const totalCompaniesCount = industryChartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Market Analytics</h1>
          <p className="text-slate-500 mt-1 font-medium">Deep dive into market distribution and historical trading volume.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={loadData}
            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto">
            <DownloadCloud size={20} />
            Export Report
          </button>
        </div>
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
            {loading ? (
                <div className="text-slate-400 font-bold">crunching numbers...</div>
            ) : industryChartData.length === 0 ? (
                <div className="text-slate-400 font-medium">No sector data available.</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={industryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    >
                    {industryChartData.map((entry, index) => (
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
            )}
            {/* Inner Text */}
            {!loading && industryChartData.length > 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                <p className="text-3xl font-extrabold text-slate-900">{totalCompaniesCount}</p>
                <p className="text-xs font-bold text-slate-400">COMPANIES</p>
                </div>
            )}
          </div>
        </div>

        {/* Volume Analysis */}
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Trading Volume Analysis</h3>
            <p className="text-slate-500 text-sm font-medium">Buy vs Sell orders by day (Millions)</p>
          </div>
          <div className="h-80 w-full">
            {loading ? (
                <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold">gathering trends...</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            )}
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
