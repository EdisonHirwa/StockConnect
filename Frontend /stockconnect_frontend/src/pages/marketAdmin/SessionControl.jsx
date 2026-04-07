import React from 'react';
import { PlayCircle, Clock, Calendar, Save, Zap, HelpCircle } from 'lucide-react';

const SessionControl = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Top Status Bar */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Current session</p>
                     <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        Open · 09:00 – 15:00 CAT · Day 47 of Semester 1
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 tracking-widest">LIVE</span>
                     </h2>
                </div>
                <button className="px-8 py-3 bg-red-500 text-white font-black text-sm rounded-2xl hover:bg-red-600 transition-all shadow-lg active:scale-95">
                    Close Market
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configure Next Session */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-black text-slate-900">Configure next session</h3>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Open time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="text" defaultValue="09 : 00 AM" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Close time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="text" defaultValue="03 : 00 PM" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Session date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" defaultValue="04 / 08 / 2025" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Auto-open</label>
                            <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all appearance-none cursor-pointer">
                                <option>Enabled</option>
                                <option>Disabled</option>
                            </select>
                        </div>

                        <button className="w-full py-4 bg-slate-950 text-[#fad059] font-black rounded-2xl hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg">
                            <Save size={18} />
                            Save schedule
                        </button>
                    </div>
                </div>

                {/* Market Scenario Injection */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                     <h3 className="text-xl font-black text-slate-900">Market scenario injection</h3>

                     <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-600 leading-relaxed">
                            Inject a scenario event to simulate market-moving news for CBT exercises.
                        </p>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Scenario type</label>
                            <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all cursor-pointer">
                                <option>Rate hike — National</option>
                                <option>Company Acquisition</option>
                                <option>Inflation Surge</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Affects company</label>
                            <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all cursor-pointer">
                                <option>All companies</option>
                                <option>Bank of Kigali (BK)</option>
                                <option>MTN Rwanda</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between items-center">
                                Event description (visible to traders)
                                <HelpCircle size={14} className="opacity-40" />
                            </label>
                            <textarea 
                                defaultValue="The NBR raised the repo rate by 0.5%..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all min-h-[120px] resize-none"
                            ></textarea>
                        </div>

                        <button className="w-full py-4 bg-slate-950 text-white font-black rounded-2xl hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg">
                            <Zap size={18} className="text-amber-500" />
                            Broadcast event
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default SessionControl;
