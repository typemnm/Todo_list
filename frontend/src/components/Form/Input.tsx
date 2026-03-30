import React from 'react';

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  type?: 'text' | 'password' | 'email';
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  maxLength,
  error,
  type = 'text',
}) => {
  return (
    <div className="w-full relative">
      <input
        className="w-full bg-transparent border-b border-outline-variant/30 py-4 font-body text-xl focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/40 text-center"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        type={type}
      />
      {error && (
        <span className="text-error text-sm mt-1 block text-center">
          {error}
        </span>
      )}
    </div>
  );
};
