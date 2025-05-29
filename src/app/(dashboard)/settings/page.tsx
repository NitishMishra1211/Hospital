
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


interface CurrentUserData {
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  role?: string;
}

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
                matchedCountry = cc;
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
    
    const [currentUser, setCurrentUser] = React.useState<CurrentUserData>({
        name: 'Admin User',
        email: 'admin@medicore.com',
        avatarUrl: 'https://picsum.photos/seed/admin/80/80',
        phone: '+15551234567',
        role: 'Administrator',
    });

    const [profileName, setProfileName] = React.useState(currentUser.name);
    const [profileEmail, setProfileEmail] = React.useState(currentUser.email); // For display
    const [profileRole, setProfileRole] = React.useState(currentUser.role); // For display

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
    const [isLoading, setIsLoading] = React.useState({
        profile: false,
        password: false,
        preferences: false,
        otp: false,
        logout: false, // Added logout loading state
    });

    React.useEffect(() => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const updatedCurrentUser = {
                name: parsedUser.username || 'Admin User',
                email: parsedUser.email || 'admin@medicore.com',
                avatarUrl: `https://placehold.co/80x80.png?text=${(parsedUser.username || 'AU').charAt(0)}`,
                phone: currentUser.phone, 
                role: parsedUser.role || 'User', 
            };
            setCurrentUser(updatedCurrentUser);
            setProfileName(updatedCurrentUser.name);
            setProfileEmail(updatedCurrentUser.email);
            setProfileRole(updatedCurrentUser.role);
            
            const phoneParts = extractPhoneParts(updatedCurrentUser.phone);
            setProfileSelectedCountryCode(phoneParts.countryCodeKey);
            setProfileLocalPhoneNumber(phoneParts.localNumber);
            setOtpSelectedCountryCode(phoneParts.countryCodeKey);
            setOtpLocalPhoneNumber(phoneParts.localNumber);

          } catch (e) {
            console.error("Failed to parse user data from localStorage for settings", e);
          }
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(prev => ({...prev, profile: true}));
        const selectedCountry = mockCountryCodes.find(c => c.code === profileSelectedCountryCode);
        const dialCode = selectedCountry ? selectedCountry.dial_code : '';
        const fullProfilePhoneNumber = `${dialCode}${profileLocalPhoneNumber}`;

        const profileData = {
            name: profileName,
            phone: fullProfilePhoneNumber,
            // Include other relevant profile fields if your API supports them
        };
        
        try {
            // Replace with your actual API endpoint for updating profile
            const response = await fetch('/api/user/profile', { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData) 
            });

            if (response.ok) {
                toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
                // Optionally, refetch user data or update currentUser state if API returns new data
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to update profile. Server error."}));
                toast({ variant: "destructive", title: "Update Failed", description: errorData.message });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Network Error", description: "Could not connect to update profile." });
        } finally {
            setIsLoading(prev => ({...prev, profile: false}));
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
        setIsLoading(prev => ({...prev, password: true}));
        const passwordData = { currentPassword, newPassword };
        
        try {
            // Replace with your actual API endpoint for changing password
            const response = await fetch('/api/auth/change-password', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passwordData) 
            });

            if (response.ok) {
                toast({ title: "Password Changed", description: "Your password has been successfully changed." });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to change password. Server error."}));
                toast({ variant: "destructive", title: "Change Failed", description: errorData.message });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Network Error", description: "Could not connect to change password service." });
        } finally {
            setIsLoading(prev => ({...prev, password: false}));
        }
    };

    const handlePreferencesUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(prev => ({...prev, preferences: true}));
        const preferencesData = { theme, emailNotifications, smsNotifications };
        
        try {
            // Replace with your actual API endpoint for updating preferences
            const response = await fetch('/api/user/preferences', { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferencesData) 
            });

            if (response.ok) {
                toast({ title: "Preferences Updated", description: "Your preferences have been saved." });
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to save preferences. Server error."}));
                toast({ variant: "destructive", title: "Update Failed", description: errorData.message });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Network Error", description: "Could not connect to save preferences." });
        } finally {
            setIsLoading(prev => ({...prev, preferences: false}));
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
        setIsLoading(prev => ({...prev, otp: true}));
        try {
            const response = await fetch('/api/send-otp', { // This API route already exists conceptually
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: fullOtpPhoneNumber }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                toast({ title: "OTP Sent", description: data.message });
                setOtpSent(true);
            } else {
                toast({ variant: "destructive", title: "Failed to Send OTP", description: data.message || "An error occurred." });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Network Error", description: "Could not connect to OTP service." });
        } finally {
            setIsLoading(prev => ({...prev, otp: false}));
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            toast({ variant: "destructive", title: "OTP Required", description: "Please enter the OTP." });
            return;
        }
        setIsLoading(prev => ({...prev, otp: true}));
        const selectedOtpCountry = mockCountryCodes.find(c => c.code === otpSelectedCountryCode);
        const dialCode = selectedOtpCountry ? selectedOtpCountry.dial_code : '';
        const fullOtpPhoneNumber = `${dialCode}${otpLocalPhoneNumber}`;
        
        try {
            // Replace with your actual API endpoint for verifying OTP
            const response = await fetch('/api/auth/verify-otp', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: fullOtpPhoneNumber, otp }) 
            });

            if (response.ok) {
                 toast({ title: "Phone Verified", description: "Your phone number has been verified." });
                 setOtpSent(false);
                 setOtp('');
                 // Update user profile state or refetch if phone is now verified
            } else {
                 const errorData = await response.json().catch(() => ({ message: "Invalid OTP or server error."}));
                 toast({ variant: "destructive", title: "Verification Failed", description: errorData.message });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Network Error", description: "Could not connect to OTP verification service." });
        } finally {
            setIsLoading(prev => ({...prev, otp: false}));
        }
    };

    const handleLogout = async () => {
        setIsLoading(prev => ({ ...prev, logout: true }));
        try {
            // Conceptual API call to backend to invalidate session/token
            const response = await fetch('http://localhost:5223/api/Users/logout', { // Placeholder API
                method: 'POST', // Or GET, depending on your API design
                headers: {
                    // Include auth token if needed, e.g., 'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                console.log("Server logout successful");
            } else {
                // Log error but proceed with client-side logout
                console.error("Server logout failed or API not implemented", await response.text().catch(() => ""));
            }
        } catch (error) {
            // Log error but proceed with client-side logout
            console.error("Error during server logout attempt:", error);
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('loggedInUser');
            }
            toast({ title: "Logged Out", description: "You have been successfully logged out." });
            router.push('/login');
            // No need to set isLoading.logout to false as we are navigating away
        }
    };
    
    const avatarFallback = currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AU';


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">User Settings</h1>
        </div>
        <Button variant="outline" onClick={handleLogout} disabled={isLoading.logout}>
            {isLoading.logout ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                </>
            ) : (
                <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </>
            )}
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
                    <AvatarFallback className="text-2xl">{avatarFallback}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" type="button" disabled={isLoading.profile}>Change Avatar</Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="profileName">Full Name</Label>
                    <Input id="profileName" value={profileName} onChange={(e) => setProfileName(e.target.value)} disabled={isLoading.profile} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileEmail">Email Address</Label>
                    <Input id="profileEmail" type="email" value={profileEmail} readOnly disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileLocalPhone">Phone Number (Profile)</Label>
                    <div className="flex gap-2">
                        <Select value={profileSelectedCountryCode} onValueChange={setProfileSelectedCountryCode} disabled={isLoading.profile}>
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
                        <Input id="profileLocalPhone" type="tel" value={profileLocalPhoneNumber} onChange={(e) => setProfileLocalPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g., 1234567890" disabled={isLoading.profile}/>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="profileRole">Role</Label>
                    <Input id="profileRole" value={profileRole || ''} readOnly disabled />
                 </div>
             </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading.profile}>
                    {isLoading.profile ? 'Saving...' : 'Save Profile'}
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
                         <Select value={otpSelectedCountryCode} onValueChange={setOtpSelectedCountryCode} disabled={otpSent || isLoading.otp}>
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
                            disabled={otpSent || isLoading.otp}
                            className="flex-1"
                        />
                        <Button onClick={handleSendOtp} disabled={!otpLocalPhoneNumber.trim() || otpSent || isLoading.otp} className="whitespace-nowrap">
                            {isLoading.otp && otpSent === false ? 'Sending...' : otpSent ? "Resend OTP" : "Send OTP"}
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
                                disabled={isLoading.otp}
                            />
                            <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || isLoading.otp} className="whitespace-nowrap">
                                {isLoading.otp ? 'Verifying...' : 'Verify OTP'}
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
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required disabled={isLoading.password}/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={isLoading.password}/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading.password}/>
            </div>
            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isLoading.password}>
                     {isLoading.password ? 'Changing...' : 'Change Password'}
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
                     <Select value={theme} onValueChange={setTheme} disabled={isLoading.preferences}>
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
                         disabled={isLoading.preferences}
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
                         disabled={isLoading.preferences}
                       />
                     </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isLoading.preferences}>
                        {isLoading.preferences ? 'Saving...' : 'Save Preferences'}
                    </Button>
                </div>
             </form>
        </CardContent>
      </Card>
    </div>
  );
}
    

    