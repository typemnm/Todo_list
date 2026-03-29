import React from 'react';
import type { Todo } from '../../types/todo';

interface TaskCardProps {
  todo: Todo;
  isActive?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  todo,
  isActive = false,
  onToggle,
  onDelete
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(todo._id);
  };

  if (todo.completed) {
    return (
      <div 
        className="group relative p-6 rounded-2xl bg-surface-container-lowest/20 border border-outline-variant/5 opacity-40 grayscale-[0.5] cursor-pointer"
        onClick={() => onToggle(todo._id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-on-surface-variant/50" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <h3 className="text-lg font-headline font-bold text-on-surface/60 line-through decoration-primary/30">
              {todo.title}
            </h3>
          </div>
          <button 
            onClick={handleDelete}
            aria-label="Delete task"
            className="text-on-surface-variant/50 hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div 
        className="group relative p-6 rounded-2xl bg-surface-container-high/60 backdrop-blur-xl border border-primary/20 shadow-[0_0_30px_rgba(204,198,180,0.05)] transition-all duration-500 hover:translate-x-2 cursor-pointer"
        onClick={() => onToggle(todo._id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <span className="material-symbols-outlined text-primary star-glow scale-125" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            </div>
            <div>
              <h3 className="text-lg font-headline font-bold text-on-surface">{todo.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="font-label text-[10px] uppercase tracking-tighter text-secondary">Priority</span>
              <span className="font-body text-xs font-semibold text-secondary">{todo.priority.toUpperCase()}</span>
            </div>
            <button 
              onClick={handleDelete}
              aria-label="Delete task"
              className="text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group relative p-6 rounded-2xl bg-surface-container-low/30 backdrop-blur-md border border-outline-variant/10 transition-all duration-500 hover:translate-x-2 hover:bg-surface-container-low/50 cursor-pointer"
      onClick={() => onToggle(todo._id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>
              auto_awesome
            </span>
          </div>
          <div>
            <h3 className="text-lg font-headline font-bold text-on-surface">{todo.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={handleDelete}
            aria-label="Delete task"
            className="text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
