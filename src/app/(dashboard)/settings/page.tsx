
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, UserCircle, Lock, Palette, Bell, Phone, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { mockCountryCodes, CountryCode } from '@/lib/mock-data';

const currentUser = {
  name: 'Admin User',
  email: 'admin@medicore.com',
  avatarUrl: 'https://picsum.photos/seed/admin/80/80',
  phone: '+15551234567',
  role: 'Administrator',
};

const extractPhoneParts = (fullPhoneNumber: string | undefined): { countryCodeKey: string, localNumber: string } => {
    const defaultCountry = mockCountryCodes.find(c => c.code === 'US') || mockCountryCodes[0];
    if (!fullPhoneNumber) return { countryCodeKey: defaultCountry.code, localNumber: '' };

    let matchedCountry = defaultCountry;
    let localNumber = '';
    let longestMatchLength = 0;

    for (const cc of mockCountryCodes) {
        if (fullPhoneNumber.startsWith(cc.dial_code)) {
            if (cc.dial_code.length > longestMatchLength) {
                longestMatchLength = cc.dial_code.length;
                matchedCountry = cc;
                localNumber = fullPhoneNumber.substring(cc.dial_code.length).replace(/[^0-9]/g, '');
            } else if (cc.dial_code.length === longestMatchLength && cc.code === 'US' && matchedCountry.dial_code === '+1' && matchedCountry.code !== 'US') {
                matchedCountry = cc; // Prefer US for +1 if it's ambiguous
                localNumber = fullPhoneNumber.substring(cc.dial_code.length).replace(/[^0-9]/g, '');
            }
        }
    }
    
    if (longestMatchLength === 0) { 
        const numericPhone = fullPhoneNumber.replace(/[^0-9]/g, '');
        const numericDefaultDialCode = defaultCountry.dial_code.replace('+', '');
        if (numericPhone.startsWith(numericDefaultDialCode) && numericPhone.length > numericDefaultDialCode.length) {
            localNumber = numericPhone.substring(numericDefaultDialCode.length);
        } else {
            localNumber = numericPhone; 
        }
    }
    return { countryCodeKey: matchedCountry.code, localNumber };
};


export default function SettingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [profileName, setProfileName] = React.useState(currentUser.name);
    const initialProfilePhoneParts = extractPhoneParts(currentUser.phone);
    const [profileSelectedCountryCode, setProfileSelectedCountryCode] = React.useState(initialProfilePhoneParts.countryCodeKey);
    const [profileLocalPhoneNumber, setProfileLocalPhoneNumber] = React.useState(initialProfilePhoneParts.localNumber);

    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const [theme, setTheme] = React.useState('system');
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [smsNotifications, setSmsNotifications] = React.useState(false);

    const initialOtpPhoneParts = extractPhoneParts(currentUser.phone); 
    const [otpSelectedCountryCode, setOtpSelectedCountryCode] = React.useState(initialOtpPhoneParts.countryCodeKey);
    const [otpLocalPhoneNumber, setOtpLocalPhoneNumber] = React.useState(initialOtpPhoneParts.localNumber);
    const [otpSent, setOtpSent] = React.useState(false);
    const [otp, setOtp] = React.useState('');


    const handleProfileUpdate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const selectedCountry = mockCountryCodes.find(c => c.code === profileSelectedCountryCode);
        const dialCode = selectedCountry ? selectedCountry.dial_code : '';
        const fullProfilePhoneNumber = `${dialCode}${profileLocalPhoneNumber}`;

        const profileData = {
            name: profileName,
            phone: fullProfilePhoneNumber,
        };
        console.log("Profile Update Data:", profileData);
        toast({ title: "Profile Update Submitted", description: "Profile data logged to console." });
    };

    const handlePasswordChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({ variant: "destructive", title: "Password Mismatch", description: "New password and confirmation do not match." });
            return;
        }
        if (!currentPassword || !newPassword) {
            toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all password fields." });
            return;
        }
        const passwordData = { currentPassword, newPassword };
        console.log("Password Change Data:", passwordData);
        toast({ title: "Password Change Submitted", description: "Password change data logged to console." });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handlePreferencesUpdate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const preferencesData = { theme, emailNotifications, smsNotifications };
        console.log("Preferences Update Data:", preferencesData);
        toast({ title: "Preferences Update Submitted", description: "Preferences data logged to console." });
    };

    const handleSendOtp = () => {
        const selectedOtpCountry = mockCountryCodes.find(c => c.code === otpSelectedCountryCode);
        const dialCode = selectedOtpCountry ? selectedOtpCountry.dial_code : '';
        const fullOtpPhoneNumber = `${dialCode}${otpLocalPhoneNumber}`;

        if (!otpLocalPhoneNumber.trim()) {
            toast({ variant: "destructive", title: "Phone Number Required", description: "Please enter phone number for OTP." });
            return;
        }
        console.log("Send OTP to:", fullOtpPhoneNumber);
        toast({ title: "OTP Sent (Simulated)", description: `OTP would be sent to ${fullOtpPhoneNumber}.` });
        setOtpSent(true); // Simulate OTP sent
    };

    const handleVerifyOtp = () => {
        if (!otp.trim()) {
            toast({ variant: "destructive", title: "OTP Required", description: "Please enter the OTP." });
            return;
        }
        const selectedOtpCountry = mockCountryCodes.find(c => c.code === otpSelectedCountryCode);
        const dialCode = selectedOtpCountry ? selectedOtpCountry.dial_code : '';
        const fullOtpPhoneNumber = `${dialCode}${otpLocalPhoneNumber}`;
        
        console.log("Verify OTP Data:", { phoneNumber: fullOtpPhoneNumber, otp });
        // Simulate OTP verification
        if (otp === "123456") { // Example: "123456" is the "correct" OTP for simulation
             toast({ title: "Phone Verified (Simulated)", description: "Phone number verified successfully." });
             setOtpSent(false);
             setOtp('');
        } else {
             toast({ variant: "destructive", title: "Invalid OTP (Simulated)", description: "The OTP entered is incorrect." });
        }
    };

    const handleLogout = () => {
        console.log("Logout Action Triggered");
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
        router.push('/login');
    };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">User Settings</h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
      </div>

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
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="user avatar"/>
                    <AvatarFallback className="text-2xl">{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" type="button">Change Avatar</Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="profileName">Full Name</Label>
                    <Input id="profileName" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileEmail">Email Address</Label>
                    <Input id="profileEmail" type="email" defaultValue={currentUser.email} readOnly disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileLocalPhone">Phone Number (Profile)</Label>
                    <div className="flex gap-2">
                        <Select value={profileSelectedCountryCode} onValueChange={setProfileSelectedCountryCode}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockCountryCodes.map(cc => (
                                    <SelectItem key={`prof-${cc.code}`} value={cc.code}>
                                        {cc.dial_code} ({cc.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input id="profileLocalPhone" type="tel" value={profileLocalPhoneNumber} onChange={(e) => setProfileLocalPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g., 1234567890"/>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileRole">Role</Label>
                    <Input id="profileRole" defaultValue={currentUser.role} readOnly disabled />
                 </div>
             </div>
              <div className="flex justify-end">
                <Button type="submit">
                    Save Profile
                </Button>
              </div>
           </form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10">
           <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">Contact Verification</CardTitle>
           </div>
           <CardDescription className="pt-1 text-muted-foreground">Verify your phone number to enhance account security.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
           <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="otpLocalPhoneNumber">Phone Number (for OTP)</Label>
                    <div className="flex gap-2 items-start">
                         <Select value={otpSelectedCountryCode} onValueChange={setOtpSelectedCountryCode} disabled={otpSent}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockCountryCodes.map(cc => (
                                    <SelectItem key={`otp-${cc.code}`} value={cc.code}>
                                        {cc.dial_code} ({cc.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            id="otpLocalPhoneNumber"
                            type="tel"
                            placeholder="e.g., 1234567890"
                            value={otpLocalPhoneNumber}
                            onChange={(e) => setOtpLocalPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            disabled={otpSent}
                            className="flex-1"
                        />
                        <Button onClick={handleSendOtp} disabled={!otpLocalPhoneNumber.trim() || otpSent} className="whitespace-nowrap">
                            {otpSent ? "Resend OTP" : "Send OTP"}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        We&apos;ll send an OTP to this number for verification.
                    </p>
                </div>

                {otpSent && (
                    <div className="space-y-2 border-t pt-4 mt-4">
                         <Label htmlFor="otp">Enter OTP</Label>
                         <div className="flex gap-2 items-start">
                            <Input
                                id="otp"
                                type="text"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <Button onClick={handleVerifyOtp} disabled={otp.length !== 6} className="whitespace-nowrap">
                                Verify OTP
                            </Button>
                        </div>
                         <p className="text-xs text-muted-foreground">
                           Check your phone for the One-Time Password. (Use 123456 for simulation)
                         </p>
                    </div>
                )}
           </div>
        </CardContent>
      </Card>

      <Separator />

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
                <Button type="submit">
                    Change Password
                </Button>
            </div>
           </form>
        </CardContent>
      </Card>

      <Separator />

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
                    <Button type="submit">
                        Save Preferences
                    </Button>
                </div>
             </form>
        </CardContent>
      </Card>
    </div>
  );
}
    
