'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, Search, Filter } from 'lucide-react';
import type { Doctor } from '@/lib/mock-data';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DoctorTableProps {
  doctors: Doctor[];
}

export function DoctorTable({ doctors: initialDoctors }: DoctorTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [doctors, setDoctors] = React.useState(initialDoctors);

  React.useEffect(() => {
    const filteredDoctors = initialDoctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDoctors(filteredDoctors);
  }, [searchTerm, initialDoctors]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Placeholder functions for filter and download
  const handleFilterClick = () => {
    console.log('Filter clicked');
    // Implement filter logic or open filter modal
  };

  const handleDownloadClick = () => {
    console.log('Download clicked');
    // Implement download logic (e.g., generate CSV)
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8 w-full"
            aria-label="Search doctors"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleFilterClick}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadClick}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[600px] w-full"> {/* Adjust height as needed */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              {/* Add more columns if needed, e.g., Contact, Department */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={doctor.avatarUrl}
                          alt={doctor.name}
                        />
                        <AvatarFallback>
                          {doctor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {doctor.name}
                    </div>
                  </TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  {/* Render additional cells if columns were added */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center h-24"> {/* Adjust colSpan if needed */}
                  No doctors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
