import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Wallet, 
  History, 
  Settings, 
  ChevronRight,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Info,
  ExternalLink,
  Plus,
  ArrowRightLeft
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn, formatCurrency, formatPercent } from '@/src/lib/utils';
import { analyzeStrategies, getRiskAnalysis, StrategyRecommendation, RiskAnalysis } from '@/src/services/geminiService';
import BridgeModal from './BridgeModal';
import SimulationModal from './SimulationModal';
import StrategiesView from './StrategiesView';

// --- Mock Data ---
const PERFORMANCE_DATA = [
  { name: 'Mon', value: 42000 },
  { name: 'Tue', value: 43500 },
  { name: 'Wed', value: 42800 },
  { name: 'Thu', value: 45000 },
  { name: 'Fri', value: 47200 },
  { name: 'Sat', value: 46800 },
  { name: 'Sun', value: 48500 },
];

const STRATEGIES = [
  {
    id: '1',
    name: 'Basis Arb: BTC-PERP',
    type: 'Delta Neutral',
    apy: 18.5,
    risk: 'Low',
    tvl: 12400000,
    description: 'Long spot BTC + Short BTC-PERP to capture funding rates on Pacifica.'
  },
  {
    id: '2',
    name: 'USDC-USDT Yield Vault',
    type: 'Stablecoin',
    apy: 8.2,
    risk: 'Minimal',
    tvl: 45000000,
    description: 'Automated yield farming across Pacifica liquidity pools.'
  },
  {
    id: '3',
    name: 'ETH Leveraged Staking',
    type: 'Leveraged',
    apy: 24.8,
    risk: 'Moderate',
    tvl: 8900000,
    description: 'Leveraged liquid staking using Pacifica margin infrastructure.'
  }
];

// --- Components ---

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="glass-panel p-6 neon-border">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-pacifica-blue/10 rounded-lg">
        <Icon className="w-5 h-5 text-pacifica-blue" />
      </div>
      <div className={cn(
        "flex items-center text-xs font-medium px-2 py-1 rounded-full",
        trend === 'up' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
      )}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change}
      </div>
    </div>
    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-display font-bold">{value}</p>
  </div>
);

const RiskMeter = ({ score }: { score: number }) => {
  const getColor = (s: number) => {
    if (s < 30) return '#4ade80';
    if (s < 70) return '#fbbf24';
    return '#f87171';
  };

  return (
    <div className="glass-panel p-6 neon-border h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-lg flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-pacifica-blue" />
          AI Risk Score
        </h3>
        <Info className="w-4 h-4 text-gray-500 cursor-help" />
      </div>
      <div className="relative flex flex-col items-center justify-center">
        <div className="text-5xl font-display font-black mb-2" style={{ color: getColor(score) }}>
          {score}
        </div>
        <div className="text-sm text-gray-400 font-medium uppercase tracking-widest">
          {score < 30 ? 'Safe' : score < 70 ? 'Moderate' : 'High Risk'}
        </div>
        
        <div className="w-full h-2 bg-pacifica-border rounded-full mt-6 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            className="h-full"
            style={{ backgroundColor: getColor(score) }}
          />
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
          Real-time analysis based on Pacifica funding rates and market volatility.
        </p>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [aiRecommendations, setAiRecommendations] = React.useState<StrategyRecommendation[]>([]);
  const [riskAnalysis, setRiskAnalysis] = React.useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // View State
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'strategies'>('dashboard');
  
  // Modal States
  const [isBridgeOpen, setIsBridgeOpen] = React.useState(false);
  const [isSimOpen, setIsSimOpen] = React.useState(false);
  const [selectedStrategy, setSelectedStrategy] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [recs, risk] = await Promise.all([
          analyzeStrategies("BTC Price: $65k, ETH Price: $3.5k, Funding: 0.01%"),
          getRiskAnalysis({ btc_long: 1.5, eth_staking: 2.0 })
        ]);
        setAiRecommendations(recs);
        setRiskAnalysis(risk);
      } catch (err) {
        console.error("Dashboard Data Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch AI insights");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-pacifica-dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-pacifica-border p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-pacifica-blue to-pacifica-purple rounded-xl flex items-center justify-center neon-glow">
            <Zap className="text-white w-6 h-6 fill-white" />
          </div>
          <span className="text-xl font-display font-black tracking-tight">SafeYield <span className="text-pacifica-blue">AI</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { id: 'dash', icon: LayoutDashboard, label: 'Dashboard', active: currentView === 'dashboard', onClick: () => setCurrentView('dashboard') },
            { id: 'strat', icon: TrendingUp, label: 'Strategies', active: currentView === 'strategies', onClick: () => setCurrentView('strategies') },
            { id: 'risk', icon: ShieldCheck, label: 'Risk Engine' },
            { id: 'bridge', icon: ArrowRightLeft, label: 'Bridge', onClick: () => setIsBridgeOpen(true) },
            { id: 'hist', icon: History, label: 'History' },
            { id: 'sett', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                item.active 
                  ? "bg-pacifica-blue/10 text-pacifica-blue" 
                  : "text-gray-400 hover:bg-pacifica-surface hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-pacifica-border">
          <div className="glass-panel p-4 bg-gradient-to-br from-pacifica-blue/5 to-pacifica-purple/5">
            <p className="text-xs text-gray-400 mb-2">Connected Wallet</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pacifica-border rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-pacifica-blue" />
              </div>
              <span className="text-sm font-mono font-medium">0x71...3f2a</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {currentView === 'dashboard' ? (
          <>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-display font-bold mb-1">Portfolio Overview</h1>
                <p className="text-gray-400">Welcome back, Strategist.</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsBridgeOpen(true)}
                  className="px-6 py-2.5 glass-panel neon-border text-sm font-bold hover:bg-pacifica-surface transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Deposit Funds
                </button>
                <button className="px-6 py-2.5 bg-pacifica-blue text-pacifica-dark font-bold rounded-xl hover:bg-white transition-colors shadow-lg shadow-pacifica-blue/20 flex items-center gap-2">
                  Connect Wallet
                </button>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Value Locked" value={formatCurrency(48500.42)} change="+12.5%" trend="up" icon={Wallet} />
              <StatCard title="Total Profit (PnL)" value={formatCurrency(4230.15)} change="+5.2%" trend="up" icon={TrendingUp} />
              <StatCard title="Active Strategies" value="4" change="0" trend="up" icon={Zap} />
              <StatCard title="Risk Level" value="Low" change="-2.1%" trend="down" icon={ShieldCheck} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Performance Chart */}
              <div className="lg:col-span-2 glass-panel p-6 neon-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-lg">Performance History</h3>
                  <select className="bg-pacifica-dark border border-pacifica-border rounded-lg px-3 py-1 text-xs font-medium focus:outline-none focus:border-pacifica-blue">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PERFORMANCE_DATA}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00D1FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#23262D" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#4B5563" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#4B5563" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value/1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#14161A', border: '1px solid #23262D', borderRadius: '12px' }}
                        itemStyle={{ color: '#00D1FF' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#00D1FF" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Engine */}
              <RiskMeter score={riskAnalysis?.overallRiskScore || 18} />
            </div>

            {/* Strategy Marketplace */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">Strategy Marketplace</h2>
                <button 
                  onClick={() => setCurrentView('strategies')}
                  className="text-pacifica-blue text-sm font-bold flex items-center hover:underline"
                >
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STRATEGIES.map((strategy) => (
                  <motion.div 
                    key={strategy.id}
                    whileHover={{ y: -5 }}
                    className="glass-panel p-6 neon-border group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-pacifica-purple/10 rounded-lg">
                        <Zap className="w-5 h-5 text-pacifica-purple" />
                      </div>
                      <div className="px-3 py-1 bg-pacifica-border rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {strategy.type}
                      </div>
                    </div>
                    <h3 className="text-lg font-display font-bold mb-2 group-hover:text-pacifica-blue transition-colors">
                      {strategy.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                      {strategy.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Est. APY</p>
                        <p className="text-xl font-display font-black text-green-400">{strategy.apy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Risk</p>
                        <p className="text-xl font-display font-black text-pacifica-blue">{strategy.risk}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedStrategy(strategy.name);
                        setIsSimOpen(true);
                      }}
                      className="w-full py-3 bg-pacifica-surface border border-pacifica-border rounded-xl font-bold text-sm hover:bg-pacifica-blue hover:text-pacifica-dark transition-all"
                    >
                      Invest Now
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* AI Recommendations */}
            <section className="glass-panel p-8 bg-gradient-to-br from-pacifica-blue/5 to-transparent border-pacifica-blue/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-pacifica-blue/20 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-pacifica-blue" />
                </div>
                <h2 className="text-xl font-display font-bold">AI Strategy Insights</h2>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-pacifica-blue/20 border-t-pacifica-blue rounded-full animate-spin mb-4" />
                  <p className="text-gray-400 animate-pulse">Analyzing market conditions on Pacifica...</p>
                </div>
              ) : error ? (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-red-500 font-bold">AI Insights Unavailable</p>
                    <p className="text-red-500/70 text-sm">{error}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiRecommendations.map((rec, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-pacifica-dark/50 border border-pacifica-border rounded-xl hover:border-pacifica-blue/30 transition-colors"
                    >
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-pacifica-blue">{rec.name}</span>
                          <span className="px-2 py-0.5 bg-pacifica-border rounded text-[10px] uppercase font-bold text-gray-400">{rec.type}</span>
                        </div>
                        <p className="text-sm text-gray-300">{rec.reasoning}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase font-bold">Expected APY</p>
                          <p className="text-lg font-display font-bold text-green-400">{rec.expectedApy}%</p>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedStrategy(rec.name);
                            setIsSimOpen(true);
                          }}
                          className="px-4 py-2 bg-pacifica-blue/10 text-pacifica-blue border border-pacifica-blue/20 rounded-lg text-sm font-bold hover:bg-pacifica-blue hover:text-pacifica-dark transition-all"
                        >
                          {rec.action}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <StrategiesView onInvest={(name) => {
            setSelectedStrategy(name);
            setIsSimOpen(true);
          }} />
        )}
      </main>

      {/* Modals */}
      <BridgeModal isOpen={isBridgeOpen} onClose={() => setIsBridgeOpen(false)} />
      <SimulationModal 
        isOpen={isSimOpen} 
        onClose={() => setIsSimOpen(false)} 
        strategyName={selectedStrategy} 
      />
    </div>
  );
}
