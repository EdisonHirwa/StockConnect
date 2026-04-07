import React from 'react';

const traders = [
  { rank: 1, name: 'Nkurunziza K.', initial: 'NK', starting: '1,000,000', netWorth: '1,384,000', gain: '+38.4%', trades: 89, color: 'bg-amber-500' },
  { rank: 2, name: 'Alice Mukiza', initial: 'AM', starting: '1,000,000', netWorth: '1,291,000', gain: '+29.1%', trades: 64, color: 'bg-blue-500' },
  { rank: 3, name: 'P. Umwali', initial: 'PU', starting: '1,000,000', netWorth: '1,218,000', gain: '+21.8%', trades: 47, color: 'bg-emerald-500' },
  { rank: 4, name: 'Jean Ntare', initial: 'JN', starting: '1,000,000', netWorth: '1,144,000', gain: '+14.4%', trades: 52, color: 'bg-indigo-500' },
  { rank: 5, name: 'C. Rusa', initial: 'CR', starting: '1,000,000', netWorth: '1,072,000', gain: '+7.2%', trades: 29, color: 'bg-rose-500' },
];

const MarketLeaderboard = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leaderboard</h1>
                    <p className="text-slate-500 font-bold mt-1">Trader performance rankings — RP Karongi · Semester 1</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-[#fad059] rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                    Export Grades
                </button>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Participants', value: '342' },
                    { label: 'Best gain', value: '+38.4%', color: 'text-emerald-600' },
                    { label: 'Avg. portfolio', value: 'RWF 1.24M' },
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
                            {traders.map((trader) => (
                                <tr key={trader.rank} className={`hover:bg-slate-50 transition-colors group ${trader.rank === 1 ? 'bg-slate-50/30' : ''}`}>
                                    <td className="px-8 py-6 font-black text-slate-400">{trader.rank}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full ${trader.color} flex items-center justify-center text-white font-black text-xs shadow-lg`}>
                                                {trader.initial}
                                            </div>
                                            <span className="font-black text-slate-900">{trader.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-slate-500">RWF {trader.starting}</td>
                                    <td className="px-8 py-6 font-black text-slate-900">RWF {trader.netWorth}</td>
                                    <td className="px-8 py-6">
                                        <span className="text-emerald-600 font-black">{trader.gain}</span>
                                    </td>
                                    <td className="px-8 py-6 font-black text-slate-400 text-right">{trader.trades}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarketLeaderboard;
