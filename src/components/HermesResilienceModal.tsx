import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface IncidentReport {
  INCIDENT_ID: string;
  SEVERITY: string;
  STATUS: string;
  DETECTED_AT: string;
  RECOVERED_AT: string;
  ROOT_CAUSE: string[];
  IMPACT: string[];
  AUTOMATED_ACTIONS: string[];
  RECOVERY_RESULT: string[];
  POST_MORTEM_RECOMMENDATIONS: string[];
}

export function HermesResilienceModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [provider, setProvider] = useState('GPT-5-Primary');

  const simulateIncident = async () => {
    setLoading(true);
    setReport(null);
    try {
      const response = await fetch('/api/resilience/incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: provider, failureType: 'Timeout Escalation' })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setTimeout(() => {
          setReport(data.incident_report);
          setLoading(false);
        }, 1200); // simulate orchestration delay
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

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
          className="bg-black/90 border border-ares-red/30 p-4 sm:p-6 rounded-xl w-full max-w-4xl flex flex-col shadow-[0_0_40px_color-mix(in_srgb,var(--theme-red)_15%,transparent)] overflow-hidden"
          onClick={e => e.stopPropagation()}
          style={{ maxHeight: 'calc(100vh - 4rem)' }}
        >
          <div className="flex justify-between items-start mb-6 border-b border-ares-red/20 pb-4">
            <div>
              <h2 className="text-xl font-bold text-ares-red flex items-center gap-2 tracking-widest uppercase">
                <Activity className="w-5 h-5" />
                HERMES RESILIENCE-X ORCHESTRATOR
              </h2>
              <div className="text-xs text-gray-400 mt-1 tracking-widest uppercase">
                Enterprise Agentic AI Failover & Recovery System
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-white/5 rounded p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Control Panel */}
            <div className="md:col-span-1 flex flex-col gap-4 border-r border-white/5 pr-4 overflow-y-auto">
              <div className="glass-panel p-4 rounded-lg">
                <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-ares-cyan" />
                  System Role
                </h3>
                <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                  Autonomous production resilience orchestrator capable of detecting failures, predicting outages, and executing failover workflows to maintain HA across multiple LLMs and MCP nodes.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Target Provider for Failure Simulation</label>
                <select 
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="bg-black/50 border border-white/10 text-white text-xs p-2 rounded focus:border-ares-red/50 focus:outline-none font-mono"
                >
                  <option value="GPT-5-Primary">Primary: GPT-5</option>
                  <option value="Gemini-2.x-Routing">Secondary: Gemini 2.x</option>
                  <option value="Claude-3-Ops">Tertiary: Claude 3</option>
                  <option value="Mistral-Fast">Quaternary: Mistral</option>
                </select>
                <button 
                  onClick={simulateIncident}
                  disabled={loading}
                  className="bg-ares-red/10 border border-ares-red/30 text-ares-red hover:bg-ares-red/20 font-bold tracking-widest text-xs uppercase px-4 py-2.5 rounded transition-all flex justify-center items-center gap-2 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 glitch-text">
                      <Zap className="w-4 h-4 animate-pulse" /> INITIATING FAILOVER...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> TRIGGER SEV-1 INCIDENT
                    </span>
                  )}
                </button>
              </div>

              <div className="glass-panel p-4 rounded-lg mt-auto">
                <h3 className="text-[10px] font-bold text-ares-amber tracking-widest uppercase mb-2">Automated Fallback Policy</h3>
                <ul className="text-[9px] text-gray-500 font-mono space-y-1">
                  <li>&gt; Retry 1: 2s delay</li>
                  <li>&gt; Retry 3: 8s delay</li>
                  <li>&gt; Retry 5: Activate Fallback Model</li>
                  <li>&gt; Circuit Breaker: OPEN on 5xx spike</li>
                </ul>
              </div>
            </div>

            {/* Output Display */}
            <div className="md:col-span-2 bg-black/60 border border-white/5 rounded-lg p-4 font-mono text-[11px] overflow-y-auto flex flex-col relative h-[500px]">
              {!report && !loading && (
                <div className="m-auto text-gray-600 flex flex-col items-center gap-4 text-center">
                  <Activity className="w-12 h-12 opacity-50" />
                  <div>
                    <div className="text-sm font-bold tracking-widest uppercase text-gray-500">Awaiting Incident Data</div>
                    <div className="mt-2 text-[10px]">Hermes Resilience-X is currently in standby mode. Nominal conditions across all clusters.</div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="m-auto flex flex-col items-center gap-6">
                  <div className="w-16 h-16 border-2 border-ares-red/20 border-t-ares-red rounded-full animate-spin"></div>
                  <div className="text-ares-red font-bold tracking-widest uppercase animate-pulse">Running Intelligent Recovery Workflow</div>
                  <div className="text-gray-500 text-[10px] text-left space-y-1">
                    <div>&gt; Detecting timeout spikes... OK</div>
                    <div>&gt; Pausing unstable provider traffic... OK</div>
                    <div>&gt; Activating circuit breaker... OPEN</div>
                    <div>&gt; Routing requests to backup provider... DONE</div>
                  </div>
                </div>
              )}

              {report && !loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-gray-300 relative">
                  <h3 className="text-lg font-black text-white bg-ares-red/20 inline-block px-3 py-1 rounded tracking-widest border border-ares-red/50">INCIDENT REPORT</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-gray-500">INCIDENT_ID:</span> {report.INCIDENT_ID}</div>
                    <div><span className="text-gray-500">SEVERITY:</span> <span className="text-ares-red font-bold">{report.SEVERITY}</span></div>
                    <div><span className="text-gray-500">STATUS:</span> <span className="text-ares-green font-bold">{report.STATUS}</span></div>
                    <div><span className="text-gray-500">DETECTED_AT:</span> {new Date(report.DETECTED_AT).toLocaleTimeString()}</div>
                    <div className="col-span-2"><span className="text-gray-500">RECOVERED_AT:</span> {new Date(report.RECOVERED_AT).toLocaleTimeString()}</div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-ares-cyan font-bold block mb-2 tracking-widest">ROOT_CAUSE:</span>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                      {report.ROOT_CAUSE.map((rc, i) => <li key={i}>{rc}</li>)}
                    </ul>
                  </div>

                  <div>
                    <span className="text-ares-amber font-bold block mb-2 tracking-widest">IMPACT:</span>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                      {report.IMPACT.map((imp, i) => <li key={i}>{imp}</li>)}
                    </ul>
                  </div>

                  <div>
                    <span className="text-purple-400 font-bold block mb-2 tracking-widest">AUTOMATED_ACTIONS:</span>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                      {report.AUTOMATED_ACTIONS.map((act, i) => <li key={i}>{act}</li>)}
                    </ul>
                  </div>

                  <div>
                    <span className="text-ares-green font-bold block mb-2 tracking-widest">RECOVERY_RESULT:</span>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                      {report.RECOVERY_RESULT.map((res, i) => <li key={i}>{res}</li>)}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <span className="text-gray-400 font-bold block mb-2 tracking-widest">POST_MORTEM_RECOMMENDATIONS:</span>
                    <ul className="list-disc pl-4 space-y-1 text-gray-500 text-[10px]">
                      {report.POST_MORTEM_RECOMMENDATIONS.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
