import React, { useEffect, useState } from 'react';
import { Users, BookOpen, Repeat, BarChart3, ArrowUpRight, ArrowDownRight, MoreHorizontal, RefreshCw } from 'lucide-react';
import { marketAdminService } from '../../services/marketAdminService';
import { useSearch } from '../../context/SearchContext';
import { companyService } from '../../services/companyService';

const MarketOverview = () => {
    const [stats, setStats] = useState(null);
    const [companies, setCompanies] = useState([]);
    const { searchTerm } = useSearch();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [s, c, sess] = await Promise.all([
                marketAdminService.getStats(),
                companyService.getAllCompanies(),
                marketAdminService.getSession()
            ]);
            setStats(s);
            setCompanies(c);
            setSession(sess);
        } catch (error) {
            console.error('Failed to load market overview data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const kpiData = [
        { label: 'Active Traders', value: stats?.activeTraders?.toString() || '—', subValue: 'Registered users', color: 'text-emerald-400', icon: Users },
        { label: 'Orders today', value: stats?.ordersToday?.toString() || '—', subValue: 'Total market depth', color: 'text-amber-400', icon: BookOpen },
        { label: 'Trades executed', value: stats?.tradesExecuted?.toString() || '—', subValue: 'Matches found', color: 'text-blue-400', icon: Repeat },
        { label: 'Volume (RWF)', value: stats?.totalVolumeRWF ? (stats.totalVolumeRWF / 1000000).toFixed(1) + 'M' : '—', subValue: 'Cumulative value', color: 'text-indigo-400', icon: BarChart3 },
    ];

    const filteredCompanies = companies.filter(c => 
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Market Overview</h1>
                    <p className="text-slate-500 font-bold mt-1">Real-time exchange monitoring for {session ? `${session.institutionName}` : 'StockConnect'}</p>
                </div>
                <button 
                    onClick={loadData}
                    className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm active:scale-95"
                >
                    <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{kpi.label}</p>
                            <kpi.icon size={20} className={`${kpi.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{loading ? '—' : kpi.value}</h3>
                        <p className="text-xs font-bold text-slate-500">
                            {kpi.subValue}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Market Watch */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            Market watch
                        </h3>
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <div className="py-20 text-center text-slate-400 font-bold">Quoting market prices...</div>
                        ) : companies.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-medium">No companies listed yet.</div>
                        ) : (
                            <div className="space-y-1">
                                {filteredCompanies.map((stock, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer">
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight">{stock.tickerSymbol}</h4>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stock.companyName}</p>
                                        </div>
                                        <div className="text-right flex items-center gap-10">
                                            <div>
                                                <p className="text-sm font-black text-slate-900">
                                                    <span className="text-emerald-600">
                                                        RWF {Number(stock.currentPrice).toLocaleString()}
                                                    </span>
                                                    <span className="ml-2 text-xs font-bold text-emerald-500">
                                                        LIVE
                                                    </span>
                                                </p>
                                                <div className="mt-2 h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                                    <div className="h-full rounded-full transition-all duration-1000 bg-emerald-500" style={{ width: '65%' }}></div>
                                                </div>
                                            </div>
                                            <MoreHorizontal size={18} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Order Book - Summary */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                            Latest activity
                        </h3>
                        <span className="text-[10px] font-black text-emerald-600 animate-pulse bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 tracking-widest">LIVE</span>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                            <Repeat size={32} />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2">Market Pulse</h4>
                        <p className="text-sm font-bold text-slate-500 max-w-[200px]">
                            Check the Order Book and Trade History for granular data.
                        </p>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100">
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Last update: {new Date().toLocaleTimeString()}</span>
                            <span>System Healthy</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketOverview;
