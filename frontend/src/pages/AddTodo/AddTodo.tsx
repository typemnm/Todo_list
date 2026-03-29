import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../../hooks/useTodos';
import { Input } from '../../components/Form/Input';
import { PrioritySelector } from '../../components/Form/PrioritySelector';
import type { PriorityLevel } from '../../components/Form/PrioritySelector';
import { Button } from '../../components/Form/Button';

export const AddTodo: React.FC = () => {
  const navigate = useNavigate();
  const { createTodo, isCreating } = useTodos();
  
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (title.length > 200) {
      setError('Title must be 200 characters or less');
      return;
    }

    try {
      await createTodo(title.trim(), priority);
      navigate('/list');
    } catch (err) {
      setError('Failed to create star. Please try again.');
    }
  };

  const getStarClasses = () => {
    switch (priority) {
      case 'low':
        return 'w-12 h-12 bg-secondary shadow-[0_0_40px_rgba(189,194,255,0.3)]';
      case 'high':
        return 'w-20 h-20 bg-primary shadow-[0_0_80px_15px_rgba(204,198,180,0.4)]';
      case 'medium':
      default:
        return 'w-16 h-16 bg-on-surface shadow-[0_0_60px_10px_rgba(225,226,231,0.3)]';
    }
  };

  const getInnerStarClasses = () => {
    switch (priority) {
      case 'low':
        return 'bg-secondary';
      case 'high':
        return 'bg-primary';
      case 'medium':
      default:
        return 'bg-white';
    }
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl bg-surface-variant/60 backdrop-blur-2xl rounded-[32px] p-8 md:p-12 shadow-[0_12px_40px_rgba(27,36,127,0.08)] flex flex-col items-center">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-primary mb-2">Place a New Star</h1>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Defining a focal point in the infinite</p>
        </header>

        <div className="relative flex items-center justify-center mb-16 h-48 w-48 group">
          <div className="absolute inset-0 bg-on-surface/5 rounded-full blur-3xl scale-150"></div>
          
          <div className={`rounded-full relative z-10 transition-all duration-500 ease-in-out ${getStarClasses()}`}>
            <div className={`absolute inset-0 rounded-full animate-pulse blur-[2px] transition-colors duration-500 ${getInnerStarClasses()}`}></div>
          </div>
          
          <div className="absolute inset-0 border border-outline-variant/15 rounded-full scale-125"></div>
          <div className="absolute inset-0 border border-outline-variant/10 rounded-full scale-[1.6] rotate-45"></div>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-10">
          <div className="relative group">
            <Input
              value={title}
              onChange={(value) => {
                setTitle(value);
                if (error) setError('');
              }}
              placeholder="Designate Task Name..."
              maxLength={200}
              error={error}
            />
            <div className="absolute bottom-0 left-0 h-[1px] bg-primary w-0 group-focus-within:w-full transition-all duration-500"></div>
          </div>

          <div className="space-y-4">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block text-center">Magnitude (Priority)</label>
            <PrioritySelector value={priority} onChange={setPriority} />
          </div>

          <div className="pt-4 flex flex-col items-center gap-6">
            <Button
              type="submit"
              fullWidth
              disabled={isCreating}
              variant="primary"
            >
              Ignite Star
            </Button>
            <button
              type="button"
              onClick={() => navigate('/list')}
              className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-background transition-colors"
            >
              Abort Sequence
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
