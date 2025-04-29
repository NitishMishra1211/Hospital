
'use client';

import type { Doctor } from '@/lib/mock-data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Stethoscope } from 'lucide-react';
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

  return (
    <Card
        className="shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden h-full cursor-pointer border border-border/50 bg-card/80 backdrop-blur-sm"
        onClick={handleViewProfile} // Make the entire card clickable
        role="button" // Add role for accessibility
        tabIndex={0} // Make it focusable
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleViewProfile(); }} // Allow keyboard activation
     >
      <CardContent className="p-4 flex flex-col items-center text-center flex-grow">
        <Avatar className="h-20 w-20 mb-3 border-2 border-primary">
          <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
          <AvatarFallback className="text-xl">
            {doctor.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold mb-1">{doctor.name}</h3>
        <Badge variant="secondary" className="flex items-center gap-1 text-xs mb-2">
            <Stethoscope className="h-3 w-3"/>
            {doctor.specialization}
        </Badge>
        {/* Placeholder for department if available */}
        {/* <p className="text-xs text-muted-foreground">Department: Placeholder</p> */}
      </CardContent>
       <CardFooter className="p-3 bg-muted/50 mt-auto border-t">
         <Button
            variant="link"
            size="sm"
            className="w-full text-primary hover:text-primary/80"
            onClick={(e) => { e.stopPropagation(); handleViewProfile(); }} // Prevent card click from triggering twice
            aria-label={`View profile for ${doctor.name}`}
         >
           View Profile
         </Button>
       </CardFooter>
    </Card>
  );
}
