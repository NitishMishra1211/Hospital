
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, UserCircle, Lock, Palette, Bell } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Mock user data (in a real app, this would come from auth state/API)
const currentUser = {
  name: 'Admin User',
  email: 'admin@medicore.com',
  avatarUrl: 'https://picsum.photos/seed/admin/80/80', // Larger avatar for settings
  phone: '555-000-1111', // Example phone
  role: 'Administrator',
};

export default function SettingsPage() {
    const { toast } = useToast();
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    // State for preferences (example)
    const [theme, setTheme] = React.useState('system'); // 'light', 'dark', 'system'
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [smsNotifications, setSmsNotifications] = React.useState(false);


    const handleProfileUpdate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Simulate profile update
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved (simulation).",
        });
    };

    const handlePasswordChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Password Mismatch",
                description: "New password and confirmation password do not match.",
            });
            return;
        }
         if (!currentPassword || !newPassword) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please fill in current and new password fields.",
            });
            return;
        }
        // Simulate password change
         toast({
            title: "Password Changed",
            description: "Your password has been updated successfully (simulation).",
        });
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

     const handlePreferencesUpdate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Simulate preferences update
        toast({
            title: "Preferences Saved",
            description: "Your preferences have been updated (simulation).",
        });
    };


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">User Settings</h1>
      </div>

      {/* Profile Information Section */}
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10">
           <div className="flex items-center gap-3">
                <UserCircle className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
           </div>
           <CardDescription className="pt-1 text-muted-foreground">Manage your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
           <form onSubmit={handleProfileUpdate} className="space-y-6">
             <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-primary">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback className="text-2xl">{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Change Avatar</Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="profileName">Full Name</Label>
                    <Input id="profileName" defaultValue={currentUser.name} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileEmail">Email Address</Label>
                    <Input id="profileEmail" type="email" defaultValue={currentUser.email} readOnly disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="profilePhone">Phone Number</Label>
                    <Input id="profilePhone" type="tel" defaultValue={currentUser.phone} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileRole">Role</Label>
                    <Input id="profileRole" defaultValue={currentUser.role} readOnly disabled />
                 </div>
             </div>
              <div className="flex justify-end">
                <Button type="submit">Save Profile</Button>
              </div>
           </form>
        </CardContent>
      </Card>

        <Separator />

        {/* Account Settings Section */}
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10">
             <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">Account Settings</CardTitle>
           </div>
           <CardDescription className="pt-1 text-muted-foreground">Manage your password and security.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
           <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div className="flex justify-end pt-2">
                <Button type="submit">Change Password</Button>
            </div>
           </form>
        </CardContent>
      </Card>

      <Separator />

       {/* Preferences Section */}
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10">
             <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">Preferences</CardTitle>
           </div>
           <CardDescription className="pt-1 text-muted-foreground">Customize your application experience.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
             <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                {/* Theme Preference */}
                <div className="space-y-2">
                    <Label htmlFor="themeSelect">Theme</Label>
                     <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="themeSelect" className="w-full md:w-1/2 lg:w-1/3">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Notification Preferences */}
                <div className="space-y-4 border-t pt-6">
                     <div className="flex items-center justify-between">
                       <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                         <span>Email Notifications</span>
                         <span className="font-normal leading-snug text-muted-foreground">
                           Receive important updates via email.
                         </span>
                       </Label>
                       <Switch
                         id="emailNotifications"
                         checked={emailNotifications}
                         onCheckedChange={setEmailNotifications}
                       />
                     </div>
                     <div className="flex items-center justify-between">
                       <Label htmlFor="smsNotifications" className="flex flex-col space-y-1">
                         <span>SMS Notifications</span>
                          <span className="font-normal leading-snug text-muted-foreground">
                           Receive critical alerts via SMS (if applicable).
                         </span>
                       </Label>
                       <Switch
                         id="smsNotifications"
                         checked={smsNotifications}
                         onCheckedChange={setSmsNotifications}
                       />
                     </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button type="submit">Save Preferences</Button>
                </div>
             </form>
        </CardContent>
      </Card>


    </div>
  );
}
