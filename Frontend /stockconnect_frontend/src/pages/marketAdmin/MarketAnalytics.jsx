import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { DownloadCloud, Layers, RefreshCw } from 'lucide-react';
import { marketAdminService } from '../../services/marketAdminService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const exportAnalyticsPDF = (data) => {
    if (!data) return;
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Dark header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, doc.internal.pageSize.width, 28, 'F');
    doc.setTextColor(250, 208, 89);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('StockConnect', 14, 13);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Market Analytics Report', 14, 22);
    doc.setFontSize(8);
    doc.text(`Generated: ${today}`, doc.internal.pageSize.width - 14, 22, { align: 'right' });

    let currentY = 33;

    // Industry Distribution table
    if (data.industryDistribution && Object.keys(data.industryDistribution).length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Industry Distribution', 14, currentY);
        currentY += 4;
        autoTable(doc, {
            startY: currentY,
            head: [['Sector / Industry', 'Listed Companies']],
            body: Object.entries(data.industryDistribution).map(([name, count]) => [name, count]),
            headStyles: { fillColor: [15, 23, 42], textColor: [250, 208, 89], fontStyle: 'bold', fontSize: 9 },
            bodyStyles: { fontSize: 9, textColor: [30, 41, 59] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            columnStyles: { 1: { halign: 'center' } },
            styles: { cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.1 },
            margin: { left: 14, right: 14 },
        });
        currentY = doc.lastAutoTable.finalY + 12;
    }

    // Volume History table
    if (data.volumeHistory && data.volumeHistory.length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Trading Volume History', 14, currentY);
        currentY += 4;
        autoTable(doc, {
            startY: currentY,
            head: [['Date', 'Buy Volume', 'Sell Volume', 'Net']],
            body: data.volumeHistory.map(v => {
                const net = Number(v.buyVolume) - Number(v.sellVolume);
                return [v.date, Number(v.buyVolume).toLocaleString(), Number(v.sellVolume).toLocaleString(), (net >= 0 ? '+' : '') + net.toLocaleString()];
            }),
            headStyles: { fillColor: [15, 23, 42], textColor: [250, 208, 89], fontStyle: 'bold', fontSize: 9 },
            bodyStyles: { fontSize: 9, textColor: [30, 41, 59] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            didParseCell(d) {
                if (d.section === 'body' && d.column.index === 3) {
                    d.cell.styles.textColor = String(d.cell.raw).startsWith('+') ? [5, 150, 105] : [220, 38, 38];
                    d.cell.styles.fontStyle = 'bold';
                }
            },
            styles: { cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.1 },
            margin: { left: 14, right: 14 },
        });
    }

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
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

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
          <button 
            onClick={() => exportAnalyticsPDF(data)}
            disabled={!data || loading}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
          >
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
        {loading || !data ? (
          <p className="text-slate-400 font-medium mt-4">Generating insights from live data...</p>
        ) : (() => {
          const topSector = industryChartData.length > 0
            ? industryChartData.reduce((a, b) => a.value >= b.value ? a : b)
            : null;
          const totalBuyVol = volumeChartData.reduce((s, v) => s + v.buy, 0);
          const totalSellVol = volumeChartData.reduce((s, v) => s + v.sell, 0);
          const buySellRatio = totalSellVol > 0 ? (totalBuyVol / totalSellVol).toFixed(2) : 'N/A';
          return (
            <ul className="space-y-4 mt-5">
              {topSector && (
                <li className="flex gap-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    <span className="font-bold text-emerald-600">{topSector.name}</span> is the dominant sector with <span className="font-bold text-slate-900">{topSector.value} {topSector.value === 1 ? 'company' : 'companies'}</span> listed, representing the largest share of the exchange by company count.
                  </p>
                </li>
              )}
              {volumeChartData.length > 0 ? (
                <li className="flex gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    Buy/Sell ratio is <span className="font-bold text-slate-900">{buySellRatio}x</span> — total buy volume: <span className="font-bold text-emerald-600">{totalBuyVol.toLocaleString()}</span>, sell volume: <span className="font-bold text-rose-600">{totalSellVol.toLocaleString()}</span> across all tracked periods.
                  </p>
                </li>
              ) : null}
              <li className="flex gap-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Total of <span className="font-bold text-slate-900">{totalCompaniesCount} {totalCompaniesCount === 1 ? 'company' : 'companies'}</span> are currently listed across <span className="font-bold text-indigo-600">{industryChartData.length} {industryChartData.length === 1 ? 'sector' : 'sectors'}</span> on this exchange.
                </p>
              </li>
            </ul>
          );
        })()}
      </div>

    </div>
  );
};

export default MarketAnalytics;
