import { useState } from 'react';
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
  Sparkles,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['hr', 'manager', 'employee'] },
  { name: 'Candidates', href: '/candidates', icon: UserPlus, roles: ['hr', 'manager'] },
  { name: 'Interviews', href: '/interviews', icon: Calendar, roles: ['hr', 'manager'] },
  { name: 'Employees', href: '/employees', icon: Users, roles: ['hr', 'manager', 'employee'] },
  { name: 'Onboarding', href: '/onboarding', icon: ClipboardCheck, roles: ['hr', 'manager'] },
  { name: 'Offboarding', href: '/offboarding', icon: LogOutIcon, roles: ['hr'] },
  { name: 'Documents', href: '/documents', icon: FileText, roles: ['hr', 'manager', 'employee'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['hr', 'manager'] },
];

interface SidebarProps {
  onToggle?: () => void;
}

export function Sidebar({ onToggle }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNav = navigation.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleToggle = () => {
    setCollapsed(!collapsed);
    onToggle?.();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white/10 backdrop-blur-md transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/20">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-white">
              SmartHire
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="text-white hover:bg-white/20"
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
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.href;
          const NavItem = (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-white',
                isActive
                  ? 'bg-white/30'
                  : 'hover:bg-white/20'
              )}
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
      </nav>

      {/* User section */}
      <div className="border-t border-white/20 p-4">
        {user && (
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-white/30 text-white">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-white/70 capitalize">
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
