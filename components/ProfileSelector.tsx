
import React, { useState } from 'react';
import { X, Plus, Check, User, Briefcase, Users, Heart, Trash2 } from 'lucide-react';
import { Profile } from '../types';

interface ProfileSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  currentProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (name: string, color: string) => void;
  onDeleteProfile: (id: string) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  isOpen, onClose, profiles, currentProfileId, onSelectProfile, onAddProfile, onDeleteProfile
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newName.trim()) {
      onAddProfile(newName.trim(), selectedColor);
      setNewName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleIn">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Perfis</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {!isAdding ? (
            <div className="space-y-4">
              <div className="grid gap-3">
                {profiles.map(p => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-4 rounded-3xl border-2 transition-all ${currentProfileId === p.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                  >
                    <button
                      onClick={() => { onSelectProfile(p.id); onClose(); }}
                      className="flex-1 flex items-center gap-4 text-left"
                    >
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ backgroundColor: p.color }}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          {currentProfileId === p.id ? 'Ativo Agora' : 'Clique para trocar'}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      {currentProfileId === p.id && <div className="bg-blue-500 text-white p-1 rounded-full"><Check size={16} /></div>}

                      {profiles.length > 1 && (
                        <button
                          onClick={() => onDeleteProfile(p.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                          title="Excluir Perfil"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsAdding(true)}
                className="w-full p-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all flex items-center justify-center gap-2 font-bold"
              >
                <Plus size={20} /> Novo Perfil
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nome do Perfil</label>
                <input
                  type="text"
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Trabalho, Conjunto..."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Cor Identificadora</label>
                <div className="flex gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${selectedColor === c ? 'ring-4 ring-slate-200 dark:ring-slate-700' : ''}`}
                      style={{ backgroundColor: c }}
                    >
                      {selectedColor === c && <Check size={18} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-4 font-bold text-slate-500">Cancelar</button>
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-40"
                >
                  Criar Perfil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSelector;
