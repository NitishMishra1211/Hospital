
import type { Doctor } from '@/lib/types'; // Corrected import path
import { DoctorCard } from './doctor-card'; // Import the DoctorCard component

interface DoctorGridProps {
  doctors: Doctor[];
}

export function DoctorGrid({ doctors }: DoctorGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
      {doctors.length === 0 && (
         <p className="col-span-full text-center text-muted-foreground py-4">
             No doctors found.
         </p>
      )}
    </div>
  );
}
