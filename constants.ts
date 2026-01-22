
import { Account, Category, Transaction, LevelData, Achievement, Vault } from './types';

// Adding 'default' profileId to satisfy interface requirements
export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc_1',
    profileId: 'default',
    name: 'Conta Corrente Principal',
    type: 'CHECKING',
    balance: 0.00,
    currency: 'BRL',
    color: '#3b82f6' // Blue
  },
  {
    id: 'acc_2',
    profileId: 'default',
    name: 'Cartão Platinum',
    type: 'CREDIT_CARD',
    balance: 0.00,
    limit: 10000,
    currency: 'BRL',
    closingDate: 25,
    dueDate: 5,
    color: '#8b5cf6' // Purple
  },
  {
    id: 'acc_3',
    profileId: 'default',
    name: 'Reserva de Emergência',
    type: 'SAVINGS',
    balance: 0.00,
    currency: 'BRL',
    color: '#10b981' // Emerald
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat_1', profileId: 'default', name: 'Moradia', icon: 'Home', color: '#3b82f6' },
  { id: 'cat_2', profileId: 'default', name: 'Alimentação', icon: 'Utensils', color: '#ef4444' },
  { id: 'cat_3', profileId: 'default', name: 'Transporte', icon: 'Car', color: '#f59e0b' },
  { id: 'cat_4', profileId: 'default', name: 'Lazer', icon: 'Film', color: '#8b5cf6' },
  { id: 'cat_5', profileId: 'default', name: 'Compras', icon: 'ShoppingBag', color: '#ec4899' },
  { id: 'cat_6', profileId: 'default', name: 'Salário', icon: 'Briefcase', color: '#10b981' },
  { id: 'cat_7', profileId: 'default', name: 'Investimentos', icon: 'TrendingUp', color: '#6366f1' },
  { id: 'cat_8', profileId: 'default', name: 'Saúde', icon: 'Heart', color: '#06b6d4' },
  { id: 'cat_9', profileId: 'default', name: 'Contas & Utilidades', icon: 'Zap', color: '#64748b' },
];

export const MOCK_VAULTS: Vault[] = [
  {
    id: 'v_1',
    profileId: 'default',
    name: 'Viagem Japão',
    targetAmount: 15000,
    currentAmount: 3200,
    icon: 'Plane',
    color: '#f43f5e',
    deadline: '2024-12-31'
  },
  {
    id: 'v_2',
    profileId: 'default',
    name: 'MacBook Pro',
    targetAmount: 12000,
    currentAmount: 8500,
    icon: 'Laptop',
    color: '#3b82f6'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = []; 

export const LEVELS: LevelData[] = [
  { level: 1, title: 'Iniciante Financeiro', minXp: 0, color: '#94a3b8' },
  { level: 2, title: 'Organizado', minXp: 500, color: '#3b82f6' },
  { level: 3, title: 'Poupador Focado', minXp: 1500, color: '#10b981' },
  { level: 4, title: 'Investidor Jr.', minXp: 3000, color: '#8b5cf6' },
  { level: 5, title: 'Mestre das Finanças', minXp: 6000, color: '#f59e0b' },
  { level: 6, title: 'Guru da Riqueza', minXp: 10000, color: '#06b6d4' },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_tx',
    title: 'Primeiro Passo',
    description: 'Registre sua primeira transação.',
    icon: 'Flag',
    condition: (stats, txs) => txs.length >= 1
  },
  {
    id: 'ach_streak_3',
    title: 'No Ritmo',
    description: 'Mantenha uma sequência de 3 dias.',
    icon: 'Flame',
    condition: (stats, txs) => stats.currentStreak >= 3
  },
  {
    id: 'ach_saver',
    title: 'Poupador',
    description: 'Registre 10 transações.',
    icon: 'PiggyBank',
    condition: (stats, txs) => txs.length >= 10
  },
  {
    id: 'ach_streak_7',
    title: 'Imparável',
    description: 'Uma semana inteira de foco!',
    icon: 'Zap',
    condition: (stats, txs) => stats.currentStreak >= 7
  }
];
