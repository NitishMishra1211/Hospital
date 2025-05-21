
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Search, Filter, UserCircle } from 'lucide-react';
import type { Patient } from '@/lib/types'; // Use the new Patient type
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';

interface PatientTableProps {
  patients: Patient[];
}

export function PatientTable({ patients: initialPatients }: PatientTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredPatients, setFilteredPatients] = React.useState(initialPatients);

  React.useEffect(() => {
    setFilteredPatients(initialPatients); // Update when initialPatients prop changes
  }, [initialPatients]);

  React.useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = initialPatients.filter((patient) =>
      patient.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      patient.pid.toLowerCase().includes(lowerCaseSearchTerm) ||
      patient.phoneno.includes(searchTerm) ||
      (patient.doctorid && patient.doctorid.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (patient.disease && patient.disease.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (patient.gender && patient.gender.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredPatients(results);
  }, [searchTerm, initialPatients]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = () => {
    console.log("Filter clicked");
    // Implement filter logic or open filter modal
  };

  const handleDownloadClick = () => {
    console.log("Download clicked");
    // Implement download logic (e.g., generate CSV)
  };

  const handleRowClick = (patientId: string) => {
    router.push(`/patient-details/${patientId}`);
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients (Name, PID, Phone, Disease...)"
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8 w-full"
            aria-label="Search patient records"
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
      <ScrollArea className="h-[600px] w-full"> {/* Adjusted height */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone No.</TableHead>
              <TableHead>Disease</TableHead>
              <TableHead>Doctor ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow
                  key={patient.pid}
                  onClick={() => handleRowClick(patient.pid)}
                  className="cursor-pointer hover:bg-muted/60"
                >
                  <TableCell><Badge variant="outline">{patient.pid}</Badge></TableCell>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phoneno}</TableCell>
                  <TableCell>{patient.disease}</TableCell>
                  <TableCell>{patient.doctorid}</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); handleRowClick(patient.pid); }}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24"> {/* Adjusted colSpan */}
                  No patients found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
       </ScrollArea>
    </div>
  );
}
