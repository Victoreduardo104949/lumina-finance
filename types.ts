
export type TransactionType = 'EXPENSE' | 'INCOME' | 'TRANSFER';

export interface Profile {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

export interface Category {
  id: string;
  profileId: string;
  name: string;
  icon: string;
  color: string;
  parentId?: string;
  budget?: number;
}

export interface Account {
  id: string;
  profileId: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'INVESTMENT' | 'CREDIT_CARD' | 'CASH';
  balance: number;
  currency: string;
  limit?: number;
  closingDate?: number;
  dueDate?: number;
  color?: string;
}

export interface Transaction {
  id: string;
  profileId: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
  accountId: string;
  destinationAccountId?: string; 
  type: TransactionType;
  status: 'PENDING' | 'COMPLETED';
  tags?: string[];
  isRecurring?: boolean;
}

export interface Vault {
  id: string;
  profileId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
  color: string;
}

export interface Debt {
  id: string;
  profileId: string;
  name: string;
  totalAmount: number;
  installmentsTotal: number;
  installmentsPaid: number;
  dueDate: number;
  categoryId: string;
  status: 'ACTIVE' | 'PAID' | 'CRITICAL';
  color: string;
  description?: string;
}

export interface FixedExpense {
  id: string;
  profileId: string;
  name: string;
  amount: number;
  dueDate: number;
  categoryId: string;
  lastPaidMonth?: string; 
  color: string;
}

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  lastLoginDate: string;
  totalTransactions: number;
  unlockedAchievements: string[];
}

export interface LevelData {
  level: number;
  title: string;
  minXp: number;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats, txs: Transaction[]) => boolean;
}

// Added SyncConfig interface to resolve import errors in App.tsx and components/Settings.tsx
export interface SyncConfig {
  enabled: boolean;
  supabaseUrl: string;
  supabaseKey: string;
  lastSynced?: string;
}
