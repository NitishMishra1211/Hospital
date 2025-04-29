
import { DoctorGrid } from '@/components/dashboard/doctor-grid'; // Use DoctorGrid
import { mockDoctors } from '@/lib/mock-data';

export default function DoctorDetailsPage() {
   const totalDoctors = mockDoctors.length;
  return (
    <div className="space-y-6 lg:space-y-8">
       <div className="flex justify-between items-center">
         <h2 className="text-xl font-semibold text-muted-foreground mb-4">Doctor Information</h2>
         <p className="text-sm font-medium text-muted-foreground">Total Doctors: {totalDoctors}</p>
       </div>
      <DoctorGrid doctors={mockDoctors} />
      {/* Add more doctor-specific details or actions here if needed */}
    </div>
  );
}
