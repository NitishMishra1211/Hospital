
'use client';

import type { Doctor } from '@/lib/types'; // Use the updated Doctor type
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Building } from 'lucide-react'; // Added Building icon
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/doctor-details/${doctor.id}`);
  };

  const initials = doctor.name ? doctor.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'DR';

  return (
    <Card
        className="shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden h-full cursor-pointer border border-border/50 bg-card/80 backdrop-blur-sm"
        onClick={handleViewProfile}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleViewProfile(); }}
     >
      <CardContent className="p-4 flex flex-col items-center text-center flex-grow">
        <Avatar className="h-20 w-20 mb-3 border-2 border-primary">
          <AvatarImage src={doctor.avatarUrl || undefined} alt={doctor.name} data-ai-hint="doctor avatar" />
          <AvatarFallback className="text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold mb-1">{doctor.name}</h3>
        {doctor.specialization && doctor.specialization !== 'N/A' && (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs mb-1">
                <Stethoscope className="h-3 w-3"/>
                {doctor.specialization}
            </Badge>
        )}
        {doctor.department && (
             <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Building className="h-3 w-3"/>{doctor.department}
            </p>
        )}
      </CardContent>
       <CardFooter className="p-3 bg-muted/50 mt-auto border-t">
         <Button
            variant="link"
            size="sm"
            className="w-full text-primary hover:text-primary/80"
            onClick={(e) => { e.stopPropagation(); handleViewProfile(); }}
            aria-label={`View profile for ${doctor.name}`}
         >
           View Profile
         </Button>
       </CardFooter>
    </Card>
  );
}
