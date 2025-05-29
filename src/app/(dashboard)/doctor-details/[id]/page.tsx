
'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import type { Doctor } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, CalendarClock, Users, Mail, Phone, Building, CheckCircle, XCircle, ClockIcon, Briefcase, UserCircle as ProfileIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interface for the expected API response for a single doctor
interface ApiDoctorDetail {
  id: string;
  doctorname: string; // From your API
  dept: string;       // From your API
  avatarUrl?: string | null;
  specialization?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  availableTimeSlots?: string[] | null;
  isActive?: boolean;
}


export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = React.useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!doctorId) return;

    async function fetchDoctorDetail() {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming your API for a single doctor is /api/Doctor/{id}
        const response = await fetch(`http://localhost:5223/api/Doctor/${doctorId}`);
        if (response.status === 404) {
          notFound();
          return;
        }
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
          throw new Error(errorData.message || `Failed to fetch doctor details. Status: ${response.status}`);
        }
        const apiData: ApiDoctorDetail = await response.json();

        // Map API data to the Doctor type
        const formattedDoctor: Doctor = {
          id: apiData.id,
          name: apiData.doctorname,
          department: apiData.dept,
          avatarUrl: apiData.avatarUrl || `https://placehold.co/80x80.png?text=${apiData.doctorname.charAt(0)}`,
          specialization: apiData.specialization || 'N/A',
          email: apiData.email,
          phoneNumber: apiData.phoneNumber,
          availableTimeSlots: apiData.availableTimeSlots || [],
          isActive: apiData.isActive === undefined ? true : apiData.isActive,
        };
        setDoctor(formattedDoctor);
      } catch (e: any) {
        console.error("Failed to fetch doctor details:", e);
        let errorMessage = "An unexpected error occurred while fetching doctor data.";
        if (e instanceof TypeError && e.message === "Failed to fetch") {
            errorMessage = `Cannot connect to the doctor API (http://localhost:5223/api/Doctor/${doctorId}). Please ensure the backend server is running, accessible, and CORS is configured correctly.`;
        } else if (e.message) {
            errorMessage = e.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoctorDetail();
  }, [doctorId]);

  if (isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-primary/10 p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full border-4 border-primary" />
              <div className="text-center sm:text-left space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            ))}
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
          <AlertTitle>Error Fetching Doctor Details</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!doctor) {
    // This case should ideally be handled by notFound() if API returns 404
    // or by the error state if the fetch failed for other reasons.
    return (
         <div className="space-y-6 lg:space-y-8 text-center">
             <p className="text-muted-foreground">Doctor data not available or an error occurred.</p>
         </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-primary">
              <AvatarImage src={doctor.avatarUrl || undefined} alt={doctor.name} data-ai-hint="doctor avatar" />
              <AvatarFallback className="text-2xl">{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold">{doctor.name}</CardTitle>
              <CardDescription className="text-lg text-primary flex items-center justify-center sm:justify-start gap-1 mt-1">
                <Stethoscope className="h-5 w-5" /> {doctor.specialization || 'N/A'}
              </CardDescription>
              {doctor.department && (
                <CardDescription className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-2 text-sm">
                  <Building className="h-4 w-4" /> {doctor.department}
                </CardDescription>
              )}
               <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground justify-center sm:justify-start">
                 {doctor.email && (
                    <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {doctor.email}</span>
                 )}
                 {doctor.phoneNumber && (
                    <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {doctor.phoneNumber}</span>
                 )}
               </div>
                <Badge variant={doctor.isActive ? "secondary" : "destructive"} className={`mt-2 ${doctor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                    {doctor.isActive ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                    {doctor.isActive ? 'Active' : 'Inactive'}
                </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Section 1: Schedule/Availability */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 flex items-center gap-2">
                <CalendarClock className="h-5 w-5"/> Availability & Schedule
            </h3>
            {(doctor.availableTimeSlots && doctor.availableTimeSlots.length > 0) ? (
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    {doctor.availableTimeSlots.map((slot, index) => (
                        <li key={index} className="flex items-center gap-1"><ClockIcon className="h-3 w-3 text-primary/70"/> {slot}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm">
                    Availability not specified.
                </p>
            )}
          </div>

           {/* Section 2: Assigned Patients (Placeholder) */}
           <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 flex items-center gap-2">
                <Users className="h-5 w-5"/> Assigned Patients
            </h3>
            <p className="text-muted-foreground text-sm">
                Patient assignment information would be displayed here if available from the API.
            </p>
            {/* Example Badges (Remove if not dynamically populated)
            <div className="mt-2 space-y-1 text-sm">
                <Badge variant="outline">Alice Johnson (PID: P123)</Badge>
                <Badge variant="outline">Robert Brown (PID: P456)</Badge>
            </div>
            */}
           </div>

          {/* Section 3: Actions (Placeholder) */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 pt-4">Actions</h3>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Edit Doctor Profile</Button>
                <Button variant="outline" size="sm">View Appointment History</Button>
                <Button variant="outline" size="sm">Manage Schedule</Button>
                {doctor.isActive ? (
                    <Button variant="destructive" size="sm">Deactivate Profile</Button>
                ) : (
                    <Button variant="secondary" size="sm" className="bg-green-600 hover:bg-green-700 text-white">Activate Profile</Button>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

