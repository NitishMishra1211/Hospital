
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Calendar as CalendarIcon, Stethoscope, Phone, Home as HomeIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { mockDoctors } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';


export default function AdmitPatientPage() {
    const [dob, setDob] = React.useState<Date | undefined>();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);
        const patientData = {
            patientName: formData.get('patientName'),
            dob: dob ? format(dob, "yyyy-MM-dd") : null,
            gender: formData.get('gender'),
            contactNumber: formData.get('contactNumber'),
            address: formData.get('address'),
            reasonForAdmission: formData.get('reason'),
            assignedDoctor: formData.get('assignedDoctor'),
            insuranceProvider: formData.get('insuranceProvider'),
            policyNumber: formData.get('policyNumber'),
        };

        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData),
            });
            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Patient Admitted",
                    description: data.message || "Patient details have been successfully recorded.",
                });
                (event.target as HTMLFormElement).reset();
                setDob(undefined);
            } else {
                toast({
                    variant: "destructive",
                    title: "Admission Failed",
                    description: data.message || "Could not admit patient. Please try again.",
                });
            }
        } catch (error) {
            console.error("Admission error:", error);
            toast({
                variant: "destructive",
                title: "Admission Error",
                description: "An unexpected error occurred. Please try again.",
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
                <Input id="patientName" name="patientName" placeholder="e.g., John Doe" required disabled={isLoading} />
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
                        disabled={isLoading}
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
                <Select name="gender" required disabled={isLoading}>
                    <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number * <Phone className="inline h-3 w-3 ml-1"/></Label>
                <Input id="contactNumber" name="contactNumber" type="tel" placeholder="e.g., 555-123-4567" required disabled={isLoading} />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="address">Address <HomeIcon className="inline h-3 w-3 ml-1"/></Label>
                <Textarea id="address" name="address" placeholder="Enter patient's full address" disabled={isLoading} />
            </div>

             {/* Admission Details */}
             <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4 pt-4">Admission Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Admission *</Label>
                    <Textarea id="reason" name="reason" placeholder="Briefly describe the reason for admission" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="assignedDoctor">Assign Doctor * <Stethoscope className="inline h-3 w-3 ml-1"/></Label>
                    <Select name="assignedDoctor" required disabled={isLoading}>
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
                    <Input id="insuranceProvider" name="insuranceProvider" placeholder="e.g., Blue Cross" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input id="policyNumber" name="policyNumber" placeholder="e.g., XYZ123456789" disabled={isLoading} />
                </div>
             </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                {isLoading ? 'Admitting...' : 'Admit Patient'}
              </Button>
            </div>
           </form>
        </CardContent>
      </Card>
    </div>
  );
}
    