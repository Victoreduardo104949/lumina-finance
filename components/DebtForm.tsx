
import React, { useState } from 'react';
// Removed ListCircle as it is not a valid export from lucide-react
import { X, ShieldAlert, Calendar, DollarSign } from 'lucide-react';
import { Category, Debt } from '../types';

interface DebtFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Debt>) => void;
  categories: Category[];
}

const COLORS = ['#f43f5e', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#1e293b'];

const DebtForm: React.FC<DebtFormProps> = ({ isOpen, onClose, onSubmit, categories }) => {
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [installments, setInstallments] = useState('');
  const [dueDate, setDueDate] = useState('10');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'CRITICAL'>('ACTIVE');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalAmount || !installments || !categoryId) return;

    onSubmit({
      name,
      totalAmount: parseFloat(totalAmount),
      installmentsTotal: parseInt(installments),
      installmentsPaid: 0,
      dueDate: parseInt(dueDate),
      categoryId,
      status,
      color: selectedColor
    });
    
    setName(''); setTotalAmount(''); setInstallments('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl p-6 animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Nova Dívida / Parcelamento</h2>
          <button onClick={onClose} className="p-2"><X size={24} className="text-slate-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">O que é?</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Fies, Empréstimo Nubank, Carro" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor Total</label>
              <input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="0.00" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nº de Parcelas</label>
              <input type="number" value={installments} onChange={e => setInstallments(e.target.value)} placeholder="Ex: 12" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Dia Vencimento</label>
              <select value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none">
                {[...Array(31)].map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Categoria</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none">
                <option value="">Selecione...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Sinalizar Atenção Crítica (Serasa)?</label>
             <div className="flex gap-2">
                 <button type="button" onClick={() => setStatus('ACTIVE')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${status === 'ACTIVE' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Normal</button>
                 <button type="button" onClick={() => setStatus('CRITICAL')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${status === 'CRITICAL' ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Crítico / Atrasado</button>
             </div>
          </div>

          <div className="flex gap-3 pt-4">
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full ${selectedColor === c ? 'ring-4 ring-slate-200' : ''}`} style={{ backgroundColor: c }} />
            ))}
          </div>

          <button type="submit" className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-xl mt-4">Salvar Dívida</button>
        </form>
      </div>
    </div>
  );
};

export default DebtForm;
