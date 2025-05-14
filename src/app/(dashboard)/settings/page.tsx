
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, UserCircle, Lock, Palette, Bell, Phone } from 'lucide-react'; 
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { mockCountryCodes, CountryCode } from '@/lib/mock-data'; // Import country codes

// Mock user data (in a real app, this would come from auth state/API)
const currentUser = {
  name: 'Admin User',
  email: 'admin@medicore.com',
  avatarUrl: 'https://picsum.photos/seed/admin/80/80', 
  phone: '+15551234567', 
  role: 'Administrator',
};

// Helper to extract country code and local number
const extractPhoneParts = (fullPhoneNumber: string | undefined): { countryCode: string, localNumber: string } => {
    if (!fullPhoneNumber) return { countryCode: '+1', localNumber: '' }; // Default to US

    const foundCountry = mockCountryCodes.find(cc => fullPhoneNumber.startsWith(cc.dial_code));
    if (foundCountry) {
        return {
            countryCode: foundCountry.dial_code,
            localNumber: fullPhoneNumber.substring(foundCountry.dial_code.length).replace(/[^0-9]/g, ''),
        };
    }
    // If no match, assume it might be a local number or a country not in our short list
    // For simplicity, default to US if no country code is apparent or recognized
    const numericOnly = fullPhoneNumber.replace(/[^0-9]/g, '');
    if (fullPhoneNumber.startsWith('+')) { // It has some country code we don't recognize
         // Try to find the longest matching dial code
        let bestMatch = { countryCode: '+1', localNumber: numericOnly.startsWith('1') ? numericOnly.substring(1) : numericOnly };
        let longestDialCode = 0;

        mockCountryCodes.forEach(cc => {
            if (fullPhoneNumber.startsWith(cc.dial_code) && cc.dial_code.length > longestDialCode) {
                longestDialCode = cc.dial_code.length;
                bestMatch = {
                    countryCode: cc.dial_code,
                    localNumber: fullPhoneNumber.substring(cc.dial_code.length).replace(/[^0-9]/g, '')
                };
            }
        });
         if(longestDialCode > 0) return bestMatch;

        // Fallback if still no recognized prefix
        const firstChar = fullPhoneNumber.charAt(0);
        if (firstChar === '+' && numericOnly.length > 10) { // Basic check for common international format
            return { countryCode: fullPhoneNumber.substring(0, fullPhoneNumber.length - 10), localNumber: numericOnly.substring(numericOnly.length -10) };
        }

    }


    return { countryCode: '+1', localNumber: numericOnly }; // Default assumption
};


export default function SettingsPage() {
    const { toast } = useToast();
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    // State for preferences (example)
    const [theme, setTheme] = React.useState('system'); 
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [smsNotifications, setSmsNotifications] = React.useState(false);

    // Initial phone parts extraction
    const initialProfilePhoneParts = extractPhoneParts(currentUser.phone);
    const initialOtpPhoneParts = extractPhoneParts(currentUser.phone);


    // State for profile phone
    const [profileCountryCode, setProfileCountryCode] = React.useState(initialProfilePhoneParts.countryCode);
    const [profileLocalPhoneNumber, setProfileLocalPhoneNumber] = React.useState(initialProfilePhoneParts.localNumber);
    
    // State for OTP phone
    const [otpCountryCode, setOtpCountryCode] = React.useState(initialOtpPhoneParts.countryCode);
    const [otpLocalPhoneNumber, setOtpLocalPhoneNumber] = React.useState(initialOtpPhoneParts.localNumber);

    const [otpSent, setOtpSent] = React.useState(false);
    const [otp, setOtp] = React.useState('');
    const [isSendingOtp, setIsSendingOtp] = React.useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);


    const handleProfileUpdate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const fullProfilePhoneNumber = `${profileCountryCode}${profileLocalPhoneNumber}`;
        toast({
            title: "Profile Updated",
            description: `Your profile information (phone: ${fullProfilePhoneNumber}) has been saved (simulation).`,
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
         toast({
            title: "Password Changed",
            description: "Your password has been updated successfully (simulation).",
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

     const handlePreferencesUpdate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        toast({
            title: "Preferences Saved",
            description: "Your preferences have been updated (simulation).",
        });
    };

    const handleSendOtp = async () => {
        const fullOtpPhoneNumber = `${otpCountryCode}${otpLocalPhoneNumber}`;
        if (!fullOtpPhoneNumber.replace(otpCountryCode, '').trim()) { // Check if local part is empty
            toast({
                variant: "destructive",
                title: "Phone Number Required",
                description: "Please enter your phone number to receive an OTP.",
            });
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
                toast({
                    title: "OTP Sent",
                    description: data.message,
                });
                setOtpSent(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to Send OTP",
                    description: data.message || "An error occurred.",
                });
                setOtpSent(false);
            }
        } catch (error) {
             console.error("Send OTP error:", error);
            toast({
                variant: "destructive",
                title: "Network Error",
                description: "Could not reach the server to send OTP. Check console for details.",
            });
            setOtpSent(false);
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            toast({
                variant: "destructive",
                title: "OTP Required",
                description: "Please enter the OTP you received.",
            });
            return;
        }
        setIsVerifyingOtp(true);
        const fullOtpPhoneNumber = `${otpCountryCode}${otpLocalPhoneNumber}`;
        console.log(`Simulating verification of OTP ${otp} for phone number ${fullOtpPhoneNumber}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        if (otp.length === 6 && /^\d+$/.test(otp) && otp.startsWith('1')) { 
            toast({
                title: "Phone Verified (Simulated)",
                description: "Your phone number has been successfully verified.",
            });
            setOtpSent(false); 
            setOtp('');
        } else {
            toast({
                variant: "destructive",
                title: "Invalid OTP (Simulated)",
                description: "The OTP entered is incorrect or invalid for simulation. Try an OTP starting with '1'.",
            });
        }
        setIsVerifyingOtp(false);
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
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="user avatar"/>
                    <AvatarFallback className="text-2xl">{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" type="button">Change Avatar</Button>
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
                    <Label htmlFor="profilePhone">Phone Number (Profile)</Label>
                    <div className="flex gap-2">
                        <Select value={profileCountryCode} onValueChange={setProfileCountryCode}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockCountryCodes.map(cc => (
                                    <SelectItem key={`prof-${cc.code}`} value={cc.dial_code}>
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
                <Button type="submit">Save Profile</Button>
              </div>
           </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Contact Verification Section */}
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
                         <Select value={otpCountryCode} onValueChange={setOtpCountryCode} disabled={otpSent || isSendingOtp}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockCountryCodes.map(cc => (
                                    <SelectItem key={`otp-${cc.code}`} value={cc.dial_code}>
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
                        <Button onClick={handleSendOtp} disabled={isSendingOtp || !otpLocalPhoneNumber.trim()} className="whitespace-nowrap">
                            {isSendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        We'll send an OTP to this number for verification.
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
                           Check your phone for the One-Time Password. (Simulated: try an OTP starting with '1')
                         </p>
                    </div>
                )}
           </div>
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

