
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarDays, Clock, User, Stethoscope, Filter } from 'lucide-react';
import { mockPatients, mockDoctors } from '@/lib/mock-data'; // Use mock data
import { Patient } from '@/lib/mock-data'; // Import type
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { format, isToday } from 'date-fns'; // For date comparison
import Link from 'next/link';


// Function to get today's date in YYYY-MM-DD format
const getTodaysDateString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export default function TodaysSchedulePage() {
  const todayString = getTodaysDateString();

  // Filter mockPatients for appointments scheduled today
  const todaysAppointments = mockPatients.filter(patient => {
     try {
        // Assuming patient.appointmentDate is 'YYYY-MM-DD'
        const appointmentDate = new Date(patient.appointmentDate + 'T00:00:00'); // Add time to avoid timezone issues
        return isToday(appointmentDate);
      } catch (e) {
        console.error("Error parsing date:", patient.appointmentDate, e);
        return false; // Skip if date is invalid
      }
  });

  // Sort appointments by time (assuming HH:MM AM/PM format)
  todaysAppointments.sort((a, b) => {
    const timeA = new Date(`1970-01-01 ${a.appointmentTime}`);
    const timeB = new Date(`1970-01-01 ${b.appointmentTime}`);
    return timeA.getTime() - timeB.getTime();
  });

  // Placeholder filter function
  const handleFilter = () => {
    console.log("Filter button clicked");
    // Implement filter logic here (e.g., by doctor, department)
  };


  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10 p-6">
           <div className="flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Today's Schedule ({todayString})</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground pt-2">
                Overview of appointments scheduled for today.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleFilter}>
                    <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
            </div>

            {/* Schedule Table */}
            <ScrollArea className="h-[600px] w-full border rounded-md">
                <Table>
                <TableHeader className="sticky top-0 bg-muted/90 backdrop-blur-sm">
                    <TableRow>
                    <TableHead><Clock className="inline h-4 w-4 mr-1"/> Time</TableHead>
                    <TableHead><User className="inline h-4 w-4 mr-1"/> Patient</TableHead>
                    <TableHead><Stethoscope className="inline h-4 w-4 mr-1"/> Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {todaysAppointments.length > 0 ? (
                    todaysAppointments.map((patient) => {
                        const doctor = mockDoctors.find(doc => doc.name === patient.doctor);
                        return (
                        <TableRow key={patient.id}>
                            <TableCell className="font-medium">{patient.appointmentTime}</TableCell>
                            <TableCell>
                                <Link href={`/patient-details/${patient.id}`} className="flex items-center gap-2 hover:text-primary hover:underline">
                                     <Avatar className="h-8 w-8">
                                        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {patient.name}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {doctor ? (
                                     <Link href={`/doctor-details/${doctor.id}`} className="flex items-center gap-2 hover:text-primary hover:underline">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                                            <AvatarFallback>{doctor.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        {patient.doctor}
                                     </Link>
                                ) : (
                                    patient.doctor
                                )}
                            </TableCell>
                             <TableCell>
                                {patient.department} <Badge variant="secondary" className="ml-1">{patient.departmentCode}</Badge>
                             </TableCell>
                        </TableRow>
                        );
                    })
                    ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                         No appointments scheduled for today.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
