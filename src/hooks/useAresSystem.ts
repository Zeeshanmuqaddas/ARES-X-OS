import { useState, useEffect, useRef } from 'react';
import { AgentNode, LogEntry, ModelProvider, SystemStatus, TelemetryPoint, ToastInfo } from '../types';

const INITIAL_AGENTS: AgentNode[] = [
  { id: 'agt-orch-01', role: 'System Orchestrator Core', status: 'online', cpu: 12, memory: 45, latency: 45, tasksCompleted: 15420, errorFrequency: 1 },
  { id: 'agt-sec-02', role: 'Security & Compliance', status: 'online', cpu: 8, memory: 22, latency: 12, tasksCompleted: 8900, errorFrequency: 0.5 },
  { id: 'agt-know-03', role: 'Knowledge Retrieval', status: 'online', cpu: 5, memory: 18, latency: 10, tasksCompleted: 340, errorFrequency: 2 },
  { id: 'agt-work-04', role: 'Adaptive Workflow', status: 'online', cpu: 18, memory: 30, latency: 8, tasksCompleted: 125000, errorFrequency: 0 },
  { id: 'agt-res-05', role: 'Resilience Engine', status: 'online', cpu: 22, memory: 35, latency: 15, tasksCompleted: 85400, errorFrequency: 1.2 },
  { id: 'agt-dev-06', role: 'DevOps Integration', status: 'online', cpu: 15, memory: 40, latency: 20, tasksCompleted: 110200, errorFrequency: 0.1 },
  { id: 'agt-gov-07', role: 'Data Governance', status: 'online', cpu: 4, memory: 15, latency: 5, tasksCompleted: 5400, errorFrequency: 0 },
  { id: 'agt-rtr-08', role: 'Multi-LLM Router', status: 'online', cpu: 45, memory: 65, latency: 120, tasksCompleted: 45000, errorFrequency: 12 },
  { id: 'agt-sent-09', role: 'Sentinel Threat Ops', status: 'online', cpu: 25, memory: 55, latency: 85, tasksCompleted: 21000, errorFrequency: 0.3 },
  { id: 'agt-ui-10', role: 'User Interaction', status: 'online', cpu: 10, memory: 80, latency: 5, tasksCompleted: 340000, errorFrequency: 4 },
];

const INITIAL_PROVIDERS: ModelProvider[] = [
  { name: 'GPT-4o (Primary Reasoning)', latency: 240, status: 'active', tokensProcessed: 4500000 },
  { name: 'Claude 3.5 (Long-form)', latency: 450, status: 'standby', tokensProcessed: 850000 },
  { name: 'Mistral Large (Fallback)', latency: 380, status: 'standby', tokensProcessed: 120000 },
  { name: 'Llama 3 70B (Lightweight)', latency: 120, status: 'standby', tokensProcessed: 45000 },
  { name: 'Domain Spec (Local OSS)', latency: 85, status: 'standby', tokensProcessed: 0 },
];

export function useAresSystem() {
  const [status, setStatus] = useState<SystemStatus>('NOMINAL');
  const [agents, setAgents] = useState<AgentNode[]>(INITIAL_AGENTS);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [providers, setProviders] = useState<ModelProvider[]>(INITIAL_PROVIDERS);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [outages, setOutages] = useState<OutageEvent[]>([]);
  const prevStatusRef = useRef<SystemStatus>('NOMINAL');
  
  const logCounter = useRef(0);

  const addToast = (message: string, type: ToastInfo['type']) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };
  const addToastRef = useRef(addToast);
  addToastRef.current = addToast;

  const addLog = (level: LogEntry['level'], module: string, message: string) => {
    setLogs(prev => {
      const newLogs = [{
        id: `log-${Date.now()}-${logCounter.current++}`,
        timestamp: new Date().toISOString().substring(11, 23),
        level,
        module,
        message
      }, ...prev];
      return newLogs.slice(0, 100); // Keep last 100
    });
  };

  // Initialize Telemetry
  useEffect(() => {
    const initialData = Array.from({ length: 20 }).map((_, i) => {
      const time = new Date();
      time.setSeconds(time.getSeconds() - (20 - i));
      return {
        time: time.toISOString().substring(11, 19),
        cpu: 20 + Math.random() * 15,
        memory: 40 + Math.random() * 5,
        activeWorkflows: 150 + Math.floor(Math.random() * 50),
        tokensPerSec: 2500 + Math.random() * 500
      };
    });
    setTelemetry(initialData);
    addLog('SYSTEM', 'ARES-BOOT', 'ARES-X OS Subsystems Initialized. Multi-LLM Router connected.');
    addLog('SYSTEM', 'Sentinel Threat Ops', 'Zero-trust architecture enforced. A2A channels encrypted.');
    addLog('INFO', 'System Orchestrator', 'DAG workflow engine active. Awaiting inbound events.');
  }, []);

  const updateAgent = (id: string, updates: Partial<AgentNode>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    addLog('SYSTEM', 'System Orchestrator Core', `Configuration updated for agent ${id}.`);
  };

  // Tick generator
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Telemetry
      setTelemetry(prev => {
        const last = prev[prev.length - 1];
        const newData = [...prev.slice(1), {
          time: new Date().toISOString().substring(11, 19),
          cpu: Math.min(100, Math.max(5, last.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.min(100, Math.max(20, last.memory + (Math.random() - 0.5) * 2)),
          activeWorkflows: Math.max(0, last.activeWorkflows + Math.floor((Math.random() - 0.5) * 10)),
          tokensPerSec: Math.max(0, last.tokensPerSec + (Math.random() - 0.5) * 300)
        }];
        return newData;
      });

      // 2. Random Agent Fluctuations & Self-Healing Simulation
      setAgents(prev => prev.map(agent => {
        let newStatus = agent.status;
        let newCpu = Math.min(100, Math.max(1, agent.cpu + (Math.random() - 0.5) * 15));
        let newLatency = Math.max(1, agent.latency + (Math.random() - 0.5) * 5);
        
        // Threshold Checks
        if (agent.cpuThreshold && newCpu > agent.cpuThreshold) {
          addLog('WARN', agent.role, `CPU utilization exceeded threshold (${newCpu.toFixed(1)}% > ${agent.cpuThreshold}%)`);
          addToastRef.current(`WARN: ${agent.role} exceeded CPU threshold (${newCpu.toFixed(1)}%)`, 'warning');
        }
        if (agent.latencyThreshold && newLatency > agent.latencyThreshold) {
          addLog('WARN', agent.role, `Latency exceeded threshold (${newLatency.toFixed(0)}ms > ${agent.latencyThreshold}ms)`);
          addToastRef.current(`WARN: ${agent.role} exceeded latency threshold (${newLatency.toFixed(0)}ms)`, 'warning');
        }

        // Simulating failure & property changes
        let newErrorFreq = agent.errorFrequency;
        
        if (agent.status === 'online') {
          newErrorFreq = Math.max(0, Math.min(100, agent.errorFrequency + (Math.random() - 0.5) * 2));
          if (Math.random() < 0.005) {
            newStatus = 'offline';
            newCpu = 0;
            newErrorFreq = 0;
            addLog('ERROR', agent.role, `Heartbeat lost. Pod unresponsive.`);
            addToastRef.current(`CRITICAL: ${agent.role} heartbeat lost. Pod unresponsive.`, 'critical');
          }
        } 
        else if (agent.status === 'offline') {
          newStatus = 'restarting';
          addLog('SYSTEM', 'DevOps Integration', `Triggering pod restart for ${agent.role}.`);
        }
        else if (agent.status === 'restarting') {
          if (Math.random() < 0.4) {
            newStatus = 'verifying';
            addLog('INFO', 'Resilience Engine', `State memory rehydration for ${agent.role} in progress.`);
          }
        }
        else if (agent.status === 'verifying') {
          if (Math.random() < 0.6) {
            newStatus = 'online';
            newErrorFreq = Math.max(0, newErrorFreq - 5);
            addLog('INFO', 'System Orchestrator Core', `${agent.role} successfully integrated into swarm.`);
          }
        }

        return {
          ...agent,
          status: newStatus,
          cpu: newCpu,
          latency: newLatency,
          errorFrequency: newErrorFreq,
          tasksCompleted: agent.status === 'online' ? agent.tasksCompleted + Math.floor(Math.random() * 5) : agent.tasksCompleted
        };
      }));

      // 3. System Status Determination
      setAgents(currentAgents => {
        const offlineCount = currentAgents.filter(a => a.status === 'offline' || a.status === 'restarting').length;
        let newStatus: SystemStatus = 'NOMINAL';
        if (offlineCount > 2) {
          newStatus = 'CRITICAL';
        } else if (offlineCount > 0) {
          newStatus = 'DEGRADED';
        } else if (currentAgents.some(a => a.status === 'verifying')) {
          newStatus = 'RECOVERING';
        }

        if (newStatus === 'CRITICAL' && prevStatusRef.current !== 'CRITICAL') {
          setOutages(prev => [{
            id: `outage-${Date.now()}`,
            type: 'CRITICAL',
            startTime: Date.now(),
            endTime: null,
            description: 'Critical Agent Cluster Failure (Offline > 2)'
          }, ...prev].slice(0, 50));
        } else if (newStatus !== 'CRITICAL' && prevStatusRef.current === 'CRITICAL') {
          setOutages(prev => {
            const newOutages = [...prev];
            const active = newOutages.find(o => o.type === 'CRITICAL' && o.endTime === null);
            if (active) active.endTime = Date.now();
            return newOutages;
          });
        }
        
        setStatus(newStatus);
        prevStatusRef.current = newStatus;
        return currentAgents;
      });

      // 4. Random Provider Failover Simulation
      if (Math.random() < 0.01) {
        setProviders(prev => {
          const newProviders = [...prev];
          const activeIdx = newProviders.findIndex(p => p.status === 'active');
          if (activeIdx !== -1) {
            newProviders[activeIdx].status = 'failing';
            addLog('WARN', 'Multi-LLM Router', `Latency spike detected on ${newProviders[activeIdx].name}. Initiating failover.`);
            addToastRef.current(`ROUTING ALERT: ${newProviders[activeIdx].name} failing. Failover initiated.`, 'critical');
            
            setOutages(outPrev => [{
              id: `fail-${Date.now()}`,
              type: 'FAILOVER',
              startTime: Date.now(),
              endTime: null,
              description: `${newProviders[activeIdx].name} latency spike`
            }, ...outPrev].slice(0, 50));

            // Find next standby
            const standbyIdx = newProviders.findIndex(p => p.status === 'standby');
            if (standbyIdx !== -1) {
              newProviders[standbyIdx].status = 'active';
              addLog('SYSTEM', 'Multi-LLM Router', `Traffic routed to ${newProviders[standbyIdx].name}. Zero state loss.`);
            }
          }
          return newProviders;
        });
      }

      // Recover failovers over time
      setProviders(prev => {
        let changed = false;
        const newProviders = prev.map(p => {
          if (p.status === 'failing' && Math.random() < 0.1) {
             addLog('INFO', 'Multi-LLM Router', `Connection stabilized to ${p.name}. Returning to standby.`);
             
             setOutages(outPrev => {
               const newOutages = [...outPrev];
               const active = newOutages.find(o => o.type === 'FAILOVER' && o.endTime === null && o.description.includes(p.name));
               if (active) active.endTime = Date.now();
               return newOutages;
             });
             
             changed = true;
             return { ...p, status: 'standby' as const };
          }
          if (p.status === 'active') {
            return { ...p, tokensProcessed: p.tokensProcessed + Math.floor(Math.random() * 800) }
          }
          return p;
        });
        return changed ? newProviders : prev; // Prevent unnecessary re-renders
      });

      // 5. Random Ambient OS Logs
      if (Math.random() < 0.15) {
        const ambientEvents: { level: LogEntry['level'], module: string, msg: string }[] = [
          { level: 'WORKFLOW', module: 'System Orchestrator', msg: 'Decomposed user request into 4 sub-tasks (DAG graph updated).' },
          { level: 'INFO', module: 'Knowledge Retrieval', msg: 'Vector embedding match found in Pinecone. Context fused.' },
          { level: 'WORKFLOW', module: 'Adaptive Workflow', msg: 'Spawning parallel agent threads for analysis pipeline.' },
          { level: 'SYSTEM', module: 'Sentinel Threat Ops', msg: 'Zero-trust validation passed for inbound user interaction.' },
          { level: 'INFO', module: 'Data Governance', msg: 'Metadata lineage tracked and audit log committed.' },
          { level: 'INFO', module: 'Security', msg: 'PII detection passed. No sensitive data anomalies.' },
          { level: 'WORKFLOW', module: 'Multi-LLM Router', msg: 'Routing lightweight inference task to Llama 3 70B.' },
          { level: 'INFO', module: 'User Interaction', msg: 'Session state synchronized with external client.' },
        ];
        const e = ambientEvents[Math.floor(Math.random() * ambientEvents.length)];
        addLog(e.level, e.module, e.msg);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { status, agents, telemetry, logs, providers, toasts, outages, updateAgent };
}
