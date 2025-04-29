import { DoctorTable } from '@/components/dashboard/doctor-table';
import { mockDoctors } from '@/lib/mock-data';

export default function DoctorDetailsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
       <h2 className="text-xl font-semibold text-muted-foreground mb-4">Doctor Information</h2>
      <DoctorTable doctors={mockDoctors} />
      {/* Add more doctor-specific details or actions here if needed */}
    </div>
  );
}
