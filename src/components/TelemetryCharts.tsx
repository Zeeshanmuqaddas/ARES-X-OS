import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TelemetryPoint } from '../types';

export function TelemetryCharts({ data }: { data: TelemetryPoint[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-full">
      {/* CPU & Memory Utilization */}
      <div className="glass-panel p-4 rounded-lg flex flex-col">
        <h3 className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-2 tracking-widest uppercase">
          <span className="w-2 h-2 rounded bg-ares-cyan"></span>
          Compute INFRa
        </h3>
        <div className="flex-1 min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="time" stroke="#444" fontSize={10} tickMargin={8} minTickGap={20} />
              <YAxis stroke="#444" fontSize={10} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--theme-black)', border: '1px solid color-mix(in srgb, var(--theme-cyan) 30%, transparent)', fontSize: '12px' }}
                itemStyle={{ color: 'var(--theme-cyan)' }}
              />
              <Line type="monotone" dataKey="cpu" stroke="var(--theme-cyan)" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="memory" stroke="var(--theme-magenta)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Global Throughput */}
      <div className="glass-panel p-4 rounded-lg flex flex-col">
        <h3 className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-2 tracking-widest uppercase">
          <span className="w-2 h-2 rounded bg-ares-green"></span>
          Gateway TTL (TOKENS/SEC)
        </h3>
        <div className="flex-1 min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--theme-green)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--theme-green)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="time" stroke="#444" fontSize={10} tickMargin={8} minTickGap={20} />
              <YAxis stroke="#444" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--theme-black)', border: '1px solid color-mix(in srgb, var(--theme-green) 30%, transparent)', fontSize: '12px' }}
                itemStyle={{ color: 'var(--theme-green)' }}
              />
              <Area type="stepAfter" dataKey="tokensPerSec" stroke="var(--theme-green)" fillOpacity={1} fill="url(#colorTokens)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Workflows */}
      <div className="glass-panel p-4 rounded-lg flex flex-col">
        <h3 className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-2 tracking-widest uppercase">
          <span className="w-2 h-2 rounded bg-ares-amber"></span>
          Active Workflows
        </h3>
        <div className="flex-1 min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWorkflows" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--theme-amber)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--theme-amber)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="time" stroke="#444" fontSize={10} tickMargin={8} minTickGap={20} />
              <YAxis stroke="#444" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--theme-black)', border: '1px solid color-mix(in srgb, var(--theme-amber) 30%, transparent)', fontSize: '12px' }}
                itemStyle={{ color: 'var(--theme-amber)' }}
              />
              <Area type="monotone" dataKey="activeWorkflows" stroke="var(--theme-amber)" strokeWidth={2} fillOpacity={1} fill="url(#colorWorkflows)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
