
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Calendar as CalendarIcon, Stethoscope, Phone, Home as HomeIcon, WeightIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { mockDoctors } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

// Helper function to calculate age
const calculateAge = (dob: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
};

// Helper to generate a simple client-side ID (for pid)
const generatePatientId = (): string => {
    return `P${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};


export default function AdmitPatientPage() {
    const [dob, setDob] = React.useState<Date | undefined>();
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);

        const age = dob ? calculateAge(dob) : 0;
        const patientWeight = formData.get('patientWeight') ? parseFloat(formData.get('patientWeight') as string) : 0;

        const patientData = {
            pid: generatePatientId(), // Generating client-side PID
            name: formData.get('patientName') as string,
            age: age,
            weight: patientWeight,
            gender: formData.get('gender') as string,
            address: formData.get('address') as string,
            insuranceProvider: formData.get('insuranceProvider') as string,
            policyNumber: formData.get('policyNumber') as string,
            phoneno: formData.get('contactNumber') as string,
            disease: formData.get('reason') as string,
            doctorid: formData.get('assignedDoctor') as string,
        };

        try {
            const response = await fetch('http://localhost:5223/api/Patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData),
            });

            if (response.ok) {
                toast({
                    title: "Patient Admitted Successfully",
                    description: `Patient ${patientData.name} has been added to the system.`,
                });
                (event.target as HTMLFormElement).reset();
                setDob(undefined);
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to submit patient data. Server responded with an error." }));
                toast({
                    variant: "destructive",
                    title: "Admission Failed",
                    description: errorData.message || `Server error: ${response.status}`,
                });
            }
        } catch (error) {
            console.error("Error submitting patient data:", error);
            toast({
                variant: "destructive",
                title: "Network Error",
                description: "Could not connect to the server. Please try again later.",
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
            <CardTitle className="text-2xl font-bold">Admit New Patient</CardTitle>
          </div>
           <CardDescription className="text-muted-foreground pt-2">
                Fill in the form below to admit a new patient into the hospital system. Required fields are marked with *.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
           <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Demographics */}
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Full Name *</Label>
                <Input id="patientName" name="patientName" placeholder="e.g., John Doe" required />
              </div>
              <div className="space-y-2">
                 <Label htmlFor="dob">Date of Birth *</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !dob && "text-muted-foreground"
                        )}
                        type="button"
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={dob}
                        onSelect={setDob}
                        initialFocus
                         disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                    </PopoverContent>
                    </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select name="gender" required>
                    <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number * <Phone className="inline h-3 w-3 ml-1"/></Label>
                <Input id="contactNumber" name="contactNumber" type="tel" placeholder="e.g., 555-123-4567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientWeight">Weight (kg) *</Label>
                <Input id="patientWeight" name="patientWeight" type="number" step="0.1" placeholder="e.g., 70.5" required />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="address">Address <HomeIcon className="inline h-3 w-3 ml-1"/></Label>
                <Textarea id="address" name="address" placeholder="Enter patient's full address" />
            </div>

             {/* Admission Details */}
             <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4 pt-4">Admission Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Admission (Disease) *</Label>
                    <Textarea id="reason" name="reason" placeholder="Briefly describe the reason for admission" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="assignedDoctor">Assign Doctor * <Stethoscope className="inline h-3 w-3 ml-1"/></Label>
                    <Select name="assignedDoctor" required>
                        <SelectTrigger id="assignedDoctor">
                            <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockDoctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                    {doctor.name} ({doctor.specialization})
                                </SelectItem>
                            ))}
                             <SelectItem value="unassigned">Unassigned / Triage</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
             </div>

             {/* Insurance Information (Basic) */}
             <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4 pt-4">Insurance Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Provider</Label>
                    <Input id="insuranceProvider" name="insuranceProvider" placeholder="e.g., Blue Cross" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input id="policyNumber" name="policyNumber" placeholder="e.g., XYZ123456789" />
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
                        Admit Patient
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
    
