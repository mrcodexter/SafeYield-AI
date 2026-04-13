import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowUpRight, 
  Info, 
  Copy, 
  Check, 
  ChevronRight,
  BarChart3,
  Activity,
  Lock,
  Unlock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { cn, formatCurrency, formatPercent } from '@/src/lib/utils';

// --- Mock Data ---
const STRATEGY_HISTORY = [
  { time: '00:00', val: 10 },
  { time: '04:00', val: 12 },
  { time: '08:00', val: 11 },
  { time: '12:00', val: 15 },
  { time: '16:00', val: 14 },
  { time: '20:00', val: 18 },
  { time: '23:59', val: 17 },
];

const EXTENDED_STRATEGIES = [
  {
    id: '1',
    name: 'Basis Arb: BTC-PERP',
    type: 'Delta Neutral',
    apy: 18.5,
    risk: 'Low',
    riskScore: 22,
    tvl: 12400000,
    users: 1240,
    description: 'Captures funding rate differentials between spot and perpetual markets on Pacifica. Highly stable in volatile markets.',
    history: STRATEGY_HISTORY,
    tags: ['Stable', 'Funding', 'BTC']
  },
  {
    id: '2',
    name: 'USDC-USDT Yield Vault',
    type: 'Stablecoin',
    apy: 8.2,
    risk: 'Minimal',
    riskScore: 8,
    tvl: 45000000,
    users: 3850,
    description: 'Optimized yield farming across top-tier Pacifica liquidity pools with automated rebalancing and fee compounding.',
    history: STRATEGY_HISTORY.map(d => ({ ...d, val: d.val * 0.8 })),
    tags: ['Safe', 'Stablecoin', 'Low Gas']
  },
  {
    id: '3',
    name: 'ETH Leveraged Staking',
    type: 'Leveraged',
    apy: 24.8,
    risk: 'Moderate',
    riskScore: 45,
    tvl: 8900000,
    users: 820,
    description: 'Uses Pacifica margin to leverage liquid staking tokens. Higher yield with liquidation risk monitoring.',
    history: STRATEGY_HISTORY.map(d => ({ ...d, val: d.val * 1.5 })),
    tags: ['High Yield', 'ETH', 'Leverage']
  },
  {
    id: '4',
    name: 'SOL Momentum Long',
    type: 'Directional',
    apy: 42.1,
    risk: 'High',
    riskScore: 78,
    tvl: 3200000,
    users: 450,
    description: 'AI-driven momentum strategy for SOL. Targets high-growth periods with tight stop-losses.',
    history: STRATEGY_HISTORY.map(d => ({ ...d, val: d.val * 2.2 })),
    tags: ['Aggressive', 'SOL', 'AI-Driven']
  }
];

// --- Components ---

const MiniChart = ({ data, color }: { data: any[], color: string }) => (
  <div className="h-20 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#14161A', 
            border: '1px solid #23262D', 
            borderRadius: '8px',
            fontSize: '10px',
            padding: '4px 8px'
          }}
          itemStyle={{ color: color }}
          labelStyle={{ display: 'none' }}
          formatter={(value: number) => [`${value}%`, 'Yield']}
        />
        <Area 
          type="monotone" 
          dataKey="val" 
          stroke={color} 
          strokeWidth={2}
          fillOpacity={1} 
          fill={`url(#grad-${color})`} 
          activeDot={{ r: 4, fill: color, stroke: '#14161A', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const RiskBadge = ({ score, label }: { score: number, label: string }) => {
  const getColors = (s: number) => {
    if (s < 20) return "bg-green-500/10 text-green-400 border-green-500/20";
    if (s < 50) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (s < 75) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  const getBarColor = (s: number) => {
    if (s < 20) return "bg-green-500";
    if (s < 50) return "bg-blue-500";
    if (s < 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm", getColors(score))}>
          {label} Risk
        </div>
        <span className="text-[10px] font-mono font-bold text-gray-500">{score}/100</span>
      </div>
      <div className="h-1.5 w-full bg-pacifica-border rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className={cn("h-full rounded-full", getBarColor(score))}
        />
      </div>
    </div>
  );
};

const MetricWithTooltip = ({ label, value, tooltip }: { label: string, value: string, tooltip: string }) => {
  const [show, setShow] = React.useState(false);

  return (
    <div 
      className="p-3 bg-pacifica-dark/50 border border-pacifica-border rounded-xl relative cursor-help group"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center gap-1 mb-1">
        <p className="text-[10px] text-gray-500 uppercase font-bold">{label}</p>
        <Info className="w-2.5 h-2.5 text-gray-600 group-hover:text-pacifica-blue transition-colors" />
      </div>
      <p className="text-sm font-mono font-bold">{value}</p>
      
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-pacifica-surface border border-pacifica-border rounded-lg shadow-2xl z-50 pointer-events-none"
        >
          <p className="text-[10px] text-gray-300 leading-tight">
            {tooltip}
          </p>
          <div className="absolute top-full left-4 w-2 h-2 bg-pacifica-surface border-r border-b border-pacifica-border rotate-45 -translate-y-1" />
        </motion.div>
      )}
    </div>
  );
};

export default function StrategiesView({ onInvest }: { onInvest: (name: string) => void }) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<string>('All');

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const filteredStrategies = EXTENDED_STRATEGIES.filter(strategy => {
    if (filter === 'All') return true;
    if (filter === 'Stable') return ['Stablecoin', 'Delta Neutral'].includes(strategy.type);
    if (filter === 'Aggressive') return ['Leveraged', 'Directional'].includes(strategy.type);
    return true;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Strategy Marketplace</h1>
          <p className="text-gray-400">Discover and follow top-performing automated strategies on Pacifica.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-pacifica-surface p-1 rounded-xl border border-pacifica-border">
            {[
              { id: 'All', label: 'All' },
              { id: 'Stable', label: 'Stable' },
              { id: 'Aggressive', label: 'Aggressive' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                  filter === item.id 
                    ? "bg-pacifica-blue text-pacifica-dark" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredStrategies.map((strategy) => (
          <motion.div 
            key={strategy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel overflow-hidden neon-border group hover:border-pacifica-blue/40 transition-all"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pacifica-blue/10 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-pacifica-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold group-hover:text-pacifica-blue transition-colors">
                      {strategy.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 font-medium">{strategy.type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Current APY</p>
                  <p className="text-2xl font-display font-black text-green-400">{strategy.apy}%</p>
                </div>
              </div>

              <div className="mb-6">
                <RiskBadge score={strategy.riskScore} label={strategy.risk} />
              </div>

              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                {strategy.description}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <MetricWithTooltip 
                  label="TVL" 
                  value={`$${(strategy.tvl / 1000000).toFixed(1)}M`}
                  tooltip="Total Value Locked (TVL) represents the total amount of assets currently deposited in this strategy's smart contracts. It is a key measure of liquidity and trust."
                />
                <div className="p-3 bg-pacifica-dark/50 border border-pacifica-border rounded-xl">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Users</p>
                  <p className="text-sm font-mono font-bold">{strategy.users.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-pacifica-dark/50 border border-pacifica-border rounded-xl">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Strategy ID</p>
                  <p className="text-sm font-mono font-bold">#{strategy.id.padStart(4, '0')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                    <Activity className="w-3 h-3 mr-2 text-pacifica-blue" />
                    24H Performance
                  </h4>
                  <span className="text-[10px] text-green-400 font-bold">+2.4%</span>
                </div>
                <MiniChart 
                  data={strategy.history} 
                  color={strategy.riskScore > 70 ? '#f87171' : strategy.riskScore > 40 ? '#fbbf24' : '#00D1FF'} 
                />
              </div>
            </div>

            <div className="bg-pacifica-surface/50 p-4 border-t border-pacifica-border flex gap-3">
              <button 
                onClick={() => onInvest(strategy.name)}
                className="flex-1 py-3 bg-pacifica-blue text-pacifica-dark font-black rounded-xl hover:bg-white transition-all text-sm flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                Invest Now
              </button>
              <button 
                onClick={() => handleCopy(strategy.id)}
                className="px-4 py-3 glass-panel border-pacifica-border hover:border-pacifica-blue transition-all flex items-center justify-center"
              >
                {copiedId === strategy.id ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button className="px-4 py-3 glass-panel border-pacifica-border hover:border-pacifica-blue transition-all">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Strategy Marketplace Section */}
      <section className="glass-panel p-8 neon-border bg-gradient-to-br from-pacifica-purple/10 to-transparent">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pacifica-purple/20 text-pacifica-purple rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <Users className="w-3 h-3" />
              Strategy Marketplace
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Follow Top Strategists</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              SafeYield AI allows you to follow and copy the exact moves of top-performing decentralized vaults. 
              Earn like a pro with one-click replication and transparent performance tracking.
            </p>
            <div className="flex gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-pacifica-dark bg-pacifica-border flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/40/40`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-pacifica-dark bg-pacifica-surface flex items-center justify-center text-[10px] font-bold">
                  +1.2k
                </div>
              </div>
              <div className="text-sm">
                <p className="font-bold">1,240+ Active Followers</p>
                <p className="text-gray-500 text-xs">Copying strategies in real-time</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64">
            <button className="w-full py-4 bg-pacifica-purple text-white font-black rounded-2xl shadow-lg shadow-pacifica-purple/20 hover:scale-105 transition-transform">
              Explore Marketplace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
