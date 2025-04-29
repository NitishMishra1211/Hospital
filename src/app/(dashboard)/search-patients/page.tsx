
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Phone, FileText } from 'lucide-react'; // Added relevant icons
import { useToast } from '@/hooks/use-toast';
import { mockPatients } from '@/lib/mock-data'; // Import mock data
import { Patient } from '@/lib/mock-data'; // Import type
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


export default function SearchPatientsPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<Patient[]>([]);
    const [hasSearched, setHasSearched] = React.useState(false);
    const { toast } = useToast();

    const handleSearch = (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) event.preventDefault();
        setHasSearched(true);

        if (!searchTerm.trim()) {
            setSearchResults([]); // Clear results if search term is empty
            return;
        }

        // Simulate searching through mock data
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const results = mockPatients.filter(patient =>
            patient.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            patient.mobile.includes(lowerCaseSearchTerm) ||
            patient.id.toLowerCase().includes(lowerCaseSearchTerm)
        );

        setSearchResults(results);

        toast({
            title: "Search Complete",
            description: `${results.length} patient record(s) found for "${searchTerm}".`,
        });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        // Optional: Live search (uncomment handleSearch() call)
        // handleSearch();
    };

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Search Patient Records</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground pt-2">
                Find patient records by Name, Mobile Number, or Patient ID.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
           {/* Patient Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
                 <div className="relative flex-grow w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="patientSearch"
                        type="search"
                        placeholder="Enter Name, Mobile, or ID..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="pl-8 w-full"
                        aria-label="Search patient records"
                    />
                 </div>
                 <Button type="submit">
                    <Search className="mr-2 h-4 w-4" /> Search
                 </Button>
            </form>

           {/* Search Results Area */}
           <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">Search Results</h3>
            {hasSearched ? (
                 searchResults.length > 0 ? (
                    <div className="space-y-4">
                        {searchResults.map((patient) => (
                         <Link href={`/patient-details/${patient.id}`} key={patient.id} passHref legacyBehavior>
                            <a className="block group">
                                <Card className="hover:bg-muted/50 transition-colors cursor-pointer p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <Avatar className="h-12 w-12 hidden sm:flex">
                                    <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                    <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                    <p className="font-semibold text-lg group-hover:text-primary">{patient.name}</p>
                                    <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                        <span className="flex items-center gap-1"><Phone className="h-3 w-3"/> {patient.mobile}</span>
                                        <span className="flex items-center gap-1"><User className="h-3 w-3"/> ID: {patient.id}</span>
                                        <span className="flex items-center gap-1"><FileText className="h-3 w-3"/> Last Visit: {patient.appointmentDate}</span>
                                    </div>
                                    </div>
                                    <Badge variant="outline" className="mt-2 sm:mt-0 sm:ml-auto">View Details</Badge>
                                </Card>
                             </a>
                         </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No patient records found matching "{searchTerm}".</p>
                        <p className="text-sm">Try refining your search criteria.</p>
                    </div>
                )
            ) : (
                 <div className="text-center py-8 text-muted-foreground">
                    <p>Enter search criteria above to find patient records.</p>
                 </div>
            )}
           </div>

        </CardContent>
      </Card>
    </div>
  );
}
