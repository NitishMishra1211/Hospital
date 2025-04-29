
import { DoctorGrid } from '@/components/dashboard/doctor-grid'; // Use DoctorGrid for attractive display
import { ActionCard } from '@/components/dashboard/action-card';
import { mockDoctors } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react'; // Keep Users icon

export default function HomePage() {
  const totalDoctors = mockDoctors.length;

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
             <p className="text-sm font-medium text-muted-foreground">Total Doctors: {totalDoctors}</p>
         </div>
        <DoctorGrid doctors={mockDoctors} />
      </div>

    </div>
  );
}
