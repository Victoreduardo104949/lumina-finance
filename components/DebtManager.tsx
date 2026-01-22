
import React, { useState } from 'react';
import { Debt, Account, Category } from '../types';
import { ShieldAlert, Plus, CreditCard, ChevronRight, CheckCircle2, AlertCircle, Calendar, Trash2 } from 'lucide-react';

interface DebtManagerProps {
  debts: Debt[];
  accounts: Account[];
  categories: Category[];
  onAddDebt: () => void;
  onPayInstallment: (debtId: string, accountId: string) => void;
  onDeleteDebt: (debtId: string) => void;
}

const DebtManager: React.FC<DebtManagerProps> = ({ debts, accounts, categories, onAddDebt, onPayInstallment, onDeleteDebt }) => {
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState<Debt | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const totalOwed = debts.reduce((sum, d) => sum + (d.totalAmount * (1 - d.installmentsPaid / d.installmentsTotal)), 0);
  const criticalDebts = debts.filter(d => d.status === 'CRITICAL').length;

  const handlePay = () => {
    if (selectedDebtForPayment && selectedAccountId) {
      onPayInstallment(selectedDebtForPayment.id, selectedAccountId);
      setSelectedDebtForPayment(null);
      setSelectedAccountId('');
    }
  };

  const confirmDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation(); // Evita que o clique propague para o card
    if (window.confirm(`Tem certeza que deseja excluir permanentemente o registro da dívida "${name}"?`)) {
      onDeleteDebt(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-32">
      <div className="flex justify-between items-center px-2">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <ShieldAlert className="text-rose-500" /> Gestão de Dívidas
            </h1>
            <p className="text-sm text-slate-500">Controle seus empréstimos e parcelas fixas.</p>
        </div>
        <button 
            onClick={onAddDebt}
            className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
            <Plus size={18} /> Nova
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
          <div className="glass-card p-6 rounded-[2.5rem] bg-gradient-to-br from-rose-500 to-rose-700 text-white border-0 shadow-xl shadow-rose-500/20">
              <p className="text-rose-100 text-xs font-bold uppercase tracking-widest mb-1">Total Devedor Estimado</p>
              <h2 className="text-3xl font-black">R$ {totalOwed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
              <div className="mt-4 flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold">
                  <AlertCircle size={12} /> {debts.length} compromissos ativos
              </div>
          </div>
          <div className="glass-card p-6 rounded-[2.5rem] flex flex-col justify-center">
              <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Status Crítico (Serasa/Atraso)</p>
                    <h2 className={`text-3xl font-black ${criticalDebts > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {criticalDebts} {criticalDebts === 1 ? 'Dívida' : 'Dívidas'}
                    </h2>
                  </div>
                  <div className={`p-4 rounded-2xl ${criticalDebts > 0 ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'}`}>
                      <ShieldAlert size={32} />
                  </div>
              </div>
          </div>
      </div>

      {/* Debts List */}
      <div className="space-y-4 px-2">
          {debts.length === 0 ? (
              <div className="py-20 text-center glass-card rounded-[2.5rem] opacity-60">
                  <CreditCard size={48} className="mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500 font-medium">Nenhuma dívida cadastrada.</p>
              </div>
          ) : (
              debts.map(debt => {
                  const progress = (debt.installmentsPaid / debt.installmentsTotal) * 100;
                  const installmentValue = debt.totalAmount / debt.installmentsTotal;
                  
                  return (
                      <div key={debt.id} className="glass-card p-5 rounded-[2.5rem] border-l-[10px] transition-all hover:bg-white/50 dark:hover:bg-slate-800/50 group relative" style={{ borderLeftColor: debt.color }}>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              
                              {/* Info Side */}
                              <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0" style={{ backgroundColor: debt.color }}>
                                      <Calendar size={28} />
                                  </div>
                                  <div className="min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                          <h3 className="font-bold text-slate-800 dark:text-white truncate">{debt.name}</h3>
                                          {debt.status === 'CRITICAL' && <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-black rounded-full uppercase shrink-0">Crítico</span>}
                                      </div>
                                      <p className="text-xs text-slate-500 font-medium">Parcela {debt.installmentsPaid}/{debt.installmentsTotal} • Dia {debt.dueDate}</p>
                                  </div>
                              </div>

                              {/* Progress Side */}
                              <div className="flex flex-1 flex-col gap-1.5">
                                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                      <span>Quitação</span>
                                      <span>{progress.toFixed(0)}%</span>
                                  </div>
                                  <div className="w-full h-3 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                      <div className="h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${progress}%`, backgroundColor: debt.color }}></div>
                                  </div>
                              </div>

                              {/* Actions Side */}
                              <div className="flex items-center gap-4 justify-between md:justify-end shrink-0">
                                  <div className="text-right">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Parcela</p>
                                      <p className="font-black text-slate-800 dark:text-white text-lg">R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setSelectedDebtForPayment(debt)}
                                        disabled={debt.installmentsPaid >= debt.installmentsTotal}
                                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100"
                                    >
                                        Pagar
                                    </button>
                                    
                                    <button 
                                        onClick={(e) => confirmDelete(e, debt.id, debt.name)}
                                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all active:scale-90"
                                        title="Excluir Dívida"
                                    >
                                        <Trash2 size={22} />
                                    </button>
                                  </div>
                              </div>

                          </div>
                      </div>
                  );
              })
          )}
      </div>

      {/* Payment Confirmation Modal */}
      {selectedDebtForPayment && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedDebtForPayment(null)} />
              <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl animate-scaleIn">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-3xl flex items-center justify-center mb-6">
                      <CreditCard size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Pagar Parcela</h2>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                      Confirmar pagamento da parcela de <span className="font-bold text-slate-800 dark:text-white">{selectedDebtForPayment.name}</span> no valor de 
                      <span className="font-bold text-blue-600"> R$ {(selectedDebtForPayment.totalAmount / selectedDebtForPayment.installmentsTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>?
                  </p>
                  
                  <div className="space-y-4 mb-8">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Origem do Pagamento</label>
                      <select 
                        value={selectedAccountId}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                          <option value="">Escolha uma conta...</option>
                          {accounts.map(acc => (
                              <option key={acc.id} value={acc.id}>{acc.name} (Saldo: R$ {acc.balance.toLocaleString('pt-BR')})</option>
                          ))}
                      </select>
                  </div>

                  <div className="flex gap-3">
                      <button onClick={() => setSelectedDebtForPayment(null)} className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
                      <button 
                        onClick={handlePay}
                        disabled={!selectedAccountId}
                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-40 active:scale-95"
                      >
                          Confirmar
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DebtManager;
