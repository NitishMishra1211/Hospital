'use client';

import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserPlus, Ambulance, FlaskConical } from 'lucide-react';
import * as React from 'react';

// Map icon names to actual Lucide components
const iconMap: { [key: string]: LucideIcon } = {
  UserPlus,
  Ambulance,
  FlaskConical,
  // Add other icons here if needed
};

interface ActionCardProps {
  title: string;
  iconName: keyof typeof iconMap; // Accept icon name as a string
}

export function ActionCard({ title, iconName }: ActionCardProps) {
  const IconComponent = iconMap[iconName];

  const handleClick = () => {
    // Placeholder for client-side action, e.g., navigation or opening a modal
    console.log(`${title} card clicked (handled client-side)`);
    // Example: router.push('/admit-patient'); or setModalOpen(true);
  };

  if (!IconComponent) {
    console.error(`Icon "${iconName}" not found in iconMap.`);
    // Optionally render a default icon or null
    return null;
  }

  return (
    <Card
      className="shadow-md rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-primary/10 to-accent/10"
      onClick={handleClick} // Use internal handler or wrap with Link/DialogTrigger
    >
       <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="p-3 rounded-full bg-primary/20 text-primary">
          <IconComponent className="h-8 w-8 " />
        </div>
        <p className="text-lg font-semibold">{title}</p>
        <Button variant="link" size="sm" className="text-primary hover:text-primary/80 pointer-events-none">
          Proceed
        </Button>
      </CardContent>
    </Card>
  );
}
