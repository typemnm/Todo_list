import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout, isLoading } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-background/60 backdrop-blur-xl bg-gradient-to-b from-surface-container-low to-transparent">
      <Link
        to="/"
        className="text-xl font-bold tracking-tighter text-primary drop-shadow-[0_0_8px_rgba(204,198,180,0.3)] font-headline"
      >
        Stellar Observer
      </Link>
      <div className="flex items-center gap-4">
        {isLoading ? (
          <div className="h-3 w-32 rounded-full bg-on-surface-variant/20 animate-pulse hidden sm:block" />
        ) : user ? (
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hidden sm:block">
            {user.email}
          </span>
        ) : null}
        <Link
          to="/settings"
          className="p-2 rounded-full hover:bg-surface-container-highest/20 transition-all text-primary"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-surface-container-highest/20 transition-all text-primary"
          aria-label="Logout"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </header>
  );
}
