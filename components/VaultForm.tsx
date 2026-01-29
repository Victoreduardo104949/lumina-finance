
import React, { useState } from 'react';
import { X, Check, Target, Calendar, Calculator } from 'lucide-react';
import { Vault } from '../types';
import * as Icons from 'lucide-react';

interface VaultFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Vault>) => void;
  initialData?: Vault | null;
}

const COLORS = [
  '#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#ec4899', '#6366f1', '#64748b', '#1e293b'
];

const AVAILABLE_ICONS = [
  'PiggyBank', 'Plane', 'Laptop', 'Car', 'Home', 'GraduationCap',
  'Gamepad2', 'Gift', 'Ring', 'Baby', 'Dog', 'Bike'
];

const VaultForm: React.FC<VaultFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState('PiggyBank');

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTargetAmount(initialData.targetAmount.toString());
      setCurrentAmount(initialData.currentAmount.toString());
      setDeadline(initialData.deadline || '');
      setSelectedColor(initialData.color || COLORS[0]);
      setSelectedIcon(initialData.icon || 'PiggyBank');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('');
      setDeadline('');
      setSelectedColor(COLORS[0]);
      setSelectedIcon('PiggyBank');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    const data: any = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline: deadline || undefined,
      color: selectedColor,
      icon: selectedIcon
    };

    if (initialData) {
      data.id = initialData.id;
    }

    onSubmit(data);

    // Reset form
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full md:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl p-6 animate-[slideUp_0.3s_ease-out] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nova Meta / Cofre</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Objetivo</label>
            <div className="relative flex items-center">
              <div className="absolute left-3 p-1.5 rounded-lg" style={{ backgroundColor: selectedColor }}>
                {React.createElement((Icons as any)[selectedIcon] || Icons.Circle, { size: 16, className: 'text-white' })}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Viagem Disney, PC Gamer"
                className="w-full p-3 pl-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                autoFocus
              />
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta (R$)</label>
              <div className="relative">
                <Target size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="10000.00"
                  className="w-full p-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Já tenho (R$)</label>
              <div className="relative">
                <Calculator size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Prazo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prazo (Opcional)</label>
            <div className="relative">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white transition-all appearance-none [&::-webkit-calendar-picker-indicator]:dark:invert"
              />
              <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ícone</label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map(iconName => {
                const Icon = (Icons as any)[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-2 rounded-xl flex items-center justify-center transition-all ${selectedIcon === iconName
                      ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md scale-110'
                      : 'bg-slate-50 text-slate-400 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                  >
                    {Icon && <Icon size={20} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cor</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${selectedColor === c ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900' : ''}`}
                  style={{ backgroundColor: c }}
                >
                  {selectedColor === c && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/30 transition-all active:scale-95"
          >
            Criar Meta
          </button>
        </form>
      </div>
    </div>
  );
};

export default VaultForm;
