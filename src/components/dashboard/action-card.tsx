
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link'; // Import Link
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserPlus, Ambulance, FlaskConical, Search, CalendarDays, Megaphone } from 'lucide-react'; // Added Search, CalendarDays, Megaphone
import * as React from 'react';

// Map icon names to actual Lucide components
const iconMap: { [key: string]: LucideIcon } = {
  UserPlus,
  Ambulance,
  FlaskConical,
  Search,         // Added Search
  CalendarDays,   // Added CalendarDays
  Megaphone,      // Added Megaphone
  // Add other icons here if needed
};

interface ActionCardProps {
  title: string;
  iconName: keyof typeof iconMap; // Accept icon name as a string
  href: string; // Add href for navigation
}

export function ActionCard({ title, iconName, href }: ActionCardProps) {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    console.error(`Icon "${iconName}" not found in iconMap.`);
    // Optionally render a default icon or null
    return (
         <Card className="shadow-md rounded-lg border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
                 <p className="text-lg font-semibold">{title}</p>
                 <p className="text-sm">Error: Icon not found</p>
            </CardContent>
         </Card>
    );
  }

  const cardContent = (
     <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
      <div className="p-3 rounded-full bg-primary/20 text-primary">
        <IconComponent className="h-8 w-8 " />
      </div>
      <p className="text-lg font-semibold">{title}</p>
      <Button variant="link" size="sm" className="text-primary hover:text-primary/80 pointer-events-none">
        Proceed
      </Button>
    </CardContent>
  );

  return (
    <Link href={href} passHref legacyBehavior>
      <a className="block group"> {/* Use anchor tag for legacyBehavior */}
        <Card
          className="shadow-md rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-primary/10 to-accent/10 h-full group-hover:ring-2 group-hover:ring-primary/50"
          role="button" // Add role for accessibility
          tabIndex={0} // Make it focusable
        >
          {cardContent}
        </Card>
      </a>
    </Link>
  );
}
