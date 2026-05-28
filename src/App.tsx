import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Activity, Database, Lock, Palette, LogOut, User, Search } from 'lucide-react';
import { useAresSystem } from './hooks/useAresSystem';
import { AgentGrid } from './components/AgentGrid';
import { TerminalLog } from './components/TerminalLog';
import { TelemetryCharts } from './components/TelemetryCharts';
import { ProviderStatus } from './components/ProviderStatus';
import { ToastContainer } from './components/ToastContainer';
import { Auth } from './components/Auth';
import { HealthHistory } from './components/HealthHistory';
import { RiskScoreModal } from './components/RiskScoreModal';
import { HermesResilienceModal } from './components/HermesResilienceModal';
import { cn } from './lib/utils';
import { SystemStatus } from './types';

export default function App() {
  const { status, agents, telemetry, logs, providers, toasts, outages } = useAresSystem();
  const [theme, setTheme] = useState<'cyberpunk-magenta' | 'terminal-green' | 'deep-space-blue'>('cyberpunk-magenta');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [agentSearch, setAgentSearch] = useState('');
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showResilienceModal, setShowResilienceModal] = useState(false);

  const filteredAgents = agents.filter(a => 
    a.role.toLowerCase().includes(agentSearch.toLowerCase()) || 
    a.id.toLowerCase().includes(agentSearch.toLowerCase())
  );

  useEffect(() => {
    const storedUser = localStorage.getItem('ares_session');
    if (storedUser) {
      setIsAuthenticated(true);
      setUserEmail(storedUser);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogin = (email: string) => {
    localStorage.setItem('ares_session', email);
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    if (window.confirm("Terminate secure session?")) {
      localStorage.removeItem('ares_session');
      setIsAuthenticated(false);
      setUserEmail('');
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const getGlobalStatusColor = (s: SystemStatus) => {
    switch (s) {
      case 'NOMINAL': return 'text-ares-cyan border-ares-cyan/30 shadow-[0_0_15px] shadow-ares-cyan/20 bg-ares-cyan/5';
      case 'DEGRADED': return 'text-ares-amber border-ares-amber/50 shadow-[0_0_15px] shadow-ares-amber/20 bg-ares-amber/5';
      case 'RECOVERING': return 'text-ares-magenta border-ares-magenta/50 shadow-[0_0_15px] shadow-ares-magenta/20 bg-ares-magenta/5';
      case 'CRITICAL': return 'text-ares-red border-ares-red/50 shadow-[0_0_20px] shadow-ares-red/40 bg-ares-red/10 glitch-text';
    }
  };

  return (
    <div className="min-h-screen bg-ares-black text-white flex flex-col p-2 sm:p-4 gap-4 max-w-[1920px] mx-auto h-screen overflow-hidden">
      
      {/* Header / Global Status */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-xl shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-black flex items-center justify-center border border-gray-800">
            <Cpu className="w-6 h-6 text-ares-cyan" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-widest text-white shadow-black drop-shadow-md">
              ARES<span className="text-ares-cyan">-X</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase">Autonomous AI Operating System</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 bg-black/50 p-2 sm:p-3 rounded-lg border border-white/5">
          <div className="flex flex-col items-end">
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">System Threat Level</div>
            <div className={cn("text-sm sm:text-base font-bold flex items-center gap-2", getGlobalStatusColor(status).split(' ')[0])}>
              {status === 'NOMINAL' ? <Shield className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4 animate-pulse" />}
              {status}
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
          
          <div className="flex flex-col items-end hidden sm:flex">
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">Agents Bound</div>
            <div className="text-sm sm:text-base font-bold text-ares-green">
              {agents.filter(a => a.status === 'online').length} / {agents.length}
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
          
          <div className="flex flex-col items-end hidden sm:flex">
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">Network Uptime</div>
            <div className="text-sm sm:text-base font-bold text-gray-300">
              99.998%
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
          
          <div className="flex flex-col items-end hidden sm:flex">
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">A2A Encryption</div>
            <div className="text-sm sm:text-base font-bold text-ares-green flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              AES-256-GCM
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
          
          <div className="flex flex-col items-end hidden xl:flex text-right">
            <div className="text-[10px] flex items-center justify-end gap-1 text-gray-500 tracking-widest uppercase mb-1">
              <User className="w-3 h-3" />
              Operator
            </div>
            <div className="text-xs font-bold text-gray-200 truncate max-w-[150px]">
              {userEmail}
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-ares-red/10 hover:bg-ares-red/20 border border-ares-red/30 hover:border-ares-red/50 text-ares-red px-3 py-1.5 rounded transition-all shadow-[0_0_10px_rgba(255,0,60,0.1)] hover:shadow-[0_0_15px_rgba(255,0,60,0.3)]"
            title="Terminate Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Grid content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* Left Column (Topology & Charts) */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
          {/* Agent Topology Grid */}
          <div className="flex-[0.6] min-h-0 overflow-y-auto glass-panel rounded-xl flex flex-col">
            <div className="sticky top-0 bg-black/80 backdrop-blur-md p-3 border-b border-white/5 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-ares-magenta" />
                <h2 className="text-xs font-bold text-gray-400 tracking-widest">MCP AGENT TOPOLOGY MAP</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={agentSearch}
                    onChange={(e) => setAgentSearch(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-ares-cyan/50 focus:shadow-[0_0_10px_rgba(0,240,255,0.15)] transition-all w-full sm:w-48 placeholder:text-gray-600 font-mono"
                  />
                </div>
                <button onClick={() => setShowRiskModal(true)} className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ares-amber/10 border border-ares-amber/30 text-ares-amber shrink-0 hover:bg-ares-amber/20 transition-colors">
                  <ShieldAlert className="w-3 h-3" />
                  <span className="text-[9px] font-bold tracking-wider">RISK ANALYSIS</span>
                </button>
                <button onClick={() => setShowResilienceModal(true)} className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ares-red/10 border border-ares-red/30 text-ares-red shrink-0 hover:bg-ares-red/20 transition-colors">
                  <Activity className="w-3 h-3" />
                  <span className="text-[9px] font-bold tracking-wider">HERMES RESILIENCE</span>
                </button>
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ares-green/10 border border-ares-green/30 text-ares-green shrink-0">
                  <Lock className="w-3 h-3" />
                  <span className="text-[9px] font-bold tracking-wider">MCP SECURE</span>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AgentGrid agents={filteredAgents} logs={logs} onUpdateAgent={updateAgent} />
            </div>
          </div>

          {/* Telemetry Charts */}
          <div className="flex-[0.4] min-h-0 glass-panel rounded-xl flex flex-col">
            <div className="bg-black/80 backdrop-blur-md p-3 border-b border-white/5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-ares-green" />
              <h2 className="text-xs font-bold text-gray-400 tracking-widest">LIVE INFRASTRUCTURE TELEMETRY</h2>
            </div>
            <div className="flex-1 min-h-0">
              <TelemetryCharts data={telemetry} />
            </div>
          </div>
        </div>

        {/* Right Column (Failover & Terminal & History) */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
          {/* Failover Status */}
          <div className="shrink-0 h-[280px]">
            <ProviderStatus providers={providers} />
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-4">
            {/* Health History */}
            <div className="flex-1 min-h-0">
              <HealthHistory outages={outages} />
            </div>

            {/* Action Logs */}
            <div className="flex-[1.5] min-h-0">
              <TerminalLog logs={logs} />
            </div>
          </div>
        </div>

      </div>
      
      <ToastContainer toasts={toasts} />
      {showRiskModal && (
        <RiskScoreModal agents={agents} onClose={() => setShowRiskModal(false)} />
      )}
      {showResilienceModal && (
        <HermesResilienceModal onClose={() => setShowResilienceModal(false)} />
      )}
    </div>
  );
}
