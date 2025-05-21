
'use client';

import * as React from 'react';
import { PatientTable } from '@/components/dashboard/patient-table';
import type { Patient } from '@/lib/types'; // Use the new Patient type
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function PatientDetailsPage() {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchPatients() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5223/api/Patients');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data: Patient[] = await response.json();
        setPatients(data);
      } catch (e: any) {
        console.error("Failed to fetch patients:", e);
        let errorMessage = "An unexpected error occurred while fetching patient data.";
        if (e instanceof TypeError && e.message === "Failed to fetch") {
            errorMessage = "Cannot connect to the patient API. Please ensure the backend server at http://localhost:5223 is running and accessible, and CORS is configured correctly.";
        } else if (e.message) {
            errorMessage = e.message;
        }
        setError(errorMessage);
        setPatients([]); // Clear patients on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchPatients();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <h2 className="text-xl font-semibold text-muted-foreground mb-4">All Patient Records</h2>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <h2 className="text-xl font-semibold text-muted-foreground mb-4">All Patient Records</h2>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Patients</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <h2 className="text-xl font-semibold text-muted-foreground mb-4">All Patient Records</h2>
      {patients.length > 0 ? (
        <PatientTable patients={patients} />
      ) : (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No patient records found.
            </CardContent>
        </Card>
      )}
    </div>
  );
}

// Need to add Card and CardContent if used for no patient records message
import { Card, CardContent } from '@/components/ui/card';
