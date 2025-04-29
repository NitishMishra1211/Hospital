
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Ambulance, Clock, Users, BedDouble, Phone, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';


// Mock data for demonstration
const erStatus = {
  averageWaitTime: 45, // minutes
  patientsWaiting: 12,
  availableBeds: 8,
  totalBeds: 20,
  onCallStaff: [
    { name: 'Dr. Alice Brown', role: 'ER Physician' },
    { name: 'Nurse Charlie Davis', role: 'Charge Nurse' },
    { name: 'Dr. Emily White', role: 'Cardiologist (On Call)' },
  ],
  triageLevelCounts: {
    critical: 2,
    urgent: 5,
    stable: 5,
  },
};

export default function EmergencyStatusPage() {
  const bedOccupancy = ((erStatus.totalBeds - erStatus.availableBeds) / erStatus.totalBeds) * 100;

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-destructive/10 p-6">
          <div className="flex items-center gap-3">
            <Ambulance className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-bold">Emergency Room Status</CardTitle>
          </div>
           <CardDescription className="text-muted-foreground pt-2">
              Real-time overview of the Emergency Department's current operations.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
           {/* Key Metrics Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             <Card className="bg-background/70">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-1"><Clock className="h-4 w-4"/> Avg. Wait Time</CardDescription>
                    <CardTitle className="text-3xl">{erStatus.averageWaitTime} min</CardTitle>
                </CardHeader>
             </Card>
              <Card className="bg-background/70">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-1"><Users className="h-4 w-4"/> Patients Waiting</CardDescription>
                    <CardTitle className="text-3xl">{erStatus.patientsWaiting}</CardTitle>
                </CardHeader>
             </Card>
              <Card className="bg-background/70">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-1"><BedDouble className="h-4 w-4"/> Available Beds</CardDescription>
                    <CardTitle className="text-3xl">{erStatus.availableBeds} / {erStatus.totalBeds}</CardTitle>
                </CardHeader>
                <CardContent>
                   <Progress value={bedOccupancy} aria-label={`${bedOccupancy.toFixed(0)}% Bed Occupancy`} className="h-2"/>
                   <p className="text-xs text-muted-foreground mt-1 text-right">{bedOccupancy.toFixed(0)}% Occupied</p>
                </CardContent>
             </Card>
           </div>

           <Separator />

           {/* On-Call Staff */}
           <div>
             <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
               <Phone className="h-5 w-5"/> On-Call Staff
             </h3>
             <div className="space-y-2">
               {erStatus.onCallStaff.map((staff, index) => (
                 <Card key={index} className="p-3 bg-muted/50 flex justify-between items-center">
                   <div>
                     <p className="font-medium">{staff.name}</p>
                     <p className="text-xs text-muted-foreground">{staff.role}</p>
                   </div>
                   <Button variant="outline" size="sm">Contact</Button> {/* Placeholder action */}
                 </Card>
               ))}
             </div>
           </div>

            <Separator />

           {/* Triage Levels */}
           <div>
             <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                <UserCheck className="h-5 w-5"/> Triage Status
            </h3>
             <div className="flex flex-wrap gap-2">
                <Badge variant="destructive" className="text-sm px-3 py-1">
                    Critical: {erStatus.triageLevelCounts.critical}
                </Badge>
                 <Badge variant="secondary" className="bg-yellow-500 text-yellow-900 hover:bg-yellow-500/80 text-sm px-3 py-1">
                     Urgent: {erStatus.triageLevelCounts.urgent}
                 </Badge>
                 <Badge variant="secondary" className="bg-green-500 text-green-900 hover:bg-green-500/80 text-sm px-3 py-1">
                    Stable: {erStatus.triageLevelCounts.stable}
                </Badge>
             </div>
             <p className="text-xs text-muted-foreground mt-2">
                 Number of patients currently waiting, categorized by triage level.
             </p>
           </div>

        </CardContent>
      </Card>
    </div>
  );
}
