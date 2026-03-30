import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Wallet as WalletIcon, Upload, Download, ArrowUpDown, RefreshCw } from 'lucide-react';
import { fetchWallet, fetchTransactions, depositFunds, withdrawFunds } from '../../services/walletService';

const USD_TO_RWF = 1400;
const fmtRWF = (v) => `RWF ${Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtUSD = (v) => `$${(Number(v ?? 0) / USD_TO_RWF).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (dt) =>
  dt ? new Date(dt).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const TYPE_BADGE = {
  DEPOSIT:    { label: 'Deposit',    color: 'bg-emerald-50 text-emerald-700' },
  WITHDRAWAL: { label: 'Withdrawal', color: 'bg-red-50 text-red-700' },
  TRADE_BUY:  { label: 'Buy',        color: 'bg-blue-50 text-blue-700' },
  TRADE_SELL: { label: 'Sell',        color: 'bg-amber-50 text-amber-700' },
  FEE:        { label: 'Fee',         color: 'bg-slate-100 text-slate-600' },
};


// ── Amount Modal ──────────────────────────────────────────────────────────────

const AmountModal = ({ title, buttonLabel, buttonColor, onConfirm, onClose, loading, error, allowCurrency = false }) => {
  const [amount,   setAmount]   = useState('');
  const [currency, setCurrency] = useState('RWF');

  const rwfAmount = currency === 'USD' ? Number(amount) * USD_TO_RWF : Number(amount);
  const valid     = amount && rwfAmount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col gap-5">
        <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Currency selector — only shown for deposits */}
        {allowCurrency && (
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Currency</label>
            <div className="flex gap-3">
              {['RWF', 'USD'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                    currency === c
                      ? 'bg-[#fad059] border-[#fad059] text-slate-900 shadow-sm'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amount input */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Amount ({currency === 'USD' && allowCurrency ? 'USD' : 'RWF'})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              {allowCurrency && currency === 'USD' ? '$' : 'RWF'}
            </span>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-14 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
            />
          </div>
        </div>

        {/* Conversion preview */}
        {allowCurrency && currency === 'USD' && amount && rwfAmount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-medium">
            ≈ <span className="font-extrabold">RWF {rwfAmount.toLocaleString()}</span> at 1 USD = {USD_TO_RWF.toLocaleString()} RWF
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={loading || !valid}
            onClick={() => onConfirm(rwfAmount)}
            className={`flex-1 py-3 rounded-xl text-white font-bold transition-colors shadow-sm disabled:opacity-50 ${buttonColor}`}
          >
            {loading ? 'Processing…' : buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};


// ── Main Component ────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const Wallet = () => {
  const [wallet, setWallet]         = useState(null);
  const [transactions, setTxns]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [hideBalance, setHide]      = useState(false);
  const [modal, setModal]           = useState(null); // 'deposit' | 'withdraw' | null
  const [modalErr, setModalErr]     = useState('');
  const [modalLoad, setModalLoad]   = useState(false);
  const [page, setPage]             = useState(1);

  // ── Fetch data ─────────────────────────────────────────────────────────────

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [w, t] = await Promise.all([fetchWallet(), fetchTransactions()]);
      setWallet(w);
      setTxns(t);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Deposit / Withdraw handlers ────────────────────────────────────────────

  const handleDeposit = async (amount) => {
    setModalLoad(true);
    setModalErr('');
    try {
      const updated = await depositFunds(amount);
      setWallet(updated);
      const t = await fetchTransactions();
      setTxns(t);
      setModal(null);
      setPage(1);
    } catch (e) {
      setModalErr(e.message);
    } finally {
      setModalLoad(false);
    }
  };

  const handleWithdraw = async (amount) => {
    setModalLoad(true);
    setModalErr('');
    try {
      const updated = await withdrawFunds(amount);
      setWallet(updated);
      const t = await fetchTransactions();
      setTxns(t);
      setModal(null);
      setPage(1);
    } catch (e) {
      setModalErr(e.message);
    } finally {
      setModalLoad(false);
    }
  };

  // ── Pagination ─────────────────────────────────────────────────────────────

  const totalPages   = Math.max(1, Math.ceil(transactions.length / ITEMS_PER_PAGE));
  const pageTxns     = transactions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const available    = wallet ? Number(wallet.balance) - Number(wallet.lockedBalance) : 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900">My Wallet</h1>
        <div className="flex gap-2">
          <button
            onClick={load}
            title="Refresh"
            className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setHide((h) => !h)}
            title={hideBalance ? 'Show balance' : 'Hide balance'}
            className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {hideBalance ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Balance */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[140px] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            <WalletIcon size={16} />
            <span className="font-bold text-xs uppercase tracking-wide">Total Balance</span>
          </div>
          <div className="mb-0.5 text-slate-900 font-extrabold text-2xl">
            {loading ? '—' : hideBalance ? '••••••' : fmtRWF(wallet?.balance)}
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-2">
            {loading || hideBalance ? '' : '≈ ' + fmtUSD(wallet?.balance)}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Last updated: {fmtDate(wallet?.updatedAt)}
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[140px] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-emerald-500">
            <WalletIcon size={16} />
            <span className="font-bold text-xs uppercase tracking-wide">Available</span>
          </div>
          <div className="mb-0.5 text-slate-900 font-extrabold text-2xl">
            {loading ? '—' : hideBalance ? '••••••' : fmtRWF(available)}
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-2">
            {loading || hideBalance ? '' : '≈ ' + fmtUSD(available)}
          </div>
          <div className="text-xs text-slate-400 font-medium">Unlocked funds</div>
        </div>

        {/* Locked Balance */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center min-h-[140px] hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 text-amber-500">
            <WalletIcon size={16} />
            <span className="font-bold text-xs uppercase tracking-wide">Locked</span>
          </div>
          <div className="mb-0.5 text-slate-900 font-extrabold text-2xl">
            {loading ? '—' : hideBalance ? '••••••' : fmtRWF(wallet?.lockedBalance)}
          </div>
          <div className="text-sm text-slate-400 font-semibold mb-2">
            {loading || hideBalance ? '' : '≈ ' + fmtUSD(wallet?.lockedBalance)}
          </div>
          <div className="text-xs text-slate-400 font-medium">Reserved for open orders</div>
        </div>
      </div>


      {/* Action Buttons */}
      <div className="flex justify-center flex-wrap gap-6 mb-16">
        <button
          onClick={() => { setModal('deposit'); setModalErr(''); }}
          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors rounded-2xl w-40 h-24 flex flex-col items-center justify-center gap-2 shadow-sm text-emerald-700 active:scale-95"
        >
          <Upload size={24} className="mb-1" />
          <span className="font-bold text-sm">Deposit</span>
        </button>
        <button
          onClick={() => { setModal('withdraw'); setModalErr(''); }}
          className="bg-red-50 hover:bg-red-100 border border-red-200 transition-colors rounded-2xl w-40 h-24 flex flex-col items-center justify-center gap-2 shadow-sm text-red-600 active:scale-95"
        >
          <Download size={24} className="mb-1" />
          <span className="font-bold text-sm">Withdraw</span>
        </button>
        <button className="bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors rounded-2xl w-40 h-24 flex flex-col items-center justify-center gap-2 shadow-sm text-slate-500 active:scale-95 cursor-not-allowed opacity-60">
          <ArrowUpDown size={24} className="mb-1" />
          <span className="font-bold text-sm">Transfer</span>
        </button>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Transaction History</h2>

        {loading ? (
          <div className="flex justify-center py-10 text-slate-400 text-sm font-medium">Loading…</div>
        ) : transactions.length === 0 ? (
          <div className="flex justify-center py-10 text-slate-400 text-sm font-medium">No transactions yet</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm mb-6">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-6 py-4 text-left">Type</th>
                    <th className="px-6 py-4 text-left">Description</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pageTxns.map((tx) => {
                    const badge = TYPE_BADGE[tx.type] ?? { label: tx.type, color: 'bg-slate-100 text-slate-600' };
                    const isCredit = tx.type === 'DEPOSIT' || tx.type === 'TRADE_SELL';
                    return (
                      <tr key={tx.id} className="bg-white hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{tx.description || '—'}</td>
                        <td className={`px-6 py-4 text-right font-bold`}>
                          <div className={isCredit ? 'text-emerald-600' : 'text-red-600'}>
                            {isCredit ? '+' : ''}{fmtRWF(Math.abs(tx.amount))}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            {isCredit ? '+' : ''}{fmtUSD(Math.abs(tx.amount))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-400 font-medium">{fmtDate(tx.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center text-sm font-bold">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-5 py-2.5 bg-slate-100 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 text-slate-700"
              >
                Previous
              </button>
              <div className="text-slate-800 border border-slate-200 px-6 py-2.5 rounded-xl bg-white shadow-sm">
                Page {page} of {totalPages}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-5 py-2.5 bg-slate-100 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 text-slate-700"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {modal === 'deposit' && (
        <AmountModal
          title="Deposit Funds"
          buttonLabel="Deposit"
          buttonColor="bg-emerald-500 hover:bg-emerald-600"
          onConfirm={handleDeposit}
          onClose={() => setModal(null)}
          loading={modalLoad}
          error={modalErr}
          allowCurrency
        />
      )}
      {modal === 'withdraw' && (
        <AmountModal
          title="Withdraw Funds"
          buttonLabel="Withdraw"
          buttonColor="bg-red-500 hover:bg-red-600"
          onConfirm={handleWithdraw}
          onClose={() => setModal(null)}
          loading={modalLoad}
          error={modalErr}
        />
      )}
    </div>
  );
};

export default Wallet;
