import React, { useMemo } from 'react';
import { Layout } from '../../components/Layout';
import { TaskCard } from '../../components/TaskCard';
import { useTodos } from '../../hooks/useTodos';

export const List: React.FC = () => {
  const { todos, isLoading, error, toggleTodo, deleteTodo } = useTodos();

  const metrics = useMemo(() => {
    const total = todos.length;
    const completedCount = todos.filter(t => t.completed).length;
    const pendingCount = total - completedCount;
    const highPriorityCount = todos.filter(t => t.priority === 'high').length;

    return { total, completedCount, pendingCount, highPriorityCount };
  }, [todos]);

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }, [todos]);

  const firstIncompleteId = useMemo(() => {
    const firstIncomplete = sortedTodos.find(t => !t.completed);
    return firstIncomplete ? firstIncomplete._id : null;
  }, [sortedTodos]);

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
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Active Sector: ORION-B9</p>
          </div>
        </div>
      </header>

      <div className="px-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-4 gap-4 mb-12">
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

        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>
              auto_awesome
            </span>
            <p className="text-xl font-headline text-on-surface-variant">No stars in your constellation yet</p>
          </div>
        ) : (
          <div className="space-y-4 pb-12">
            {sortedTodos.map(todo => (
              <TaskCard
                key={todo._id}
                todo={todo}
                isActive={todo._id === firstIncompleteId}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
