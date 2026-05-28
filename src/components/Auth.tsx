import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, EyeOff, Loader2, Mail, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthProps {
  onLogin: (email: string) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 0) score += 1;
    if (pass.length >= 6 && /[a-zA-Z]/.test(pass)) score += 1;
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (pass.length >= 10 && /[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(score, 4);
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['WEAK', 'FAIR', 'GOOD', 'STRONG'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Simulate API Call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-ares-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-ares-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-ares-magenta/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel p-8 sm:p-10 rounded-2xl w-full max-w-md z-10 relative border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center border border-ares-cyan/30 shadow-[0_0_20px_rgba(0,240,255,0.2)] mb-4">
            <Shield className="w-8 h-8 text-ares-cyan" />
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white uppercase">ARES-X</h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-2">Resilient AI Swarm Auth</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-ares-red/10 border border-ares-red/40 text-ares-red px-4 py-3 rounded flex items-start gap-2 text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1 font-bold">Operator Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-10 py-3 text-sm text-white focus:outline-none focus:border-ares-cyan/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all placeholder:text-gray-700 font-mono"
                placeholder="operator@ares.network"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1 font-bold">Passkey</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-12 py-3 text-sm text-white focus:outline-none focus:border-ares-cyan/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all placeholder:text-gray-700 font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-ares-cyan transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="h-6 overflow-hidden">
              <motion.div 
                initial={false}
                animate={{ height: password.length > 0 ? 'auto' : 0, opacity: password.length > 0 ? 1 : 0 }}
                className="flex flex-col gap-1 mx-1 mt-2"
              >
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map((step) => {
                    let colorClass = "bg-gray-800";
                    if (strength >= step) {
                      if (strength === 1) colorClass = "bg-ares-red shadow-[0_0_8px_var(--theme-red)]";
                      else if (strength === 2) colorClass = "bg-ares-amber shadow-[0_0_8px_var(--theme-amber)]";
                      else if (strength === 3) colorClass = "bg-ares-green shadow-[0_0_8px_var(--theme-green)]";
                      else if (strength === 4) colorClass = "bg-ares-cyan shadow-[0_0_8px_var(--theme-cyan)]";
                    }
                    return (
                      <div 
                        key={step} 
                        className={cn("flex-1 rounded-full transition-all duration-300", colorClass)}
                      />
                    );
                  })}
                </div>
                <div className={cn(
                  "text-[9px] uppercase tracking-widest font-bold text-right transition-colors",
                  strength === 1 ? "text-ares-red" :
                  strength === 2 ? "text-ares-amber" :
                  strength === 3 ? "text-ares-green" :
                  strength === 4 ? "text-ares-cyan" : "text-gray-500"
                )}>
                  {strengthLabels[Math.max(0, strength - 1)] || ''}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-3.5 h-3.5 accent-ares-cyan cursor-pointer rounded-sm border-gray-700 bg-black/50" />
              <span className="text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-widest">Remember Session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full bg-ares-cyan/20 border border-ares-cyan text-ares-cyan py-3 rounded-lg font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-4 hover:bg-ares-cyan/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                INITIATING HANDSHAKE...
              </>
            ) : (
              'ESTABLISH CONNECTION'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
