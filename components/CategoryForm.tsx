import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Category } from '../types';
import * as Icons from 'lucide-react';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Category>) => void;
}

const COLORS = [
  '#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#6366f1', '#64748b', '#f97316'
];

const AVAILABLE_ICONS = [
  'Home', 'Utensils', 'Car', 'Film', 'ShoppingBag', 'Briefcase', 
  'TrendingUp', 'Heart', 'Zap', 'Smartphone', 'Coffee', 'Plane', 
  'Gift', 'Book', 'Wrench', 'Dog', 'Baby', 'GraduationCap', 'Wifi', 'Shield'
];

const CategoryForm: React.FC<CategoryFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState('Home');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onSubmit({
      name,
      color: selectedColor,
      icon: selectedIcon
    });
    
    setName('');
    setSelectedColor(COLORS[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full md:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl p-6 animate-[slideUp_0.3s_ease-out] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nova Categoria</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome da Categoria</label>
            <div className="relative flex items-center">
                <div className="absolute left-3 p-1.5 rounded-lg" style={{ backgroundColor: selectedColor }}>
                     {React.createElement((Icons as any)[selectedIcon] || Icons.Circle, { size: 16, className: 'text-white' })}
                </div>
                <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Assinaturas"
                className="w-full p-3 pl-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                autoFocus
                />
            </div>
          </div>

          {/* Icon Selector */}
          <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ícone</label>
              <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto pr-1 no-scrollbar">
                  {AVAILABLE_ICONS.map(iconName => {
                      const Icon = (Icons as any)[iconName];
                      return (
                        <button
                            key={iconName}
                            type="button"
                            onClick={() => setSelectedIcon(iconName)}
                            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                                selectedIcon === iconName 
                                ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md' 
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
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            Criar Categoria
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;