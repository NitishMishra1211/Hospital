
import { mockPatients, mockDoctors } from '@/lib/mock-data'; // Assuming doctors might be needed later
import { notFound } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, Stethoscope, Phone } from 'lucide-react';

// Helper function to find patient by ID (in a real app, this would fetch from an API/DB)
const getPatientById = (id: string) => {
  return mockPatients.find(patient => patient.id === id);
};

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = getPatientById(params.id);

  if (!patient) {
    notFound(); // Show 404 if patient not found
  }

  // Find the assigned doctor's details (optional, could enhance later)
  const doctor = mockDoctors.find(doc => doc.name === patient.doctor);

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} />
              <AvatarFallback className="text-xl">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">{patient.name}</CardTitle>
              <CardDescription className="text-muted-foreground flex items-center gap-1 mt-1">
                <Phone className="h-4 w-4" /> {patient.mobile}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2">Appointment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-medium">Date:</span> {patient.appointmentDate}
              </div>
            </div>
             <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-medium">Time:</span> {patient.appointmentTime}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                 <span className="font-medium">Assigned Doctor:</span> {patient.doctor}
              </div>
            </div>
             <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-muted-foreground" />
               <div>
                <span className="font-medium">Department:</span> {patient.department} <Badge variant="secondary" className="ml-1">{patient.departmentCode}</Badge>
               </div>
            </div>
             {doctor && (
                <div className="md:col-span-2 flex items-center gap-2 mt-2 pt-2 border-t">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <span className="font-medium">{doctor.name}</span>
                        <span className="text-muted-foreground text-xs block">{doctor.specialization}</span>
                    </div>
                </div>
             )}
          </div>

          {/* Placeholder for more patient details */}
          <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 pt-4">Medical History (Placeholder)</h3>
          <p className="text-muted-foreground text-sm">
            Past diagnoses, allergies, medications, etc. would be displayed here.
          </p>

           <h3 className="text-lg font-semibold text-primary mb-3 border-b pb-2 pt-4">Actions (Placeholder)</h3>
           <div className="flex gap-2">
             <Badge>Edit Patient Info</Badge>
             <Badge variant="outline">View Past Appointments</Badge>
             <Badge variant="destructive">Discharge Patient</Badge>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Optional: Add metadata generation if needed
// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const patient = getPatientById(params.id);
//   return {
//     title: patient ? `Patient Details - ${patient.name}` : 'Patient Not Found',
//   };
// }
