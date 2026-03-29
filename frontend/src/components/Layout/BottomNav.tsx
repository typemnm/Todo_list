import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: 'auto_awesome', label: 'Map' },
    { to: '/list', icon: 'list_alt', label: 'List' },
    { to: '/add', icon: 'add_circle', label: 'Entry' },
    { to: '/settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-6 pb-6 pt-2 bg-background/80 backdrop-blur-2xl border-t border-outline-variant/15 rounded-t-[32px]"
      aria-label="Bottom navigation"
    >
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-3 transition-all ${
              isActive
                ? 'bg-primary text-on-primary rounded-full shadow-star-glow'
                : 'text-on-surface/40 hover:text-primary'
            }`
          }
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span className="font-label text-[10px] font-bold">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}