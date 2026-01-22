
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import AccountForm from './components/AccountForm';
import CategoryForm from './components/CategoryForm';
import VaultForm from './components/VaultForm';
import DebtManager from './components/DebtManager';
import DebtForm from './components/DebtForm';
import FixedExpenseManager from './components/FixedExpenseManager';
import FinancialAI from './components/FinancialAI';
import RewardOverlay from './components/RewardOverlay';
import Settings from './components/Settings';
import ProfileSelector from './components/ProfileSelector';
import { MOCK_CATEGORIES } from './constants';
import { Transaction, Account, Category, UserStats, Vault, Profile, Debt, FixedExpense, SyncConfig } from './types';
import { Trash2, Plus, CreditCard as CreditCardIcon, Landmark, Wallet, Banknote, TrendingUp } from 'lucide-react';
import { initSupabase, syncData, deleteRemoteCategory, fetchData, deleteRemoteAccount, deleteRemoteVault, deleteRemoteDebt, deleteRemoteFixedExpense, deleteRemoteProfile } from './services/supabaseService';

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('lumina_profiles');
    return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Meu Perfil', color: '#3b82f6', avatar: 'User' }];
  });

  const [currentProfileId, setCurrentProfileId] = useState(() => {
    return localStorage.getItem('lumina_current_profile_id') || 'default';
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('lumina_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('lumina_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('lumina_categories');
    return saved ? JSON.parse(saved) : MOCK_CATEGORIES.map(c => ({ ...c, profileId: 'default' }));
  });

  const [vaults, setVaults] = useState<Vault[]>(() => {
    const saved = localStorage.getItem('lumina_vaults');
    return saved ? JSON.parse(saved) : [];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('lumina_debts');
    return saved ? JSON.parse(saved) : [];
  });

  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>(() => {
    const saved = localStorage.getItem('lumina_fixed_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [syncConfig, setSyncConfig] = useState<SyncConfig>(() => {
    const saved = localStorage.getItem('lumina_sync_config');
    const parsed = saved ? JSON.parse(saved) : {};
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    return {
      ...parsed,
      enabled: !!(envUrl && envKey) || parsed.enabled || false,
      supabaseUrl: envUrl || parsed.supabaseUrl || '',
      supabaseKey: envKey || parsed.supabaseKey || ''
    };
  });

  const [allUserStats, setAllUserStats] = useState<Record<string, UserStats>>(() => {
    const saved = localStorage.getItem('lumina_all_user_stats');
    return saved ? JSON.parse(saved) : {};
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const currentProfile = useMemo(() =>
    profiles.find(p => p.id === currentProfileId) || profiles[0]
    , [profiles, currentProfileId]);

  const currentUserStats = allUserStats[currentProfileId] || { xp: 0, level: 1, currentStreak: 1, lastLoginDate: '', totalTransactions: 0, unlockedAchievements: [] };

  const filteredTransactions = useMemo(() => transactions.filter(t => t.profileId === currentProfileId), [transactions, currentProfileId]);
  const filteredAccounts = useMemo(() => accounts.filter(a => a.profileId === currentProfileId), [accounts, currentProfileId]);
  const filteredCategories = useMemo(() => categories.filter(c => c.profileId === currentProfileId || c.profileId === 'default'), [categories, currentProfileId]);
  const filteredVaults = useMemo(() => vaults.filter(v => v.profileId === currentProfileId), [vaults, currentProfileId]);
  const filteredDebts = useMemo(() => debts.filter(d => d.profileId === currentProfileId), [debts, currentProfileId]);
  const filteredFixedExpenses = useMemo(() => fixedExpenses.filter(e => e.profileId === currentProfileId), [fixedExpenses, currentProfileId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [rewardState, setRewardState] = useState<{ xp: number | null, achievement: any | null }>({ xp: null, achievement: null });

  useEffect(() => {
    localStorage.setItem('lumina_profiles', JSON.stringify(profiles));
    localStorage.setItem('lumina_current_profile_id', currentProfileId);
    localStorage.setItem('lumina_transactions', JSON.stringify(transactions));
    localStorage.setItem('lumina_accounts', JSON.stringify(accounts));
    localStorage.setItem('lumina_categories', JSON.stringify(categories));
    localStorage.setItem('lumina_vaults', JSON.stringify(vaults));
    localStorage.setItem('lumina_debts', JSON.stringify(debts));
    localStorage.setItem('lumina_fixed_expenses', JSON.stringify(fixedExpenses));
    localStorage.setItem('lumina_all_user_stats', JSON.stringify(allUserStats));
    localStorage.setItem('lumina_sync_config', JSON.stringify(syncConfig));
  }, [profiles, currentProfileId, transactions, accounts, categories, vaults, debts, fixedExpenses, allUserStats, syncConfig]);

  // Auto-sync effect
  useEffect(() => {
    if (syncConfig.enabled && syncConfig.supabaseUrl && syncConfig.supabaseKey) {
      const timer = setTimeout(async () => {
        console.log("🔄 Iniciando sincronização automática...");
        try {
          const result = await syncData(profiles, allUserStats, accounts, categories, vaults, transactions, debts, fixedExpenses);
          if (result.success) {
            console.log("✅ Sincronização automática concluída com sucesso!");
            setSyncConfig(prev => ({ ...prev, lastSynced: new Date().toISOString() }));
          } else {
            console.error("❌ Falha na sincronização automática:", result.error);
          }
        } catch (error) {
          console.error("❌ Erro catastrófico no auto-sync:", error);
        }
      }, 3000); // 3s debounce
      return () => clearTimeout(timer);
    }
  }, [profiles, allUserStats, accounts, categories, vaults, transactions, debts, fixedExpenses, syncConfig.enabled, syncConfig.supabaseUrl, syncConfig.supabaseKey]);

  // Supabase Init & Initial Load Effect
  useEffect(() => {
    if (syncConfig.supabaseUrl && syncConfig.supabaseKey) {
      console.log("🔌 Inicializando cliente Supabase...");
      initSupabase(syncConfig.supabaseUrl, syncConfig.supabaseKey);

      // Sincronização inicial apenas quando habilitado e as chaves estiverem presentes
      if (syncConfig.enabled) {
        const loadInitialData = async () => {
          console.log("📥 [Auto-Sync] Buscando dados remotos iniciais...");
          const result = await fetchData();
          if (result.success && result.data) {
            console.log("📦 [Auto-Sync] Dados carregados!");
            setProfiles(result.data.profiles);
            setAccounts(result.data.accounts);
            setCategories(result.data.categories);
            setTransactions(result.data.transactions);
            setVaults(result.data.vaults);
            setDebts(result.data.debts);
            setFixedExpenses(result.data.fixedExpenses);

            setAllUserStats(prev => {
              const newStats = { ...prev };
              Object.keys(result.data!.allUserStats).forEach(pid => {
                const remoteStat = result.data!.allUserStats[pid];
                if (newStats[pid]) {
                  newStats[pid] = { ...newStats[pid], xp: remoteStat.xp, level: remoteStat.level };
                } else {
                  newStats[pid] = remoteStat;
                }
              });
              return newStats;
            });
          } else {
            console.warn("⚠️ [Auto-Sync] Sem dados no servidor ou falha:", result.error);
          }
        };
        loadInitialData();
      }
    }
  }, [syncConfig.supabaseUrl, syncConfig.supabaseKey, syncConfig.enabled]); // Adicionado syncConfig.enabled


  const handleAddProfile = (name: string, color: string) => {
    const newProfile: Profile = {
      id: `profile_${Date.now()}`,
      name,
      color,
      avatar: 'User'
    };
    setProfiles(prev => [...prev, newProfile]);
    setCurrentProfileId(newProfile.id);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      alert("Você deve ter pelo menos um perfil.");
      return;
    }

    if (window.confirm("Deseja excluir este perfil? Todos os dados vinculados (contas, transações, etc.) serão perdidos.")) {
      setProfiles(prev => prev.filter(p => p.id !== id));

      // Cleanup local state
      setTransactions(prev => prev.filter(t => t.profileId !== id));
      setAccounts(prev => prev.filter(a => a.profileId !== id));
      setCategories(prev => prev.filter(c => c.profileId !== id));
      setVaults(prev => prev.filter(v => v.profileId !== id));
      setDebts(prev => prev.filter(d => d.profileId !== id));
      setFixedExpenses(prev => prev.filter(e => e.profileId !== id));
      setAllUserStats(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      // Switch profile if active was deleted
      if (currentProfileId === id) {
        const remainingProfiles = profiles.filter(p => p.id !== id);
        if (remainingProfiles.length > 0) {
          setCurrentProfileId(remainingProfiles[0].id);
        }
      }

      // Sync remote
      if (syncConfig.enabled) {
        deleteRemoteProfile(id);
      }
    }
  };

  const handleSync = async () => {
    if (!syncConfig.supabaseUrl || !syncConfig.supabaseKey) {
      alert("Configure as chaves do Supabase primeiro!");
      return;
    }
    const result = await syncData(profiles, allUserStats, accounts, categories, vaults, transactions, debts, fixedExpenses);
    if (result.success) {
      setSyncConfig(prev => ({ ...prev, enabled: true, lastSynced: new Date().toISOString() }));
    } else {
      alert("Erro ao sincronizar: " + result.error);
    }
  };

  const handleExport = () => {
    const data = { transactions, accounts, categories, vaults, debts, fixedExpenses, allUserStats, profiles };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImport = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profiles) setProfiles(data.profiles);
      if (data.transactions) setTransactions(data.transactions);
      if (data.accounts) setAccounts(data.accounts);
      if (data.categories) setCategories(data.categories);
      if (data.vaults) setVaults(data.vaults);
      if (data.debts) setDebts(data.debts);
      if (data.fixedExpenses) setFixedExpenses(data.fixedExpenses);
      if (data.allUserStats) setAllUserStats(data.allUserStats);
      alert("Backup restaurado com sucesso!");
    } catch (e) {
      alert("Erro ao importar backup: Formato inválido.");
    }
  };

  const handleAddTransaction = (data: any) => {
    const newTx = { ...data, id: `tx_${Date.now()}`, profileId: currentProfileId };
    setTransactions(prev => [newTx, ...prev]);

    setAccounts(prev => prev.map(acc => {
      if (acc.id === newTx.accountId) {
        if (newTx.type === 'TRANSFER') return { ...acc, balance: acc.balance - newTx.amount };
        if (acc.type === 'CREDIT_CARD') return { ...acc, balance: acc.balance + (newTx.type === 'INCOME' ? -newTx.amount : newTx.amount) };
        return { ...acc, balance: acc.balance + (newTx.type === 'INCOME' ? newTx.amount : -newTx.amount) };
      }
      if (newTx.type === 'TRANSFER' && acc.id === newTx.destinationAccountId) {
        if (acc.type === 'CREDIT_CARD') return { ...acc, balance: acc.balance - newTx.amount };
        return { ...acc, balance: acc.balance + newTx.amount };
      }
      return acc;
    }));

    setAllUserStats(prev => ({
      ...prev,
      [currentProfileId]: { ...currentUserStats, xp: currentUserStats.xp + 50, totalTransactions: currentUserStats.totalTransactions + 1 }
    }));
    setRewardState({ xp: 50, achievement: null });
  };

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <HashRouter>
      <Layout
        onAddTransaction={() => setIsModalOpen(true)}
        currentProfile={currentProfile}
        onSwitchProfile={() => setIsProfileModalOpen(true)}
      >
        <RewardOverlay xpGained={rewardState.xp} achievementUnlocked={rewardState.achievement} onClose={() => setRewardState({ xp: null, achievement: null })} />
        <Routes>
          <Route path="/" element={<Dashboard transactions={filteredTransactions} accounts={filteredAccounts} vaults={filteredVaults} fixedExpenses={filteredFixedExpenses} debts={filteredDebts} privacyMode={privacyMode} togglePrivacy={() => setPrivacyMode(!privacyMode)} userStats={currentUserStats} onAddVault={() => setIsVaultModalOpen(true)} onDeleteVault={(id) => {
            if (window.confirm('Excluir este cofre?')) {
              setVaults(v => v.filter(item => item.id !== id));
              if (syncConfig.enabled) deleteRemoteVault(id);
            }
          }} />} />
          <Route path="/wallet" element={
            <div className="space-y-6 animate-fadeIn pb-32">
              <div className="flex justify-between items-center px-4">
                <h1 className="text-2xl font-bold">Carteira</h1>
                <button onClick={() => setIsAccountModalOpen(true)} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                  <Plus size={16} /> Nova Conta
                </button>
              </div>
              <div className="grid gap-6 md:grid-cols-2 px-4">
                {filteredAccounts.map(acc => {
                  const isCredit = acc.type === 'CREDIT_CARD';
                  const availableLimit = isCredit ? (acc.limit || 0) - acc.balance : 0;
                  const usePercentage = isCredit ? Math.min((acc.balance / (acc.limit || 1)) * 100, 100) : 0;

                  const AccIcon = { CHECKING: Landmark, CREDIT_CARD: CreditCardIcon, CASH: Banknote, SAVINGS: Wallet, INVESTMENT: TrendingUp }[acc.type] || Wallet;

                  return (
                    <div key={acc.id} className="glass-card p-6 rounded-[2.5rem] border-l-8 flex flex-col justify-between group relative transition-all hover:translate-y-[-4px]" style={{ borderLeftColor: acc.color }}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500"><AccIcon size={20} /></div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isCredit ? 'Fatura Atual' : 'Saldo em Conta'}</p>
                            <h3 className="text-xl font-bold">{acc.name}</h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-black ${isCredit && acc.balance > 0 ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>{formatBRL(acc.balance)}</p>
                        </div>
                      </div>
                      {isCredit && (
                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black uppercase">
                              <span className="text-slate-400">Uso do Limite</span>
                              <span className={usePercentage > 85 ? 'text-rose-500' : 'text-slate-500'}>{usePercentage.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-1000 ${usePercentage > 85 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${usePercentage}%` }}></div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
                              <p className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-0.5 tracking-tighter">Disponível para Usar</p>
                              <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatBRL(availableLimit)}</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                              <p className="text-[8px] font-black uppercase text-slate-400 mb-0.5 tracking-tighter">Limite Total</p>
                              <p className="font-bold text-slate-500 text-sm">{formatBRL(acc.limit || 0)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <button onClick={() => {
                        if (window.confirm('Excluir esta conta?')) {
                          setAccounts(a => a.filter(i => i.id !== acc.id));
                          if (syncConfig.enabled) deleteRemoteAccount(acc.id);
                        }
                      }} className="absolute top-4 right-4 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 p-2 transition-all"><Trash2 size={16} /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          } />
          <Route path="/fixed" element={<FixedExpenseManager expenses={filteredFixedExpenses} accounts={filteredAccounts} categories={filteredCategories} onAddExpense={(d) => setFixedExpenses(prev => [...prev, { ...d, id: `f_${Date.now()}`, profileId: currentProfileId } as FixedExpense])} onPayExpense={(id, accId) => { }} onDeleteExpense={(id) => {
            if (window.confirm('Excluir este gasto fixo?')) {
              setFixedExpenses(p => p.filter(e => e.id !== id));
              if (syncConfig.enabled) deleteRemoteFixedExpense(id);
            }
          }} />} />
          <Route path="/debts" element={<DebtManager debts={filteredDebts} accounts={filteredAccounts} categories={filteredCategories} onAddDebt={() => setIsDebtModalOpen(true)} onPayInstallment={(id, accId) => { }} onDeleteDebt={(id) => {
            if (window.confirm('Excluir esta dívida?')) {
              setDebts(p => p.filter(d => d.id !== id));
              if (syncConfig.enabled) deleteRemoteDebt(id);
            }
          }} />} />
          <Route path="/analytics" element={
            <div className="space-y-8 animate-fadeIn pb-32">
              <h1 className="text-2xl font-black text-slate-800 dark:text-white px-2 uppercase tracking-tighter">Análise com IA</h1>
              <FinancialAI transactions={filteredTransactions} accounts={filteredAccounts} debts={filteredDebts} fixedExpenses={filteredFixedExpenses} />
            </div>
          } />
          <Route path="/settings" element={
            <Settings
              categories={filteredCategories}
              onAddCategory={() => setIsCategoryModalOpen(true)}
              onDeleteCategory={(id) => {
                if (window.confirm('Deseja excluir esta categoria?')) {
                  setCategories(prev => prev.filter(c => c.id !== id));
                  if (syncConfig.enabled) deleteRemoteCategory(id);
                }
              }}
              syncConfig={syncConfig}
              onUpdateSyncConfig={setSyncConfig}
              onSync={handleSync}
              onExport={handleExport}
              onImport={handleImport}
              profiles={profiles}
            />
          } />
        </Routes>
      </Layout>

      <ProfileSelector
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        currentProfileId={currentProfileId}
        onSelectProfile={setCurrentProfileId}
        onAddProfile={handleAddProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      <TransactionForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddTransaction} categories={filteredCategories} accounts={filteredAccounts} />
      <AccountForm isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} onSubmit={(data) => setAccounts(prev => [...prev, { ...data, id: `acc_${Date.now()}`, profileId: currentProfileId }])} />
      <CategoryForm isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSubmit={(data) => setCategories(prev => [...prev, { ...data, id: `cat_${Date.now()}`, profileId: currentProfileId } as Category])} />
      <VaultForm isOpen={isVaultModalOpen} onClose={() => setIsVaultModalOpen(false)} onSubmit={(data) => setVaults(prev => [...prev, { ...data, id: `v_${Date.now()}`, profileId: currentProfileId } as Vault])} />
      <DebtForm isOpen={isDebtModalOpen} onClose={() => setIsDebtModalOpen(false)} onSubmit={(d) => setDebts(prev => [...prev, { ...d, id: `d_${Date.now()}`, profileId: currentProfileId } as Debt])} categories={filteredCategories} />
    </HashRouter>
  );
};

export default App;
