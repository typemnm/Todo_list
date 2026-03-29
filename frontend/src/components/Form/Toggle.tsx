import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <div 
      className="flex items-center justify-between cursor-pointer group"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      {label && <span className="font-body text-sm text-on-surface">{label}</span>}
      <div 
        className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
          checked ? 'bg-primary' : 'bg-surface-container-lowest'
        }`}
      >
        <div 
          className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${
            checked 
              ? 'right-1 bg-on-primary' 
              : 'left-1 bg-outline-variant'
          }`}
        />
      </div>
    </div>
  );
};
