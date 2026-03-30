import React from 'react';
import { Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, users: 240 },
  { name: 'Tue', revenue: 3000, users: 139 },
  { name: 'Wed', revenue: 2000, users: 980 },
  { name: 'Thu', revenue: 2780, users: 390 },
  { name: 'Fri', revenue: 1890, users: 480 },
  { name: 'Sat', revenue: 2390, users: 380 },
  { name: 'Sun', revenue: 3490, users: 430 },
];

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitor key metrics and system health.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm">
          Generate Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Users', value: '12,482', change: '+12.5%', isUp: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { title: 'System Revenue', value: '$84,293', change: '+8.2%', isUp: true, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { title: 'Active Trades', value: '1,204', change: '-3.1%', isUp: false, icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { title: 'System Load', value: '42%', change: '+1.2%', isUp: false, icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`flex items-center text-sm font-bold ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.isUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Revenue Overview</h3>
            <p className="text-slate-500 text-sm font-medium">Daily platform revenue across all services</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} prefix="$" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">User Activity</h3>
            <p className="text-slate-500 text-sm font-medium">New registrations</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="users" fill="#fad059" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Recent System Logs</h3>
            <p className="text-slate-500 text-sm font-medium">Latest activities happening across the platform.</p>
          </div>
          <button className="text-sm font-bold text-[#fad059] hover:text-[#e8be48]">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-bold border-b border-slate-100">
                <th className="py-4 px-6">Event ID</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">User/Entity</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {[
                { id: '#EVT-001', type: 'Large Deposit', entity: 'John Doe', date: 'Oct 23, 10:42 AM', status: 'Success', statusColor: 'text-emerald-500 bg-emerald-50' },
                { id: '#EVT-002', type: 'System Error', entity: 'Trade Engine', date: 'Oct 23, 09:12 AM', status: 'Warning', statusColor: 'text-orange-500 bg-orange-50' },
                { id: '#EVT-003', type: 'New Registration', entity: 'sally@design.com', date: 'Oct 23, 08:30 AM', status: 'Success', statusColor: 'text-emerald-500 bg-emerald-50' },
                { id: '#EVT-004', type: 'Failed Login', entity: 'Unknown IP', date: 'Oct 22, 11:45 PM', status: 'Failed', statusColor: 'text-red-500 bg-red-50' },
              ].map((log, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{log.id}</td>
                  <td className="py-4 px-6 text-slate-700">{log.type}</td>
                  <td className="py-4 px-6 text-slate-500">{log.entity}</td>
                  <td className="py-4 px-6 text-slate-500">{log.date}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.statusColor}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
