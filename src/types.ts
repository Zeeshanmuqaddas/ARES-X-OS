export type SystemStatus = 'NOMINAL' | 'DEGRADED' | 'RECOVERING' | 'CRITICAL';

export type AgentRole = 
  | 'Supervisor AI'
  | 'Reliability Agent'
  | 'Recovery Agent'
  | 'Infra Monitor'
  | 'Routing Agent'
  | 'Security Agent'
  | 'Cost Optimizer'
  | 'Hallucination Detector'
  | 'Workflow Planner'
  | 'Memory Coordinator'
  | 'Incident Analyzer';

export interface AgentNode {
  id: string;
  role: string;
  status: 'online' | 'offline' | 'restarting' | 'verifying';
  cpu: number;
  memory: number;
  latency: number;
  tasksCompleted: number;
  errorFrequency: number;
  cpuThreshold?: number;
  latencyThreshold?: number;
}

export interface TelemetryPoint {
  time: string;
  cpu: number;
  memory: number;
  activeWorkflows: number;
  tokensPerSec: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM' | 'WORKFLOW';
  module: string;
  message: string;
}

export interface ModelProvider {
  name: string;
  latency: number;
  status: 'active' | 'standby' | 'failing';
  tokensProcessed: number;
}

export interface ToastInfo {
  id: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
}

export interface OutageEvent {
  id: string;
  type: 'CRITICAL' | 'FAILOVER';
  startTime: number;
  endTime: number | null;
  description: string;
}
