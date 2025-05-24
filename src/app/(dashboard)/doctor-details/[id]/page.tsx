
import { mockDoctors } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import type { Doctor } from '@/lib/types'; // Import the updated Doctor type
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, CalendarClock, Users, Mail, Phone, Building, CheckCircle, XCircle, ClockIcon } from 'lucide-react';

// Helper function to find doctor by ID (in a real app, this would fetch from an API/DB)
const getDoctorById = (id: string): Doctor | undefined => {
  return mockDoctors.find(doctor => doctor.id === id);
};

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const doctor = getDoctorById(params.id);

  if (!doctor) {
    notFound(); // Show 404 if doctor not found
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-primary">
              <AvatarImage src={doctor.avatarUrl || undefined} alt={doctor.name} />
              <AvatarFallback className="text-2xl">{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold">{doctor.name}</CardTitle>
              <CardDescription className="text-lg text-primary flex items-center justify-center sm:justify-start gap-1 mt-1">
                <Stethoscope className="h-5 w-5" /> {doctor.specialization}
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
            {doctor.availableTimeSlots && doctor.availableTimeSlots.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    {doctor.availableTimeSlots.map((slot, index) => (
                        <li key={index} className="flex items-center gap-1"><ClockIcon className="h-3 w-3 text-primary/70"/> {slot}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm">
                    No specific time slots listed. General availability: Mon-Fri 9 AM - 5 PM (example).
                </p>
            )}
          </div>

           {/* Section 2: Assigned Patients (Placeholder) */}
           <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 flex items-center gap-2">
                <Users className="h-5 w-5"/> Assigned Patients
            </h3>
            <p className="text-muted-foreground text-sm">
                A list or table of patients currently under this doctor's care would be displayed here.
            </p>
            <div className="mt-2 space-y-1 text-sm">
                <Badge variant="outline">Alice Johnson (PID: P123)</Badge>
                <Badge variant="outline">Robert Brown (PID: P456)</Badge>
            </div>
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

// Optional: Add metadata generation if needed
// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const doctor = getDoctorById(params.id);
//   return {
//     title: doctor ? `Doctor Details - ${doctor.name}` : 'Doctor Not Found',
//   };
// }
