import React, { useState, useEffect } from 'react';
import { TrendingUp, Wallet as WalletIcon, Download, Upload, X } from 'lucide-react';
import { companyService } from '../../services/companyService';
import { fetchPortfolio } from '../../services/portfolioService';
import { fetchWallet, fetchTransactions } from '../../services/walletService';
import { orderService } from '../../services/orderService';

import { useSearch } from '../../context/SearchContext';

const primaryTabs = ['Markets', 'Positions', 'Orders', 'Transactions', 'Wallet'];
const secondaryTabs = ['Stocks'];

const fmtRWF = (v) => `RWF ${Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDate = (dt) => dt ? new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const Trade = () => {
  const [activePrimary, setActivePrimary] = useState('Markets');
  const [activeSecondary, setActiveSecondary] = useState('Stocks');

  const [companies, setCompanies] = useState([]);
  const { searchTerm } = useSearch();
  const [portfolio, setPortfolio] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sell Modal State
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellLoading, setSellLoading] = useState(false);
  const [sellError, setSellError] = useState(null);
  const [sellSuccess, setSellSuccess] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [comp, port, wal, txs, ord] = await Promise.all([
          companyService.getAllCompanies(),
          fetchPortfolio(),
          fetchWallet(),
          fetchTransactions(),
          orderService.getUserOrders()
        ]);
        setCompanies(comp);
        setPortfolio(port);
        setWallet(wal);
        setTransactions(txs);
        setOrders(ord);
      } catch (e) {
        console.error('Error fetching trade data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [activePrimary]); // Reload when tab changes

  const handleSellClick = (pos) => {
    setSelectedPosition(pos);
    setSellQuantity(1);
    setSellError(null);
    setSellSuccess(null);
  };

  const handleConfirmSell = async () => {
    if (!selectedPosition || sellQuantity <= 0) return;
    setSellLoading(true);
    setSellError(null);
    setSellSuccess(null);

    const availableToSell = selectedPosition.quantity - selectedPosition.lockedQuantity;
    if (sellQuantity > availableToSell) {
      setSellError(`You only have ${availableToSell} shares available to sell.`);
      setSellLoading(false);
      return;
    }

    try {
      await orderService.placeSellOrder({
        companyId: selectedPosition.companyId,
        quantity: sellQuantity,
        targetPrice: selectedPosition.currentPrice,
        type: 'MARKET'
      });
      setSellSuccess(`Successfully placed order to sell ${sellQuantity} shares of ${selectedPosition.tickerSymbol}!`);
      window.dispatchEvent(new Event('walletUpdated'));
      // Optional: Refresh local state manually, or just let users observe it via the tab switch
      setTimeout(() => {
         setSelectedPosition(null);
         setActivePrimary('Orders'); // redirect to view orders
      }, 2000);
    } catch (err) {
      setSellError(err.message || 'Failed to place sell order');
    } finally {
      setSellLoading(false);
    }
  };

  const filteredCompanies = companies.filter(comp => 
    comp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    comp.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          Trade <span className="text-sm font-medium text-slate-500 tracking-normal mt-2">by StockConnect</span>
        </h1>
      </div>

      {/* Primary Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
        {primaryTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePrimary(tab)}
            className={`pb-4 px-1 text-sm font-bold transition-all relative ${
              activePrimary === tab 
                ? 'text-slate-900 border-b-2 border-[#fad059]' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activePrimary === 'Markets' && (
        <>
          {/* Secondary Tabs */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
            {secondaryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSecondary(tab)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeSecondary === tab
                    ? 'bg-slate-900 text-[#fad059] shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeSecondary === 'Stocks' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Trade Stocks</h2>
                    <p className="text-sm text-slate-500 font-medium">Buy and sell company stocks</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Current Price</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Shares Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       <tr><td colSpan="3" className="py-12 text-center text-slate-500">Loading...</td></tr>
                    ) : filteredCompanies.map((comp) => (
                      <tr key={comp.id} className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-sm font-bold text-slate-600 flex-shrink-0 group-hover:scale-105 transition-transform">
                              {comp.tickerSymbol[0]}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-500">{comp.companyName}</span>
                              <span className="text-base font-bold text-slate-900">{comp.tickerSymbol}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-slate-900">
                          {fmtRWF(comp.currentPrice)}
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-slate-600">
                          {Number(comp.totalShares).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {activePrimary === 'Positions' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden mt-2">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Trade Positions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Instrument</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Transaction Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Symbol</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Position</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Open Price</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Current Price</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Number of Lots</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Profit/Loss</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan="9" className="py-12 text-center text-slate-500">Loading...</td></tr>
                ) : portfolio.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center bg-white">
                      <p className="text-sm font-medium text-slate-500">You have no open positions.</p>
                    </td>
                  </tr>
                ) : portfolio.map((pos) => (
                  <tr key={pos.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                    <td className="py-4 px-6 font-bold">{pos.companyName}</td>
                    <td className="py-4 px-6 text-sm">{fmtDate(pos.updatedAt)}</td>
                    <td className="py-4 px-6 font-bold text-slate-600">{pos.tickerSymbol}</td>
                    <td className="py-4 px-6 text-sm">{pos.quantity}</td>
                    <td className="py-4 px-6 text-sm">{fmtRWF(pos.averageBuyPrice)}</td>
                    <td className="py-4 px-6 text-sm">{fmtRWF(pos.currentPrice)}</td>
                    <td className="py-4 px-6 text-sm">{pos.quantity}</td>
                    <td className={`py-4 px-6 text-sm font-bold ${Number(pos.unrealizedPnl) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {Number(pos.unrealizedPnl) >= 0 ? '+' : ''}{fmtRWF(pos.unrealizedPnl)}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium">
                      <button 
                         onClick={() => handleSellClick(pos)}
                         className="text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95"
                      >
                         Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activePrimary === 'Orders' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden mt-2">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Your Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Date</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Type</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Symbol</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Price</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Qty</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Action</th>
                 </tr>
               </thead>
               <tbody>
                {loading ? (
                   <tr><td colSpan="7" className="py-12 text-center text-slate-500">Loading...</td></tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center bg-white">
                      <p className="text-sm font-medium text-slate-500">You have no orders.</p>
                    </td>
                  </tr>
                ) : orders.map((ord) => (
                  <tr key={ord.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                    <td className="py-4 px-6 text-sm">{fmtDate(ord.createdAt)}</td>
                    <td className={`py-4 px-6 text-sm font-bold ${ord.side === 'BUY' ? 'text-emerald-600' : 'text-amber-600'}`}>{ord.side} {ord.type}</td>
                    <td className="py-4 px-6 font-bold">{ord.tickerSymbol}</td>
                    <td className="py-4 px-6 text-sm">{fmtRWF(ord.targetPrice)}</td>
                    <td className="py-4 px-6 text-sm">{ord.filledQuantity} / {ord.totalQuantity}</td>
                    <td className="py-4 px-6"><span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{ord.status}</span></td>
                    <td className="py-4 px-6">
                       {ord.status === 'PENDING' && (
                         <button 
                            onClick={async () => {
                               try {
                                  await orderService.cancelOrder(ord.id);
                                  window.dispatchEvent(new Event('walletUpdated'));
                                  setOrders(orders.map(o => o.id === ord.id ? {...o, status: 'CANCELLED'} : o));
                               } catch (e) {
                                  alert('Failed to cancel order: ' + e.message);
                               }
                            }}
                            className="text-xs font-bold text-rose-500 hover:text-rose-700"
                         >
                            Cancel
                         </button>
                       )}
                    </td>
                  </tr>
                ))}
               </tbody>
            </table>
          </div>
        </div>
      )}

      {activePrimary === 'Transactions' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden mt-2">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Trade Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Transaction Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Transaction Type</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Description</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan="4" className="py-12 text-center text-slate-500">Loading...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center bg-white">
                      <p className="text-sm font-medium text-slate-500">You have no transactions.</p>
                    </td>
                  </tr>
                ) : transactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                    <td className="py-4 px-6 text-sm">{fmtDate(tx.createdAt)}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-700">{tx.type}</td>
                    <td className={`py-4 px-6 text-sm font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-900'}`}>{fmtRWF(tx.amount)}</td>
                    <td className="py-4 px-6 text-sm text-slate-500">{tx.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activePrimary === 'Wallet' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden mt-2 pt-6">
          <div className="px-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Trade Wallet</h2>
          </div>
          
          <div className="px-6 flex flex-col md:flex-row gap-8 mb-10">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pl-1">Wallet Balance</h3>
              <div className="border border-slate-200 rounded-2xl p-6 shadow-sm h-32 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2 text-slate-700">
                  <WalletIcon size={16} />
                  <span className="font-bold text-xs uppercase tracking-wide">Trade Wallet</span>
                </div>
                <div className="mb-1 text-slate-900 font-extrabold text-lg">
                  {loading ? 'loading...' : fmtRWF(wallet?.balance)}
                </div>
                <div className="text-xs text-slate-400 font-medium">Last updated: {loading ? '—' : fmtDate(wallet?.updatedAt)}</div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pl-1">Deposit/Withdraw from your Wallet</h3>
              <div className="flex gap-4 h-32">
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm text-slate-700 active:scale-95">
                  <Upload size={24} className="text-slate-500 mb-1" />
                  <span className="font-bold text-sm">Deposit</span>
                </button>
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm text-slate-700 active:scale-95">
                  <Download size={24} className="text-slate-500 mb-1" />
                  <span className="font-bold text-sm">Withdraw</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-6 mb-4">
             <h3 className="text-sm font-bold text-slate-900 pl-1">Deposit/Withdrawal Transactions</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-t border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Transaction Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Transaction Type</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap text-right">Amount</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan="4" className="py-12 text-center text-slate-500">Loading...</td></tr>
                ) : transactions.filter(t => t.type === 'DEPOSIT' || t.type === 'WITHDRAWAL').length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center bg-white border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-500">You have no transactions.</p>
                    </td>
                  </tr>
                ) : transactions.filter(t => t.type === 'DEPOSIT' || t.type === 'WITHDRAWAL').map((tx) => (
                  <tr key={tx.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                    <td className="py-4 px-6 text-sm">{fmtDate(tx.createdAt)}</td>
                    <td className="py-4 px-6 text-sm font-bold text-slate-700">{tx.type}</td>
                    <td className={`py-4 px-6 text-sm text-right font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-900'}`}>{fmtRWF(tx.amount)}</td>
                    <td className="py-4 px-6 text-sm text-right text-slate-500">Completed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Sell Modal */}
      {selectedPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-slate-900">Sell {selectedPosition.tickerSymbol}</h3>
              <button 
                onClick={() => setSelectedPosition(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex justify-between items-center text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <div>
                    <div className="text-sm font-medium text-slate-500">Current Price</div>
                    <div className="text-lg font-bold">{fmtRWF(selectedPosition.currentPrice)}</div>
                 </div>
                 <div className="text-right">
                    <div className="text-sm font-medium text-slate-500">Available Shares</div>
                    <div className="text-lg font-bold text-emerald-600">{selectedPosition.quantity - selectedPosition.lockedQuantity}</div>
                 </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Quantity to Sell</label>
                <input 
                  type="number" 
                  min="1"
                  max={selectedPosition.quantity - selectedPosition.lockedQuantity}
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(parseInt(e.target.value) || 1)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-6 flex justify-between items-center">
                <span className="text-slate-600 font-bold">Total Return Estimate</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {fmtRWF(selectedPosition.currentPrice * sellQuantity)}
                </span>
              </div>

              {sellError && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
                  {sellError}
                </div>
              )}

              {sellSuccess && (
                <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-sm font-medium">
                  {sellSuccess}
                </div>
              )}

              <button 
                onClick={handleConfirmSell}
                disabled={sellLoading || !!sellSuccess || (selectedPosition.quantity - selectedPosition.lockedQuantity <= 0)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {sellLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Confirm Sell Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trade;
