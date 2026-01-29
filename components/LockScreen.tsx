
import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Delete, X } from 'lucide-react';

interface LockScreenProps {
    correctPin: string;
    onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ correctPin, onUnlock }) => {
    const [pin, setPin] = useState<string>('');
    const [error, setError] = useState(false);

    const handleNumberClick = (num: string) => {
        if (pin.length < 4) {
            setError(false);
            setPin(prev => prev + num);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError(false);
    };

    useEffect(() => {
        if (pin.length === 4) {
            if (pin === correctPin) {
                onUnlock();
            } else {
                setError(true);
                setTimeout(() => setPin(''), 500);
            }
        }
    }, [pin, correctPin, onUnlock]);

    return (
        <div className="fixed inset-0 z-[1000] bg-slate-900 flex flex-col items-center justify-center p-6 animate-fadeIn">
            <div className="mb-12 text-center">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${error ? 'bg-rose-500 animate-shake' : 'bg-blue-600 shadow-xl shadow-blue-500/20'}`}>
                    <Lock className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Lumina Safe</h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest px-4 py-1.5 bg-slate-800 rounded-full inline-block">Digite seu PIN de Acesso</p>
            </div>

            <div className="flex gap-4 mb-16">
                {[0, 1, 2, 3].map(i => (
                    <div
                        key={i}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${pin.length > i
                            ? 'bg-blue-500 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                            : 'bg-slate-700'
                            } ${error ? 'bg-rose-500' : ''}`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        type="button"
                        onClick={() => handleNumberClick(num.toString())}
                        className="w-16 h-16 rounded-2xl bg-slate-800/50 hover:bg-slate-700 text-white text-2xl font-black transition-all active:scale-95 border border-slate-700/50"
                    >
                        {num}
                    </button>
                ))}
                <div />
                <button
                    type="button"
                    onClick={() => handleNumberClick('0')}
                    className="w-16 h-16 rounded-2xl bg-slate-800/50 hover:bg-slate-700 text-white text-2xl font-black transition-all active:scale-95 border border-slate-700/50"
                >
                    0
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95"
                >
                    <Delete size={24} />
                </button>
            </div>

            <div className="mt-12">
                <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Proteção Ativa Lumina</span>
                </div>
            </div>
        </div>
    );
};

export default LockScreen;
