import React, { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';

const WebSocketAlerts = () => {
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => {
                // In production VITE_WS_BASE_URL is set (e.g. Heroku URL).
                // In development it is undefined — fall back to a relative path
                // so Vite's dev proxy (/ws → localhost:8080) handles it correctly.
                const base = import.meta.env.VITE_WS_BASE_URL || '';
                return new SockJS(`${base}/ws`);
            },
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("Connected to Market WebSocket");
            client.subscribe('/topic/market-events', (message) => {
                if (message.body) {
                    const event = JSON.parse(message.body);
                    toast.custom((t) => (
                        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-slate-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-white/10 mb-4 mr-4`}>
                            <div className="flex-1 w-0 p-5">
                                <div className="flex items-start">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                            </span>
                                            Scenario Inject
                                        </p>
                                        <p className="text-sm font-bold text-white mb-1">
                                            {event.type}
                                        </p>
                                        <p className="text-xs font-semibold text-slate-400 mb-3">
                                            Affects: {event.company}
                                        </p>
                                        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                            <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col border-l border-white/5 bg-slate-800/20 rounded-r-2xl justify-center">
                                <button onClick={() => toast.dismiss(t.id)} className="w-12 h-full flex flex-col items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 focus:outline-none transition-all rounded-r-2xl">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    ), { duration: 10000, position: 'bottom-right' });
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    return null;
};

export default WebSocketAlerts;
