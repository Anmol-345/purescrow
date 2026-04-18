import React from 'react';
import { Award } from 'lucide-react';

export function AchievementBadge({ title, description, icon, earned = false }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group ${
      earned 
        ? 'border-accent-orange/30 bg-accent-orange/5 shadow-lg shadow-accent-orange/5' 
        : 'border-zinc-900 bg-zinc-950/50 opacity-40 grayscale'
    }`}>
      {/* Background Glow for Earned Badges */}
      {earned && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-orange/10 blur-3xl -mr-12 -mt-12 group-hover:bg-accent-orange/20 transition-colors" />
      )}

      <div className="relative z-10 flex gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${
          earned ? 'bg-zinc-900 text-white border border-zinc-800' : 'bg-zinc-900/50 text-zinc-700'
        }`}>
          {icon || <Award size={20} />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-black tracking-tight ${earned ? 'text-white' : 'text-zinc-500'}`}>
              {title}
            </h4>
            {earned && (
              <div className="w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse" />
            )}
          </div>
          <p className="text-[10px] text-zinc-500 leading-tight mt-1 font-medium uppercase tracking-wide">
            {description}
          </p>
        </div>
      </div>

      {/* Earned Border Animation */}
      {earned && (
        <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-accent-orange/50 to-transparent w-full opacity-50" />
      )}
    </div>
  );
}
