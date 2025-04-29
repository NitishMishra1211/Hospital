
import { mockDoctors } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, CalendarClock, Users, Mail } from 'lucide-react'; // Example icons

// Helper function to find doctor by ID (in a real app, this would fetch from an API/DB)
const getDoctorById = (id: string) => {
  return mockDoctors.find(doctor => doctor.id === id);
};

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const doctor = getDoctorById(params.id);

  if (!doctor) {
    notFound(); // Show 404 if doctor not found
  }

  // Placeholder for doctor's contact info (add to mock data if needed)
  const doctorEmail = `${doctor.name.toLowerCase().replace('dr. ', '').replace(' ', '.')}@medicore.com`;

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-primary">
              <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
              <AvatarFallback className="text-2xl">{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold">{doctor.name}</CardTitle>
              <CardDescription className="text-lg text-primary flex items-center justify-center sm:justify-start gap-1 mt-1">
                <Stethoscope className="h-5 w-5" /> {doctor.specialization}
              </CardDescription>
               <CardDescription className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-2 text-sm">
                <Mail className="h-4 w-4" /> {doctorEmail}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Section 1: Schedule/Availability (Placeholder) */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 flex items-center gap-2">
                <CalendarClock className="h-5 w-5"/> Availability & Schedule
            </h3>
            <p className="text-muted-foreground text-sm">
                Doctor's weekly schedule, on-call status, and upcoming leave would be displayed here. (e.g., Mon-Fri 9 AM - 5 PM, Off on weekends).
            </p>
             {/* Example: Could add a simple schedule table or list */}
             <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>Monday: 9:00 AM - 1:00 PM (Clinic A)</li>
                <li>Tuesday: 1:00 PM - 5:00 PM (Clinic B)</li>
                <li>Wednesday: Off</li>
                <li>Thursday: 9:00 AM - 5:00 PM (Surgery)</li>
                <li>Friday: 9:00 AM - 12:00 PM (Admin)</li>
             </ul>
          </div>

           {/* Section 2: Assigned Patients (Placeholder) */}
           <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 flex items-center gap-2">
                <Users className="h-5 w-5"/> Assigned Patients
            </h3>
            <p className="text-muted-foreground text-sm">
                A list or table of patients currently under this doctor's care would be displayed here.
            </p>
            {/* Example: Could add a mini patient list */}
            <div className="mt-2 space-y-1 text-sm">
                <Badge variant="secondary">Alice Johnson (Cardiology)</Badge>
                <Badge variant="secondary">Diana Prince (Cardiology)</Badge>
                {/* ... more patients */}
            </div>
           </div>

          {/* Section 3: Actions (Placeholder) */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 pt-4">Actions</h3>
            <div className="flex flex-wrap gap-2">
                <Badge>Edit Doctor Profile</Badge>
                <Badge variant="outline">View Appointment History</Badge>
                <Badge variant="outline">Manage Schedule</Badge>
                <Badge variant="destructive">Deactivate Profile</Badge>
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
