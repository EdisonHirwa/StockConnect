const trades = [
  { id: '#t-0128', company: 'BK', buyer: 'N. Jean', seller: 'M. Ineza', price: '278.00', qty: 100, value: '27,800', time: '09:41:22' },
  { id: '#t-0127', company: 'MTN', buyer: 'A. Mukiza', seller: 'P. Umwali', price: '91.50', qty: 200, value: '18,300', time: '09:38:07' },
  { id: '#t-0126', company: 'BRL', buyer: 'C. Rusa', seller: 'J. Kagaba', price: '142.00', qty: 50, value: '7,100', time: '09:22:44' },
];

const TradeHistory = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executed Trades</h1>
                    <p className="text-slate-500 font-bold mt-1">Full audit trail of matched and settled trades</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-[#fad059] rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                    Export
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900">Today's trades</h3>
                    <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Updates</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Trade ID</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Company</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Buyer</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Seller</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Exec. Price</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Value (RWF)</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {trades.map((trade) => (
                                <tr key={trade.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6 text-sm font-black text-slate-400 font-mono">{trade.id}</td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-900">{trade.company}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                {trade.buyer.split(' ')[0][0]}{trade.buyer.split(' ')[1][0]}
                                            </div>
                                            <span className="text-sm font-black text-slate-700">{trade.buyer}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-700">{trade.seller}</td>
                                    <td className="px-8 py-6 text-sm font-black text-emerald-600 italic tracking-tight">{trade.price}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-900">{trade.qty}</td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-900">{trade.value}</td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-400 text-right">{trade.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TradeHistory;
