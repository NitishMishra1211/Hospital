
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export default function AnnouncementsPage() {
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
           {/* Placeholder for Announcements Feed */}
           <div className="border-dashed border-2 border-muted rounded-lg p-8 text-center">
             <p className="text-muted-foreground">Announcements Feed will be displayed here.</p>
             <p className="text-sm text-muted-foreground/70 mt-2">Display a list of recent announcements, possibly filterable by category.</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
