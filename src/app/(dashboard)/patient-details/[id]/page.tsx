
'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, Stethoscope, Phone, Home, Briefcase, StickyNote, Pill, Weight, Edit3, FileText, UserCircle } from 'lucide-react';
import type { Patient } from '@/lib/types'; // Use the new Patient type
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!patientId) return;

    async function fetchPatientDetail() {
      try {
        setIsLoading(true);
        setError(null);
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
      } catch (e: any) {
        console.error("Failed to fetch patient details:", e);
         let errorMessage = "An unexpected error occurred while fetching patient data.";
        if (e instanceof TypeError && e.message === "Failed to fetch") {
            errorMessage = "Cannot connect to the patient API. Please ensure the backend server at http://localhost:5223 is running and accessible, and CORS is configured correctly.";
        } else if (e.message) {
            errorMessage = e.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPatientDetail();
  }, [patientId]);

  if (isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-primary/10 p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
     return (
      <div className="space-y-6 lg:space-y-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Patient Details</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!patient) {
    // This case should ideally be handled by notFound() if API returns 404
    return (
         <div className="space-y-6 lg:space-y-8 text-center">
             <p className="text-muted-foreground">Patient data not available or an error occurred.</p>
         </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              {/* API doesn't provide avatar, using fallback */}
              <AvatarFallback className="text-2xl bg-muted text-primary">
                {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold">{patient.name}</CardTitle>
              <CardDescription className="text-md text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1">
                <User className="h-4 w-4" /> PID: {patient.pid}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Patient Demographics */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 flex items-center gap-2">
                <UserCircle className="h-5 w-5"/> Demographics & Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <p><strong className="font-medium">Age:</strong> {patient.age}</p>
              <p><strong className="font-medium">Gender:</strong> {patient.gender}</p>
              <p><strong className="font-medium">Weight:</strong> {patient.weight} kg</p>
              <p className="flex items-center gap-1"><Phone className="h-4 w-4 text-muted-foreground"/> <strong className="font-medium">Phone:</strong> {patient.phoneno}</p>
              <p className="md:col-span-2 flex items-start gap-1"><Home className="h-4 w-4 text-muted-foreground mt-0.5"/> <strong className="font-medium">Address:</strong> {patient.address || 'N/A'}</p>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 flex items-center gap-2 pt-4">
                <Pill className="h-5 w-5"/> Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <p><strong className="font-medium">Primary Concern/Disease:</strong> {patient.disease}</p>
              <p className="flex items-center gap-1"><Stethoscope className="h-4 w-4 text-muted-foreground"/> <strong className="font-medium">Assigned Doctor ID:</strong> {patient.doctorid}</p>
            </div>
          </div>

          {/* Insurance Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 flex items-center gap-2 pt-4">
                <Briefcase className="h-5 w-5"/> Insurance Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <p><strong className="font-medium">Provider:</strong> {patient.insuranceProvider || 'N/A'}</p>
              <p><strong className="font-medium">Policy Number:</strong> {patient.policyNumber || 'N/A'}</p>
            </div>
          </div>

          {/* Placeholder for Actions (if needed) */}
           <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-primary mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm"><Edit3 className="mr-2 h-4 w-4"/> Edit Patient Info</Button>
                <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4"/> View Medical History</Button>
                <Button variant="destructive" size="sm">Discharge Patient</Button>
            </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper to get initials if needed, but AvatarFallback does this
// const getInitials = (name: string) => {
//   return name.split(' ').map(n => n[0]).join('').toUpperCase();
// };

