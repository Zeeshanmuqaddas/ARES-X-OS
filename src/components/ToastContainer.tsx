import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, XCircle, Info } from 'lucide-react';
import { ToastInfo } from '../types';
import { cn } from '../lib/utils';

export function ToastContainer({ toasts }: { toasts: ToastInfo[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3 rounded-lg border backdrop-blur-md w-72 lg:w-80",
              toast.type === 'critical' ? "bg-ares-red/20 border-ares-red shadow-[0_0_15px_var(--theme-red)] text-white" :
              toast.type === 'warning' ? "bg-ares-amber/20 border-ares-amber shadow-[0_0_15px_var(--theme-amber)] text-white" :
              "bg-ares-cyan/20 border-ares-cyan shadow-[0_0_15px_var(--theme-cyan)] text-white"
            )}
          >
            {toast.type === 'critical' ? <XCircle className="w-5 h-5 text-ares-red shrink-0 glitch-text" /> :
             toast.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-ares-amber shrink-0" /> :
             <Info className="w-5 h-5 text-ares-cyan shrink-0" />}
            <div className="flex-1 text-xs font-bold tracking-wide">
              {toast.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
