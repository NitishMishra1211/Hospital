
'use client';

import * as React from 'react';
import { DoctorGrid } from '@/components/dashboard/doctor-grid';
import type { Doctor } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ApiDoctor {
  id: string;
  doctorname: string;
  dept: string;
  // Add other fields if your API returns more for the list view
  avatarUrl?: string;
  specialization?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export default function DoctorDetailsPage() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchDoctors() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://5ca9-47-9-35-133.ngrok-free.app/api/Doctor');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
          throw new Error(errorData.message || `Failed to fetch doctors. Status: ${response.status}`);
        }
        const apiData: ApiDoctor[] = await response.json();

        // Map API data to the Doctor type used in the frontend
        const formattedDoctors: Doctor[] = apiData.map(apiDoc => ({
          id: apiDoc.id,
          name: apiDoc.doctorname,
          department: apiDoc.dept,
          avatarUrl: apiDoc.avatarUrl || `https://placehold.co/80x80.png?text=${apiDoc.doctorname.charAt(0)}`, // Placeholder if not provided
          specialization: apiDoc.specialization || 'N/A', // Default if not provided
          email: apiDoc.email,
          phoneNumber: apiDoc.phoneNumber,
          isActive: apiDoc.isActive === undefined ? true : apiDoc.isActive, // Default to true
          availableTimeSlots: [], // Assuming not available from list endpoint
        }));
        setDoctors(formattedDoctors);
      } catch (e: any) {
        console.error("Failed to fetch doctors:", e);
        let errorMessage = "An unexpected error occurred while fetching doctor data.";
        if (e instanceof TypeError && e.message === "Failed to fetch") {
            errorMessage = "Cannot connect to the doctor API. Please ensure the backend server at https://5ca9-47-9-35-133.ngrok-free.app is running, accessible, and CORS is configured correctly.";
        } else if (e.message) {
            errorMessage = e.message;
        }
        setError(errorMessage);
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" /> Doctor Information
          </h2>
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="shadow-md rounded-lg">
              <CardContent className="p-4 flex flex-col items-center text-center flex-grow space-y-2">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <h2 className="text-xl font-semibold text-muted-foreground mb-4">Doctor Information</h2>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Doctors</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5"/> Doctor Information
        </h2>
        <p className="text-sm font-medium text-muted-foreground">Total Doctors: {doctors.length}</p>
      </div>
      {doctors.length > 0 ? (
        <DoctorGrid doctors={doctors} />
      ) : (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No doctor records found.
            </CardContent>
        </Card>
      )}
    </div>
  );
}
