import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, MemoryStick, Activity, Network, Settings } from 'lucide-react';
import { AgentNode, LogEntry } from '../types';
import { cn } from '../lib/utils';

export function AgentModal({ agent, logs, onClose, onUpdateAgent }: { agent: AgentNode | null, logs: LogEntry[], onClose: () => void, onUpdateAgent?: (id: string, updates: Partial<AgentNode>) => void }) {
  const [cpuThresh, setCpuThresh] = useState('');
  const [latThresh, setLatThresh] = useState('');

  useEffect(() => {
    if (agent) {
      setCpuThresh(agent.cpuThreshold?.toString() || '');
      setLatThresh(agent.latencyThreshold?.toString() || '');
    }
  }, [agent?.id]);

  const handleSave = () => {
    if (agent && onUpdateAgent) {
      onUpdateAgent(agent.id, {
        cpuThreshold: cpuThresh ? Number(cpuThresh) : undefined,
        latencyThreshold: latThresh ? Number(latThresh) : undefined
      });
    }
  };

  return (
    <AnimatePresence>
      {agent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-black/90 border border-white/10 p-4 sm:p-6 rounded-xl w-full max-w-2xl flex flex-col shadow-[0_0_30px_color-mix(in_srgb,var(--theme-cyan)_10%,transparent)] overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: 'calc(100vh - 4rem)' }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-widest uppercase">
                  <Network className="w-5 h-5 text-ares-cyan" />
                  {agent.role}
                </h2>
                <div className="text-xs text-gray-400 mt-1 tracking-widest">NODE ID: {agent.id}</div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-white/5 rounded p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 shrink-0">
              <div className="glass-panel p-3 rounded">
                <div className="text-[10px] text-gray-500 flex items-center gap-1 mb-1 tracking-widest"><Cpu className="w-3 h-3"/> CPU</div>
                <div className="text-lg font-bold text-ares-cyan">{agent.cpu.toFixed(1)}%</div>
              </div>
              <div className="glass-panel p-3 rounded">
                <div className="text-[10px] text-gray-500 flex items-center gap-1 mb-1 tracking-widest"><MemoryStick className="w-3 h-3"/> MEMORY</div>
                <div className="text-lg font-bold text-ares-magenta">{agent.memory.toFixed(1)}%</div>
              </div>
              <div className="glass-panel p-3 rounded">
                <div className="text-[10px] text-gray-500 flex items-center gap-1 mb-1 tracking-widest"><Activity className="w-3 h-3"/> LATENCY</div>
                <div className="text-lg font-bold text-gray-200">{agent.latency.toFixed(0)}ms</div>
              </div>
              <div className="glass-panel p-3 rounded">
                <div className="text-[10px] text-gray-500 flex items-center gap-1 mb-1 tracking-widest"><Network className="w-3 h-3"/> TASKS</div>
                <div className="text-lg font-bold text-ares-green">{Math.floor(agent.tasksCompleted / 1000)}k</div>
              </div>
            </div>
            
            <div className="mb-6 shrink-0 flex flex-col gap-2">
              <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
                Alert Configuration
              </h3>
              <div className="glass-panel p-4 rounded flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="text-[10px] text-gray-500 block mb-1 tracking-widest uppercase font-bold">Max CPU Threshold (%)</label>
                  <input 
                    type="number" 
                    value={cpuThresh} 
                    onChange={e => setCpuThresh(e.target.value)} 
                    className="w-full bg-black/50 border border-white/10 focus:border-ares-cyan/50 focus:outline-none rounded px-3 py-1.5 text-xs text-white font-mono" 
                    placeholder="e.g. 80" 
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-[10px] text-gray-500 block mb-1 tracking-widest uppercase font-bold">Max Latency (ms)</label>
                  <input 
                    type="number" 
                    value={latThresh} 
                    onChange={e => setLatThresh(e.target.value)} 
                    className="w-full bg-black/50 border border-white/10 focus:border-ares-cyan/50 focus:outline-none rounded px-3 py-1.5 text-xs text-white font-mono" 
                    placeholder="e.g. 150" 
                  />
                </div>
                <button 
                  onClick={handleSave} 
                  className="bg-ares-cyan/10 hover:bg-ares-cyan/20 border border-ares-cyan/30 text-ares-cyan px-6 py-1.5 rounded text-xs font-bold tracking-widest transition-colors w-full sm:w-auto h-[34px] flex items-center justify-center shrink-0"
                >
                  SAVE
                </button>
              </div>
            </div>
            
            <div className="flex-1 min-h-0 flex flex-col">
              <h3 className="text-xs font-bold text-gray-400 mb-2 tracking-widest uppercase">Agent Event Log ({agent.id})</h3>
              <div className="flex-1 overflow-y-auto glass-panel p-1 rounded text-[11px] sm:text-xs">
                {logs.length > 0 ? logs.map(log => (
                  <div key={log.id} className="flex gap-2 items-start opacity-80 hover:opacity-100 transition-opacity p-1.5 hover:bg-white/5 rounded mx-1">
                    <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                    <span className={cn(
                      "font-bold w-12 shrink-0",
                      log.level === 'INFO' && "text-ares-cyan",
                      log.level === 'WARN' && "text-ares-amber",
                      log.level === 'ERROR' && "text-ares-red",
                      log.level === 'SYSTEM' && "text-ares-magenta"
                    )}>{log.level}</span>
                    <span className="text-gray-300 break-words">{log.message}</span>
                  </div>
                )) : (
                  <div className="text-gray-500 p-2 italic text-center mt-4">No recent logs for this agent.</div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
