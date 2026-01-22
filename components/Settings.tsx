
import React, { useState } from 'react';
import { Database, Tag, Download, Upload, Trash2, Plus, ShieldCheck, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Category, SyncConfig, Profile } from '../types';
import * as Icons from 'lucide-react';

interface SettingsProps {
  categories: Category[];
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
  syncConfig: SyncConfig;
  onUpdateSyncConfig: (config: SyncConfig) => void;
  onSync: () => void;
  onExport: () => void;
  onImport: (data: string) => void;
  profiles: Profile[];
}

const Settings: React.FC<SettingsProps> = ({
  categories, onAddCategory, onDeleteCategory,
  syncConfig, onUpdateSyncConfig, onSync,
  onExport, onImport, profiles
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleSyncClick = async () => {
    setIsSyncing(true);
    await onSync();
    setTimeout(() => setIsSyncing(false), 1500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        onImport(content);
        setImportError(null);
        alert('Backup importado com sucesso!');
      } catch (err) {
        setImportError('Erro ao ler o arquivo de backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      <h1 className="text-3xl font-black text-slate-800 dark:text-white px-2">Ajustes do Sistema</h1>

      {/* Database & Cloud Sync Section */}
      <section className="glass-card p-6 rounded-[2.5rem] border-2 border-indigo-500/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <Database size={20} />
          </div>
          <div>
            <h2 className="font-black text-lg">Banco de Dados (Nuvem)</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sincronização com Supabase</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-4">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              A conexão com o banco de dados é gerenciada automaticamente pelo sistema.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleSyncClick}
              disabled={!syncConfig.supabaseUrl || isSyncing}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-40"
            >
              {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </button>
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ShieldCheck size={18} className={syncConfig.enabled ? 'text-emerald-500' : 'text-slate-300'} />
              <span className="text-[10px] font-black uppercase text-slate-400">
                {syncConfig.enabled ? 'Conexão Ativa' : 'Offline Mode'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Management */}
      <section className="glass-card p-6 rounded-[2.5rem]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20">
              <Tag size={20} />
            </div>
            <div>
              <h2 className="font-black text-lg">Categorias</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Personalize seus gastos</p>
            </div>
          </div>
          <button
            onClick={onAddCategory}
            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-800 dark:text-white hover:scale-110 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(cat => {
            const Icon = (Icons as any)[cat.icon] || Icons.Circle;
            return (
              <div key={cat.id} className="group relative p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: cat.color }}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate w-full">{cat.name}</span>
                </div>
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-75 hover:scale-100"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Backup & Export */}
      <section className="glass-card p-6 rounded-[2.5rem]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/20">
            <Download size={20} />
          </div>
          <div>
            <h2 className="font-black text-lg">Backup de Segurança</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nunca perca seus dados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onExport}
            className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex flex-col items-center gap-3"
          >
            <Download size={24} className="text-blue-500" />
            <div className="text-center">
              <span className="block font-black text-xs uppercase tracking-widest text-slate-800 dark:text-white">Exportar JSON</span>
              <span className="text-[10px] text-slate-400 font-bold">Salva uma cópia no seu dispositivo</span>
            </div>
          </button>

          <label className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex flex-col items-center gap-3 cursor-pointer">
            <Upload size={24} className="text-emerald-500" />
            <div className="text-center">
              <span className="block font-black text-xs uppercase tracking-widest text-slate-800 dark:text-white">Importar Backup</span>
              <span className="text-[10px] text-slate-400 font-bold">Substitui os dados atuais</span>
            </div>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>

        {importError && (
          <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center gap-3 text-xs font-bold">
            <AlertTriangle size={16} />
            {importError}
          </div>
        )}
      </section>
    </div>
  );
};

export default Settings;
