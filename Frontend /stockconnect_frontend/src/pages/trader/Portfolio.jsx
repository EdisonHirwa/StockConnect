import React, { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Briefcase, ShieldCheck, BarChart2, User } from 'lucide-react';
import { fetchPortfolio } from '../../services/portfolioService';
import { useAuth } from '../../context/AuthContext';

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtRWF = (v) => `RWF ${Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtPct = (v) => `${v >= 0 ? '+' : ''}${Number(v).toFixed(2)}%`;

const ROLE_META = {
  TRADER: {
    label: 'Trader',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    desc: 'Active market participant buying and selling shares.',
  },
  MARKET_ADMIN: {
    label: 'Market Administrator',
    icon: ShieldCheck,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: 'Manages market operations including company listings and market status.',
  },
  COMPANY_REP: {
    label: 'Company Representative',
    icon: BarChart2,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    desc: 'Represents a listed company and manages share issuance.',
  },
  SUPER_ADMIN: {
    label: 'Super Administrator',
    icon: ShieldCheck,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    desc: 'Full system access and user management.',
  },
};

// ── SVG Donut Chart ───────────────────────────────────────────────────────────

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

const DonutChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-48 h-48 rounded-full border-[28px] border-slate-100 mx-auto flex items-center justify-center">
        <span className="text-xs text-slate-400 font-medium text-center px-4">No holdings</span>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);
  let cumAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = Math.cos(cumAngle), y1 = Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = Math.cos(cumAngle), y2 = Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M 0 0 L ${x1} ${y1} A 1 1 0 ${large} 1 ${x2} ${y2} Z`;
    return { path, color: CHART_COLORS[i % CHART_COLORS.length] };
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <svg viewBox="-1.3 -1.3 2.6 2.6" className="w-48 h-48">
        <circle cx="0" cy="0" r="1.3" fill="white" />
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} />
        ))}
        <circle cx="0" cy="0" r="0.65" fill="white" />
      </svg>
      <div className="flex flex-wrap justify-center gap-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="text-xs font-semibold text-slate-600">{d.label} ({fmtPct(d.value / total * 100)})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Portfolio Page ────────────────────────────────────────────────────────────

const Portfolio = () => {
  const { role, userId } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const data = await fetchPortfolio();
      setHoldings(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Derived metrics ─────────────────────────────────────────────────────────
  const totalValue    = holdings.reduce((s, h) => s + Number(h.totalValue), 0);
  const totalCost     = holdings.reduce((s, h) => s + Number(h.averageBuyPrice) * Number(h.quantity), 0);
  const totalPnl      = totalValue - totalCost;
  const totalPnlPct   = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const chartData = holdings.map((h) => ({
    label: h.tickerSymbol,
    value: Number(h.totalValue),
  }));

  const roleMeta = ROLE_META[role] ?? ROLE_META['TRADER'];
  const RoleIcon = roleMeta.icon;

  return (
    <div className="p-8 max-w-5xl space-y-12">

      {/* ── Role-aware Profile Banner ───────────────────────────────────────── */}
      <div className={`flex items-start gap-5 p-6 rounded-2xl border ${roleMeta.border} ${roleMeta.bg}`}>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${roleMeta.bg} border ${roleMeta.border} shrink-0`}>
          <RoleIcon size={26} className={roleMeta.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-extrabold text-slate-900">My Portfolio</h2>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${roleMeta.border} ${roleMeta.color} ${roleMeta.bg}`}>
              <RoleIcon size={12} />
              {roleMeta.label}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">{roleMeta.desc}</p>
        </div>
        <button onClick={load} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 mt-1">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ── Summary Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Portfolio Value */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            <Briefcase size={15} />
            <span className="text-xs font-bold uppercase tracking-wide">Portfolio Value</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-0.5 mt-3">
            {loading ? '—' : fmtRWF(totalValue)}
          </div>
        </div>

        {/* Total Cost Basis */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            <User size={15} />
            <span className="text-xs font-bold uppercase tracking-wide">Cost Basis</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-0.5 mt-3">
            {loading ? '—' : fmtRWF(totalCost)}
          </div>
        </div>

        {/* Unrealized P&L */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            {totalPnl >= 0 ? <TrendingUp size={15} className="text-emerald-500" /> : <TrendingDown size={15} className="text-red-500" />}
            <span className="text-xs font-bold uppercase tracking-wide">Unrealized P&amp;L</span>
          </div>
          <div className={`text-2xl font-extrabold mb-0.5 mt-3 ${totalPnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {loading ? '—' : (totalPnl >= 0 ? '+' : '') + fmtRWF(totalPnl)}
          </div>
          <div className={`text-sm font-semibold ${totalPnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {loading ? '' : fmtPct(totalPnlPct)}
          </div>
        </div>
      </div>

      {/* ── Allocation Chart ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-8">Holdings Allocation</h2>
        {loading ? (
          <div className="flex justify-center py-10 text-slate-400 text-sm">Loading…</div>
        ) : (
          <DonutChart data={chartData} />
        )}
      </div>

      {/* ── Holdings Table ───────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">My Holdings</h2>
        {loading ? (
          <div className="flex justify-center py-10 text-slate-400 text-sm">Loading…</div>
        ) : holdings.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-sm font-medium shadow-sm">
            No holdings yet. Start trading to build your portfolio.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-4 text-left">Ticker</th>
                  <th className="px-6 py-4 text-left">Company</th>
                  <th className="px-6 py-4 text-right">Shares</th>
                  <th className="px-6 py-4 text-right">Avg Buy</th>
                  <th className="px-6 py-4 text-right">Current Price</th>
                  <th className="px-6 py-4 text-right">Total Value</th>
                  <th className="px-6 py-4 text-right">P&amp;L</th>
                  <th className="px-6 py-4 text-right">Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {holdings.map((h) => {
                  const pnl     = Number(h.unrealizedPnl);
                  const pnlPct  = Number(h.averageBuyPrice) > 0
                    ? ((Number(h.currentPrice) - Number(h.averageBuyPrice)) / Number(h.averageBuyPrice)) * 100
                    : 0;
                  const allocPct = totalValue > 0 ? (Number(h.totalValue) / totalValue) * 100 : 0;

                  return (
                    <tr key={h.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-extrabold text-slate-900">{h.tickerSymbol}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{h.companyName}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-800">
                        {Number(h.quantity).toLocaleString()}
                        {h.lockedQuantity > 0 && (
                          <div className="text-xs text-amber-500 font-medium">🔒 {Number(h.lockedQuantity).toLocaleString()} locked</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 font-medium">
                        <div>{fmtRWF(h.averageBuyPrice)}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 font-medium">
                        <div>{fmtRWF(h.currentPrice)}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        <div>{fmtRWF(h.totalValue)}</div>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        <div>{pnl >= 0 ? '+' : ''}{fmtRWF(pnl)}</div>
                        <div className="text-xs">{fmtPct(pnlPct)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-slate-800">{fmtPct(allocPct)}</div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(allocPct, 100)}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Portfolio;
