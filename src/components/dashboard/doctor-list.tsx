'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import type { Doctor } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";

interface DoctorListProps {
  doctors: Doctor[];
}

export function DoctorList({ doctors: initialDoctors }: DoctorListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [doctors, setDoctors] = React.useState(initialDoctors);

  React.useEffect(() => {
    const filteredDoctors = initialDoctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDoctors(filteredDoctors);
  }, [searchTerm, initialDoctors]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Card className="shadow-md rounded-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Available Doctors</CardTitle>
         <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8 w-full"
            aria-label="Search available doctors"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[calc(100%-1rem)] p-4 pt-0"> {/* Adjust height as needed */}
          <ul className="space-y-4">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <li key={doctor.id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  </div>
                </li>
              ))
            ) : (
               <p className="text-center text-muted-foreground py-4">No doctors found.</p>
            )}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
