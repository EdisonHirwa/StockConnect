import React, { useState, useEffect } from 'react';
import { Search, Plus, Building2, TrendingUp, Users, MoreVertical, X, BarChart2, BarChart3, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { companyService } from '../../services/companyService';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const [newCompany, setNewCompany] = useState({
    companyName: '',
    tickerSymbol: '',
    currentPrice: '',
    totalShares: '',
    industry: 'Technology'
  });
  const [adding, setAdding] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await companyService.getAllCompanies();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await companyService.createCompany({
        ...newCompany,
        currentPrice: parseFloat(newCompany.currentPrice),
        totalShares: parseInt(newCompany.totalShares)
      });
      setIsModalOpen(false);
      setNewCompany({ companyName: '', tickerSymbol: '', currentPrice: '', totalShares: '', industry: 'Technology' });
      fetchCompanies();
    } catch (err) {
      alert(err.message || 'Failed to create company');
    } finally {
      setAdding(false);
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMarketCap = companies.reduce((acc, c) => acc + (c.currentPrice * c.totalShares), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Market Companies</h1>
          <p className="text-slate-500 mt-1 font-medium">List new organizations and monitor market volume and trader engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchCompanies}
            className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-all shadow-sm"
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#fad059] hover:bg-[#e8be48] text-slate-900 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Plus size={20} />
            Add New Company
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Building2 size={24} /></div>
          <div>
             <p className="text-sm font-medium text-slate-500">Total Listed</p>
             <p className="text-2xl font-bold text-slate-900">{loading ? '—' : companies.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><BarChart3 size={24} /></div>
          <div>
             <p className="text-sm font-medium text-slate-500">Total Market Cap</p>
             <p className="text-2xl font-bold text-slate-900">
               {loading ? '—' : `RWF ${(totalMarketCap / 1000000).toFixed(1)}M`}
             </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><Users size={24} /></div>
          <div>
             <p className="text-sm font-medium text-slate-500">System Support</p>
             <p className="text-2xl font-bold text-slate-900">Active</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
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
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-medium">Loading market data...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm font-bold border-b border-slate-100">
                  <th className="py-4 px-6">Company / Symbol</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Market Metrics</th>
                  <th className="py-4 px-6">Shares Outstanding</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredCompanies.map((company) => {
                  return (
                    <tr key={company.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shadow-sm font-bold text-xs">
                            {company.tickerSymbol.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{company.companyName}</p>
                            <p className="text-slate-500 font-medium text-xs font-mono">{company.tickerSymbol} • {company.industry || 'Common Stock'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900">RWF {Number(company.currentPrice).toLocaleString()}</p>
                        <p className="text-xs text-slate-400 font-medium italic">Latest quote</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-slate-700 font-bold truncate">Cap: RWF {((Number(company.currentPrice) * company.totalShares) / 1000000).toFixed(2)}M</p>
                        <p className="text-slate-500 font-medium text-xs">Equity Class: A</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                          {company.totalShares.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors mr-2">
                          View Details
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
          )}
        </div>
      </div>

      {/* Add Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form onSubmit={handleCreateCompany} className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">List a New Company</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company Legal Name</label>
                  <input 
                    type="text" 
                    required
                    value={newCompany.companyName}
                    onChange={(e) => setNewCompany({...newCompany, companyName: e.target.value})}
                    placeholder="e.g. Bank of Kigali" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ticker Symbol</label>
                  <input 
                    type="text" 
                    required
                    maxLength={5}
                    value={newCompany.tickerSymbol}
                    onChange={(e) => setNewCompany({...newCompany, tickerSymbol: e.target.value.toUpperCase()})}
                    placeholder="e.g. BK" 
                    className="uppercase w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Initial IPO Price (RWF)</label>
                  <input 
                    type="number" 
                    required
                    value={newCompany.currentPrice}
                    onChange={(e) => setNewCompany({...newCompany, currentPrice: e.target.value})}
                    placeholder="0.00" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Total Shares Outstanding</label>
                  <input 
                    type="number" 
                    required
                    value={newCompany.totalShares}
                    onChange={(e) => setNewCompany({...newCompany, totalShares: e.target.value})}
                    placeholder="1000000" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Industry / Sector</label>
                  <select 
                    value={newCompany.industry}
                    onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                  >
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Energy</option>
                    <option>Consumer Staples</option>
                    <option>Telecommunications</option>
                  </select>
                </div>
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Company HQ & Compliance</label>
                 <textarea rows="2" placeholder="Registered HQ address and compliance details." className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium resize-none"></textarea>
              </div>

            </div>
            <div className="px-8 py-5 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all shadow-sm">Cancel</button>
              <button 
                type="submit"
                disabled={adding}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {adding ? 'Processing...' : 'List on Exchange'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
