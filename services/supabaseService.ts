
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
  fixedExpenses: FixedExpense[]
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

    return { success: true };
  } catch (error: any) {
    console.error("Erro na sincronização:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
};

export const deleteRemoteAccount = async (id: string) => supabase?.from('accounts').delete().eq('id', id);
export const deleteRemoteCategory = async (id: string) => supabase?.from('categories').delete().eq('id', id);
export const deleteRemoteVault = async (id: string) => supabase?.from('vaults').delete().eq('id', id);
export const deleteRemoteDebt = async (id: string) => supabase?.from('debts').delete().eq('id', id);
export const deleteRemoteFixedExpense = async (id: string) => supabase?.from('fixed_expenses').delete().eq('id', id);
export const deleteRemoteTransaction = async (id: string) => supabase?.from('transactions').delete().eq('id', id);
