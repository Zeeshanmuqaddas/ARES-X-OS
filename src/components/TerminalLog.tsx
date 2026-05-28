import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalIcon, Lock, Filter } from 'lucide-react';
import { LogEntry } from '../types';
import { cn } from '../lib/utils';

export function TerminalLog({ logs }: { logs: LogEntry[] }) {
  const [filter, setFilter] = useState<'ALL' | LogEntry['level']>('ALL');
  const bottomRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter(log => filter === 'ALL' || log.level === filter);

  return (
    <div className="glass-panel rounded-lg flex flex-col h-full overflow-hidden border border-ares-cyan/30">
      <div className="bg-ares-cyan/10 border-b border-ares-cyan/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-ares-cyan" />
          <span className="text-xs font-bold text-ares-cyan hidden sm:inline">ARES-X SECURE SHELL</span>
          <div className="ml-2 hidden sm:flex items-center gap-1 bg-ares-green/10 border border-ares-green/30 text-ares-green px-1.5 py-0.5 rounded">
            <Lock className="w-2.5 h-2.5" />
            <span className="text-[8px] font-bold tracking-widest uppercase">Encrypted</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
          <div className="flex bg-black/40 border border-white/10 rounded overflow-hidden text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">
            <button 
              onClick={() => setFilter('ALL')}
              className={cn("px-2 py-1 transition-colors", filter === 'ALL' ? "bg-white/20 text-white" : "text-gray-500 hover:text-gray-300")}
            >
              ALL
            </button>
            <button 
              onClick={() => setFilter('SYSTEM')}
              className={cn("px-2 py-1 transition-colors border-l border-white/10", filter === 'SYSTEM' ? "bg-ares-magenta/20 text-ares-magenta" : "text-gray-500 hover:text-gray-300")}
            >
              SYS
            </button>
            <button 
              onClick={() => setFilter('ERROR')}
              className={cn("px-2 py-1 transition-colors border-l border-white/10", filter === 'ERROR' ? "bg-ares-red/20 text-ares-red" : "text-gray-500 hover:text-gray-300")}
            >
              ERR
            </button>
            <button 
              onClick={() => setFilter('WARN')}
              className={cn("px-2 py-1 transition-colors border-l border-white/10", filter === 'WARN' ? "bg-ares-amber/20 text-ares-amber" : "text-gray-500 hover:text-gray-300")}
            >
              WRN
            </button>
            <button 
              onClick={() => setFilter('WORKFLOW')}
              className={cn("px-2 py-1 transition-colors border-l border-white/10", filter === 'WORKFLOW' ? "bg-purple-500/20 text-purple-400" : "text-gray-500 hover:text-gray-300")}
            >
              WKF
            </button>
            <button 
              onClick={() => setFilter('INFO')}
              className={cn("px-2 py-1 transition-colors border-l border-white/10", filter === 'INFO' ? "bg-ares-cyan/20 text-ares-cyan" : "text-gray-500 hover:text-gray-300")}
            >
              INF
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-1.5 text-[11px] sm:text-xs">
        <AnimatePresence initial={false}>
          {filteredLogs.map((log) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-3 hover:bg-white/5 p-0.5 rounded transition-colors overflow-hidden"
            >
              <span className="text-gray-500 whitespace-nowrap">[{log.timestamp}]</span>
              <span className={cn(
                "font-bold w-14 shrink-0",
                log.level === 'INFO' && "text-ares-cyan",
                log.level === 'WARN' && "text-ares-amber",
                log.level === 'ERROR' && "text-ares-red glitch-text",
                log.level === 'SYSTEM' && "text-ares-magenta",
                log.level === 'WORKFLOW' && "text-purple-400 font-black tracking-widest uppercase"
              )}>
                {log.level}
              </span>
              <span className="text-gray-400 font-bold shrink-0 w-24 sm:w-36 truncate">
                {log.module}
              </span>
              <span className="text-gray-200 break-words flex-1">
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
