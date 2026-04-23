import React, { useEffect, useState } from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { marketAdminService } from '../../services/marketAdminService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const exportToPDF = (trades) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Header bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, doc.internal.pageSize.width, 22, 'F');
    doc.setTextColor(250, 208, 89); // #fad059
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('StockConnect', 14, 14);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Market Admin — Executed Trades Report', 60, 14);
    doc.setFontSize(9);
    doc.text(`Generated: ${today}`, doc.internal.pageSize.width - 60, 14);

    // Table
    autoTable(doc, {
        startY: 28,
        head: [['#', 'Company', 'Buyer', 'Seller', 'Exec. Price (RWF)', 'Qty', 'Value (RWF)', 'Time']],
        body: trades.map((t, i) => [
            i + 1,
            t.tickerSymbol,
            t.buyerName,
            t.sellerName,
            `RWF ${Number(t.executionPrice).toLocaleString()}`,
            t.executionQuantity,
            `RWF ${Number(t.totalValue).toLocaleString()}`,
            new Date(t.executedAt).toLocaleString()
        ]),
        headStyles: { fillColor: [15, 23, 42], textColor: [250, 208, 89], fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.1 },
        margin: { left: 14, right: 14 },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(`Page ${i} of ${pageCount} — StockConnect Confidential`, 14, doc.internal.pageSize.height - 6);
    }

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades_report_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const TradeHistory = () => {
    const [trades, setTrades] = useState([]);
    const { searchTerm } = useSearch();
    const [loading, setLoading] = useState(true);

    const loadTrades = async () => {
        setLoading(true);
        try {
            const data = await marketAdminService.getAllTrades();
            setTrades(data);
        } catch (error) {
            console.error('Failed to load trades', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrades();
    }, []);

    const fmtDate = (dt) => 
        new Date(dt).toLocaleTimeString('en-US', { hour12: false });

    const filteredTrades = (trades || []).filter(t => 
        (t.tickerSymbol?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (t.buyerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (t.sellerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        String(t.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executed Trades</h1>
                    <p className="text-slate-500 font-bold mt-1">Full audit trail of matched and settled trades</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={loadTrades}
                        className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button 
                        onClick={() => exportToPDF(filteredTrades)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-[#fad059] rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900">Today's trades</h3>
                    <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Updates</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-20 text-center text-slate-400 font-bold">Auditing records...</div>
                    ) : trades.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium">No trades have been executed yet.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">#</th>
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
                                {filteredTrades.map((trade, index) => (
                                    <tr key={trade.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-6 text-sm font-black text-slate-400 font-mono">{index + 1}</td>
                                        <td className="px-8 py-6 text-sm font-black text-slate-900">{trade.tickerSymbol}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                                                    {trade.buyerName.substring(0, 2)}
                                                </div>
                                                <span className="text-sm font-black text-slate-700">{trade.buyerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-black text-slate-700">{trade.sellerName}</td>
                                        <td className="px-8 py-6 text-sm font-black text-emerald-600 italic tracking-tight">RWF {Number(trade.executionPrice).toLocaleString()}</td>
                                        <td className="px-8 py-6 text-sm font-bold text-slate-900">{trade.executionQuantity}</td>
                                        <td className="px-8 py-6 text-sm font-black text-slate-900">RWF {Number(trade.totalValue).toLocaleString()}</td>
                                        <td className="px-8 py-6 text-sm font-black text-slate-400 text-right">{fmtDate(trade.executedAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TradeHistory;
