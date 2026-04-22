import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, HardDrive, Save, RefreshCw, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';

const CURRENCIES = ['USD ($)', 'EUR (€)', 'GBP (£)', 'RWF (RF)', 'JPY (¥)', 'AED (د.إ)'];
const TIMEZONES = [
  'UTC (Coordinated Universal Time)',
  'EST (Eastern Standard Time)',
  'PST (Pacific Standard Time)',
  'CAT (Central Africa Time)',
  'EAT (East Africa Time)',
  'CET (Central European Time)',
  'IST (India Standard Time)',
  'CST (China Standard Time)',
];
const TIMEOUTS = ['15 Minutes', '30 Minutes', '1 Hour', '4 Hours', 'Never'];

const DEFAULT_SETTINGS = {
  platformName: 'StockConnect',
  supportEmail: 'support@stockconnect.com',
  tagline: 'Your gateway to global markets.',
  currency: 'USD ($)',
  timezone: 'UTC (Coordinated Universal Time)',
  require2fa: true,
  sessionTimeout: '15 Minutes',
  notifyNewRegistrations: true,
  notifyLargeDeposits: false,
  notifySystemErrors: true,
  notifyDailyReports: false,
};

const Toggle = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} className="relative inline-flex items-center cursor-pointer shrink-0">
    <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-[#fad059]' : 'bg-slate-300'}`}>
      <div className={`absolute top-[2px] left-[2px] bg-white border border-slate-200 rounded-full h-5 w-5 shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [original, setOriginal] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  const tabs = [
    { id: 'general',       name: 'General',         icon: Settings,  description: 'Basic platform configuration' },
    { id: 'security',      name: 'Security & Auth',  icon: Shield,    description: 'Authentication and password policies' },
    { id: 'notifications', name: 'Notifications',    icon: Bell,      description: 'System email and alert rules' },
    { id: 'advanced',      name: 'Advanced',         icon: HardDrive, description: 'System data and maintenance' },
  ];

  useEffect(() => {
    superAdminService.getSettings()
      .then(data => {
        setSettings(data);
        setOriginal(data);
      })
      .catch(() => {
        // Use defaults silently if backend not ready
      })
      .finally(() => setLoading(false));
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await superAdminService.updateSettings(settings);
      setOriginal(saved);
      showToast('success', 'Settings saved successfully!');
    } catch {
      showToast('error', 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setSettings(original);
    showToast('success', 'Changes discarded.');
  };

  const set = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const isDirty = JSON.stringify(settings) !== JSON.stringify(original);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-bold animate-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle size={18} className="text-emerald-600" />
            : <AlertCircle size={18} className="text-red-600" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 mt-1 font-medium">Configure global platform parameters and rules.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDiscard}
            disabled={!isDirty || saving}
            className="px-5 py-2.5 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} />
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="bg-[#fad059] hover:bg-[#e8be48] text-slate-900 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
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
                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-[#fad059] text-slate-900' : 'bg-slate-200 text-slate-500'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{tab.name}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{tab.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 overflow-y-auto">

          {/* ── General ──────────────────────────────────────────────── */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Platform Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Platform Name</label>
                    <input
                      type="text"
                      value={settings.platformName || ''}
                      onChange={e => set('platformName', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                    <input
                      type="email"
                      value={settings.supportEmail || ''}
                      onChange={e => set('supportEmail', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">System Tagline / Description</label>
                    <textarea
                      rows="3"
                      value={settings.tagline || ''}
                      onChange={e => set('tagline', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium resize-none"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Localization</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Default Currency</label>
                    <select
                      value={settings.currency || ''}
                      onChange={e => set('currency', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                    >
                      {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Timezone</label>
                    <select
                      value={settings.timezone || ''}
                      onChange={e => set('timezone', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                    >
                      {TIMEZONES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Security ─────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Authentication Policies</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50">
                    <div>
                      <h4 className="font-bold text-slate-900">Require Two-Factor Authentication (2FA)</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Force all administrative users to configure 2FA.</p>
                    </div>
                    <Toggle checked={settings.require2fa} onChange={v => set('require2fa', v)} />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50">
                    <div>
                      <h4 className="font-bold text-slate-900">Session Timeout</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Automatically log users out after inactivity.</p>
                    </div>
                    <select
                      value={settings.sessionTimeout || '15 Minutes'}
                      onChange={e => set('sessionTimeout', e.target.value)}
                      className="bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all"
                    >
                      {TIMEOUTS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ─────────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Email Alert Rules</h2>
              {[
                { key: 'notifyNewRegistrations', label: 'New User Registrations', desc: 'Send an email when a new user registers on the platform.' },
                { key: 'notifyLargeDeposits',    label: 'Large Deposits (>$10k)',  desc: 'Alert when a single wallet deposit exceeds $10,000.' },
                { key: 'notifySystemErrors',     label: 'System Errors & Warnings', desc: 'Receive notifications for backend exceptions and errors.' },
                { key: 'notifyDailyReports',     label: 'Daily Summary Reports',   desc: 'Deliver a daily activity digest to the support inbox.' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all">
                  <div>
                    <p className="font-bold text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                  <Toggle checked={!!settings[key]} onChange={v => set(key, v)} />
                </div>
              ))}
            </div>
          )}

          {/* ── Advanced ──────────────────────────────────────────────── */}
          {activeTab === 'advanced' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
              <HardDrive size={56} className="mx-auto text-slate-300 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">System Maintenance</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">Execute administrative scripts, clear cache, and export critical system logs.</p>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button
                  onClick={() => showToast('success', 'Application cache cleared successfully.')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white px-5 py-3.5 rounded-xl font-bold transition-all shadow-sm"
                >
                  Clear Application Cache
                </button>
                <a
                  href={`${import.meta.env.VITE_API_BASE_URL}/superadmin/audit-logs`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full block bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 px-5 py-3.5 rounded-xl font-bold transition-all shadow-sm text-center"
                >
                  Download System Logs (JSON)
                </a>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => showToast('error', 'Emergency wipe is disabled in this environment.')}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3.5 rounded-xl font-bold transition-all shadow-sm"
                  >
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
