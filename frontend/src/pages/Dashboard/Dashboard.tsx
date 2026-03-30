import { Link } from 'react-router-dom';
import { useTodos } from '../../hooks/useTodos';
import { useSettings } from '../../hooks/useSettings';
import { Layout } from '../../components/Layout';
import { StarVisualization } from '../../components/StarVisualization';

export default function Dashboard() {
  const { todos, isLoading, error } = useTodos();
  const { settings } = useSettings();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full min-h-[500px]">
          <div data-testid="loading-spinner" className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full min-h-[500px] text-error p-8 text-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Communication Error</h2>
            <p>{error.message || 'Failed to fetch'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;

  const recentActivity = totalCount > 0
    ? `Tracking ${totalCount} celestial bodies. ${completedCount} objectives achieved.`
    : null;

  return (
    <Layout>
      <section className="px-8 md:px-12 py-8 relative z-10 flex justify-between items-end">
        <div>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">Your Stellar Map</h1>
          <p className="text-secondary font-label tracking-widest uppercase text-xs opacity-80">Navigate through your active objectives</p>
        </div>
      </section>

      <section className="relative w-full h-[50vh] md:h-[60vh] min-h-[400px]">
        <StarVisualization todos={todos} settings={settings} />
      </section>

      <section className="px-8 md:px-12 pb-24 md:pb-12 mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">rocket_launch</span>
              <h3 className="font-headline font-bold text-on-surface">Total Stars</h3>
            </div>
            <span className="text-3xl font-headline font-bold text-primary">{totalCount}</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-success">task_alt</span>
              <h3 className="font-headline font-bold text-on-surface">Completed</h3>
            </div>
            <span className="text-3xl font-headline font-bold text-success">{completedCount}</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary">pending</span>
              <h3 className="font-headline font-bold text-on-surface">Pending</h3>
            </div>
            <span className="text-3xl font-headline font-bold text-secondary">{pendingCount}</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-tertiary">notifications_active</span>
            <h3 className="font-headline font-bold text-on-surface">Celestial Events</h3>
          </div>
          <p className="text-sm text-on-surface-variant/70 leading-relaxed">
            {recentActivity || 'No recent stellar activity detected.'}
          </p>
        </div>
      </section>

      <Link
        to="/add"
        aria-label="add"
        className="fixed bottom-[100px] md:bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(204,198,180,0.3)] hover:scale-105 transition-transform duration-300 z-50"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </Layout>
  );
}
