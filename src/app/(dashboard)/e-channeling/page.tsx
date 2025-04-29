
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PhoneCall, Search, Calendar as CalendarIcon, UserCircle, Stethoscope, Clock, CheckCircle } from 'lucide-react';
import { mockDoctors } from '@/lib/mock-data';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from '@/hooks/use-toast';

// Extend mock doctor data slightly for this page context
const eChannelingDoctors = mockDoctors.map(doc => ({
    ...doc,
    availableSlots: [ // Example slots
        { time: '09:00 AM', available: true },
        { time: '09:30 AM', available: false }, // Booked
        { time: '10:00 AM', available: true },
        { time: '10:30 AM', available: true },
        { time: '11:00 AM', available: false }, // Booked
        { time: '11:30 AM', available: true },
    ]
}));

export default function EChannelingPage() {
    const [searchSpecialization, setSearchSpecialization] = React.useState('');
    const [selectedDoctorId, setSelectedDoctorId] = React.useState<string | undefined>();
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = React.useState<string | undefined>();
    const [patientName, setPatientName] = React.useState('');
    const [patientContact, setPatientContact] = React.useState('');
    const { toast } = useToast();

    const filteredDoctors = eChannelingDoctors.filter(doctor =>
        doctor.specialization.toLowerCase().includes(searchSpecialization.toLowerCase())
    );

    const selectedDoctor = eChannelingDoctors.find(doc => doc.id === selectedDoctorId);

    const handleBooking = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedDoctor || !selectedDate || !selectedTime || !patientName || !patientContact) {
            toast({
                variant: "destructive",
                title: "Booking Failed",
                description: "Please fill in all required fields.",
            });
            return;
        }

        // Simulate booking process
        console.log("Booking Details:", {
            doctor: selectedDoctor.name,
            date: format(selectedDate, "PPP"),
            time: selectedTime,
            patientName,
            patientContact,
        });

        toast({
            title: "Appointment Booked Successfully!",
            description: `Appointment with ${selectedDoctor.name} on ${format(selectedDate, "PPP")} at ${selectedTime} for ${patientName}. (Simulation)`,
            action: <CheckCircle className="text-green-500" />,
        });

        // Reset form
        setSearchSpecialization('');
        setSelectedDoctorId(undefined);
        setSelectedDate(undefined);
        setSelectedTime(undefined);
        setPatientName('');
        setPatientContact('');
    };


  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10 p-6">
           <div className="flex items-center gap-3">
            <PhoneCall className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">E-Channeling (Book Appointment)</CardTitle>
          </div>
           <CardDescription className="text-muted-foreground pt-2">
              Search for doctors and book appointments online.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">

            {/* Doctor Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">1. Find a Doctor</CardTitle>
                     <div className="relative mt-2">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by specialization (e.g., Cardiology)"
                            value={searchSpecialization}
                            onChange={(e) => {
                                setSearchSpecialization(e.target.value);
                                setSelectedDoctorId(undefined); // Reset doctor selection on search change
                                setSelectedDate(undefined);
                                setSelectedTime(undefined);
                            }}
                            className="pl-8 w-full md:w-1/2 lg:w-1/3"
                            aria-label="Search doctors by specialization"
                        />
                    </div>
                </CardHeader>
                 <CardContent className="space-y-4">
                    {filteredDoctors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-1">
                            {filteredDoctors.map((doctor) => (
                                <Card
                                    key={doctor.id}
                                    className={cn(
                                        "cursor-pointer transition-colors hover:bg-muted/50",
                                        selectedDoctorId === doctor.id && "ring-2 ring-primary bg-muted/60"
                                    )}
                                    onClick={() => {
                                        setSelectedDoctorId(doctor.id);
                                        setSelectedDate(undefined); // Reset date/time when doctor changes
                                        setSelectedTime(undefined);
                                    }}
                                >
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                        <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                        <p className="font-semibold">{doctor.name}</p>
                                        <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                         </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">
                           {searchSpecialization ? 'No doctors found for this specialization.' : 'Enter a specialization to search for doctors.'}
                        </p>
                    )}
                 </CardContent>
            </Card>

            {/* Appointment Booking Form */}
            {selectedDoctor && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">2. Select Date & Time for {selectedDoctor.name}</CardTitle>
                        <CardDescription>{selectedDoctor.specialization}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <form onSubmit={handleBooking} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {/* Date Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Date *</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !selectedDate && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={(date) => {
                                                    setSelectedDate(date);
                                                    setSelectedTime(undefined); // Reset time when date changes
                                                }}
                                                initialFocus
                                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                 {/* Time Slot Selection */}
                                <div className="space-y-2">
                                     <label className="text-sm font-medium">Select Time Slot *</label>
                                     {selectedDate ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedDoctor.availableSlots.map((slot) => (
                                                <Button
                                                    key={slot.time}
                                                    type="button"
                                                    variant={selectedTime === slot.time ? "default" : "outline"}
                                                    size="sm"
                                                    disabled={!slot.available}
                                                    onClick={() => setSelectedTime(slot.time)}
                                                    className={cn(!slot.available && "text-muted-foreground line-through")}
                                                >
                                                     <Clock className="mr-1 h-3 w-3"/> {slot.time}
                                                </Button>
                                            ))}
                                        </div>
                                     ) : (
                                         <p className="text-sm text-muted-foreground">Please select a date first.</p>
                                     )}
                                </div>
                            </div>

                             {/* Patient Details */}
                            <div className="pt-4 border-t">
                                <h3 className="text-md font-semibold mb-3">3. Enter Patient Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="patientName" className="text-sm font-medium">Patient Full Name *</label>
                                        <Input id="patientName" placeholder="e.g., Jane Smith" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="patientContact" className="text-sm font-medium">Contact Number *</label>
                                        <Input id="patientContact" type="tel" placeholder="e.g., 555-987-6543" value={patientContact} onChange={(e) => setPatientContact(e.target.value)} required />
                                    </div>
                                </div>
                             </div>

                             {/* Booking Button */}
                             <div className="flex justify-end pt-4">
                                <Button type="submit">
                                    <CheckCircle className="mr-2 h-4 w-4"/> Book Appointment
                                </Button>
                             </div>
                         </form>
                    </CardContent>
                 </Card>
            )}

        </CardContent>
      </Card>
    </div>
  );
}

