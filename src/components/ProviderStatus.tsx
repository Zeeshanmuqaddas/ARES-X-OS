import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, ZapOff, ArrowRightLeft } from 'lucide-react';
import { ModelProvider } from '../types';
import { cn } from '../lib/utils';

export function ProviderStatus({ providers }: { providers: ModelProvider[] }) {
  return (
    <div className="glass-panel rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-xs font-bold text-gray-400 mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-ares-magenta" />
          MULTI-LLM FAILOVER ROUTING
        </span>
        <span className="text-[10px] bg-ares-magenta/20 text-ares-magenta px-2 py-0.5 rounded-full">TRUEFOUNDRY AI GATEWAY</span>
      </h3>
      
      <div className="flex-1 space-y-2">
        <AnimatePresence>
          {providers.map((provider) => (
            <motion.div
              layout
              key={provider.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-2.5 rounded flex items-center justify-between border transition-all",
                provider.status === 'active' && "bg-ares-cyan/10 border-ares-cyan/40",
                provider.status === 'standby' && "bg-black/30 border-gray-800",
                provider.status === 'failing' && "bg-ares-red/10 border-ares-red/40"
              )}
            >
              <div className="flex items-center gap-3">
                {provider.status === 'active' ? (
                  <Zap className="w-4 h-4 text-ares-cyan animate-pulse" />
                ) : provider.status === 'failing' ? (
                  <ZapOff className="w-4 h-4 text-ares-red glitch-text" />
                ) : (
                  <Cpu className="w-4 h-4 text-gray-600" />
                )}
                <div>
                  <div className="text-xs font-bold text-gray-200">{provider.name}</div>
                  <div className="text-[10px] text-gray-500">Vol: {(provider.tokensProcessed / 1000).toFixed(1)}k tokens</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={cn(
                  "text-xs font-bold",
                  provider.status === 'active' ? "text-ares-cyan" : provider.status === 'failing' ? "text-ares-red" : "text-gray-500"
                )}>
                  {provider.latency}ms
                </div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">
                  {provider.status}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
