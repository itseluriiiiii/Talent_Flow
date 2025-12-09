import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import GradientBackground from '@/components/GradientBackground';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when navigating
  const handleNavigation = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <GradientBackground />
      <div className="relative z-10 h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={cn(
          'fixed md:relative left-0 top-0 z-40 h-screen transition-all duration-300 ease-out',
          isMobile
            ? sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            : 'translate-x-0'
        )}>
          <Sidebar 
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            onNavigate={handleNavigation}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col w-full min-h-0">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
