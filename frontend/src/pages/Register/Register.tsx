import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';

export const Register: React.FC = () => {
  const { handleRegister, error, isSubmitting } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '', confirm: '' });

  const validate = () => {
    const errors = { email: '', password: '', confirm: '' };
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email format';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!confirm) errors.confirm = 'Please confirm your password';
    else if (confirm !== password) errors.confirm = 'Passwords do not match';
    setFieldErrors(errors);
    return !errors.email && !errors.password && !errors.confirm;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await handleRegister({ email, password });
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-surface-variant/60 backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-[0_12px_40px_rgba(27,36,127,0.08)]">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-secondary shadow-[0_0_60px_10px_rgba(189,194,255,0.3)] relative">
              <div className="absolute inset-0 rounded-full animate-pulse blur-[2px] bg-secondary"></div>
            </div>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-primary mb-2">
            New Constellation
          </h1>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
            Initialize Your Star System
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
              placeholder="Min 6 characters"
              type="password"
              error={fieldErrors.password}
            />
          </div>
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">
              Confirm Password
            </label>
            <Input
              value={confirm}
              onChange={(v) => { setConfirm(v); setFieldErrors(p => ({ ...p, confirm: '' })); }}
              placeholder="••••••••"
              type="password"
              error={fieldErrors.confirm}
            />
          </div>
          <Button type="submit" fullWidth variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Initializing...' : 'Launch Constellation'}
          </Button>
        </form>

        <p className="mt-8 text-center font-label text-xs text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/80 transition-colors">
            Return to Orbit
          </Link>
        </p>
      </div>
    </main>
  );
};
