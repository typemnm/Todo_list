import React from 'react';

export type PriorityLevel = 'low' | 'medium' | 'high';

export interface PrioritySelectorProps {
  value: PriorityLevel;
  onChange: (priority: PriorityLevel) => void;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <button 
        type="button"
        onClick={() => onChange('low')}
        className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
      >
        <div className={`rounded-full flex items-center justify-center transition-all duration-300 ${
          value === 'low' 
            ? 'w-10 h-10 border border-secondary/40 bg-secondary/10' 
            : 'w-8 h-8 border border-secondary/20 bg-secondary/10'
        }`}>
          <div className={`rounded-full bg-secondary transition-all duration-300 ${
            value === 'low'
              ? 'w-3 h-3 shadow-[0_0_10px_rgba(204,198,180,0.5)]'
              : 'w-2 h-2'
          }`}></div>
        </div>
        <span className={`font-label text-[10px] transition-colors duration-300 ${
          value === 'low' ? 'text-secondary' : 'text-secondary/60'
        }`}>Low</span>
      </button>

      <button 
        type="button"
        onClick={() => onChange('medium')}
        className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
      >
        <div className={`rounded-full flex items-center justify-center transition-all duration-300 ${
          value === 'medium' 
            ? 'w-10 h-10 border border-on-surface/40 bg-on-surface/10' 
            : 'w-8 h-8 border border-on-surface/20 bg-on-surface/10'
        }`}>
          <div className={`rounded-full bg-on-surface transition-all duration-300 ${
            value === 'medium'
              ? 'w-3 h-3 shadow-[0_0_10px_rgba(225,226,231,0.5)]'
              : 'w-2 h-2'
          }`}></div>
        </div>
        <span className={`font-label text-[10px] transition-colors duration-300 ${
          value === 'medium' ? 'text-on-surface' : 'text-on-surface/60'
        }`}>Medium</span>
      </button>

      <button 
        type="button"
        onClick={() => onChange('high')}
        className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
      >
        <div className={`rounded-full flex items-center justify-center transition-all duration-300 ${
          value === 'high' 
            ? 'w-10 h-10 border border-primary/40 bg-primary/10' 
            : 'w-8 h-8 border border-primary/20 bg-primary/10'
        }`}>
          <div className={`rounded-full bg-primary transition-all duration-300 ${
            value === 'high'
              ? 'w-3 h-3 shadow-[0_0_10px_rgba(204,198,180,0.5)]'
              : 'w-2 h-2'
          }`}></div>
        </div>
        <span className={`font-label text-[10px] transition-colors duration-300 ${
          value === 'high' ? 'text-primary' : 'text-primary/60'
        }`}>High</span>
      </button>
    </div>
  );
};
