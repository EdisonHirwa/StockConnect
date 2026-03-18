import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const marketStatuses = [
  { name: 'Kenyan Stocks', status: 'Closed', flag: '🇰🇪' },
  { name: 'US Stocks', status: 'Open', flag: '🇺🇸' },
  { name: 'US ETFs', status: 'Open', flag: '🇺🇸' },
  { name: 'CDSC', status: 'Open', flag: '🏛️' },
];

const MainContent = () => {
  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full">
      {/* Market Status Row */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        {marketStatuses.map((market) => (
          <div key={market.name} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{market.flag}</div>
            <h4 className="font-bold text-slate-800 text-sm mb-2">{market.name}</h4>
            <div className={`flex items-center gap-1.5 text-xs font-bold ${market.status === 'Open' ? 'text-emerald-500' : 'text-red-500'}`}>
              <span className={`w-2 h-2 rounded-full ${market.status === 'Open' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              {market.status}
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Section Placeholder */}
      <div className="mb-10">
        <h2 className="text-xl font-extrabold text-slate-800 mb-6">Recommended</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
          <StockCard symbol="AAPL" name="Apple Inc." price="$ 249.43" change="0.05%" isUp={true} />
          <StockCard symbol="COST" name="Costco Whol..." price="$ 977.80" change="0%" isUp={false} isNeutral={true} />
          <StockCard symbol="SCHM" name="Schwab U.S..." price="$ 31.14" change="0.51%" isUp={true} />
          <StockCard symbol="SCBK" name="Standard Ch..." price="KES 332.5" change="1.48%" isUp={false} />
          <StockCard symbol="AMZN" name="Amazon.com" price="$ 209.64" change="0.25%" isUp={true} />
        </div>
      </div>

      {/* Popular Stocks Section Placeholder */}
      <div className="mb-10">
        <h2 className="text-xl font-extrabold text-slate-800 mb-6">Popular Stocks</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
          <StockCard symbol="MSFT" name="Microsoft C..." price="$ 391.35" change="0.01%" isUp={true} />
          <StockCard symbol="AMD" name="Advanced Mi..." price="$ 198.66" change="0.17%" isUp={true} />
          <StockCard symbol="OXY" name="Occidental ..." price="$ 58.23" change="0.03%" isUp={true} />
          <StockCard symbol="EQTY" name="Equity Grou..." price="KES 79.0" change="1.28%" isUp={true} />
          <StockCard symbol="AAPL" name="Apple Inc." price="$ 249.43" change="0.05%" isUp={true} />
        </div>
      </div>

      {/* Popular ETFs Section */}
      <div className="mb-10">
        <h2 className="text-xl font-extrabold text-slate-800 mb-6">Popular ETFs</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
          <StockCard symbol="VTWO" name="Vanguard Sc..." price="$ 99.28" change="0.02%" isUp={false} />
          <StockCard symbol="VOO" name="Vanguard S&..." price="$ 607.06" change="0.01%" isUp={true} />
          <StockCard symbol="SCHE" name="Schwab Emer..." price="$ 32.97" change="1.11%" isUp={true} />
          <StockCard symbol="DIA" name="SPDR Dow Jo..." price="$ 461.75" change="0.01%" isUp={true} />
          <StockCard symbol="VUG" name="Vanguard Gr..." price="$ 449.39" change="0.30%" isUp={true} />
        </div>
      </div>
      
    </div>
  );
};

const StockCard = ({ symbol, name, price, change, isUp, isNeutral }) => {
  return (
    <div className="min-w-[220px] bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group flex flex-col shrink-0">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            {symbol.charAt(0)}
          </div>
          <div>
            <div className="font-extrabold text-slate-800 text-sm">{symbol}</div>
            <div className="text-xs text-slate-400 font-medium truncate w-24">{name}</div>
          </div>
        </div>
        {!isNeutral && (
          <div className={`p-1.5 rounded-lg ${isUp ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
            {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-end mt-auto">
        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">Price</div>
          <div className="font-extrabold text-slate-800">{price}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 font-semibold mb-1">24hr</div>
          <div className={`font-bold ${isNeutral ? 'text-slate-400' : isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {isUp && !isNeutral ? '+' : ''}{change}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
