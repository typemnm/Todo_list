import React, { useMemo, useState } from 'react';
import { Layout } from '../../components/Layout';
import { TaskCard } from '../../components/TaskCard';
import { useTodos } from '../../hooks/useTodos';
import { useAuthContext } from '../../contexts/AuthContext';
import type { Priority } from '../../types/todo';

export const List: React.FC = () => {
  const { user } = useAuthContext();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { todos, pagination, isLoading, error, toggleTodo, deleteTodo, updateTodo } = useTodos({
    search: search || undefined,
    priority: priorityFilter || undefined,
    completed: completedFilter,
    page,
    limit: 10,
  });

  const metrics = useMemo(() => {
    const total = pagination.total;
    const completedCount = todos.filter(t => t.completed).length;
    const pendingCount = todos.filter(t => !t.completed).length;
    const highPriorityCount = todos.filter(t => t.priority === 'high').length;
    return { total, completedCount, pendingCount, highPriorityCount };
  }, [todos, pagination.total]);

  const firstIncompleteId = useMemo(() => {
    return todos.find(t => !t.completed)?._id ?? null;
  }, [todos]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <p className="text-on-surface-variant animate-pulse">Loading constellation...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <p className="text-error">{error.message || 'Failed to fetch'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="sticky top-0 w-full z-30 flex justify-between items-center px-12 py-8 bg-gradient-to-b from-background to-transparent">
        <div>
          <h2 className="text-4xl font-headline font-extrabold text-primary tracking-tighter">The Milky Way List</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-px w-8 bg-primary/30"></span>
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{user?.email ?? 'Loading...'}</p>
          </div>
        </div>
      </header>

      <div className="px-12 max-w-4xl mx-auto">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant/10">
            <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-1">Total Mass</p>
            <p className="text-2xl font-headline font-bold text-on-surface">{metrics.total}</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant/10">
            <p className="font-label text-[10px] uppercase tracking-widest text-tertiary mb-1">Supernovas</p>
            <p className="text-2xl font-headline font-bold text-on-surface">{metrics.highPriorityCount}</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant/10">
            <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-1">Active Orbits</p>
            <p className="text-2xl font-headline font-bold text-on-surface">{metrics.pendingCount}</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant/10">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Completed</p>
            <p className="text-2xl font-headline font-bold text-on-surface">{metrics.completedCount}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search stars..."
            aria-label="Search todos"
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant/10 rounded-2xl font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary/30 transition-colors"
          />
        </div>

        {/* Priority filter */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {(['', 'low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p || 'all'}
              onClick={() => { setPriorityFilter(p); setPage(1); }}
              className={`px-4 py-1.5 rounded-full font-label text-[10px] uppercase tracking-widest transition-colors ${
                priorityFilter === p
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface-container-low/30 text-on-surface-variant border border-outline-variant/10 hover:border-primary/20'
              }`}
            >
              {p || 'All'}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-2 mb-8">
          {[
            { label: 'All', value: undefined },
            { label: 'Active', value: false },
            { label: 'Done', value: true },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => { setCompletedFilter(opt.value); setPage(1); }}
              className={`px-4 py-1.5 rounded-full font-label text-[10px] uppercase tracking-widest transition-colors ${
                completedFilter === opt.value
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface-container-low/30 text-on-surface-variant border border-outline-variant/10 hover:border-primary/20'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Todo list */}
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span
              className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              auto_awesome
            </span>
            <p className="text-xl font-headline text-on-surface-variant">No stars in your constellation yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map(todo => (
              <TaskCard
                key={todo._id}
                todo={todo}
                isActive={todo._id === firstIncompleteId}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={(id, title) => updateTodo(id, { title })}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-6 py-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
              className="px-4 py-2 rounded-xl bg-surface-container-low/40 border border-outline-variant/10 text-on-surface-variant hover:text-on-surface disabled:opacity-30 transition-colors font-label text-xs uppercase tracking-widest"
            >
              ← Prev
            </button>
            <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
              {page} / {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page >= pagination.pages}
              aria-label="Next page"
              className="px-4 py-2 rounded-xl bg-surface-container-low/40 border border-outline-variant/10 text-on-surface-variant hover:text-on-surface disabled:opacity-30 transition-colors font-label text-xs uppercase tracking-widest"
            >
              Next →
            </button>
          </div>
        )}

        <div className="pb-12" />
      </div>
    </Layout>
  );
};
