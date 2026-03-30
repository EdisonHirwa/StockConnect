import React, { useState } from 'react';
import { Settings, Shield, Bell, HardDrive, Save, RefreshCw } from 'lucide-react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: Settings, description: 'Basic platform configuration' },
    { id: 'security', name: 'Security & Auth', icon: Shield, description: 'Authentication and password policies' },
    { id: 'notifications', name: 'Notifications', icon: Bell, description: 'System email and alert rules' },
    { id: 'advanced', name: 'Advanced', icon: HardDrive, description: 'System data and maintenance' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 mt-1 font-medium">Configure global platform parameters and rules.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <RefreshCw size={18} />
            Discard
          </button>
          <button className="bg-[#fad059] hover:bg-[#e8be48] text-slate-900 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
        {/* Settings Navigation */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all text-left ${
                    isActive 
                      ? 'bg-white shadow-sm border border-slate-100 ring-1 ring-slate-100/50' 
                      : 'hover:bg-white/60 border border-transparent'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-[#fad059] text-slate-900' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{tab.name}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{tab.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Platform Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Platform Name</label>
                    <input type="text" defaultValue="StockConnect" className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                    <input type="email" defaultValue="support@stockconnect.com" className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">System Tagline / Description</label>
                    <textarea rows="3" defaultValue="Your gateway to global markets." className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium resize-none"></textarea>
                  </div>
                </div>
              </div>
              
              <hr className="border-slate-100" />

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Localization</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Default Currency</label>
                    <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Timezone</label>
                    <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium">
                      <option>UTC (Coordinated Universal Time)</option>
                      <option>EST (Eastern Standard Time)</option>
                      <option>PST (Pacific Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Authentication Policies</h2>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50">
                    <div>
                      <h4 className="font-bold text-slate-900">Require Two-Factor Authentication (2FA)</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Force all administrative users to configure 2FA.</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fad059]"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50">
                    <div>
                      <h4 className="font-bold text-slate-900">Session Timeout</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Automatically log users out after inactivity.</p>
                    </div>
                    <select className="bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all">
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Email Rules</h2>
              {['New User Registrations', 'Large Deposits (>$10k)', 'System Errors & Warnings', 'Daily Summary Reports'].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all">
                  <span className="font-bold text-slate-700">{item}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={idx % 2 === 0} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
              <HardDrive size={56} className="mx-auto text-slate-300 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">System Maintenance</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">Execute administrative scripts, clear cache, and export critical system logs.</p>
              
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white px-5 py-3.5 rounded-xl font-bold transition-all shadow-sm">
                  Clear Application Cache
                </button>
                <button className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 px-5 py-3.5 rounded-xl font-bold transition-all shadow-sm">
                  Download System Logs
                </button>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3.5 rounded-xl font-bold transition-all shadow-sm">
                    Emergency Data Wipe
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
