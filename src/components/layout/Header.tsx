import { Search, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TutorialWidget } from '@/components/TutorialWidget';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const roles: { value: UserRole; label: string }[] = [
    { value: 'hr', label: 'HR Manager' },
    { value: 'manager', label: 'Department Manager' },
    { value: 'employee', label: 'Employee' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/20 bg-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/10">
      <div className="flex h-full items-center justify-between px-4 md:px-6 lg:px-8 gap-4 mx-auto max-w-7xl">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden text-[#1b1833] hover:bg-white/20"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1b1833]/60" />
            <Input
              placeholder="Search candidates, employees..."
              className="pl-10 bg-white/40 border-0 focus-visible:ring-1 text-[#1b1833] placeholder:text-[#1b1833]/60"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Role switcher (demo only) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-[#1b1833] hover:bg-white/20">
                <Badge variant="secondary" className="capitalize bg-white/40 text-[#1b1833]">
                  {user?.role}
                </Badge>
                <span className="hidden md:inline">View as</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map((role) => (
                <DropdownMenuItem
                  key={role.value}
                  onClick={() => switchRole(role.value)}
                  className={user?.role === role.value ? 'bg-accent' : ''}
                >
                  {role.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tutorial Widget */}
          <TutorialWidget />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-white/20">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-white/40 text-[#1b1833]">
                    {user?.name?.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-[#1b1833]">{user?.name}</p>
                  <p className="text-xs text-[#1b1833]/60">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
