
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export default function AdmitPatientPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex items-center gap-3">
            <UserPlus className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Admit New Patient</CardTitle>
          </div>
           <CardDescription className="text-muted-foreground pt-2">
                Fill in the form below to admit a new patient into the hospital system.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
           {/* Placeholder for Patient Admission Form */}
           <div className="border-dashed border-2 border-muted rounded-lg p-8 text-center">
             <p className="text-muted-foreground">Patient Admission Form will be displayed here.</p>
             <p className="text-sm text-muted-foreground/70 mt-2">This section will contain fields for patient demographics, insurance details, reason for admission, assigned doctor, etc.</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
