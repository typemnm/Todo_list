import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: 'auto_awesome', label: 'Home' },
    { to: '/list', icon: 'list_alt', label: 'List' },
    { to: '/settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <aside 
      className="hidden md:flex fixed left-0 top-0 h-full flex-col pt-20 pb-8 bg-background w-64 border-r border-outline-variant/15 z-40"
      aria-label="Sidebar navigation"
    >
      <div className="px-6 mb-10">
        <h2 className="text-lg font-black text-primary font-headline">Celestial Tracker</h2>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface/40">
          Mapping the Infinite
        </p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 font-label text-xs uppercase tracking-widest transition-transform duration-300 hover:translate-x-1 ${
                isActive
                  ? 'bg-surface-container-highest text-primary rounded-full mx-2'
                  : 'text-on-surface/60 hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto">
        <NavLink
          to="/add"
          className="w-full py-3 px-4 bg-primary text-on-primary rounded-full font-label text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-star-glow"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Place New Star
        </NavLink>
      </div>
    </aside>
  );
}