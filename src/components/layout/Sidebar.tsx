import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  ClipboardCheck,
  LogOut as LogOutIcon,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  Briefcase,
  Building2,
  Home,
  MessageSquare,
  Plus,
  LogIn,
  Trash2,
  Menu,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const mainNavigation = [
  { name: 'Dashboard', href: '/', icon: Home, roles: ['hr', 'manager', 'employee'] },
  { name: 'Candidates', href: '/candidates', icon: UserPlus, roles: ['hr', 'manager'] },
  { name: 'Interviews', href: '/interviews', icon: Calendar, roles: ['hr', 'manager'] },
  { name: 'Employees', href: '/employees', icon: Users, roles: ['hr', 'manager', 'employee'] },
];

const workflowNavigation = [
  { name: 'Onboarding', href: '/onboarding', icon: ClipboardCheck, roles: ['hr', 'manager'] },
  { name: 'Offboarding', href: '/offboarding', icon: LogOutIcon, roles: ['hr'] },
];

const otherNavigation = [
  { name: 'Documents', href: '/documents', icon: FileText, roles: ['hr', 'manager', 'employee'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['hr', 'manager'] },
  { name: 'Tutorial', href: '/tutorial', icon: BookOpen, roles: ['hr', 'manager', 'employee'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['hr', 'manager', 'employee'] },
];

interface SidebarProps {
  onToggle?: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ onToggle, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Detect mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const allNavigation = [...mainNavigation, ...workflowNavigation, ...otherNavigation];
  
  const filteredNav = allNavigation.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleToggle = () => {
    setCollapsed(!collapsed);
    onToggle?.();
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <aside
      className={cn(
        'h-screen backdrop-blur-xl transition-all duration-300 ease-out flex flex-col rounded-2xl border m-2 md:m-3',
        'w-64 md:w-64',
        collapsed && 'md:w-20'
      )}
      style={{
        backgroundColor: '#CDC1FF',
        borderColor: '#3B1E54'
      }}
    >
      {/* Logo Header */}
      <div className="flex h-16 items-center justify-between px-4 rounded-t-2xl" style={{ borderBottomColor: '#3B1E54', borderBottomWidth: '1px' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg" style={{ color: '#3B1E54' }}>
              TalentFlow
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="md:flex hidden"
          style={{ color: '#3B1E54' }}
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform',
              collapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3B1E54 transparent' }}>
        <style>{`
          nav::-webkit-scrollbar {
            width: 6px;
          }
          nav::-webkit-scrollbar-track {
            background: transparent;
          }
          nav::-webkit-scrollbar-thumb {
            background: #3B1E54;
            border-radius: 3px;
          }
          nav::-webkit-scrollbar-thumb:hover {
            background: #5a2d7a;
          }
        `}</style>
        {/* Main Navigation */}
        <div className="space-y-1">
          {!collapsed && <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3" style={{ color: '#3B1E54' }}>Menu</p>}
          {filteredNav.filter(item => mainNavigation.find(m => m.href === item.href)).map((item) => {
            const isActive = location.pathname === item.href;
            const NavItem = (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'border-2'
                    : 'hover:bg-black/5'
                )}
                style={{
                  backgroundColor: 'transparent',
                  color: '#3B1E54',
                  borderColor: isActive ? '#3B1E54' : 'transparent',
                  borderWidth: '2px'
                }}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              );
            }
            return NavItem;
          })}
        </div>

        {/* Workflow Section */}
        {!collapsed && (
          <Collapsible defaultOpen className="space-y-2 mt-6">
            <CollapsibleTrigger className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors" style={{ color: '#3B1E54' }}>
              <span>Workflows</span>
              <ChevronLeft className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {filteredNav.filter(item => workflowNavigation.find(w => w.href === item.href)).map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive ? 'border-2' : 'hover:bg-black/5'
                    )}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#3B1E54',
                      borderColor: isActive ? '#3B1E54' : 'transparent',
                      borderWidth: '2px'
                    }}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Other Navigation */}
        {!collapsed && (
          <div className="space-y-1 mt-6 pt-6" style={{ borderTopColor: '#3B1E54', borderTopWidth: '1px' }}>
            <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3" style={{ color: '#3B1E54' }}>Other</p>
            {filteredNav.filter(item => otherNavigation.find(o => o.href === item.href)).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive ? 'border-2' : 'hover:bg-black/5'
                  )}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#3B1E54',
                    borderColor: isActive ? '#3B1E54' : 'transparent',
                    borderWidth: '2px'
                  }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Icon Navigation for Collapsed State */}
      {collapsed && (
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto" style={{ borderTopColor: '#3B1E54', borderTopWidth: '1px', scrollbarWidth: 'thin', scrollbarColor: '#3B1E54 transparent' }}>
          <style>{`
            nav::-webkit-scrollbar {
              width: 6px;
            }
            nav::-webkit-scrollbar-track {
              background: transparent;
            }
            nav::-webkit-scrollbar-thumb {
              background: #3B1E54;
              border-radius: 3px;
            }
            nav::-webkit-scrollbar-thumb:hover {
              background: #5a2d7a;
            }
          `}</style>
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-lg transition-all',
                      isActive ? 'border-2' : 'hover:bg-black/5'
                    )}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#3B1E54',
                      borderColor: isActive ? '#3B1E54' : 'transparent',
                      borderWidth: '2px'
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      )}

      {/* User section */}
      <div className="p-4 rounded-b-2xl" style={{ borderTopColor: '#3B1E54', borderTopWidth: '1px' }}>
        {user && (
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <Avatar className="h-9 w-9" style={{ borderColor: '#3B1E54', borderWidth: '2px' }}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#3B1E54' }}>
                  {user.name}
                </p>
                <p className="text-xs capitalize" style={{ color: '#3B1E54' }}>
                  {user.role}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
