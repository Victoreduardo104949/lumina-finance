
import React, { useState, useEffect } from 'react';
import { X, Loader2, Wand2, Calendar, AlertCircle, Scale, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { TransactionType, Category, Account } from '../types';
import { suggestCategory } from '../services/geminiService';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: Category[];
  accounts: Account[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSubmit, categories, accounts }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const selectedAccount = accounts.find(a => a.id === accountId);
  
  const getProjectedBalance = () => {
    if (!selectedAccount || !amount) return 0;
    const val = parseFloat(amount);
    
    if (type === 'TRANSFER') return selectedAccount.balance - val;
    
    if (selectedAccount.type === 'CREDIT_CARD') {
        // Para cartão, despesa aumenta a dívida (número positivo)
        return type === 'EXPENSE' ? selectedAccount.balance + val : selectedAccount.balance - val;
    }
    
    return type === 'INCOME' ? selectedAccount.balance + val : selectedAccount.balance - val;
  };

  const projectedBalance = getProjectedBalance();

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setCategoryId('');
      setType('EXPENSE');
      if (accounts.length > 0) setAccountId(accounts[0].id);
    }
  }, [isOpen, accounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || (!categoryId && type !== 'TRANSFER') || !accountId || !date) return;

    onSubmit({
      amount: parseFloat(amount),
      description,
      categoryId: type === 'TRANSFER' ? '' : categoryId,
      accountId,
      destinationAccountId: type === 'TRANSFER' ? destinationAccountId : undefined,
      type,
      date: new Date(date).toISOString(),
      status: 'COMPLETED'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full md:max-w-md bg-white dark:bg-slate-900 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-8 animate-slideUp overflow-hidden max-h-[95vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Nova Transação</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quanto?</p>
            <div className="relative inline-block">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-300">R$</span>
              <input 
                type="number" 
                step="0.01" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full bg-transparent text-5xl font-black text-slate-800 dark:text-white pl-12 focus:outline-none placeholder:text-slate-200 text-center"
                autoFocus
              />
            </div>
          </div>

          {/* Type Selector */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {(['EXPENSE', 'INCOME', 'TRANSFER'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-wider ${
                  type === t 
                    ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t === 'EXPENSE' ? 'Gasto' : t === 'INCOME' ? 'Ganho' : 'Transf.'}
              </button>
            ))}
          </div>

          {/* Context Alert */}
          {selectedAccount && amount && (
             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-tighter mb-2">
                    <span>{selectedAccount.type === 'CREDIT_CARD' ? 'Impacto na Dívida' : 'Impacto no Saldo'}</span>
                    <Scale size={14} className="text-indigo-500" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400">R$ {selectedAccount.balance.toLocaleString()}</span>
                    <ArrowRight size={16} className="text-slate-300" />
                    <span className={`font-black text-lg ${
                        selectedAccount.type === 'CREDIT_CARD' 
                        ? (projectedBalance > selectedAccount.balance ? 'text-rose-500' : 'text-emerald-500')
                        : (projectedBalance >= 0 ? 'text-emerald-500' : 'text-rose-500')
                    }`}>
                        R$ {projectedBalance.toLocaleString()}
                    </span>
                </div>
             </div>
          )}

          {/* Details */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">O que foi isso?</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Almoço, Netflix, Pagamento fatura..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Data</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-xs" />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Conta Origem</label>
                  <select value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-xs">
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
               </div>
            </div>

            {type === 'TRANSFER' ? (
               <div className="animate-fadeIn">
                  <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">Conta Destino</label>
                  <div className="relative">
                    <select 
                      value={destinationAccountId} 
                      onChange={e => setDestinationAccountId(e.target.value)} 
                      className="w-full p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-500/20 font-bold text-xs"
                    >
                      <option value="">Selecione o destino...</option>
                      {accounts.filter(a => a.id !== accountId).map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </select>
                    <ArrowLeftRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                  </div>
               </div>
            ) : (
              <div className="animate-fadeIn">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Categoria</label>
                 <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-xs">
                    <option value="">Selecione...</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                 </select>
              </div>
            )}
          </div>

          <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all uppercase tracking-[0.1em] text-sm">
            Salvar Transação
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
