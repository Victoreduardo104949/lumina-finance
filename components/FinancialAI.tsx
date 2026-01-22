
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
// Added FixedExpense to imports
import { Transaction, Account, Debt, FixedExpense } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface FinancialAIProps {
    transactions: Transaction[];
    accounts: Account[];
    debts: Debt[];
    // Added fixedExpenses to prop interface
    fixedExpenses: FixedExpense[];
}

const FinancialAI: React.FC<FinancialAIProps> = ({ transactions, accounts, debts, fixedExpenses }) => {
    const [insightHtml, setInsightHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchInsights = async () => {
        setLoading(true);
        // Updated call to include fixedExpenses
        const html = await getFinancialInsights(transactions, accounts, debts, fixedExpenses);
        setInsightHtml(html);
        setLoading(false);
    };

    useEffect(() => {
        // Fetch initial insight on mount
        fetchInsights();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="glass-card p-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-white/40 to-purple-50/40 dark:from-slate-800/60 dark:to-slate-900/60 mt-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white shadow-lg shadow-purple-500/30">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Concierge Financeiro</h3>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Powered by Gemini</p>
                    </div>
                </div>
                <button
                    onClick={fetchInsights}
                    disabled={loading}
                    className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all ${loading ? 'animate-spin' : ''}`}
                >
                    <RefreshCw size={16} className="text-slate-500" />
                </button>
            </div>

            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed min-h-[80px]">
                {!import.meta.env.VITE_API_KEY ? (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800/50 flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-amber-800 dark:text-amber-200 text-xs">Chave do Gemini Ausente</p>
                            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80">Configure a variável VITE_API_KEY no painel do Vercel.</p>
                        </div>
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-4 space-y-2 opacity-70">
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="w-3/4 h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="w-5/6 h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </div>
                ) : (
                    <div
                        dangerouslySetInnerHTML={{ __html: insightHtml || 'Peça uma análise das suas finanças.' }}
                        className="prose prose-sm dark:prose-invert max-w-none"
                    />
                )}
            </div>

        </div>
    );
};

export default FinancialAI;
