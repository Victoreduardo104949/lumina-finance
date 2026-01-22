
import React, { useMemo } from 'react';
import { Transaction, Account, UserStats, Vault, FixedExpense, Debt } from '../types';
import { Eye, EyeOff, TrendingUp, Wallet, Target, Activity, ArrowUpRight, ArrowDownLeft, HeartPulse, Flame, Plus, CreditCard, ChevronRight } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  accounts: Account[];
  vaults: Vault[];
  fixedExpenses: FixedExpense[];
  debts: Debt[];
  privacyMode: boolean;
  togglePrivacy: () => void;
  userStats: UserStats;
  onAddVault: () => void;
  onDeleteVault: (vaultId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, accounts, vaults, fixedExpenses, debts, privacyMode, togglePrivacy, userStats, onAddVault, onDeleteVault }) => {
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  
  const financialTotals = useMemo(() => {
    const assets = accounts.filter(acc => acc.type !== 'CREDIT_CARD').reduce((sum, acc) => sum + acc.balance, 0);
    const liabilities = accounts.filter(acc => acc.type === 'CREDIT_CARD').reduce((sum, acc) => sum + acc.balance, 0);
    const totalCreditLimit = accounts.filter(acc => acc.type === 'CREDIT_CARD').reduce((sum, acc) => sum + (acc.limit || 0), 0);
    
    return {
      assets, 
      liabilities,
      netWorth: assets - liabilities,
      availableCredit: totalCreditLimit - liabilities,
      totalLimit: totalCreditLimit
    };
  }, [accounts]);

  const monthlyStats = useMemo(() => {
    let income = 0; let expense = 0;
    transactions.forEach(t => {
      if (t.date.startsWith(currentMonthStr)) {
        if (t.type === 'INCOME') income += t.amount;
        if (t.type === 'EXPENSE') expense += t.amount;
      }
    });
    return { income, expense };
  }, [transactions, currentMonthStr]);

  const formatCurrency = (val: number) => privacyMode ? '••••' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 pb-32 animate-fadeIn">
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Lumina</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
              <Flame size={14} className="fill-orange-500" /> {userStats.currentStreak} DIAS DE FOCO
            </div>
          </div>
        </div>
        <button onClick={togglePrivacy} className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-500 hover:scale-110 transition-transform">
          {privacyMode ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
      </div>

      {/* Main Net Worth Card */}
      <div className="relative group px-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white border-0 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Wallet size={120} />
          </div>
          
          <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Patrimônio Líquido</p>
            <h2 className="text-5xl font-black tracking-tighter mb-10">{formatCurrency(financialTotals.netWorth)}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Saldo em Contas</p>
                <p className="font-bold text-xl text-emerald-400">{formatCurrency(financialTotals.assets)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Dívida de Cartões</p>
                <p className="font-bold text-xl text-rose-400">{formatCurrency(financialTotals.liabilities)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Limite Disponível</p>
                <p className="font-bold text-xl text-blue-400">{formatCurrency(financialTotals.availableCredit)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary Grid */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="glass-card p-6 rounded-[2rem] border-emerald-500/10 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><ArrowUpRight size={48} /></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entradas</p>
          <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(monthlyStats.income)}</h3>
        </div>
        <div className="glass-card p-6 rounded-[2rem] border-rose-500/10 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><ArrowDownLeft size={48} /></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saídas</p>
          <h3 className="text-xl font-black text-rose-600 dark:text-rose-400">{formatCurrency(monthlyStats.expense)}</h3>
        </div>
      </div>

      {/* Health & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        <div className="glass-card p-6 rounded-[2.5rem] flex items-center gap-6 border-2 border-slate-50 dark:border-slate-800">
            <div className="relative w-24 h-24 flex-shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle cx="50%" cy="50%" r="42%" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray={264} strokeDashoffset={264 - (264 * 85) / 100} strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black">85</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Score</span>
               </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                <HeartPulse className="text-rose-500" size={18} /> Saúde Financeira
              </h3>
              <p className="text-xs text-slate-500 leading-tight">Você está no caminho certo! Suas reservas cobrem 3 meses de gastos fixos.</p>
            </div>
        </div>

        <div className="glass-card p-6 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Target className="text-blue-500" size={18} /> Objetivos Ativos
             </h3>
             <button onClick={onAddVault} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 hover:scale-110 transition-transform">
                <Plus size={16} />
             </button>
          </div>
          <div className="space-y-4">
            {vaults.length === 0 ? (
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase py-4">Nenhuma meta definida</p>
            ) : (
              vaults.slice(0, 2).map(v => (
                <div key={v.id} className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
                    <span className="text-slate-500">{v.name}</span>
                    <span className="text-blue-600">{Math.round((v.currentAmount/v.targetAmount)*100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(v.currentAmount/v.targetAmount)*100}%` }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
