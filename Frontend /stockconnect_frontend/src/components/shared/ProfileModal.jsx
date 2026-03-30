import React, { useEffect, useState } from 'react';
import {
  X, Mail, Phone, Shield, Calendar, Copy, Check,
  TrendingUp, BarChart2, ShieldCheck, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/apiClient';

// ── Role config ───────────────────────────────────────────────────────────────

const ROLE_META = {
  TRADER: {
    label:    'Trader',
    gradient: 'from-emerald-500 to-teal-600',
    light:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon:     TrendingUp,
    glow:     'shadow-emerald-200',
  },
  MARKET_ADMIN: {
    label:    'Market Administrator',
    gradient: 'from-blue-500 to-indigo-600',
    light:    'bg-blue-50 text-blue-700 border-blue-200',
    icon:     ShieldCheck,
    glow:     'shadow-blue-200',
  },
  COMPANY_REP: {
    label:    'Company Representative',
    gradient: 'from-amber-400 to-orange-500',
    light:    'bg-amber-50 text-amber-700 border-amber-200',
    icon:     BarChart2,
    glow:     'shadow-amber-200',
  },
  SUPER_ADMIN: {
    label:    'Super Administrator',
    gradient: 'from-purple-500 to-violet-600',
    light:    'bg-purple-50 text-purple-700 border-purple-200',
    icon:     ShieldCheck,
    glow:     'shadow-purple-200',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (str) => {
  if (!str) return '—';
  try {
    return new Date(str).toLocaleDateString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  } catch { return str; }
};

// Info row
const InfoRow = ({ icon: Icon, label, value, mono, copyable }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 group">
      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        <p className={`text-sm font-semibold text-slate-700 break-all leading-tight ${mono ? 'font-mono text-xs' : ''}`}>
          {value}
        </p>
      </div>
      {copyable && (
        <button
          onClick={copy}
          className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-slate-400 hover:text-slate-600"
        >
          {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
        </button>
      )}
    </div>
  );
};

// ── Profile Modal ─────────────────────────────────────────────────────────────

const ProfileModal = ({ onClose }) => {
  const { role } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch(`${API_BASE}/users/me`);
        if (!res.ok) throw new Error('Failed to load profile');
        setProfile(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const meta     = ROLE_META[role] ?? ROLE_META['TRADER'];
  const RoleIcon = meta.icon;
  const initials = profile?.fullName
    ? profile.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : role?.[0] ?? '?';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-[72px] pr-5">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Card */}
      <div
        className={`relative w-[340px] bg-white rounded-3xl shadow-2xl ${meta.glow} border border-slate-100 overflow-hidden
          animate-[slideDown_0.2s_cubic-bezier(0.16,1,0.3,1)]`}
        style={{ animation: 'slideDown 0.2s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X size={14} />
        </button>

        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${meta.gradient} pt-8 pb-14 px-6 relative overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />

          {/* Avatar */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg">
              {loading ? <RefreshCw size={24} className="animate-spin opacity-60" /> : initials}
            </div>
          </div>
        </div>

        {/* Name + role card (overlapping header) */}
        <div className="px-5 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-5 py-4 text-center">
            {loading ? (
              <div className="h-5 w-32 bg-slate-100 rounded-lg animate-pulse mx-auto mb-2" />
            ) : (
              <p className="font-extrabold text-slate-900 text-lg leading-tight">
                {profile?.fullName ?? '—'}
              </p>
            )}
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${meta.light}`}>
                <RoleIcon size={11} />
                {meta.label}
              </span>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="px-5 pt-5 pb-6 space-y-4">
          {error && (
            <p className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2.5 w-16 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3.5 w-40 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <InfoRow icon={Mail}     label="Email"        value={profile?.email}       copyable />
              <InfoRow icon={Phone}    label="Phone"        value={profile?.phoneNumber} />
              <InfoRow icon={Shield}   label="Role"         value={meta.label} />
              <InfoRow icon={Calendar} label="Member Since" value={fmtDate(profile?.createdAt)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
