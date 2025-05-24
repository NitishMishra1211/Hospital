
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Building } from 'lucide-react';

// Helper to generate a simple client-side ID
const generateDoctorId = (): string => {
    return `D${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

interface DoctorApiPayload {
  id: string;
  doctorname: string;
  dept: string;
}

export default function AddDoctorPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);

        const doctorData: DoctorApiPayload = {
            id: generateDoctorId(), // Client-side ID generation
            doctorname: formData.get('doctorName') as string,
            dept: formData.get('department') as string,
        };

        try {
            const response = await fetch('https://5ca9-47-9-35-133.ngrok-free.app/api/Doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(doctorData),
            });

            if (response.ok) {
                toast({
                    title: "Doctor Added Successfully",
                    description: `Dr. ${doctorData.doctorname} has been added to the system.`,
                });
                (event.target as HTMLFormElement).reset();
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to add doctor. Server responded with an error." }));
                console.error("API Error Data:", errorData);
                toast({
                    variant: "destructive",
                    title: "Adding Doctor Failed",
                    description: errorData.message || `Server error: ${response.status} ${response.statusText}`,
                });
            }
        } catch (error: any) {
            console.error("Error submitting doctor data:", error);
            let description = "Could not connect to the server. Please try again later.";
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                description = "Network request failed. Please ensure the backend server at https://5ca9-47-9-35-133.ngrok-free.app is running, accessible, and CORS is configured correctly.";
            } else if (error.message) {
                description = `An error occurred: ${error.message}`;
            }
            toast({
                variant: "destructive",
                title: "Submission Error",
                description: description,
            });
        } finally {
            setIsLoading(false);
        }
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
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Doctor Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Full Name *</Label>
                <Input id="doctorName" name="doctorName" placeholder="e.g., Dr. Jane Smith" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department * <Building className="inline h-3 w-3 ml-1"/></Label>
                <Input id="department" name="department" placeholder="e.g., Cardiovascular Unit" required/>
              </div>
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
