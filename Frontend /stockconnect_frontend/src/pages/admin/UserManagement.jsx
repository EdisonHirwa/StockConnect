import { Search, Filter, MoreVertical, CheckCircle2, XCircle, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

// Mock Data
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Trader', status: 'Active', joinDate: 'Oct 23, 2026', avatar: 'J' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@design.com', role: 'Trader', status: 'Active', joinDate: 'Oct 22, 2026', avatar: 'JS' },
  { id: 3, name: 'Michael Chen', email: 'm.chen@analytics.io', role: 'Admin', status: 'Active', joinDate: 'Oct 20, 2026', avatar: 'MC' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah.w@firm.co', role: 'Trader', status: 'Inactive', joinDate: 'Oct 15, 2026', avatar: 'SW' },
  { id: 5, name: 'Robert Fox', email: 'rfox@company.com', role: 'Broker', status: 'Suspended', joinDate: 'Oct 10, 2026', avatar: 'RF' },
  { id: 6, name: 'Emily Davis', email: 'emily.d@personal.net', role: 'Trader', status: 'Active', joinDate: 'Oct 05, 2026', avatar: 'ED' },
  { id: 7, name: 'David Lee', email: 'dlee@trading.org', role: 'Analyst', status: 'Active', joinDate: 'Oct 01, 2026', avatar: 'DL' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const { searchTerm, setSearchTerm } = useSearch();
  const [activeTab, setActiveTab] = useState('All');

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || user.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusConfig = (status) => {
    switch(status) {
      case 'Active': return { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle2 };
      case 'Inactive': return { color: 'text-slate-700', bg: 'bg-slate-100', icon: XCircle };
      case 'Suspended': return { color: 'text-red-700', bg: 'bg-red-100', icon: AlertCircle };
      default: return { color: 'text-slate-700', bg: 'bg-slate-100', icon: CheckCircle2 };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Users Management</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage platform users, roles, and account statuses.</p>
        </div>
        <button className="bg-[#fad059] hover:bg-[#e8be48] text-slate-900 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm self-start md:self-auto">
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-max">
            {['All', 'Active', 'Inactive', 'Suspended'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-full md:w-64 focus-within:ring-2 focus-within:ring-[#fad059]/50 focus-within:border-[#fad059] transition-all">
              <Search className="text-slate-400 mr-2" size={18} />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <button className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-bold border-b border-slate-100">
                <th className="py-4 px-6 font-bold cursor-pointer hover:text-slate-900 transition-colors">User</th>
                <th className="py-4 px-6 font-bold cursor-pointer hover:text-slate-900 transition-colors">Role</th>
                <th className="py-4 px-6 font-bold cursor-pointer hover:text-slate-900 transition-colors">Status</th>
                <th className="py-4 px-6 font-bold cursor-pointer hover:text-slate-900 transition-colors">Joined on</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const StatusIcon = getStatusConfig(user.status).icon;
                  return (
                    <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 text-[#fad059] flex items-center justify-center font-bold text-sm shadow-sm border border-slate-700">
                            {user.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-slate-500 font-medium text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-slate-700 font-medium">{user.role}</td>
                      <td className="py-3 px-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusConfig(user.status).bg} ${getStatusConfig(user.status).color}`}>
                          <StatusIcon size={14} />
                          {user.status}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-slate-500 font-medium">{user.joinDate}</td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search size={32} className="mb-2 opacity-50" />
                      <p className="font-medium text-slate-500">No users found matching your filters.</p>
                      <button 
                        onClick={() => {setSearchTerm(''); setActiveTab('All');}}
                        className="mt-3 text-sm font-bold text-[#fad059] hover:text-[#e8be48]"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Showing <span className="font-bold text-slate-900">{filteredUsers.length}</span> of {initialUsers.length} users</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 font-bold disabled:opacity-50 transition-colors">Previous</button>
            <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 font-bold disabled:opacity-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
