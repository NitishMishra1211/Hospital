
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Megaphone, Filter, CalendarDays, UserCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';


// Mock data for demonstration
const mockAnnouncements = [
  {
    id: 'a001',
    title: 'New COVID-19 Booster Clinic Dates',
    date: '2024-08-18',
    author: 'Public Health Dept.',
    content: 'Additional dates for the COVID-19 booster clinic have been added for next week. Please encourage eligible patients to book an appointment. See internal memo for details.',
    tags: ['Clinic', 'COVID-19', 'Public Health'],
  },
  {
    id: 'a002',
    title: 'System Maintenance Scheduled for Sunday',
    date: '2024-08-17',
    author: 'IT Department',
    content: 'Please be advised that the main hospital EMR system will undergo scheduled maintenance this Sunday from 2:00 AM to 4:00 AM. Downtime procedures will be in effect.',
    tags: ['System', 'IT', 'Maintenance'],
  },
   {
    id: 'a003',
    title: 'Annual Staff Training Reminder',
    date: '2024-08-15',
    author: 'Human Resources',
    content: 'A reminder that all staff must complete their mandatory annual training modules by September 30th. Please log in to the training portal to check your status.',
    tags: ['Training', 'Staff', 'HR'],
  },
   {
    id: 'a004',
    title: 'Welcome New Cardiology Fellow: Dr. Eva Rostova',
    date: '2024-08-14',
    author: 'Cardiology Dept.',
    content: 'We are pleased to welcome Dr. Eva Rostova to the Cardiology department as our new fellow. Please make her feel welcome!',
    tags: ['Staff', 'Cardiology', 'Welcome'],
  },
];


export default function AnnouncementsPage() {
     // Placeholder filter function
    const handleFilter = () => {
        console.log("Filter button clicked");
        // Implement filter logic here (e.g., by tag, date range)
    };

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10 p-6">
           <div className="flex items-center gap-3">
            <Megaphone className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Hospital Announcements</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground pt-2">
                Latest news, updates, and important announcements for hospital staff.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            <div className="flex justify-end">
                 <Button variant="outline" size="sm" onClick={handleFilter}>
                    <Filter className="mr-2 h-4 w-4" /> Filter Announcements
                </Button>
            </div>

            {/* Announcements Feed */}
            <div className="space-y-6">
                {mockAnnouncements.length > 0 ? (
                    mockAnnouncements.map((announcement, index) => (
                        <React.Fragment key={announcement.id}>
                             <Card className="border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                                    <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 pt-1">
                                        <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3"/> {announcement.date}</span>
                                        <span className="flex items-center gap-1"><UserCircle className="h-3 w-3"/> By: {announcement.author}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground/90">{announcement.content}</p>
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {announcement.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                             </Card>
                             {index < mockAnnouncements.length - 1 && <Separator />}
                         </React.Fragment>
                    ))
                 ) : (
                     <div className="text-center py-8 text-muted-foreground">
                        <p>No announcements available at this time.</p>
                     </div>
                 )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
