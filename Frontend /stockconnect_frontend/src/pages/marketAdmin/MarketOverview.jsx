import React from 'react';
import { Users, BookOpen, Repeat, BarChart3, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MarketOverview = () => {
    const kpiData = [
        { label: 'Active Traders', value: '187', subValue: 'of 342 registered', color: 'text-emerald-400', icon: Users },
        { label: 'Orders today', value: '412', subValue: '+38 last hour', color: 'text-amber-400', icon: BookOpen },
        { label: 'Trades executed', value: '128', subValue: '82% fill rate', color: 'text-blue-400', icon: Repeat },
        { label: 'Volume (RWF)', value: '48.2M', subValue: '+12% vs yesterday', color: 'text-indigo-400', icon: BarChart3 },
    ];

    const marketWatch = [
        { symbol: 'BK', name: 'Bank of Kigali', price: '278.00', change: '+1.8%', isUp: true },
        { symbol: 'MTN', name: 'MTN Rwanda', price: '91.50', change: '-0.5%', isUp: false },
        { symbol: 'BRL', name: 'Bralirwa', price: '142.00', change: '+0.7%', isUp: true },
        { symbol: 'KCB', name: 'KCB Group', price: '314.00', change: '0.0%', isUp: null },
        { symbol: 'IMR', name: 'I&M Rwanda', price: '57.00', change: '+2.1%', isUp: true },
    ];

    const orderBook = {
        symbol: 'BK',
        bids: [
            { price: '278.00', qty: '4,200' },
            { price: '277.50', qty: '3,000' },
            { price: '277.00', qty: '2,100' },
            { price: '276.50', qty: '800' },
        ],
        asks: [
            { price: '278.50', qty: '3,500' },
            { price: '279.00', qty: '2,200' },
            { price: '279.50', qty: '1,800' },
            { price: '280.00', qty: '600' },
        ],
        spread: '0.50'
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{kpi.label}</p>
                            <kpi.icon size={20} className={`${kpi.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{kpi.value}</h3>
                        <p className={`text-xs font-bold ${i === 1 || i === 3 ? 'text-emerald-600' : 'text-slate-500'}`}>
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
                        <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-[#fad059] font-black text-sm rounded-xl transition-all shadow-lg active:scale-95">
                            Manage
                        </button>
                    </div>
                    <div className="p-4">
                        <div className="space-y-1">
                            {marketWatch.map((stock, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer">
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900 tracking-tight">{stock.symbol}</h4>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stock.name}</p>
                                    </div>
                                    <div className="text-right flex items-center gap-10">
                                        <div>
                                            <p className="text-sm font-black text-slate-900">
                                                <span className={`${stock.isUp === true ? 'text-emerald-600' : stock.isUp === false ? 'text-rose-600' : 'text-slate-600'}`}>
                                                    RWF {stock.price}
                                                </span>
                                                <span className={`ml-2 text-xs font-bold ${stock.isUp === true ? 'text-emerald-500' : stock.isUp === false ? 'text-rose-500' : 'text-slate-400'}`}>
                                                    {stock.change}
                                                </span>
                                            </p>
                                            <div className="mt-2 h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ${stock.isUp === true ? 'bg-emerald-500' : stock.isUp === false ? 'bg-rose-500' : 'bg-slate-400'}`}
                                                    style={{ width: stock.isUp === null ? '40%' : stock.isUp ? '75%' : '25%' }}
                                                ></div>
                                            </div>
                                        </div>
                                        <MoreHorizontal size={18} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Order Book */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                            Order book — <span className="text-[#fad059]">{orderBook.symbol}</span>
                        </h3>
                        <span className="text-[10px] font-black text-emerald-600 animate-pulse bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 tracking-widest">LIVE</span>
                    </div>
                    
                    <div className="p-8 flex-1">
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 text-center">BID (Buy)</p>
                                <div className="space-y-4">
                                    {orderBook.bids.map((bid, i) => (
                                        <div key={i} className="flex justify-between items-center group">
                                            <span className="text-emerald-600 font-black text-sm">{bid.price}</span>
                                            <span className="text-slate-400 font-bold text-xs group-hover:text-slate-900 transition-colors">{bid.qty}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-l border-slate-50 pl-8">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 text-center">ASK (Sell)</p>
                                <div className="space-y-4">
                                    {orderBook.asks.map((ask, i) => (
                                        <div key={i} className="flex justify-between items-center group">
                                            <span className="text-rose-600 font-black text-sm">{ask.price}</span>
                                            <span className="text-slate-400 font-bold text-xs group-hover:text-slate-900 transition-colors">{ask.qty}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center">
                            <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Market Spread</p>
                            <div className="px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-sm font-bold text-slate-400 uppercase mr-2 opacity-60 tracking-tighter">RWF</span>
                                <span className="text-xl font-black text-slate-900">{orderBook.spread}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100">
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Last update: Just now</span>
                            <span>Depth: 20 levels</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketOverview;
