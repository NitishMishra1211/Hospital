import { PatientTable } from '@/components/dashboard/patient-table';
import { mockPatients } from '@/lib/mock-data';

export default function PatientDetailsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <h2 className="text-xl font-semibold text-muted-foreground mb-4">All Patient Appointments</h2>
      <PatientTable patients={mockPatients} />
      {/* Add more patient-specific details or actions here if needed */}
    </div>
  );
}
