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
import type { Patient } from '@/lib/mock-data';
import { ScrollArea } from "@/components/ui/scroll-area";

interface PatientTableProps {
  patients: Patient[];
}

export function PatientTable({ patients: initialPatients }: PatientTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [patients, setPatients] = React.useState(initialPatients);

  React.useEffect(() => {
    const filteredPatients = initialPatients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mobile.includes(searchTerm) ||
      patient.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.departmentCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPatients(filteredPatients);
  }, [searchTerm, initialPatients]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Placeholder functions for filter and download
  const handleFilterClick = () => {
    console.log("Filter clicked");
    // Implement filter logic or open filter modal
  };

  const handleDownloadClick = () => {
    console.log("Download clicked");
    // Implement download logic (e.g., generate CSV)
  };


  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8 w-full"
            aria-label="Search patient appointments"
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
      <ScrollArea className="h-[400px] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>MOB</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {patient.name}
                    </div>
                  </TableCell>
                  <TableCell>{patient.mobile}</TableCell>
                  <TableCell>
                    {patient.appointmentDate}
                    <span className="text-muted-foreground text-xs block">{patient.appointmentTime}</span>
                  </TableCell>
                  <TableCell>{patient.doctor}</TableCell>
                  <TableCell>
                     {patient.department}
                     <span className="text-muted-foreground text-xs block">{patient.departmentCode}</span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
       </ScrollArea>
    </div>
  );
}
