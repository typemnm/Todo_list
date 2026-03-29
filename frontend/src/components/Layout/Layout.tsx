import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <Header />
      <Sidebar />
      <main className="md:ml-64 pt-20 pb-24 md:pb-8 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}