
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Ambulance } from 'lucide-react';

export default function EmergencyStatusPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-destructive/10 p-6">
          <div className="flex items-center gap-3">
            <Ambulance className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-bold">Emergency Room Status</CardTitle>
          </div>
           <CardDescription className="text-muted-foreground pt-2">
              Overview of the current status of the Emergency Room.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
           {/* Placeholder for Emergency Room Status Details */}
           <div className="border-dashed border-2 border-muted rounded-lg p-8 text-center">
             <p className="text-muted-foreground">ER Status Dashboard will be displayed here.</p>
             <p className="text-sm text-muted-foreground/70 mt-2">This could include waiting times, number of patients, available beds, on-call staff, etc.</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
