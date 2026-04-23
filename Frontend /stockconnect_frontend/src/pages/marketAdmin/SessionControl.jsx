import React, { useEffect, useState } from 'react';
import { PlayCircle, Clock, Calendar, Save, Zap, HelpCircle } from 'lucide-react';
import { marketAdminService } from '../../services/marketAdminService';
import toast from 'react-hot-toast';

const SessionControl = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const [schedule, setSchedule] = useState({
        openTime: '09:00',
        closeTime: '15:00',
        sessionDate: new Date().toISOString().split('T')[0],
        autoOpen: true
    });

    const [event, setEvent] = useState({
        type: 'Rate hike — National',
        company: 'All companies',
        description: 'The NBR raised the repo rate by 0.5%...',
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await marketAdminService.getSession();
            setSession(data);
            if (data.openTime) setSchedule(prev => ({ ...prev, openTime: data.openTime }));
            if (data.closeTime) setSchedule(prev => ({ ...prev, closeTime: data.closeTime }));
            if (data.sessionDate) setSchedule(prev => ({ ...prev, sessionDate: data.sessionDate }));
            if (data.autoOpen !== undefined) setSchedule(prev => ({ ...prev, autoOpen: data.autoOpen }));
        } catch (error) {
            console.error('Failed to load session info', error);
            toast.error('Failed to load session info');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleToggleSession = async () => {
        try {
            const updated = await marketAdminService.toggleSession();
            setSession(updated);
            toast.success(`Market ${updated.active ? 'opened' : 'closed'} successfully`);
        } catch(e) { toast.error('Failed to toggle session'); }
    };

    const handleSaveSchedule = async () => {
        try {
            const updated = await marketAdminService.updateSchedule(schedule);
            setSession(updated);
            toast.success('Schedule saved successfully');
        } catch(e) { toast.error('Failed to update schedule'); }
    };

    const handleBroadcast = async () => {
        try {
            await marketAdminService.broadcastEvent(event);
            toast.success('Event broadcasted to all traders');
        } catch(e) { toast.error('Failed to broadcast event'); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Top Status Bar */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Current session</p>
                     <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        {loading ? 'Fetching...' : `${session?.active ? 'Open' : 'Closed'} · ${session?.institutionName} | ${session?.academicPeriod}`}
                        {session?.active ? (
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 tracking-widest">LIVE</span>
                        ) : (
                            <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 tracking-widest">CLOSED</span>
                        )}
                     </h2>
                </div>
                <button 
                    onClick={handleToggleSession}
                    className={`px-8 py-3 font-black text-sm rounded-2xl transition-all shadow-lg active:scale-95 text-white ${session?.active ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                    {session?.active ? 'Close Market' : 'Open Market'}
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
                                    <input type="time" 
                                        value={schedule.openTime} 
                                        onChange={e => setSchedule({...schedule, openTime: e.target.value})}
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Close time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="time" 
                                        value={schedule.closeTime}
                                        onChange={e => setSchedule({...schedule, closeTime: e.target.value})}
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Session date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="date" 
                                    value={schedule.sessionDate}
                                    onChange={e => setSchedule({...schedule, sessionDate: e.target.value})}
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Auto-open</label>
                            <select 
                                value={schedule.autoOpen ? 'true' : 'false'}
                                onChange={e => setSchedule({...schedule, autoOpen: e.target.value === 'true'})}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all appearance-none cursor-pointer">
                                <option value="true">Enabled</option>
                                <option value="false">Disabled</option>
                            </select>
                        </div>

                        <button onClick={handleSaveSchedule} className="w-full py-4 bg-slate-950 text-[#fad059] font-black rounded-2xl hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg">
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
                            <select 
                                onChange={e => setEvent({...event, type: e.target.value})}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all cursor-pointer">
                                <option>Rate hike — National</option>
                                <option>Company Acquisition</option>
                                <option>Inflation Surge</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Affects company</label>
                            <select 
                                onChange={e => setEvent({...event, company: e.target.value})}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all cursor-pointer">
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
                                value={event.description}
                                onChange={e => setEvent({...event, description: e.target.value})}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-[#fad059] transition-all min-h-[120px] resize-none"
                            ></textarea>
                        </div>

                        <button onClick={handleBroadcast} className="w-full py-4 bg-slate-950 text-white font-black rounded-2xl hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg">
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
