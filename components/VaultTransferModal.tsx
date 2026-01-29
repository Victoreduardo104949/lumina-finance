
import React, { useState } from 'react';
import { X, ArrowRightLeft, CreditCard, Target, Check } from 'lucide-react';
import { Account, Vault } from '../types';

interface VaultTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: Account[];
    vault: Vault;
    onTransfer: (data: {
        vaultId: string;
        accountId: string;
        amount: number;
        type: 'DEPOSIT' | 'WITHDRAW';
    }) => void;
}

const VaultTransferModal: React.FC<VaultTransferModalProps> = ({
    isOpen, onClose, accounts, vault, onTransfer
}) => {
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState(accounts[0]?.id || '');
    const [type, setType] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (!val || val <= 0 || !accountId) return;

        onTransfer({
            vaultId: vault.id,
            accountId,
            amount: val,
            type
        });
        setAmount('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full md:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl p-6 animate-[slideUp_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 text-white rounded-xl">
                            <ArrowRightLeft size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Gerenciar Saldo</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Objetivo Selecionado</p>
                    <p className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: vault.color }}></span>
                        {vault.name}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setType('DEPOSIT')}
                            className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${type === 'DEPOSIT' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            <Target size={18} /> Guardar
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('WITHDRAW')}
                            className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${type === 'WITHDRAW' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            <CreditCard size={18} /> Resgatar
                        </button>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Valor (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0,00"
                            className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-2xl font-black text-slate-800 dark:text-white text-center"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            {type === 'DEPOSIT' ? 'Retirar de qual conta?' : 'Enviar para qual conta?'}
                        </label>
                        <div className="space-y-2">
                            {accounts.map(acc => (
                                <button
                                    key={acc.id}
                                    type="button"
                                    onClick={() => setAccountId(acc.id)}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${accountId === acc.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-slate-50 dark:bg-slate-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={18} className="text-slate-400" />
                                        <span className="font-bold text-sm">{acc.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(acc.balance)}</span>
                                        {accountId === acc.id && <Check size={16} className="text-blue-500 inline mt-1" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg transition-all active:scale-95 ${type === 'DEPOSIT' ? 'bg-blue-600 shadow-blue-600/20' : 'bg-rose-500 shadow-rose-500/20'}`}
                    >
                        {type === 'DEPOSIT' ? 'Confirmar Depósito' : 'Confirmar Resgate'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VaultTransferModal;
