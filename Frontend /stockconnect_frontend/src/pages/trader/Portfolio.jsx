import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const assetClasses = [
  { name: 'Kenyan Stocks', color: 'bg-rose-600', allocation: 'NaN%' },
  { name: 'US Stocks', color: 'bg-indigo-900', allocation: 'NaN%' },
  { name: 'US ETFs', color: 'bg-blue-600', allocation: 'NaN%' },
  { name: 'Others', color: 'bg-orange-500', allocation: 'NaN%' }
];

const dividendYears = ['2021', '2022', '2023', '2024', '2025', '2026'];

const Portfolio = () => {
  const [expandedYear, setExpandedYear] = useState(null);

  const toggleYear = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  return (
    <div className="p-8 max-w-5xl">
      
      {/* 1. Overall Investment Allocation Placeholder */}
      <div className="mb-12">
        {/* Donut Chart Placeholder */}
        <div className="w-52 h-52 rounded-full border-[32px] border-slate-200 mx-auto mb-10"></div>
        
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-3 px-6 text-sm font-medium text-slate-500 text-left">Investment</th>
                <th className="py-3 px-6 text-sm font-medium text-slate-500 text-right">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {/* Assuming there might be some content here later. Left empty as per screenshot layout style */}
              <tr>
                <td className="py-4 px-6 text-sm text-slate-700">Total Investment</td>
                <td className="py-4 px-6 text-sm text-slate-700 text-right font-medium">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. My Portfolio by Asset Class */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">My Portfolio by Asset Class</h2>
        
        {/* Donut Chart Placeholder */}
        <div className="w-52 h-52 rounded-full border-[32px] border-slate-200 mx-auto mb-10"></div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-3 px-6 text-sm font-medium text-slate-500">Asset Class</th>
                <th className="py-3 px-6 text-sm font-medium text-slate-500 text-right">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {assetClasses.map((item, idx) => (
                <tr key={idx} className="border-t border-slate-100">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-sm font-bold text-slate-900">{item.allocation}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. My Portfolio Holdings */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">My Portfolio Holdings</h2>
        
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-3 px-6 text-sm font-medium text-slate-500">Security</th>
                <th className="py-3 px-6 text-sm font-medium text-slate-500">Security Name</th>
                <th className="py-3 px-6 text-sm font-medium text-slate-500 text-right">Number of Shares</th>
                <th className="py-3 px-6 text-sm font-medium text-slate-500 text-right">Current Price</th>
                <th className="py-3 px-6 text-sm font-medium text-slate-500 text-right">Total Value</th>
                <th className="py-3 px-6 text-sm font-medium text-slate-500 text-right">Allocation %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="py-12 text-center text-sm font-medium text-slate-500 bg-white">
                  No holdings found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. My Dividends by Months (Yearly) */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">My Dividends by Months (Yearly)</h2>
        
        <div className="flex flex-col gap-3">
          {dividendYears.map((year) => {
            const isExpanded = expandedYear === year;
            return (
              <div 
                key={year} 
                className="bg-slate-50/50 border border-slate-100 rounded-xl overflow-hidden transition-all duration-300"
              >
                <div 
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                  onClick={() => toggleYear(year)}
                >
                  <span className="font-extrabold text-slate-900">{year}</span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 text-slate-500 shadow-sm transition-transform duration-300">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-6 py-8 border-t border-slate-100 bg-white flex justify-center">
                     <p className="text-sm text-slate-500 font-medium">No dividends recorded for {year}.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Portfolio;
