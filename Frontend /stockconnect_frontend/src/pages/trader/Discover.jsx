import React, { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { orderService } from '../../services/orderService';
import { X } from 'lucide-react';

const fmtRWF = (v) => `RWF ${Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const Discover = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Trade Modal State
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeError, setTradeError] = useState(null);
  const [tradeSuccess, setTradeSuccess] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await companyService.getAllCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleTradeClick = (stock) => {
    setSelectedStock(stock);
    setQuantity(1);
    setTradeError(null);
    setTradeSuccess(null);
  };

  const handleConfirmTrade = async () => {
    if (!selectedStock || quantity <= 0) return;
    setTradeLoading(true);
    setTradeError(null);
    setTradeSuccess(null);

    try {
      await orderService.placeBuyOrder({
        companyId: selectedStock.id,
        quantity: quantity,
        targetPrice: selectedStock.currentPrice,
        type: 'MARKET'
      });
      setTradeSuccess(`Successfully placed order to buy ${quantity} shares of ${selectedStock.ticker}!`);
      window.dispatchEvent(new Event('walletUpdated'));
      setTimeout(() => setSelectedStock(null), 2000);
    } catch (err) {
      setTradeError(err.message || 'Failed to place order');
    } finally {
      setTradeLoading(false);
    }
  };

  const trendingStocks = companies.slice(0, 3).map(c => ({
    id: c.id,
    currentPrice: c.currentPrice,
    ticker: c.tickerSymbol,
    name: c.companyName,
    price: fmtRWF(c.currentPrice),
    vol: c.totalShares?.toString() || '0',
    initial: c.tickerSymbol.charAt(0)
  }));

  const mostTradedStocks = companies.slice(3).map(c => ({
    id: c.id,
    currentPrice: c.currentPrice,
    ticker: c.tickerSymbol,
    name: c.companyName,
    price: fmtRWF(c.currentPrice),
    change: '0.00%',
    isPositive: true,
    investors: Math.floor(Math.random() * 500) + 100, // mock investors
    initial: c.tickerSymbol.charAt(0),
    avatars: ['M', 'W', 'M'],
    extra: null
  }));

  return (
    <div className="p-8 max-w-5xl relative">
      {/* Trending Stocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {trendingStocks.map((stock, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 font-bold border border-slate-200">
                {stock.initial}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900">{stock.ticker}</span>
                <span className="text-xs text-slate-500 max-w-[120px] truncate">{stock.name}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-slate-900">{stock.price}</span>
              <span className="text-xs text-slate-500">Vol: {stock.vol}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Most Traded Section */}
      <div className="mb-8 mt-2">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Most Traded on StockConnect</h2>
        <p className="text-slate-500 font-medium">Discover stocks that are popular among StockConnect Investors.</p>
      </div>

      <div className="space-y-6">
        {mostTradedStocks.map((stock, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            {/* Top row: Info & Price */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 font-bold border border-slate-200 font-lg">
                  {stock.initial}
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-lg">{stock.ticker}</span>
                  <span className="text-slate-500 text-sm font-medium">{stock.name}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-slate-900 text-lg">{stock.price}</span>
                <span className={`text-sm font-bold ${stock.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stock.change}
                </span>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-slate-100 my-4" />

            {/* Bottom row: Traded info, avatars and Trade Button */}
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-500 font-medium">
                Traded by over {stock.investors} investors in March 2026
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {stock.avatars.map((av, avIdx) => (
                      <div key={avIdx} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                        {av}
                      </div>
                    ))}
                  </div>
                  {stock.extra && (
                    <div className="ml-3 px-3 py-1 bg-violet-100 text-violet-600 border border-violet-200 text-xs font-bold rounded-full">
                      {stock.extra}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => handleTradeClick(stock)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-sm focus:ring-4 focus:ring-slate-900/20 active:scale-95"
                >
                  Trade
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trade Modal */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-slate-900">Trade {selectedStock.ticker}</h3>
              <button 
                onClick={() => setSelectedStock(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex justify-between items-center text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <div>
                    <div className="text-sm font-medium text-slate-500">Current Price</div>
                    <div className="text-lg font-bold">{selectedStock.price}</div>
                 </div>
                 <div className="text-right">
                    <div className="text-sm font-medium text-slate-500">Company</div>
                    <div className="text-sm font-bold truncate max-w-[150px]">{selectedStock.name}</div>
                 </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Quantity (Shares)</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-6 flex justify-between items-center">
                <span className="text-slate-600 font-bold">Total Estimate</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {fmtRWF(selectedStock.currentPrice * quantity)}
                </span>
              </div>

              {tradeError && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
                  {tradeError}
                </div>
              )}

              {tradeSuccess && (
                <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-sm font-medium">
                  {tradeSuccess}
                </div>
              )}

              <button 
                onClick={handleConfirmTrade}
                disabled={tradeLoading || !!tradeSuccess}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {tradeLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Confirm Buy Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
