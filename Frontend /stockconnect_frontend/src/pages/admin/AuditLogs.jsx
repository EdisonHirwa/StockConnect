import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import { superAdminService } from '../../services/superAdminService';

const AuditLogs = () => {
    const { searchTerm } = useSearch();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await superAdminService.getAuditLogs();
                setLogs(data);
            } catch (error) {
                console.error('Failed to load audit logs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        (log.adminEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (log.action?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (log.target?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Audit Logs</h1>
                <p className="text-slate-500 font-bold mt-1">Immutable record of all administrative and system actions.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900">System Activity</h3>
                    <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl transition-all border border-slate-100 active:scale-95">
                        Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Actor</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Target</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right px-12">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-6 text-xs font-black text-slate-400 font-mono">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-sm font-black text-slate-900">{log.adminEmail}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black border tracking-wider ${log.statusColor}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-black text-slate-600">
                                            {log.target}
                                        </td>
                                        <td className="px-8 py-6 text-xs font-black text-slate-400 text-right px-12 font-mono">{log.ipAddress}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-bold">
                                        No logs found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 bg-slate-50/50 text-center border-t border-slate-50">
                    <button className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                        View Full History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
