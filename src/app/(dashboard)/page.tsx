
'use client';

import * as React from 'react';
import { DoctorGrid } from '@/components/dashboard/doctor-grid';
import { ActionCard } from '@/components/dashboard/action-card';
import type { Doctor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ApiDoctor {
  id: string;
  doctorname: string;
  dept: string;
  avatarUrl?: string;
  specialization?: string;
}

export default function HomePage() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = React.useState(true);
  const [doctorError, setDoctorError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchDoctors() {
      setIsLoadingDoctors(true);
      setDoctorError(null);
      try {
        const response = await fetch('https://70e2-47-9-35-133.ngrok-free.app/api/Doctor', {
          headers: {
            'ngrok-skip-browser-warning': 'true', // Added header
          },
        });
        if (!response.ok) {
          const errorText = await response.text().catch(() => `HTTP error! status: ${response.status}`);
          console.error("API Error Response Text (Home Page):", errorText);
          throw new Error(`Failed to fetch doctors. Status: ${response.status}. Response: ${errorText.substring(0, 200)}...`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text().catch(() => "Could not read response text.");
          console.error("API Non-JSON Response Text (Home Page):", responseText);
          throw new Error(`Expected JSON response, but got ${contentType || 'unknown'}. Response: ${responseText.substring(0, 200)}...`);
        }
        
        const apiData: ApiDoctor[] = await response.json();
        const formattedDoctors: Doctor[] = apiData.map(apiDoc => ({
          id: apiDoc.id,
          name: apiDoc.doctorname,
          department: apiDoc.dept,
          avatarUrl: apiDoc.avatarUrl || `https://placehold.co/80x80.png?text=${apiDoc.doctorname.charAt(0)}`,
          specialization: apiDoc.specialization || 'N/A',
          isActive: true, 
        }));
        setDoctors(formattedDoctors);
      } catch (e: any) {
        console.error("Failed to fetch doctors for home page:", e);
        let errorMessage = "Could not load doctor information.";
         if (e instanceof TypeError && e.message.toLowerCase().includes("failed to fetch")) {
            errorMessage = "Network error: Cannot connect to the doctor API. Please ensure the backend server at https://70e2-47-9-35-133.ngrok-free.app is running and accessible.";
        } else if (e.message) {
            errorMessage = e.message;
        }
        setDoctorError(errorMessage);
      } finally {
        setIsLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, []);

  return (
    <div className="space-y-6 lg:space-y-8">
       {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome to MediCore Hospital</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your central hub for managing hospital operations efficiently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Use the navigation on the left to access different sections or use the quick actions below.</p>
          </CardContent>
        </Card>

       {/* Feature/Action Cards */}
       <h2 className="text-xl font-semibold text-muted-foreground mb-4 pt-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <ActionCard title="Admit New Patient" iconName="UserPlus" href="/admit-patient" />
        <ActionCard title="Emergency Room Status" iconName="Ambulance" href="/emergency-status" />
        <ActionCard title="Pharmacy Details" iconName="FlaskConical" href="/pharmacy-details" />
        <ActionCard title="Search Patient Records" iconName="Search" href="/search-patients" />
        <ActionCard title="View Today's Schedule" iconName="CalendarDays" href="/todays-schedule" />
        <ActionCard title="Hospital Announcements" iconName="Megaphone" href="/announcements" />
      </div>

      {/* Doctor Grid Section */}
      <div className="space-y-4 pt-8">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-muted-foreground flex items-center gap-2">
                <Users className="h-5 w-5"/> Our Doctors
            </h2>
             {isLoadingDoctors ? (
                <Skeleton className="h-5 w-24" />
             ) : doctorError ? null : (
                <p className="text-sm font-medium text-muted-foreground">Total Doctors: {doctors.length}</p>
             )}
         </div>
        {isLoadingDoctors ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(4)].map((_, i) => (
                     <Card key={i} className="shadow-md rounded-lg">
                        <CardContent className="p-4 flex flex-col items-center text-center flex-grow space-y-2">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : doctorError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Doctors</AlertTitle>
              <AlertDescription>{doctorError}</AlertDescription>
            </Alert>
        ) : doctors.length > 0 ? (
            <DoctorGrid doctors={doctors} />
        ) : (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No doctors available at this time.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
