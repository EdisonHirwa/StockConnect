import React, { useEffect, useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import { marketAdminService } from '../../services/marketAdminService';

const getAvatarColor = (index) => {
  const colors = ['bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-rose-500', 'bg-purple-500', 'bg-cyan-500'];
  return colors[index % colors.length];
};

const MarketLeaderboard = () => {
    const { searchTerm } = useSearch();
    const [traders, setTraders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [tradersData, sessionData] = await Promise.all([
                marketAdminService.getLeaderboard(),
                marketAdminService.getSession()
            ]);
            setTraders(tradersData);
            setSession(sessionData);
        } catch (error) {
            console.error('Failed to load leaderboard or session', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);
    
    const filteredTraders = (traders || []).filter(t => 
        (t.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (t.initials?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const topGain = traders.length > 0 ? Math.max(...traders.map(t => t.gainPercentage)) : 0;
    const avgNetWorth = traders.length > 0 ? traders.reduce((acc, t) => acc + t.currentNetWorth, 0) / traders.length : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leaderboard</h1>
                    <p className="text-slate-500 font-bold mt-1">
                        Trader performance rankings — {session ? `${session.institutionName} · ${session.academicPeriod}` : 'General Rankings'}
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-[#fad059] rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                    Export Grades
                </button>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Participants', value: loading ? '—' : traders.length },
                    { label: 'Best gain', value: loading ? '—' : `+${topGain.toFixed(1)}%`, color: 'text-emerald-600' },
                    { label: 'Avg. portfolio', value: loading ? '—' : `RWF ${(avgNetWorth / 1000000).toFixed(2)}M` },
                    { label: 'Days running', value: '47' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                        <h3 className={`text-3xl font-black ${stat.color || 'text-slate-900'}`}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900">Top traders by portfolio growth</h3>
                    <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl transition-all active:scale-95">
                        Export for grading
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">#</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Trader</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Starting balance</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Current net worth</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Gain (%)</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Trades</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-slate-400 font-bold">Calculating rankings...</td>
                                </tr>
                            ) : filteredTraders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-slate-400 font-medium">No traders found.</td>
                                </tr>
                            ) : (
                                filteredTraders.map((trader, index) => (
                                    <tr key={trader.userId} className={`hover:bg-slate-50 transition-colors group ${index === 0 ? 'bg-slate-50/30' : ''}`}>
                                        <td className="px-8 py-6 font-black text-slate-400">{index + 1}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-black text-xs shadow-lg`}>
                                                    {trader.initials}
                                                </div>
                                                <span className="font-black text-slate-900">{trader.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-slate-500">RWF {Number(trader.startingBalance).toLocaleString()}</td>
                                        <td className="px-8 py-6 font-black text-slate-900">RWF {Number(trader.currentNetWorth).toLocaleString()}</td>
                                        <td className="px-8 py-6">
                                            <span className={`${trader.gainPercentage >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-black`}>
                                                {trader.gainPercentage >= 0 ? '+' : ''}{trader.gainPercentage}%
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-black text-slate-400 text-right">{trader.tradesCount}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarketLeaderboard;
