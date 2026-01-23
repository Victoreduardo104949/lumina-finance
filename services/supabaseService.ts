
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Transaction, Account, Category, Vault, Profile, UserStats, Debt, FixedExpense } from '../types';

const getStoredSupabase = () => (window as any).__SUPABASE_INSTANCE__ as SupabaseClient | null;
const setStoredSupabase = (client: SupabaseClient | null) => ((window as any).__SUPABASE_INSTANCE__ = client);

let supabase: SupabaseClient | null = getStoredSupabase();

export const initSupabase = (url: string, key: string) => {
  if (!url || !key) return null;
  try {
    supabase = createClient(url, key);
    setStoredSupabase(supabase);
    return supabase;
  } catch (e) {
    console.error("Failed to init Supabase", e);
    return null;
  }
};

export const getSetupSQL = () => `
-- Por favor, use o arquivo supabase/schema.sql incluído no projeto para configurar seu banco de dados.
-- Ele contém todas as tabelas e permissões necessárias.
`;

export const syncData = async (
  profiles: Profile[],
  allUserStats: Record<string, UserStats>,
  accounts: Account[],
  categories: Category[],
  vaults: Vault[],
  transactions: Transaction[],
  debts: Debt[],
  fixedExpenses: FixedExpense[],
  pinConfig: { enabled: boolean; pin: string }
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) supabase = getStoredSupabase();
  if (!supabase) return { success: false, error: "Supabase não inicializado" };

  try {
    // 1. Profiles
    const profilesPayload = profiles.map(p => ({
      id: p.id,
      name: p.name,
      color: p.color,
      avatar: p.avatar,
      xp: allUserStats[p.id]?.xp || 0,
      level: allUserStats[p.id]?.level || 1
    }));
    const { error: errProf } = await supabase.from('profiles').upsert(profilesPayload);
    if (errProf) throw errProf;

    // 2. Categories
    const catPayload = categories.map(c => ({
      id: c.id,
      profile_id: c.profileId,
      name: c.name,
      icon: c.icon,
      color: c.color,
      parent_id: c.parentId || null,
      budget: c.budget || 0
    }));
    const { error: errCat } = await supabase.from('categories').upsert(catPayload);
    if (errCat) throw errCat;

    // 3. Accounts
    const accPayload = accounts.map(a => ({
      id: a.id,
      profile_id: a.profileId,
      name: a.name,
      type: a.type,
      balance: a.balance,
      currency: a.currency || 'BRL',
      limit: a.limit,
      closing_date: a.closingDate,
      due_date: a.dueDate,
      color: a.color
    }));
    const { error: errAcc } = await supabase.from('accounts').upsert(accPayload);
    if (errAcc) throw errAcc;

    // 4. Vaults
    const vaultPayload = vaults.map(v => ({
      id: v.id,
      profile_id: v.profileId,
      name: v.name,
      target_amount: v.targetAmount,
      current_amount: v.currentAmount,
      deadline: v.deadline || null,
      icon: v.icon,
      color: v.color
    }));
    const { error: errVault } = await supabase.from('vaults').upsert(vaultPayload);
    if (errVault) throw errVault;

    // 5. Debts
    const debtsPayload = debts.map(d => ({
      id: d.id,
      profile_id: d.profileId,
      name: d.name,
      total_amount: d.totalAmount,
      installments_total: d.installmentsTotal,
      installments_paid: d.installmentsPaid,
      due_date: d.dueDate,
      category_id: d.categoryId,
      status: d.status,
      color: d.color,
      description: d.description || null
    }));
    const { error: errDebts } = await supabase.from('debts').upsert(debtsPayload);
    if (errDebts) throw errDebts;

    // 6. Fixed Expenses
    const fixedPayload = fixedExpenses.map(f => ({
      id: f.id,
      profile_id: f.profileId,
      name: f.name,
      amount: f.amount,
      due_date: f.dueDate,
      category_id: f.categoryId,
      last_paid_month: f.lastPaidMonth || null,
      color: f.color
    }));
    const { error: errFixed } = await supabase.from('fixed_expenses').upsert(fixedPayload);
    if (errFixed) throw errFixed;

    // 7. Transactions
    const txPayload = transactions.map(t => ({
      id: t.id,
      profile_id: t.profileId,
      amount: t.amount,
      date: t.date,
      description: t.description,
      category_id: t.categoryId,
      account_id: t.accountId,
      destination_account_id: t.destinationAccountId || null,
      type: t.type,
      status: t.status,
      tags: t.tags || [],
      is_recurring: t.isRecurring || false
    }));
    const { error: errTx } = await supabase.from('transactions').upsert(txPayload);
    if (errTx) throw errTx;

    // 8. App Settings (PIN)
    const { error: errSettings } = await supabase.from('app_settings').upsert({
      id: 'global_settings',
      pin_enabled: pinConfig.enabled,
      pin_code: pinConfig.pin
    });
    if (errSettings) throw errSettings;

    return { success: true };
  } catch (error: any) {
    console.error("Erro na sincronização:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
};

export const fetchData = async () => {
  if (!supabase) supabase = getStoredSupabase();
  if (!supabase) return { success: false, error: "Supabase não inicializado" };

  try {
    const { data: profiles, error: errProf } = await supabase.from('profiles').select('*');
    if (errProf) throw errProf;
    if (!profiles || profiles.length === 0) {
      // Return success: false because we don't want to overwrite local data with "nothing"
      return { success: false, error: "Nenhum perfil encontrado no servidor" };
    }

    const { data: accounts, error: errAcc } = await supabase.from('accounts').select('*');
    if (errAcc) throw errAcc;

    const { data: categories, error: errCat } = await supabase.from('categories').select('*');
    if (errCat) throw errCat;

    const { data: transactions, error: errTx } = await supabase.from('transactions').select('*');
    if (errTx) throw errTx;

    const { data: vaults, error: errVault } = await supabase.from('vaults').select('*');
    if (errVault) throw errVault;

    const { data: debts, error: errDebt } = await supabase.from('debts').select('*');
    if (errDebt) throw errDebt;

    const { data: fixedExpenses, error: errFixed } = await supabase.from('fixed_expenses').select('*');
    if (errFixed) throw errFixed;

    const { data: appSettings, error: errSettings } = await supabase.from('app_settings').select('*').maybeSingle();
    // Use maybeSingle() to avoid error when no row exists, but table-missing will still return error

    // Map content back to frontend types if necessary, though direct mapping is close.
    // We'll perform basic mapping to ensure camelCase compatibility
    const mappedProfiles = profiles.map((p: any) => ({
      id: p.id, name: p.name, color: p.color, avatar: p.avatar
    }));

    // We also need to reconstruct UserStats from profiles if stored there, or separate table?
    // Current syncData stores stats in profiles (xp, level).
    const mappedStats: Record<string, UserStats> = {};
    profiles.forEach((p: any) => {
      mappedStats[p.id] = {
        xp: p.xp || 0,
        level: p.level || 1,
        currentStreak: 1,
        lastLoginDate: new Date().toISOString(),
        totalTransactions: 0, // Would need to count txs
        unlockedAchievements: []
      };
    });

    const mappedAccounts = accounts.map((a: any) => ({
      id: a.id, profileId: a.profile_id, name: a.name, type: a.type, balance: a.balance,
      currency: a.currency, limit: a.limit, closingDate: a.closing_date, dueDate: a.due_date, color: a.color
    }));

    const mappedCategories = categories.map((c: any) => ({
      id: c.id, profileId: c.profile_id, name: c.name, icon: c.icon, color: c.color, parentId: c.parent_id, budget: c.budget
    }));

    const mappedTransactions = transactions.map((t: any) => ({
      id: t.id, profileId: t.profile_id, amount: t.amount, date: t.date, description: t.description,
      categoryId: t.category_id, accountId: t.account_id, destinationAccountId: t.destination_account_id,
      type: t.type, status: t.status, tags: t.tags, isRecurring: t.is_recurring
    }));

    const mappedVaults = vaults.map((v: any) => ({
      id: v.id, profileId: v.profile_id, name: v.name, targetAmount: v.target_amount, currentAmount: v.current_amount,
      deadline: v.deadline, icon: v.icon, color: v.color
    }));

    const mappedDebts = debts.map((d: any) => ({
      id: d.id, profileId: d.profile_id, name: d.name, totalAmount: d.total_amount, installmentsTotal: d.installments_total,
      installmentsPaid: d.installments_paid, dueDate: d.due_date, categoryId: d.category_id, status: d.status,
      color: d.color, description: d.description
    }));

    const mappedFixed = fixedExpenses.map((f: any) => ({
      id: f.id, profileId: f.profile_id, name: f.name, amount: f.amount, dueDate: f.due_date,
      categoryId: f.category_id, lastPaidMonth: f.last_paid_month, color: f.color
    }));

    return {
      success: true,
      data: {
        profiles: mappedProfiles,
        allUserStats: mappedStats,
        accounts: mappedAccounts,
        categories: mappedCategories,
        transactions: mappedTransactions,
        vaults: mappedVaults,
        debts: mappedDebts,
        fixedExpenses: mappedFixed,
        pinConfig: appSettings ? { enabled: !!appSettings.pin_enabled, pin: appSettings.pin_code } : null
      }
    };

  } catch (error: any) {
    console.error("Erro ao buscar dados:", error);
    return { success: false, error: error.message };
  }
};

export const deleteRemoteAccount = async (id: string) => supabase?.from('accounts').delete().eq('id', id);
export const deleteRemoteCategory = async (id: string) => supabase?.from('categories').delete().eq('id', id);
export const deleteRemoteVault = async (id: string) => supabase?.from('vaults').delete().eq('id', id);
export const deleteRemoteDebt = async (id: string) => supabase?.from('debts').delete().eq('id', id);
export const deleteRemoteFixedExpense = async (id: string) => supabase?.from('fixed_expenses').delete().eq('id', id);
export const deleteRemoteTransaction = async (id: string) => supabase?.from('transactions').delete().eq('id', id);
export const deleteRemoteProfile = async (id: string) => supabase?.from('profiles').delete().eq('id', id);
