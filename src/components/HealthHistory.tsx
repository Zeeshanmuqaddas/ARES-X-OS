import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Clock, ShieldAlert, Activity } from 'lucide-react';
import { OutageEvent } from '../types';
import { cn } from '../lib/utils';

export function HealthHistory({ outages }: { outages: OutageEvent[] }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const int = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(int);
  }, []);

  const formatDuration = (start: number, end: number | null) => {
    const ms = (end || now) - start;
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    return `${m}m ${s % 60}s`;
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toISOString().substring(11, 19);
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-xl overflow-hidden relative">
      <div className="sticky top-0 bg-black/80 backdrop-blur-md p-3 border-b border-white/5 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-ares-amber" />
          <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase">System Health History</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            {outages.length} Events
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence initial={false}>
          {outages.length > 0 ? (
            outages.map(outage => (
              <motion.div
                key={outage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-3 rounded border bg-black/40 text-xs",
                  outage.type === 'CRITICAL' 
                    ? "border-ares-red/30 shadow-[0_0_10px_rgba(255,0,60,0.05)]" 
                    : "border-ares-amber/30 shadow-[0_0_10px_rgba(255,176,0,0.05)]"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {outage.type === 'CRITICAL' ? (
                      <ShieldAlert className="w-4 h-4 text-ares-red shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-ares-amber shrink-0" />
                    )}
                    <div className="font-bold tracking-widest uppercase truncate text-gray-200">
                      {outage.description}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0 text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-600" />
                      {formatTime(outage.startTime)}
                    </span>
                    <span className={cn(
                      "font-bold w-12 text-right",
                      !outage.endTime ? (outage.type === 'CRITICAL' ? 'text-ares-red animate-pulse' : 'text-ares-amber animate-pulse') : 'text-ares-green'
                    )}>
                      {formatDuration(outage.startTime, outage.endTime)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 opacity-50">
              <ShieldAlert className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">No Critical Events Logged</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
