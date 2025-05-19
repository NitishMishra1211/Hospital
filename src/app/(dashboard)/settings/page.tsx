
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
    
    if (longestMatchLength === 0) { // If no dial code prefix matched
        const numericPhone = fullPhoneNumber.replace(/[^0-9]/g, '');
        const numericDefaultDialCode = defaultCountry.dial_code.replace('+', '');
        if (numericPhone.startsWith(numericDefaultDialCode) && numericPhone.length > numericDefaultDialCode.length) {
            localNumber = numericPhone.substring(numericDefaultDialCode.length);
        } else {
            localNumber = numericPhone; // Assume it's a local number for the default country
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
    const [isProfileLoading, setIsProfileLoading] = React.useState(false);

    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isPasswordLoading, setIsPasswordLoading] = React.useState(false);

    const [theme, setTheme] = React.useState('system');
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [smsNotifications, setSmsNotifications] = React.useState(false);
    const [isPreferencesLoading, setIsPreferencesLoading] = React.useState(false);

    const initialOtpPhoneParts = extractPhoneParts(currentUser.phone); 
    const [otpSelectedCountryCode, setOtpSelectedCountryCode] = React.useState(initialOtpPhoneParts.countryCodeKey);
    const [otpLocalPhoneNumber, setOtpLocalPhoneNumber] = React.useState(initialOtpPhoneParts.localNumber);
    const [otpSent, setOtpSent] = React.useState(false);
    const [otp, setOtp] = React.useState('');
    const [isSendingOtp, setIsSendingOtp] = React.useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = React.useState(false);


    const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsProfileLoading(true);
        const selectedCountry = mockCountryCodes.find(c => c.code === profileSelectedCountryCode);
        const dialCode = selectedCountry ? selectedCountry.dial_code : '';
        const fullProfilePhoneNumber = `${dialCode}${profileLocalPhoneNumber}`;

        const profileData = {
            name: profileName,
            phone: fullProfilePhoneNumber,
        };

        try {
            const response = await fetch('/api/user/profile', { // Replace with your actual endpoint
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });
            const data = await response.json();
            if (response.ok) {
                toast({ title: "Profile Updated", description: data.message || "Your profile has been saved." });
            } else {
                toast({ variant: "destructive", title: "Update Failed", description: data.message || "Could not update profile." });
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({ variant: "destructive", title: "Password Mismatch", description: "New password and confirmation do not match." });
            return;
        }
        if (!currentPassword || !newPassword) {
            toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all password fields." });
            return;
        }
        setIsPasswordLoading(true);
        try {
            const response = await fetch('/api/user/change-password', { // Replace with your actual endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                toast({ title: "Password Changed", description: data.message || "Password updated successfully." });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast({ variant: "destructive", title: "Change Failed", description: data.message || "Could not change password." });
            }
        } catch (error) {
            console.error("Password change error:", error);
            toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handlePreferencesUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPreferencesLoading(true);
        const preferencesData = { theme, emailNotifications, smsNotifications };
        try {
            const response = await fetch('/api/user/preferences', { // Replace with your actual endpoint
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferencesData),
            });
            const data = await response.json();
            if (response.ok) {
                toast({ title: "Preferences Saved", description: data.message || "Your preferences have been updated." });
            } else {
                toast({ variant: "destructive", title: "Save Failed", description: data.message || "Could not save preferences." });
            }
        } catch (error) {
            console.error("Preferences update error:", error);
            toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
        } finally {
            setIsPreferencesLoading(false);
        }
    };

    const handleSendOtp = async () => {
        const selectedOtpCountry = mockCountryCodes.find(c => c.code === otpSelectedCountryCode);
        const dialCode = selectedOtpCountry ? selectedOtpCountry.dial_code : '';
        const fullOtpPhoneNumber = `${dialCode}${otpLocalPhoneNumber}`;

        if (!otpLocalPhoneNumber.trim()) {
            toast({ variant: "destructive", title: "Phone Number Required", description: "Please enter phone number for OTP." });
            return;
        }
        setIsSendingOtp(true);
        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: fullOtpPhoneNumber }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                toast({ title: "OTP Sent", description: data.message || "OTP sent to your phone." });
                setOtpSent(true);
            } else {
                toast({ variant: "destructive", title: "Failed to Send OTP", description: data.message || "An error occurred." });
                setOtpSent(false);
            }
        } catch (error) {
             console.error("Send OTP error:", error);
            toast({ variant: "destructive", title: "Network Error", description: "Could not reach server for OTP." });
            setOtpSent(false);
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            toast({ variant: "destructive", title: "OTP Required", description: "Please enter the OTP." });
            return;
        }
        setIsVerifyingOtp(true);
        const selectedOtpCountry = mockCountryCodes.find(c => c.code === otpSelectedCountryCode);
        const dialCode = selectedOtpCountry ? selectedOtpCountry.dial_code : '';
        const fullOtpPhoneNumber = `${dialCode}${otpLocalPhoneNumber}`;
        
        try {
            // Replace with your actual OTP verification endpoint
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: fullOtpPhoneNumber, otp }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                 toast({ title: "Phone Verified", description: data.message || "Phone number verified successfully." });
                 setOtpSent(false);
                 setOtp('');
                 // Potentially update user profile state to reflect verification
            } else {
                 toast({ variant: "destructive", title: "Invalid OTP", description: data.message || "The OTP entered is incorrect." });
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            toast({ variant: "destructive", title: "Verification Error", description: "An error occurred during verification." });
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleLogout = async () => {
        setIsLogoutLoading(true);
        try {
            // Replace with your actual logout endpoint if necessary (e.g., to invalidate a server session)
            // For client-side token clearing, this might not need an API call.
            // const response = await fetch('/api/auth/logout', { method: 'POST' });
            // if (response.ok) {
                toast({ title: "Logged Out", description: "You have been successfully logged out." });
                // Clear any client-side authentication tokens/state here
                router.push('/login');
            // } else {
            //     const data = await response.json();
            //     toast({ variant: "destructive", title: "Logout Failed", description: data.message || "Could not log out." });
            // }
        } catch (error) {
            console.error("Logout error:", error);
            toast({ variant: "destructive", title: "Logout Error", description: "An unexpected error occurred." });
        } finally {
            setIsLogoutLoading(false);
        }
    };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">User Settings</h1>
        </div>
        <Button variant="outline" onClick={handleLogout} disabled={isLogoutLoading}>
            {isLogoutLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
               <LogOut className="mr-2 h-4 w-4" />
            )}
            {isLogoutLoading ? 'Logging out...' : 'Logout'}
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
                <Button variant="outline" size="sm" type="button" disabled={isProfileLoading}>Change Avatar</Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="profileName">Full Name</Label>
                    <Input id="profileName" value={profileName} onChange={(e) => setProfileName(e.target.value)} disabled={isProfileLoading} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileEmail">Email Address</Label>
                    <Input id="profileEmail" type="email" defaultValue={currentUser.email} readOnly disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileLocalPhone">Phone Number (Profile)</Label>
                    <div className="flex gap-2">
                        <Select value={profileSelectedCountryCode} onValueChange={setProfileSelectedCountryCode} disabled={isProfileLoading}>
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
                        <Input id="profileLocalPhone" type="tel" value={profileLocalPhoneNumber} onChange={(e) => setProfileLocalPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g., 1234567890" disabled={isProfileLoading}/>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileRole">Role</Label>
                    <Input id="profileRole" defaultValue={currentUser.role} readOnly disabled />
                 </div>
             </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isProfileLoading}>
                 {isProfileLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                    {isProfileLoading ? 'Saving...' : 'Save Profile'}
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
                         <Select value={otpSelectedCountryCode} onValueChange={setOtpSelectedCountryCode} disabled={otpSent || isSendingOtp}>
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
                            disabled={otpSent || isSendingOtp}
                            className="flex-1"
                        />
                        <Button onClick={handleSendOtp} disabled={isSendingOtp || !otpLocalPhoneNumber.trim() || otpSent} className="whitespace-nowrap">
                            {isSendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
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
                                disabled={isVerifyingOtp}
                            />
                            <Button onClick={handleVerifyOtp} disabled={isVerifyingOtp || otp.length !== 6} className="whitespace-nowrap">
                                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                            </Button>
                        </div>
                         <p className="text-xs text-muted-foreground">
                           Check your phone for the One-Time Password.
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
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required disabled={isPasswordLoading} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={isPasswordLoading} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isPasswordLoading} />
            </div>
            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isPasswordLoading}>
                    {isPasswordLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                    {isPasswordLoading ? 'Changing...' : 'Change Password'}
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
                     <Select value={theme} onValueChange={setTheme} disabled={isPreferencesLoading}>
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
                         disabled={isPreferencesLoading}
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
                         disabled={isPreferencesLoading}
                       />
                     </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isPreferencesLoading}>
                        {isPreferencesLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : null}
                        {isPreferencesLoading ? 'Saving...' : 'Save Preferences'}
                    </Button>
                </div>
             </form>
        </CardContent>
      </Card>
    </div>
  );
}
    