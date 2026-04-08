import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, ShieldCheck, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategyName: string;
}

export default function SimulationModal({ isOpen, onClose, strategyName }: SimulationModalProps) {
  const [status, setStatus] = React.useState<'idle' | 'simulating' | 'result'>('idle');

  const runSimulation = () => {
    setStatus('simulating');
    setTimeout(() => setStatus('result'), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass-panel p-8 neon-border bg-pacifica-surface"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pacifica-blue/20 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-pacifica-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold">Transaction Simulation</h2>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">SafeYield Risk Engine</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-pacifica-border rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {status === 'idle' && (
              <div className="space-y-6">
                <div className="p-4 bg-pacifica-dark border border-pacifica-border rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Target Strategy</p>
                  <p className="text-lg font-display font-bold text-white">{strategyName}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-400 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Simulation Parameters
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-pacifica-dark/50 border border-pacifica-border rounded-lg">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Slippage Tolerance</p>
                      <p className="font-mono text-sm">0.5%</p>
                    </div>
                    <div className="p-3 bg-pacifica-dark/50 border border-pacifica-border rounded-lg">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Gas Limit</p>
                      <p className="font-mono text-sm">Auto</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                  <p className="text-xs text-yellow-500/80 leading-relaxed">
                    Simulation executes the transaction against a fork of the Pacifica mainnet to verify outcomes before spending real gas.
                  </p>
                </div>

                <button 
                  onClick={runSimulation}
                  className="w-full py-4 bg-pacifica-blue text-pacifica-dark font-black rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Run Simulation
                </button>
              </div>
            )}

            {status === 'simulating' && (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="relative w-20 h-20 mb-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 border-4 border-pacifica-blue/20 border-t-pacifica-blue rounded-full"
                  />
                  <ShieldCheck className="absolute inset-0 m-auto w-8 h-8 text-pacifica-blue animate-pulse" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Analyzing Execution Path</h3>
                <p className="text-gray-400 text-sm">Verifying smart contract calls and liquidity depth...</p>
              </div>
            )}

            {status === 'result' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-bold text-green-500">Simulation Passed</h3>
                    <p className="text-xs text-green-500/70">No errors detected. Strategy execution is safe.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-400">Expected Outcomes</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Net Position Change', value: '+1.24 ETH' },
                      { label: 'Estimated Gas Cost', value: '$4.12' },
                      { label: 'Price Impact', value: '< 0.01%' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-pacifica-dark/50 border border-pacifica-border rounded-lg">
                        <span className="text-sm text-gray-400">{item.label}</span>
                        <span className="text-sm font-mono font-bold text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={onClose}
                    className="flex-1 py-3 bg-pacifica-surface border border-pacifica-border rounded-xl font-bold text-sm hover:bg-pacifica-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    className="flex-1 py-3 bg-pacifica-blue text-pacifica-dark font-black rounded-xl hover:bg-white transition-all text-sm"
                  >
                    Confirm & Execute
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
