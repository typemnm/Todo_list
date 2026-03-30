import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';

export const Login: React.FC = () => {
  const { handleLogin, error, isSubmitting } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const validate = () => {
    const errors = { email: '', password: '' };
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email format';
    if (!password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await handleLogin({ email, password });
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-surface-variant/60 backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-[0_12px_40px_rgba(27,36,127,0.08)]">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary shadow-[0_0_60px_10px_rgba(204,198,180,0.3)] relative">
              <div className="absolute inset-0 rounded-full animate-pulse blur-[2px] bg-primary"></div>
            </div>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-primary mb-2">
            Stellar Observer
          </h1>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
            Enter the Constellation
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-body text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">
              Email
            </label>
            <Input
              value={email}
              onChange={(v) => { setEmail(v); setFieldErrors(p => ({ ...p, email: '' })); }}
              placeholder="stellar@example.com"
              error={fieldErrors.email}
            />
          </div>
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">
              Password
            </label>
            <Input
              value={password}
              onChange={(v) => { setPassword(v); setFieldErrors(p => ({ ...p, password: '' })); }}
              placeholder="••••••••"
              type="password"
              error={fieldErrors.password}
            />
          </div>
          <Button type="submit" fullWidth variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Launching...' : 'Enter Orbit'}
          </Button>
        </form>

        <p className="mt-8 text-center font-label text-xs text-on-surface-variant">
          No account?{' '}
          <Link to="/register" className="text-primary hover:text-primary/80 transition-colors">
            Create Constellation
          </Link>
        </p>
      </div>
    </main>
  );
};
