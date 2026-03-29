export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-background/60 backdrop-blur-xl bg-gradient-to-b from-surface-container-low to-transparent">
      <div className="text-xl font-bold tracking-tighter text-primary drop-shadow-[0_0_8px_rgba(204,198,180,0.3)] font-headline">
        Stellar Observer
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-surface-container-highest/20 transition-all text-primary">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
        <button className="p-2 rounded-full hover:bg-surface-container-highest/20 transition-all text-primary">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </header>
  );
}