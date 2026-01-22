
import React, { useState } from 'react';
import { FixedExpense, Account, Category } from '../types';
import { CalendarClock, Plus, CheckCircle, Circle, Trash2, ArrowUpRight, ReceiptText } from 'lucide-react';

interface FixedExpenseManagerProps {
  expenses: FixedExpense[];
  accounts: Account[];
  categories: Category[];
  onAddExpense: (data: Partial<FixedExpense>) => void;
  onPayExpense: (expenseId: string, accountId: string) => void;
  onDeleteExpense: (expenseId: string) => void;
}

const FixedExpenseManager: React.FC<FixedExpenseManagerProps> = ({ expenses, accounts, categories, onAddExpense, onPayExpense, onDeleteExpense }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpenseForPay, setSelectedExpenseForPay] = useState<FixedExpense | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('5');
  const [categoryId, setCategoryId] = useState('');

  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !categoryId) return;
    onAddExpense({
      name,
      amount: parseFloat(amount),
      dueDate: parseInt(dueDate),
      categoryId,
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    });
    setName(''); setAmount(''); setIsModalOpen(false);
  };

  const confirmPay = () => {
    if (selectedExpenseForPay && selectedAccountId) {
      onPayExpense(selectedExpenseForPay.id, selectedAccountId);
      setSelectedExpenseForPay(null);
      setSelectedAccountId('');
    }
  };

  const totalFixed = expenses.reduce((sum, e) => sum + e.amount, 0);
  const paidThisMonth = expenses.filter(e => e.lastPaidMonth === currentMonthStr).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-32">
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarClock className="text-indigo-500" /> Contas Fixas
          </h1>
          <p className="text-sm text-slate-500">Gastos que se repetem todo mês.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg flex items-center gap-2 font-bold text-sm">
          <Plus size={18} /> Adicionar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
          <div className="glass-card p-6 rounded-[2rem] bg-indigo-600 text-white border-0">
              <p className="text-indigo-100 text-[10px] font-bold uppercase mb-1">Custo Mensal Fixo</p>
              <h2 className="text-3xl font-black">R$ {totalFixed.toLocaleString('pt-BR')}</h2>
              <p className="text-[10px] mt-2 text-indigo-200">Total de {expenses.length} contas recorrentes</p>
          </div>
          <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Status do Mês Atual</p>
              <div className="flex items-end gap-2">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white">R$ {paidThisMonth.toLocaleString('pt-BR')}</h2>
                <span className="text-slate-400 text-sm mb-1">pagos</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3">
                 <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${(paidThisMonth/totalFixed)*100 || 0}%` }}></div>
              </div>
          </div>
      </div>

      <div className="space-y-3 px-2">
        {expenses.map(exp => {
          const isPaid = exp.lastPaidMonth === currentMonthStr;
          return (
            <div key={exp.id} className={`glass-card p-4 rounded-3xl flex items-center justify-between border-l-4 transition-all ${isPaid ? 'opacity-60' : ''}`} style={{ borderLeftColor: exp.color }}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  {isPaid ? <CheckCircle size={24} /> : <Circle size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{exp.name}</h3>
                  <p className="text-[10px] text-slate-500">Vence dia {exp.dueDate} • R$ {exp.amount.toLocaleString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isPaid && (
                  <button onClick={() => setSelectedExpenseForPay(exp)} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase">Pagar</button>
                )}
                <button onClick={() => onDeleteExpense(exp.id)} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Adicionar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <form onSubmit={handleAdd} className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold">Nova Conta Fixa</h2>
            <input type="text" placeholder="Nome (ex: Netflix, Aluguel)" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none" required />
            <input type="number" placeholder="Valor R$" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none font-bold" required />
            <div className="grid grid-cols-2 gap-2">
              <select value={dueDate} onChange={e => setDueDate(e.target.value)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none">
                {[...Array(31)].map((_, i) => <option key={i} value={i+1}>Dia {i+1}</option>)}
              </select>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none">
                <option value="">Categoria</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl">Salvar Conta</button>
          </form>
        </div>
      )}

      {/* Modal Pagamento */}
      {selectedExpenseForPay && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedExpenseForPay(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl flex items-center justify-center mb-4"><ReceiptText size={32} /></div>
            <h2 className="text-xl font-bold mb-2">Pagar {selectedExpenseForPay.name}</h2>
            <p className="text-xs text-slate-500 mb-6">Esta ação registrará uma despesa no valor de R$ {selectedExpenseForPay.amount.toLocaleString('pt-BR')} e marcará a conta como paga este mês.</p>
            <select value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none font-bold text-sm mb-6">
              <option value="">Escolha a conta de débito...</option>
              {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} (Saldo: R$ {acc.balance.toLocaleString()})</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setSelectedExpenseForPay(null)} className="flex-1 py-4 font-bold text-slate-400">Cancelar</button>
              <button onClick={confirmPay} disabled={!selectedAccountId} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg disabled:opacity-40">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedExpenseManager;
