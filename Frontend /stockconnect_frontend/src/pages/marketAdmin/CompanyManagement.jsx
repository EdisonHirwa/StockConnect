import React, { useState } from 'react';
import { Search, Plus, Building2, TrendingUp, Users, MoreVertical, X, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const initialCompanies = [
  { id: 1, name: 'Apple Inc.', symbol: 'AAPL', price: '$150.25', users: '12,450', volume: '52.4M', marketCap: '3.02T', status: 'Active', industry: 'Technology', trend: '+1.2%' },
  { id: 2, name: 'Tesla Inc.', symbol: 'TSLA', price: '$210.80', users: '8,320', volume: '112.1M', marketCap: '780.2B', status: 'Active', industry: 'Automotive', trend: '-0.8%' },
  { id: 3, name: 'Amazon.com', symbol: 'AMZN', price: '$135.40', users: '9,105', volume: '45.8M', marketCap: '1.45T', status: 'Active', industry: 'E-Commerce', trend: '+2.4%' },
  { id: 4, name: 'NVIDIA Corp', symbol: 'NVDA', price: '$420.50', users: '15,200', volume: '34.2M', marketCap: '1.18T', status: 'Active', industry: 'Semiconductors', trend: '+3.1%' },
];

const CompanyManagement = () => {
  const [companies, setCompanies] = useState(initialCompanies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Market Companies</h1>
          <p className="text-slate-500 mt-1 font-medium">List new organizations and monitor market volume and trader engagement.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#fad059] hover:bg-[#e8be48] text-slate-900 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <Plus size={20} />
          Add New Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Building2 size={24} /></div>
          <div>
             <p className="text-sm font-medium text-slate-500">Total Listed</p>
             <p className="text-2xl font-bold text-slate-900">4,192</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><BarChart3 size={24} /></div>
          <div>
             <p className="text-sm font-medium text-slate-500">Total Market Cap</p>
             <p className="text-2xl font-bold text-slate-900">$42.8T</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><Users size={24} /></div>
          <div>
             <p className="text-sm font-medium text-slate-500">Combined Shareholders</p>
             <p className="text-2xl font-bold text-slate-900">1.2M</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-full max-w-md focus-within:ring-2 focus-within:ring-[#fad059]/50 focus-within:border-[#fad059] transition-all">
            <Search className="text-slate-400 mr-2" size={18} />
            <input 
              type="text" 
              placeholder="Search by company name or symbol..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-bold border-b border-slate-100">
                <th className="py-4 px-6">Company / Symbol</th>
                <th className="py-4 px-6">Price & Trend</th>
                <th className="py-4 px-6">Market Metrics</th>
                <th className="py-4 px-6">Active Shareholders</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCompanies.map((company) => {
                const isPositive = company.trend.startsWith('+');
                return (
                  <tr key={company.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shadow-sm">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{company.name}</p>
                          <p className="text-slate-500 font-medium text-xs font-mono">{company.symbol} • {company.industry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{company.price}</p>
                      <p className={`text-xs font-bold flex items-center ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {company.trend} {isPositive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-700 font-bold truncate">Cap: {company.marketCap}</p>
                      <p className="text-slate-500 font-medium text-xs">Vol: {company.volume}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <Users size={16} className="text-blue-500" />
                        {company.users}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors mr-2">
                        View Graph
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500 font-medium">
                    <Building2 size={32} className="mx-auto text-slate-300 mb-3" />
                    No companies found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">List a New Company</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company Legal Name</label>
                  <input type="text" placeholder="e.g. Microsoft Corporation" className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ticker Symbol</label>
                  <input type="text" placeholder="e.g. MSFT" className="uppercase w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Initial IPO Price ($)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Total Shares Outstanding</label>
                  <input type="number" placeholder="1000000" className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Industry / Sector</label>
                  <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium">
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Energy</option>
                    <option>Consumer Staples</option>
                  </select>
                </div>
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Company HQ & Compliance</label>
                 <textarea rows="2" placeholder="Registered HQ address and compliance details." className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium resize-none"></textarea>
              </div>

            </div>
            <div className="px-8 py-5 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all shadow-sm">Cancel</button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
              >
                List on Exchange
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
