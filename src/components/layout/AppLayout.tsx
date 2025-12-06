import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import GradientBackground from '@/components/GradientBackground';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <GradientBackground />
      <div className="relative z-10 min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className={cn(
          'fixed md:relative left-0 top-0 z-40 h-screen transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0 md:w-16'
        )}>
          <Sidebar onToggle={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col w-full md:w-auto">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
