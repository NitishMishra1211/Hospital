
import { DoctorTable } from '@/components/dashboard/doctor-table';
import { ActionCard } from '@/components/dashboard/action-card';
import { mockDoctors } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Search } from 'lucide-react';

export default function HomePage() {
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
            {/* Optional: Add a quick search or summary here */}
            <p className="text-sm">Use the navigation on the left to access different sections.</p>
          </CardContent>
        </Card>


      {/* Main Content Area - Doctor Table */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
           <h2 className="text-xl font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                <Users className="h-5 w-5"/> Our Doctors
            </h2>
          <DoctorTable doctors={mockDoctors} />
        </div>
      </div>

      {/* Feature/Action Cards */}
       <h2 className="text-xl font-semibold text-muted-foreground mb-4 pt-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <ActionCard title="Admit New Patient" iconName="UserPlus" />
        <ActionCard title="Emergency Room Status" iconName="Ambulance" />
        <ActionCard title="Pharmacy Details" iconName="FlaskConical" />
        {/* Add more relevant home page actions if needed */}
         <ActionCard title="Search Patient Records" iconName="Search" />
         <ActionCard title="View Today's Schedule" iconName="CalendarDays" />
         <ActionCard title="Hospital Announcements" iconName="Megaphone" />
      </div>
    </div>
  );
}
