import React, { useEffect, useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import { marketAdminService } from '../../services/marketAdminService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getAvatarColor = (index) => {
  const colors = ['bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-rose-500', 'bg-purple-500', 'bg-cyan-500'];
  return colors[index % colors.length];
};

const exportGradesToPDF = (traders, session) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const sessionLabel = session ? `${session.institutionName} — ${session.academicPeriod}` : 'General Session';

    // Dark header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, doc.internal.pageSize.width, 28, 'F');
    doc.setTextColor(250, 208, 89);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('StockConnect', 14, 13);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Leaderboard & Grading Report', 14, 22);
    doc.setFontSize(8);
    doc.text(`Session: ${sessionLabel}`, doc.internal.pageSize.width / 2, 22, { align: 'center' });
    doc.text(`Generated: ${today}`, doc.internal.pageSize.width - 14, 22, { align: 'right' });

    // Summary stats box
    const topGain = traders.length > 0 ? Math.max(...traders.map(t => t.gainPercentage)) : 0;
    const avgNW = traders.length > 0 ? traders.reduce((s, t) => s + t.currentNetWorth, 0) / traders.length : 0;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 33, doc.internal.pageSize.width - 28, 18, 3, 3, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Participants: ${traders.length}`, 20, 40);
    doc.text(`Best Gain: +${topGain.toFixed(1)}%`, 70, 40);
    doc.text(`Avg. Portfolio: RWF ${(avgNW / 1000000).toFixed(2)}M`, 130, 40);
    doc.text(`Top Trader: ${traders[0]?.name || 'N/A'}`, 20, 47);

    // Ranked table
    autoTable(doc, {
        startY: 56,
        head: [['Rank', 'Trader Name', 'Starting Balance (RWF)', 'Current Net Worth (RWF)', 'Gain (%)', 'Trades']],
        body: traders.map((t, i) => [
            i + 1,
            t.name,
            `RWF ${Number(t.startingBalance).toLocaleString()}`,
            `RWF ${Number(t.currentNetWorth).toLocaleString()}`,
            `${t.gainPercentage >= 0 ? '+' : ''}${t.gainPercentage}%`,
            t.tradesCount
        ]),
        headStyles: { fillColor: [15, 23, 42], textColor: [250, 208, 89], fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9, textColor: [30, 41, 59] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'center' }
        },
        didParseCell(data) {
            if (data.section === 'body' && data.column.index === 4) {
                const val = parseFloat(data.cell.raw);
                data.cell.styles.textColor = val >= 0 ? [5, 150, 105] : [220, 38, 38];
                data.cell.styles.fontStyle = 'bold';
            }
            if (data.section === 'body' && data.row.index === 0) {
                data.cell.styles.fillColor = [254, 249, 231]; // gold tint for #1
            }
        },
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
    a.download = `leaderboard_grades_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

    // Compute days running from session start date, or fallback to '-'
    const daysRunning = session?.sessionDate
        ? Math.max(1, Math.floor((new Date() - new Date(session.sessionDate)) / (1000 * 60 * 60 * 24)) + 1)
        : '—';

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leaderboard</h1>
                    <p className="text-slate-500 font-bold mt-1">
                        Trader performance rankings — {session ? `${session.institutionName} · ${session.academicPeriod}` : 'General Rankings'}
                    </p>
                </div>
                <button 
                    onClick={() => exportGradesToPDF(filteredTraders, session)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-[#fad059] rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                    Export Grades
                </button>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Participants', value: loading ? '—' : traders.length },
                    { label: 'Best gain', value: loading ? '—' : `+${topGain.toFixed(1)}%`, color: 'text-emerald-600' },
                    { label: 'Avg. portfolio', value: loading ? '—' : `RWF ${(avgNetWorth / 1000000).toFixed(2)}M` },
                    { label: 'Days running', value: loading ? '—' : daysRunning },
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
                    <button 
                        onClick={() => exportGradesToPDF(filteredTraders, session)}
                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl transition-all active:scale-95"
                    >
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
