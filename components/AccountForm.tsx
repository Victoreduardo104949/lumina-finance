
import React, { useState } from 'react';
import { X, Wallet, CreditCard, Banknote, Landmark, TrendingUp, Check } from 'lucide-react';
import { Account } from '../types';

interface AccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const COLORS = [
  { hex: '#3b82f6', name: 'Azul' },     // Blue-500
  { hex: '#8b5cf6', name: 'Roxo' },     // Violet-500
  { hex: '#10b981', name: 'Verde' },    // Emerald-500
  { hex: '#f43f5e', name: 'Rosa' },     // Rose-500
  { hex: '#f59e0b', name: 'Laranja' },  // Amber-500
  { hex: '#06b6d4', name: 'Ciano' },    // Cyan-500
  { hex: '#6366f1', name: 'Indigo' },   // Indigo-500
  { hex: '#1e293b', name: 'Preto' },    // Slate-800
];

const AccountForm: React.FC<AccountFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<Account['type']>('CHECKING');
  const [balance, setBalance] = useState('');
  const [limit, setLimit] = useState('');
  const [closingDate, setClosingDate] = useState('1');
  const [dueDate, setDueDate] = useState('10');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance) return;

    const newAccount: Partial<Account> = {
      name,
      type,
      balance: parseFloat(balance),
      currency: 'BRL',
      color: selectedColor
    };

    if (type === 'CREDIT_CARD') {
      newAccount.limit = parseFloat(limit) || 0;
      newAccount.closingDate = parseInt(closingDate);
      newAccount.dueDate = parseInt(dueDate);
    }

    onSubmit(newAccount);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setType('CHECKING');
    setBalance('');
    setLimit('');
    setSelectedColor(COLORS[0].hex);
  };

  if (!isOpen) return null;

  const accountTypes = [
    { id: 'CHECKING', label: 'Conta Corrente', icon: Landmark },
    { id: 'CREDIT_CARD', label: 'Cartão de Crédito', icon: CreditCard },
    { id: 'CASH', label: 'Dinheiro Físico', icon: Banknote },
    { id: 'SAVINGS', label: 'Poupança', icon: Wallet },
    { id: 'INVESTMENT', label: 'Investimento', icon: TrendingUp },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full md:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl p-6 animate-[slideUp_0.3s_ease-out] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nova Conta / Carteira</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tipo de Conta */}
          <div className="grid grid-cols-3 gap-2">
            {accountTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id as any)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  type === t.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <t.icon size={20} className="mb-1" />
                <span className="text-[10px] font-medium text-center">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome da Conta</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Nubank, Carteira, Itaú"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
              autoFocus
            />
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cor do Cartão</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setSelectedColor(c.hex)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${selectedColor === c.hex ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.hex && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Saldo Inicial */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {type === 'CREDIT_CARD' ? 'Fatura Atual (Dívida)' : 'Saldo Atual (Dinheiro)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
              <input 
                type="number" 
                step="0.01" 
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white font-bold"
              />
            </div>
            {type === 'CREDIT_CARD' && (
               <p className="text-[10px] text-rose-500 mt-1 font-bold">Nota: Em cartões, o valor inserido será subtraído do seu patrimônio.</p>
            )}
          </div>

          {/* Campos Específicos de Cartão de Crédito */}
          {type === 'CREDIT_CARD' && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Limite Total</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="Ex: 5000.00"
                    className="w-full p-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dia Fechamento</label>
                   <select 
                     value={closingDate}
                     onChange={(e) => setClosingDate(e.target.value)}
                     className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                   >
                      {[...Array(31)].map((_, i) => (
                        <option key={i} value={i+1}>{i+1}</option>
                      ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dia Vencimento</label>
                   <select 
                     value={dueDate}
                     onChange={(e) => setDueDate(e.target.value)}
                     className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                   >
                      {[...Array(31)].map((_, i) => (
                        <option key={i} value={i+1}>{i+1}</option>
                      ))}
                   </select>
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
