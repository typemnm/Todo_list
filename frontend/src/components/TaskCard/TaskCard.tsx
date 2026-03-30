import React, { useState, useRef } from 'react';
import type { Todo } from '../../types/todo';

interface TaskCardProps {
  todo: Todo;
  isActive?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  todo,
  isActive = false,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(todo._id);
  };

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(todo.title);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.title) {
      onUpdate(todo._id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') {
      setEditValue(todo.title);
      setIsEditing(false);
    }
  };

  const titleContent = isEditing ? (
    <input
      ref={inputRef}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={saveEdit}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
      maxLength={200}
      className="bg-transparent border-b border-primary/50 outline-none text-lg font-headline font-bold text-on-surface w-full"
      aria-label="Edit task title"
    />
  ) : (
    <h3
      className={`text-lg font-headline font-bold ${
        todo.completed ? 'text-on-surface/60 line-through decoration-primary/30' : 'text-on-surface'
      }`}
    >
      {todo.title}
    </h3>
  );

  const editBtn = (
    <button
      onClick={startEdit}
      aria-label="Edit task"
      className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
    >
      <span className="material-symbols-outlined text-[20px]">edit</span>
    </button>
  );

  const deleteBtn = (
    <button
      onClick={handleDelete}
      aria-label="Delete task"
      className="text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100"
    >
      <span className="material-symbols-outlined">delete</span>
    </button>
  );

  if (todo.completed) {
    return (
      <div
        className="group relative p-6 rounded-2xl bg-surface-container-lowest/20 border border-outline-variant/5 opacity-40 grayscale-[0.5] cursor-pointer"
        onClick={() => onToggle(todo._id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <span
              className="material-symbols-outlined text-on-surface-variant/50 flex-shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <div className="min-w-0 flex-1">{titleContent}</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {editBtn}
            <button
              onClick={handleDelete}
              aria-label="Delete task"
              className="text-on-surface-variant/50 hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div
        className="group relative p-6 rounded-2xl bg-surface-container-high/60 backdrop-blur-xl border border-primary/20 shadow-[0_0_30px_rgba(204,198,180,0.05)] transition-all duration-500 hover:translate-x-2 cursor-pointer"
        onClick={() => !isEditing && onToggle(todo._id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <span
                className="material-symbols-outlined text-primary star-glow scale-125"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            </div>
            <div className="min-w-0 flex-1">{titleContent}</div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col items-end">
              <span className="font-label text-[10px] uppercase tracking-tighter text-secondary">Priority</span>
              <span className="font-body text-xs font-semibold text-secondary">{todo.priority.toUpperCase()}</span>
            </div>
            {editBtn}
            {deleteBtn}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative p-6 rounded-2xl bg-surface-container-low/30 backdrop-blur-md border border-outline-variant/10 transition-all duration-500 hover:translate-x-2 hover:bg-surface-container-low/50 cursor-pointer"
      onClick={() => !isEditing && onToggle(todo._id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <span
              className="material-symbols-outlined text-on-surface-variant"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              auto_awesome
            </span>
          </div>
          <div className="min-w-0 flex-1">{titleContent}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {editBtn}
          {deleteBtn}
        </div>
      </div>
    </div>
  );
};
