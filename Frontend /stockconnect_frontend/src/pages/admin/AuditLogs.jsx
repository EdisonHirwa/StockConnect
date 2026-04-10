import React from 'react';
import { useSearch } from '../../context/SearchContext';

const logs = [
  { timestamp: '2025-04-07 09:14:02', admin: 'admin@system', action: 'TENANT_CREATE', target: 'CMA Training', ip: '192.168.1.4', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { timestamp: '2025-04-07 09:00:00', admin: 'j.ndayisenga', action: 'SESSION_OPEN', target: 'RP Karongi', ip: '10.0.0.5', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { timestamp: '2025-04-07 08:47:11', admin: 'admin@system', action: 'WALLET_ADJUST', target: 'wallet #w-0041', ip: '10.0.0.5', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { timestamp: '2025-04-07 08:22:33', admin: 'admin@system', action: 'TRADE_REVERSAL', target: 'trade #t-8892', ip: '192.168.1.12', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  { timestamp: '2025-04-06 17:05:44', admin: 'admin@system', action: 'ROLE_CHANGE', target: 'n.habimana → AUDITOR', ip: '10.0.0.5', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
];

const AuditLogs = () => {
    const { searchTerm } = useSearch();
    
    const filteredLogs = logs.filter(log => 
        log.admin.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.target.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Audit Logs</h1>
                <p className="text-slate-500 font-bold mt-1">Immutable record of all administrative system actions.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900">All admin actions</h3>
                    <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl transition-all border border-slate-100 active:scale-95">
                        Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Admin</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Target</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right px-12">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLogs.map((log, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6 text-sm font-black text-slate-400 font-mono">{log.timestamp}</td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-900">{log.admin}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black border tracking-wider ${log.color}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-600">
                                        {log.target}
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-400 text-right px-12 font-mono">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 bg-slate-50/50 text-center border-t border-slate-50">
                    <button className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                        Load more actions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
