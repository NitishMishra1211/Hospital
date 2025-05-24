
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Stethoscope, Building, Mail, Phone } from 'lucide-react';
import type { Doctor } from '@/lib/types';

// Helper to generate a simple client-side ID (for doctor id)
const generateDoctorId = (): string => {
    return `D${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

export default function AddDoctorPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);

        const doctorData: Doctor = {
            id: generateDoctorId(),
            name: formData.get('doctorName') as string,
            specialization: formData.get('specialization') as string,
            avatarUrl: formData.get('avatarUrl') as string || `https://picsum.photos/seed/${formData.get('doctorName')}/80/80`,
            department: formData.get('department') as string || null,
            email: formData.get('email') as string || null,
            phoneNumber: formData.get('phoneNumber') as string || null,
            availableTimeSlots: [], // Defaulting to empty for new adds via this form
            isActive: true, // Defaulting to active for new adds
        };

        console.log("New Doctor Data:", doctorData);

        // Simulate API call for now
        setTimeout(() => {
             toast({
                title: "Doctor Added (Simulated)",
                description: `Dr. ${doctorData.name} (${doctorData.specialization}) data logged to console.`,
            });
            (event.target as HTMLFormElement).reset();
            setIsLoading(false);
        }, 1000);
    };

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex items-center gap-3">
            <UserPlus className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Add New Doctor</CardTitle>
          </div>
           <CardDescription className="text-muted-foreground pt-2">
                Fill in the form below to add a new doctor to the hospital system. Fields marked with * are required.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
           <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Information */}
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Doctor Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Full Name *</Label>
                <Input id="doctorName" name="doctorName" placeholder="e.g., Dr. Jane Smith" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization * <Stethoscope className="inline h-3 w-3 ml-1"/></Label>
                <Input id="specialization" name="specialization" placeholder="e.g., Cardiology" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department <Building className="inline h-3 w-3 ml-1"/></Label>
                <Input id="department" name="department" placeholder="e.g., Cardiovascular Unit" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <Mail className="inline h-3 w-3 ml-1"/></Label>
                <Input id="email" name="email" type="email" placeholder="e.g., dr.jane@medicore.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number <Phone className="inline h-3 w-3 ml-1"/></Label>
                <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="e.g., +1-555-123-4567" />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input id="avatarUrl" name="avatarUrl" type="url" placeholder="e.g., https://example.com/avatar.png" />
                <p className="text-xs text-muted-foreground">Optional. If left blank, a placeholder will be used.</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Doctor
                    </>
                )}
              </Button>
            </div>
           </form>
        </CardContent>
      </Card>
    </div>
  );
}
