
'use client';

import * as React from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit3, Calendar as CalendarIcon, Stethoscope, Phone, Home as HomeIcon, WeightIcon, UserCircle, Save } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { mockDoctors } from '@/lib/mock-data'; // Assuming you still want mock doctors for the dropdown
import { useToast } from '@/hooks/use-toast';
import type { Patient } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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

export default function EditPatientPage() {
    const router = useRouter();
    const params = useParams();
    const patientId = params.id as string;
    const { toast } = useToast();

    const [patient, setPatient] = React.useState<Patient | null>(null);
    const [dob, setDob] = React.useState<Date | undefined>();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isFetching, setIsFetching] = React.useState(true);
    const [fetchError, setFetchError] = React.useState<string | null>(null);

    // Form state for controlled components
    const [formData, setFormData] = React.useState<Partial<Patient>>({});

    React.useEffect(() => {
        if (!patientId) return;

        async function fetchPatientData() {
            setIsFetching(true);
            setFetchError(null);
            try {
                const response = await fetch(`http://localhost:5223/api/Patients/${patientId}`);
                if (response.status === 404) {
                    notFound();
                    return;
                }
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data: Patient = await response.json();
                setPatient(data);
                setFormData(data);
                if (data.age && !isNaN(data.age)) { // Attempt to reconstruct DOB if age is present and patient is fetched
                    const currentYear = new Date().getFullYear();
                    setDob(new Date(currentYear - data.age, 0, 1)); // Approximate DOB
                }
            } catch (e: any) {
                console.error("Failed to fetch patient data for editing:", e);
                setFetchError(e.message || 'An unexpected error occurred while fetching patient data.');
            } finally {
                setIsFetching(false);
            }
        }
        fetchPatientData();
    }, [patientId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!patient) return;
        setIsLoading(true);

        const age = dob ? calculateAge(dob) : formData.age || 0; // Use calculated age if DOB is set, otherwise existing age
        const patientWeight = formData.weight ? parseFloat(String(formData.weight)) : 0;

        const updatedPatientData: Patient = {
            ...patient, // Start with existing patient data to ensure all fields are present
            ...formData, // Overlay with form changes
            age: age,
            weight: Math.round(patientWeight),
            // Ensure fields that might not be directly on formData but are part of Patient type are handled
            pid: patient.pid, // pid is from the original patient data, not editable
            name: formData.name || patient.name,
            gender: formData.gender || patient.gender,
            phoneno: formData.phoneno || patient.phoneno,
            disease: formData.disease || patient.disease,
            doctorid: formData.doctorid || patient.doctorid,
        };


        try {
            // The API URL is just /api/Patients/ and the patientId (pid) is in the body for PUT
            const response = await fetch(`http://localhost:5223/api/Patients/${patient.pid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPatientData),
            });

            if (response.ok) {
                toast({
                    title: "Patient Updated Successfully",
                    description: `Patient ${updatedPatientData.name}'s information has been updated.`,
                });
                router.push(`/patient-details/${patient.pid}`);
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to update patient. Server responded with an error." }));
                toast({
                    variant: "destructive",
                    title: "Update Failed",
                    description: errorData.message || `Server error: ${response.status}`,
                });
            }
        } catch (error: any) {
            console.error("Error updating patient data:", error);
            toast({
                variant: "destructive",
                title: "Submission Error",
                description: error.message || "Could not connect to the server. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="space-y-6 lg:space-y-8">
                <Card className="shadow-lg rounded-lg">
                    <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="space-y-6 lg:space-y-8">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Fetching Patient Data</AlertTitle>
                    <AlertDescription>{fetchError}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!patient) {
        // This case should ideally be caught by notFound() if API returns 404
        // or by the error state if the fetch failed for other reasons.
        return <p className="text-center text-muted-foreground">Patient not found or an error occurred.</p>;
    }

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Edit Patient: {patient.name} (PID: {patient.pid})</CardTitle>
          </div>
           <CardDescription className="text-muted-foreground pt-2">
                Modify the patient's information below. Required fields are marked with *.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
           <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Full Name *</Label>
                <Input id="patientName" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="e.g., John Doe" required />
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
                <Select name="gender" value={formData.gender || ''} onValueChange={(value) => handleSelectChange('gender', value)} required>
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
                <Input id="contactNumber" name="phoneno" type="tel" value={formData.phoneno || ''} onChange={handleInputChange} placeholder="e.g., 555-123-4567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientWeight">Weight (kg) * <WeightIcon className="inline h-3 w-3 ml-1"/></Label>
                <Input id="patientWeight" name="weight" type="number" step="0.1" value={formData.weight || ''} onChange={handleInputChange} placeholder="e.g., 70.5" required />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="address">Address <HomeIcon className="inline h-3 w-3 ml-1"/></Label>
                <Textarea id="address" name="address" value={formData.address || ''} onChange={handleInputChange} placeholder="Enter patient's full address" />
            </div>

             <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4 pt-4">Admission Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Admission (Disease) *</Label>
                    <Textarea id="reason" name="disease" value={formData.disease || ''} onChange={handleInputChange} placeholder="Briefly describe the reason for admission" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="assignedDoctor">Assign Doctor * <Stethoscope className="inline h-3 w-3 ml-1"/></Label>
                    <Select name="doctorid" value={formData.doctorid || ''} onValueChange={(value) => handleSelectChange('doctorid', value)} required>
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

             <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4 pt-4">Insurance Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Provider</Label>
                    <Input id="insuranceProvider" name="insuranceProvider" value={formData.insuranceProvider || ''} onChange={handleInputChange} placeholder="e.g., Blue Cross" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input id="policyNumber" name="policyNumber" value={formData.policyNumber || ''} onChange={handleInputChange} placeholder="e.g., XYZ123456789" />
                </div>
             </div>

            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
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
