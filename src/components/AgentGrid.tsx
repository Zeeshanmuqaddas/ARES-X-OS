import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Box, CheckCircle, AlertTriangle, RefreshCcw, Activity, Lock } from 'lucide-react';
import { AgentNode, LogEntry } from '../types';
import { cn } from '../lib/utils';
import { AgentModal } from './AgentModal';

export function AgentGrid({ agents, logs, onUpdateAgent }: { agents: AgentNode[], logs: LogEntry[], onUpdateAgent: (id: string, updates: Partial<AgentNode>) => void }) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  // Need to get the latest agent state from agents array
  const selectedAgent = selectedAgentId ? agents.find(a => a.id === selectedAgentId) || null : null;

  const getStatusColor = (status: AgentNode['status']) => {
    switch (status) {
      case 'online': return 'text-ares-green';
      case 'offline': return 'text-ares-red';
      case 'restarting': return 'text-ares-amber';
      case 'verifying': return 'text-ares-cyan';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: AgentNode['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'offline': return <AlertTriangle className="w-4 h-4 glitch-text" />;
      case 'restarting': return <RefreshCcw className="w-4 h-4 animate-spin" />;
      case 'verifying': return <Activity className="w-4 h-4 animate-pulse" />;
      default: return <Box className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            layout
            onClick={() => setSelectedAgentId(agent.id)}
            className={cn(
              "glass-panel rounded-lg p-3 relative overflow-hidden flex flex-col cursor-pointer transition-colors hover:border-ares-cyan/50",
              agent.status === 'offline' && "border-ares-red/40 bg-ares-red/5 hover:border-ares-red/60"
            )}
          >
            {/* Neon Top Border indicator */}
          <div className={cn(
            "absolute top-0 left-0 w-full h-[2px] opacity-70",
            agent.status === 'online' && "bg-ares-green",
            agent.status === 'offline' && "bg-ares-red shadow-[0_0_8px_var(--theme-red)]",
            agent.status === 'restarting' && "bg-ares-amber",
            agent.status === 'verifying' && "bg-ares-cyan"
          )} />

          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Lock className="w-3 h-3 text-ares-green/70 shrink-0" />
              <span className="text-xs font-bold text-gray-300 truncate tracking-tight">{agent.role}</span>
            </div>
            <div className={cn("flex items-center gap-1.5 shrink-0 ml-2", getStatusColor(agent.status))}>
              <span className="text-[10px] uppercase">{agent.status}</span>
              {getStatusIcon(agent.status)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div>
              <div className="text-[10px] text-gray-500">CPU</div>
              <div className="text-sm font-bold text-ares-cyan">
                {agent.cpu.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">MEM</div>
              <div className="text-sm font-bold text-ares-magenta">
                {agent.memory.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">LATENCY</div>
              <div className="text-sm font-bold text-gray-300">
                {agent.latency.toFixed(0)}ms
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">TASKS</div>
              <div className="text-sm font-bold text-gray-300">
                {Math.floor(agent.tasksCompleted / 1000)}k
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      </div>

      <AgentModal
        agent={selectedAgent}
        logs={selectedAgent ? logs.filter(log => log.module === selectedAgent.role || log.message.includes(selectedAgent.role) || log.module.includes(selectedAgent.role.replace(' ', '-'))) : []}
        onClose={() => setSelectedAgentId(null)}
        onUpdateAgent={onUpdateAgent}
      />
    </>
  );
}
