import React from 'react';
import type { Todo } from '../../types/todo';

interface StarVisualizationProps {
  todos: Todo[];
  activeTodoId?: string;
  onStarClick?: (todoId: string) => void;
}

export const StarVisualization: React.FC<StarVisualizationProps> = ({
  todos,
  activeTodoId,
  onStarClick
}) => {
  if (todos.length === 0) {
    return (
      <div className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-gradient-to-br from-surface to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
        <p className="text-secondary font-label uppercase tracking-widest text-sm opacity-60 relative z-10">
          The cosmos is quiet. No active tasks.
        </p>
      </div>
    );
  }

  const getStarPosition = (index: number, total: number) => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const angle = index * goldenAngle;
    const radius = Math.sqrt(index / total) * 40 + 5;
    
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    
    return { x: `${x}%`, y: `${y}%` };
  };

  const getPriorityClasses = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return { size: 'w-5 h-5', bg: 'bg-primary' };
      case 'medium': return { size: 'w-4 h-4', bg: 'bg-secondary' };
      case 'low': return { size: 'w-3 h-3', bg: 'bg-tertiary' };
      default: return { size: 'w-4 h-4', bg: 'bg-primary' };
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-surface to-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" stroke="currentColor">
        {todos.map((todo, index) => {
          if (index === 0) return null;
          const prevPos = getStarPosition(index - 1, todos.length);
          const currPos = getStarPosition(index, todos.length);
          
          return (
            <line
              key={`line-${todo._id}`}
              className="text-primary"
              strokeDasharray="4"
              x1={prevPos.x}
              y1={prevPos.y}
              x2={currPos.x}
              y2={currPos.y}
            />
          );
        })}
      </svg>

      {todos.map((todo, index) => {
        const position = getStarPosition(index, todos.length);
        const { size, bg } = getPriorityClasses(todo.priority);
        const isActive = todo._id === activeTodoId;
        const isCompleted = todo.completed;

        return (
          <div
            key={todo._id}
            data-todo-id={todo._id}
            className={`absolute group cursor-pointer transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
            style={{ left: position.x, top: position.y }}
            onClick={() => onStarClick?.(todo._id)}
          >
            <div className="flex items-center gap-4">
              <div
                data-id={todo._id}
                data-priority={todo.priority}
                className={`rounded-full transition-transform duration-500 group-hover:scale-150 ${size} ${isActive ? 'bg-primary star-glow' : bg} ${isActive && isCompleted ? 'opacity-80 shadow-[0_0_10px_1px_rgba(204,198,180,0.2)]' : ''}`}
              ></div>
              <div className="opacity-0 lg:opacity-80 group-hover:opacity-100 transition-opacity absolute left-full ml-4 whitespace-nowrap z-20 pointer-events-none">
                <span className="block text-[10px] font-label text-secondary uppercase tracking-[0.2em] mb-1 drop-shadow-md">
                  {todo.priority}
                </span>
                <span className={`font-headline text-lg font-bold drop-shadow-md ${isCompleted ? 'text-secondary line-through' : 'text-on-surface'}`}>
                  {todo.title}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};