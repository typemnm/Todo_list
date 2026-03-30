import React from 'react';
import type { Todo } from '../../types/todo';
import type { AppSettings } from '../../services/api';

interface StarVisualizationProps {
  todos: Todo[];
  activeTodoId?: string;
  onStarClick?: (todoId: string) => void;
  settings?: AppSettings;
}

const DEFAULT_SETTINGS: AppSettings = {
  starBrightness: 65,
  glowIntensity: 42,
  connectionLines: true,
  nebulaEffects: true,
  animationSpeed: 42,
};

export const StarVisualization: React.FC<StarVisualizationProps> = ({
  todos,
  activeTodoId,
  onStarClick,
  settings = DEFAULT_SETTINGS,
}) => {
  // Convert 0-100 settings to usable CSS values
  const starOpacity = 0.3 + (settings.starBrightness / 100) * 0.7;        // 0.3 – 1.0
  const glowPx = Math.round((settings.glowIntensity / 100) * 40);          // 0 – 40px
  const transitionMs = Math.round(1000 - (settings.animationSpeed / 100) * 800); // 1000 – 200ms

  const getStarPosition = (index: number, total: number) => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const angle = index * goldenAngle;
    const radius = Math.sqrt(index / total) * 40 + 5;
    return {
      x: `${50 + radius * Math.cos(angle)}%`,
      y: `${50 + radius * Math.sin(angle)}%`,
    };
  };

  const getPriorityClasses = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':   return { size: 'w-5 h-5', bg: 'bg-primary' };
      case 'medium': return { size: 'w-4 h-4', bg: 'bg-secondary' };
      case 'low':    return { size: 'w-3 h-3', bg: 'bg-tertiary' };
      default:       return { size: 'w-4 h-4', bg: 'bg-primary' };
    }
  };

  const glowColor: Record<Todo['priority'], string> = {
    high:   `rgba(204,198,180,${settings.glowIntensity / 100})`,
    medium: `rgba(189,194,255,${settings.glowIntensity / 100})`,
    low:    `rgba(216,187,244,${settings.glowIntensity / 100})`,
  };

  if (todos.length === 0) {
    return (
      <div className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-gradient-to-br from-surface to-background overflow-hidden">
        {settings.nebulaEffects && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        )}
        <p className="text-secondary font-label uppercase tracking-widest text-sm opacity-60 relative z-10">
          The cosmos is quiet. No active tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-surface to-background overflow-hidden">
      {settings.nebulaEffects && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      )}

      {/* Connection lines */}
      {settings.connectionLines && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: starOpacity * 0.3 }}
          stroke="currentColor"
        >
          {todos.map((todo, index) => {
            if (index === 0) return null;
            const prev = getStarPosition(index - 1, todos.length);
            const curr = getStarPosition(index, todos.length);
            return (
              <line
                key={`line-${todo._id}`}
                className="text-primary"
                strokeDasharray="4"
                x1={prev.x} y1={prev.y}
                x2={curr.x} y2={curr.y}
              />
            );
          })}
        </svg>
      )}

      {/* Stars */}
      {todos.map((todo, index) => {
        const position = getStarPosition(index, todos.length);
        const { size, bg } = getPriorityClasses(todo.priority);
        const isActive = todo._id === activeTodoId;
        const isCompleted = todo.completed;
        const glow = `0 0 ${glowPx}px ${glowPx / 2}px ${glowColor[todo.priority]}`;

        return (
          <div
            key={todo._id}
            data-todo-id={todo._id}
            className={`absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
            style={{
              left: position.x,
              top: position.y,
              opacity: isCompleted ? starOpacity * 0.5 : starOpacity,
              transition: `all ${transitionMs}ms ease`,
            }}
            onClick={() => onStarClick?.(todo._id)}
          >
            <div className="flex items-center gap-4">
              <div
                data-id={todo._id}
                data-priority={todo.priority}
                className={`rounded-full group-hover:scale-150 ${size} ${isActive ? 'bg-primary star-glow' : bg}`}
                style={{
                  boxShadow: glowPx > 0 ? glow : undefined,
                  transition: `transform ${transitionMs}ms ease, box-shadow ${transitionMs}ms ease`,
                }}
              />
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
