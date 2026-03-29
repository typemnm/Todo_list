import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  fullWidth = false,
}) => {
  let baseStyles = "px-6 py-3 font-button transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-on-primary rounded-full shadow-[0_0_20px_rgba(204,198,180,0.15)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(204,198,180,0.25)]",
    secondary: "bg-surface-bright text-primary border border-primary/20 rounded-full hover:bg-primary/5",
    ghost: "text-on-surface-variant hover:text-on-surface rounded-full hover:bg-on-surface/5",
  };

  const classes = `${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};
