import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Bell, Lock, Palette } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    newCandidates: true,
  });
  const [theme, setTheme] = useState('light');

  const handleSaveProfile = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile changes have been saved.',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Preferences updated',
      description: 'Your notification preferences have been saved.',
    });
  };

  const handleSaveTheme = () => {
    toast({
      title: 'Theme updated',
      description: `Theme changed to ${theme}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#3B1E54] flex items-center gap-2">
          <SettingsIcon className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-slate-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'profile'
              ? 'text-[#3B1E54] border-b-2 border-[#3B1E54]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'notifications'
              ? 'text-[#3B1E54] border-b-2 border-[#3B1E54]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'theme'
              ? 'text-[#3B1E54] border-b-2 border-[#3B1E54]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Theme
        </button>
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={user?.role || ''}
                disabled
                className="bg-slate-100"
              />
              <p className="text-sm text-slate-500">Role cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={user?.department || ''}
                disabled
                className="bg-slate-100"
              />
            </div>

            <Button onClick={handleSaveProfile} className="w-full bg-[#3B1E54] hover:bg-[#5a2d7a]">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Control how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Email Notifications</p>
                <p className="text-sm text-slate-600">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, emailNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Push Notifications</p>
                <p className="text-sm text-slate-600">Receive browser notifications</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, pushNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Weekly Report</p>
                <p className="text-sm text-slate-600">Get weekly summary reports</p>
              </div>
              <Switch
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, weeklyReport: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">New Candidates</p>
                <p className="text-sm text-slate-600">Notify about new candidates</p>
              </div>
              <Switch
                checked={notifications.newCandidates}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, newCandidates: checked })
                }
              />
            </div>

            <Button onClick={handleSaveNotifications} className="w-full bg-[#3B1E54] hover:bg-[#5a2d7a]">
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Theme Settings */}
      {activeTab === 'theme' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme Settings
            </CardTitle>
            <CardDescription>Customize your interface appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="light"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-4 h-4"
                />
                <label htmlFor="light" className="flex-1 cursor-pointer">
                  <p className="font-medium text-slate-900">Light Theme</p>
                  <p className="text-sm text-slate-600">Bright and clean interface</p>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="dark"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-4 h-4"
                />
                <label htmlFor="dark" className="flex-1 cursor-pointer">
                  <p className="font-medium text-slate-900">Dark Theme</p>
                  <p className="text-sm text-slate-600">Easy on the eyes</p>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="auto"
                  name="theme"
                  value="auto"
                  checked={theme === 'auto'}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-4 h-4"
                />
                <label htmlFor="auto" className="flex-1 cursor-pointer">
                  <p className="font-medium text-slate-900">Auto (System)</p>
                  <p className="text-sm text-slate-600">Follow system preferences</p>
                </label>
              </div>
            </div>

            <Button onClick={handleSaveTheme} className="w-full bg-[#3B1E54] hover:bg-[#5a2d7a]">
              Apply Theme
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
