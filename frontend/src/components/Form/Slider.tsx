import React from 'react';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  displayValue?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  label,
  displayValue,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {(label || displayValue) && (
        <div className="flex justify-between items-center text-sm font-label">
          {label && <span className="text-on-surface-variant">{label}</span>}
          {displayValue && <span className="text-primary">{displayValue}</span>}
        </div>
      )}
      <div className="relative w-full h-4 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="w-full h-1 bg-outline-variant/20 rounded-full relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          />
        </div>
        <div 
          className="absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(204,198,180,0.4)] pointer-events-none transform -translate-x-1/2"
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
    </div>
  );
};
