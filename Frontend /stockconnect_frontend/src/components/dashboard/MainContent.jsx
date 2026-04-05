import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { companyService } from '../../services/companyService';

const marketStatuses = [
  { name: 'Rwandan Stocks', status: 'Open', flag: '🇷🇼' },
];

const MainContent = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {loading ? (
        <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-slate-800 mb-6">Available Stocks</h2>
          {companies.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
                {companies.map((company) => {
                    const rwfPrice = `RWF ${Number(company.currentPrice ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
                    return (
                      <StockCard 
                        key={company.id} 
                        symbol={company.tickerSymbol} 
                        name={company.companyName} 
                        price={rwfPrice} 
                        change="0.00%" 
                        isUp={true} 
                        isNeutral={true} 
                      />
                    );
                })}
              </div>
          ) : (
              <div className="text-slate-500 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center font-medium">
                  No stocks available in the database.
              </div>
          )}
        </div>
      )}
      
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
