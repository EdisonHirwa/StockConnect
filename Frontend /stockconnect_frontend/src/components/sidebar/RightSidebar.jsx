import React, { useEffect, useState, useCallback } from 'react';
import { Download, Upload, Wallet, RefreshCw } from 'lucide-react';
import { fetchWallet, fetchTransactions, depositFunds, withdrawFunds } from '../../services/walletService';

const USD_TO_RWF = 1400;
const fmtRWF = (v) => `RWF ${Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtUSD = (v) => `$${(Number(v ?? 0) / USD_TO_RWF).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const TYPE_BADGE = {
  DEPOSIT:    { label: 'Deposit',    color: 'bg-emerald-50 text-emerald-700' },
  WITHDRAWAL: { label: 'Withdrawal', color: 'bg-red-50 text-red-700' },
  TRADE_BUY:  { label: 'Buy',        color: 'bg-blue-50 text-blue-700' },
  TRADE_SELL: { label: 'Sell',       color: 'bg-amber-50 text-amber-700' },
  FEE:        { label: 'Fee',        color: 'bg-slate-100 text-slate-600' },
};

// ── Quick Amount Modal ────────────────────────────────────────────────────────

const QuickModal = ({ title, onConfirm, onClose, loading, error, isDeposit }) => {
  const [amount, setAmount]     = useState('');
  const [currency, setCurrency] = useState('RWF');
  const rwfAmt = currency === 'USD' ? Number(amount) * USD_TO_RWF : Number(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs mx-4 flex flex-col gap-4">
        <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3 py-2 rounded-xl">{error}</div>}

        {isDeposit && (
          <div className="flex gap-2">
            {['RWF', 'USD'].map((c) => (
              <button key={c} onClick={() => setCurrency(c)}
                className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${currency === c ? 'bg-[#fad059] border-[#fad059] text-slate-900' : 'border-slate-200 text-slate-500'}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
            {isDeposit && currency === 'USD' ? '$' : 'RWF'}
          </span>
          <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium text-sm"
          />
        </div>

        {isDeposit && currency === 'USD' && amount && rwfAmt > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 font-medium">
            ≈ <strong>RWF {rwfAmt.toLocaleString()}</strong> at 1 USD = {USD_TO_RWF.toLocaleString()} RWF
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
          <button disabled={loading || !amount || rwfAmt <= 0} onClick={() => onConfirm(rwfAmt)}
            className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-colors disabled:opacity-50 ${isDeposit ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}>
            {loading ? '…' : title}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Right Sidebar ─────────────────────────────────────────────────────────────

const RightSidebar = () => {
  const [wallet, setWallet]       = useState(null);
  const [txns, setTxns]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [view, setView]           = useState('RWF'); // 'RWF' | 'USD'
  const [modal, setModal]         = useState(null);  // 'deposit' | 'withdraw' | null
  const [modalErr, setModalErr]   = useState('');
  const [modalLoad, setModalLoad] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [w, t] = await Promise.all([fetchWallet(), fetchTransactions()]);
      setWallet(w);
      setTxns(t);
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDeposit = async (amount) => {
    setModalLoad(true); setModalErr('');
    try { const w = await depositFunds(amount); setWallet(w); const t = await fetchTransactions(); setTxns(t); setModal(null); }
    catch (e) { setModalErr(e.message); }
    finally { setModalLoad(false); }
  };

  const handleWithdraw = async (amount) => {
    setModalLoad(true); setModalErr('');
    try { const w = await withdrawFunds(amount); setWallet(w); const t = await fetchTransactions(); setTxns(t); setModal(null); }
    catch (e) { setModalErr(e.message); }
    finally { setModalLoad(false); }
  };

  const balance   = Number(wallet?.balance ?? 0);
  const available = balance - Number(wallet?.lockedBalance ?? 0);
  const displayBal = view === 'RWF' ? fmtRWF(balance) : fmtUSD(balance);
  const recentTxns = txns.slice(0, 5);

  return (
    <div className="w-[320px] h-full bg-slate-50 flex flex-col p-6 overflow-y-auto no-scrollbar border-l border-slate-200 shrink-0">

      {/* Portfolio Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Portfolio</h2>
        <button onClick={load} className="text-slate-400 hover:text-slate-600 transition-colors">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors duration-500" />
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3 relative z-10">
          <Wallet size={16} /> Portfolio Value
        </div>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight relative z-10">$ 0.00</div>
      </div>

      {/* Recent Transactions */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h2>
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100 min-h-[140px] flex flex-col">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider px-1">
          <span>Type</span>
          <span>Amount</span>
        </div>
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">Loading…</div>
        ) : recentTxns.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400">No transactions yet</div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentTxns.map((tx) => {
              const badge = TYPE_BADGE[tx.type] ?? { label: tx.type, color: 'bg-slate-100 text-slate-600' };
              const isCredit = tx.type === 'DEPOSIT' || tx.type === 'TRADE_SELL';
              const amt = Math.abs(Number(tx.amount));
              return (
                <div key={tx.id} className="flex items-center justify-between px-1">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${badge.color}`}>{badge.label}</span>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isCredit ? '+' : '-'}{view === 'RWF' ? fmtRWF(amt) : fmtUSD(amt)}
                    </div>
                    <div className="text-xs text-slate-400">{fmtDate(tx.createdAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Wallets Section */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">Wallets</h2>
      <div className="bg-white rounded-2xl p-2 mb-4 shadow-sm border border-slate-100 flex gap-1">
        {['RWF', 'USD'].map((c) => (
          <button key={c} onClick={() => setView(c)}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-colors ${view === c ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-700'}`}>
            {c} Wallet
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            {loading ? '—' : displayBal}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Available: {loading ? '—' : (view === 'RWF' ? fmtRWF(available) : fmtUSD(available))}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">
            Locked: {loading ? '—' : (view === 'RWF' ? fmtRWF(wallet?.lockedBalance) : fmtUSD(wallet?.lockedBalance))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-2">
        <button onClick={() => { setModal('deposit'); setModalErr(''); }}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
          <Download size={18} /> Deposit
        </button>
        <button onClick={() => { setModal('withdraw'); setModalErr(''); }}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-4 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 hover:border-slate-300">
          <Upload size={18} /> Withdraw
        </button>
      </div>

      {/* Modals */}
      {modal === 'deposit' && (
        <QuickModal title="Deposit" isDeposit onConfirm={handleDeposit} onClose={() => setModal(null)} loading={modalLoad} error={modalErr} />
      )}
      {modal === 'withdraw' && (
        <QuickModal title="Withdraw" isDeposit={false} onConfirm={handleWithdraw} onClose={() => setModal(null)} loading={modalLoad} error={modalErr} />
      )}
    </div>
  );
};

export default RightSidebar;
