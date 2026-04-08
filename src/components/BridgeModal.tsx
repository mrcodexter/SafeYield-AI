import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRightLeft, Wallet, ChevronDown, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NETWORKS = [
  { id: 'eth', name: 'Ethereum', icon: '🌐' },
  { id: 'arb', name: 'Arbitrum', icon: '🔵' },
  { id: 'poly', name: 'Polygon', icon: '🟣' },
  { id: 'pac', name: 'Pacifica', icon: '⚡' },
];

export default function BridgeModal({ isOpen, onClose }: BridgeModalProps) {
  const [step, setStep] = React.useState<'input' | 'processing' | 'success'>('input');
  const [amount, setAmount] = React.useState('');

  const handleBridge = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 3000);
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
            className="relative w-full max-w-md glass-panel p-6 neon-border bg-pacifica-surface"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold flex items-center">
                <ArrowRightLeft className="w-5 h-5 mr-2 text-pacifica-blue" />
                Cross-Chain Bridge
              </h2>
              <button onClick={onClose} className="p-1 hover:bg-pacifica-border rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === 'input' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">From Network</label>
                  <div className="flex items-center justify-between p-3 bg-pacifica-dark border border-pacifica-border rounded-xl cursor-pointer hover:border-pacifica-blue/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🌐</span>
                      <span className="font-medium">Ethereum</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-pacifica-blue p-2 rounded-full shadow-lg shadow-pacifica-blue/20">
                    <ArrowRightLeft className="w-4 h-4 text-pacifica-dark rotate-90" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">To Network</label>
                  <div className="flex items-center justify-between p-3 bg-pacifica-dark border border-pacifica-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⚡</span>
                      <span className="font-medium">Pacifica</span>
                    </div>
                    <div className="px-2 py-0.5 bg-pacifica-blue/20 text-pacifica-blue text-[10px] font-bold rounded">DESTINATION</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Amount to Bridge</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-pacifica-dark border border-pacifica-border rounded-xl p-4 font-mono text-xl focus:outline-none focus:border-pacifica-blue transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="font-bold text-gray-400">USDC</span>
                      <button className="text-[10px] font-bold bg-pacifica-blue/10 text-pacifica-blue px-2 py-1 rounded hover:bg-pacifica-blue/20">MAX</button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-pacifica-blue/5 border border-pacifica-blue/20 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Estimated Time</span>
                    <span className="text-white font-medium">~3 minutes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Bridge Fee</span>
                    <span className="text-white font-medium">$1.50</span>
                  </div>
                </div>

                <button 
                  onClick={handleBridge}
                  disabled={!amount}
                  className="w-full py-4 bg-pacifica-blue text-pacifica-dark font-black rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pacifica-blue/20"
                >
                  Bridge to Pacifica
                </button>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-12 flex flex-col items-center text-center">
                <Loader2 className="w-12 h-12 text-pacifica-blue animate-spin mb-6" />
                <h3 className="text-xl font-display font-bold mb-2">Bridging in Progress</h3>
                <p className="text-gray-400 text-sm max-w-[250px]">
                  Please wait while we securely move your assets to Pacifica.
                </p>
                <div className="mt-8 w-full max-w-[200px] h-1 bg-pacifica-border rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-full h-full bg-pacifica-blue"
                  />
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Bridge Successful!</h3>
                <p className="text-gray-400 text-sm mb-8">
                  Your funds are now available on Pacifica and ready for SafeYield strategies.
                </p>
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-pacifica-surface border border-pacifica-border rounded-xl font-bold hover:bg-pacifica-border transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
