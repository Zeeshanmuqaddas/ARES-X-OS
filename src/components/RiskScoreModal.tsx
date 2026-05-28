import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Activity, AlertTriangle } from 'lucide-react';
import { AgentNode } from '../types';
import { cn } from '../lib/utils';

export function RiskScoreModal({ agents, onClose }: { agents: AgentNode[], onClose: () => void }) {
  // Sort agents by risk score descending
  const agentsWithRisk = agents.map(agent => {
    // Risk Score Calculation
    // Base latency score (up to 300ms contributes 50 points)
    const latencyScore = Math.min(50, (agent.latency / 300) * 50);
    // Base error frequency score (up to 20% contributes 50 points)
    const errorScore = Math.min(50, (agent.errorFrequency / 20) * 50);
    const totalRisk = Math.round(latencyScore + errorScore);
    
    return { ...agent, riskScore: totalRisk };
  }).sort((a, b) => b.riskScore - a.riskScore);

  return (
    <AnimatePresence>
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
          className="bg-black/90 border border-white/10 p-4 sm:p-6 rounded-xl w-full max-w-3xl flex flex-col shadow-[0_0_30px_color-mix(in_srgb,var(--theme-amber)_10%,transparent)] overflow-hidden"
          onClick={e => e.stopPropagation()}
          style={{ maxHeight: 'calc(100vh - 4rem)' }}
        >
          <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-widest uppercase">
                <ShieldAlert className="w-5 h-5 text-ares-amber" />
                Proactive Risk Analysis
              </h2>
              <div className="text-xs text-gray-400 mt-1 tracking-widest uppercase">
                Predictive failover metrics based on latency & error rates
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-white/5 rounded p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {agentsWithRisk.map(agent => (
              <div key={agent.id} className="glass-panel p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded tracking-widest uppercase",
                      agent.riskScore >= 70 ? "bg-ares-red/10 text-ares-red border border-ares-red/30" :
                      agent.riskScore >= 40 ? "bg-ares-amber/10 text-ares-amber border border-ares-amber/30" :
                      "bg-ares-green/10 text-ares-green border border-ares-green/30"
                    )}>
                      {agent.riskScore >= 70 ? 'CRITICAL RISK' :
                       agent.riskScore >= 40 ? 'ELEVATED RISK' :
                       'NOMINAL'}
                    </span>
                    <span className="font-bold text-white truncate uppercase tracking-widest">{agent.role}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono tracking-wider">{agent.id}</div>
                </div>

                <div className="flex items-center gap-6 shrink-0 bg-black/40 px-4 py-2 rounded border border-white/5 w-full sm:w-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest">Latency</span>
                    <span className="text-sm font-bold text-gray-200">{agent.latency.toFixed(0)} ms</span>
                  </div>
                  <div className="h-6 w-px bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest">Error Freq</span>
                    <span className="text-sm font-bold text-gray-200">{agent.errorFrequency.toFixed(1)}%</span>
                  </div>
                  <div className="h-6 w-px bg-white/10"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest">Risk Score</span>
                    <span className={cn(
                      "text-lg font-black",
                      agent.riskScore >= 70 ? "text-ares-red" :
                      agent.riskScore >= 40 ? "text-ares-amber" :
                      "text-ares-green"
                    )}>{agent.riskScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
