
import React, { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';

interface RewardOverlayProps {
  xpGained: number | null;
  achievementUnlocked: { title: string; icon: any } | null;
  onClose: () => void;
}

const RewardOverlay: React.FC<RewardOverlayProps> = ({ xpGained, achievementUnlocked, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (xpGained || achievementUnlocked) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade out
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [xpGained, achievementUnlocked, onClose]);

  if (!visible && !xpGained && !achievementUnlocked) return null;

  return (
    <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95'}`}>
      
      {/* XP Notification */}
      {xpGained && !achievementUnlocked && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border-2 border-white/20">
          <div className="bg-white/20 p-1 rounded-full">
            <Sparkles size={16} className="text-yellow-300 animate-spin-slow" />
          </div>
          <span className="font-bold text-lg">+{xpGained} XP</span>
        </div>
      )}

      {/* Achievement Notification */}
      {achievementUnlocked && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-1 rounded-2xl shadow-2xl border-2 border-white/20">
           <div className="bg-black/10 backdrop-blur-sm rounded-xl px-6 py-4 flex items-center gap-4">
              <div className="bg-white p-3 rounded-full text-amber-500 shadow-inner">
                <Trophy size={24} className="animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-100">Conquista Desbloqueada!</p>
                <p className="font-bold text-lg">{achievementUnlocked.title}</p>
              </div>
           </div>
        </div>
      )}
      
      {/* CSS-only Confetti Effect (Simplified) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden flex justify-center w-screen h-screen -z-10 left-1/2 -translate-x-1/2 -top-10">
         <div className="confetti-piece"></div>
         <div className="confetti-piece"></div>
         <div className="confetti-piece"></div>
         <div className="confetti-piece"></div>
         <div className="confetti-piece"></div>
         <div className="confetti-piece"></div>
         <div className="confetti-piece"></div>
         <style>{`
            .confetti-piece {
                position: absolute;
                width: 10px;
                height: 10px;
                background: #ffd300;
                top: 0;
                opacity: 0;
                animation: confetti 3s ease-in-out infinite;
            }
            .confetti-piece:nth-child(1) { left: -100px; background: #4774ff; animation-delay: 0; }
            .confetti-piece:nth-child(2) { left: 100px; background: #ff477e; animation-delay: 0.5s; }
            .confetti-piece:nth-child(3) { left: -50px; background: #ffd300; animation-delay: 0.2s; }
            .confetti-piece:nth-child(4) { left: 50px; background: #34d399; animation-delay: 0.7s; }
            .confetti-piece:nth-child(5) { left: -150px; background: #a78bfa; animation-delay: 1s; }
            .confetti-piece:nth-child(6) { left: 150px; background: #f472b6; animation-delay: 1.2s; }

            @keyframes confetti {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(200px) rotate(720deg); opacity: 0; }
            }
         `}</style>
      </div>
    </div>
  );
};

export default RewardOverlay;
