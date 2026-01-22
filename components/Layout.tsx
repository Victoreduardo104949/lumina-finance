
import React from 'react';
import { LayoutDashboard, CreditCard, PieChart, Settings, Plus, UserCircle, ShieldAlert, CalendarClock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Profile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onAddTransaction: () => void;
  currentProfile?: Profile;
  onSwitchProfile: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onAddTransaction, currentProfile, onSwitchProfile }) => {
  const location = useLocation();

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
          isActive 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium hidden md:block">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-transparent">
      {/* Desktop Sidebar (Left) */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-24 flex-col items-center py-8 glass-panel border-r border-white/20 z-50">
        <button 
            onClick={onSwitchProfile}
            className="mb-8 p-1 rounded-2xl border-2 border-white/20 hover:scale-110 transition-transform shadow-lg"
            style={{ borderColor: currentProfile?.color }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner" style={{ backgroundColor: currentProfile?.color || '#3b82f6' }}>
            {currentProfile?.name.charAt(0) || 'L'}
          </div>
        </button>
        
        <div className="flex-1 flex flex-col space-y-8 w-full">
          <NavItem to="/" icon={LayoutDashboard} label="Início" />
          <NavItem to="/wallet" icon={CreditCard} label="Carteira" />
          <NavItem to="/fixed" icon={CalendarClock} label="Fixas" />
          <NavItem to="/debts" icon={ShieldAlert} label="Dívidas" />
          <NavItem to="/analytics" icon={PieChart} label="Análise" />
          <NavItem to="/settings" icon={Settings} label="Ajustes" />
        </div>
        
        <div className="mt-auto">
            <button 
                onClick={onAddTransaction}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            >
                <Plus size={24} />
            </button>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 glass-panel border-b border-white/10 z-50">
        <div className="flex items-center gap-3" onClick={onSwitchProfile}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: currentProfile?.color }}>
                {currentProfile?.name.charAt(0)}
            </div>
            <span className="font-bold text-slate-800 dark:text-white">{currentProfile?.name}</span>
        </div>
        <Link to="/settings" className="text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <Settings size={20}/>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 md:pl-24 scroll-smooth no-scrollbar">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Reorganizado para incluir Contas Fixas */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 glass-panel border-t border-white/20 z-50 flex items-center justify-around px-2 pb-2">
        <NavItem to="/" icon={LayoutDashboard} label="Início" />
        <NavItem to="/wallet" icon={CreditCard} label="Carteira" />
        <NavItem to="/fixed" icon={CalendarClock} label="Fixas" />
        
        <div className="relative -top-6">
          <button
            onClick={onAddTransaction}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-blue-500/30 shadow-xl transition-transform active:scale-95 border-4 border-[#f3f4f6] dark:border-[#0f172a]"
          >
            <Plus size={32} />
          </button>
        </div>

        <NavItem to="/debts" icon={ShieldAlert} label="Dívidas" />
        <NavItem to="/analytics" icon={PieChart} label="Análise" />
      </nav>
    </div>
  );
};

export default Layout;
