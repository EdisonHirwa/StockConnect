import React from 'react';

const trendingStocks = [
  { ticker: 'UCHM', name: 'Uchumi Supermarket Plc', price: 'KES 2.06', vol: '1,991,076.52', initial: 'U' },
  { ticker: 'SMER', name: 'Sameer Africa Plc', price: 'KES 16.64', vol: '147,735.44', initial: 'S' },
  { ticker: 'NBV', name: 'Nairobi Business Ventures L...', price: 'KES 1.47', vol: '138,588.66', initial: 'N' }
];

const mostTradedStocks = [
  {
    ticker: 'UCHM',
    name: 'Uchumi Supermarket Plc',
    price: 'KES 2.06',
    change: '-5.5%',
    isPositive: false,
    investors: 473,
    initial: 'U',
    avatars: ['M', 'W', 'M', 'R', 'W', 'N', 'M', 'G', 'K', 'R'],
    extra: '+1270'
  },
  {
    ticker: 'SCOM',
    name: 'Safaricom Plc',
    price: 'KES 28.85',
    change: '-0.17%',
    isPositive: false,
    investors: 1038,
    initial: 'S',
    avatars: ['M', 'E', 'D', 'M', 'G', 'M', 'J', 'G', 'E'],
    extra: '+3225'
  },
  {
    ticker: 'KPLC',
    name: 'Kenya Power and Lighting Company Plc',
    price: 'KES 16.85',
    change: '-0.59%',
    isPositive: false,
    investors: 857,
    initial: 'K',
    avatars: ['M', 'P', 'R', 'J', 'W'],
    extra: '+127'
  }
];

const Discover = () => {
  return (
    <div className="p-8 max-w-5xl">
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
                
                <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-sm focus:ring-4 focus:ring-slate-900/20 active:scale-95">
                  Trade
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
