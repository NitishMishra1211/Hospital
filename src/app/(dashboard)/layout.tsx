
'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link'; // <-- Import Link
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Home,
  User,
  Users,
  CreditCard,
  PhoneCall,
  Bell,
  UserPlus,
  Ambulance,
  FlaskConical,
  Search,
  CalendarDays,
  Megaphone,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Patient Details', icon: User, href: '/patient-details' },
  { name: 'Doctor Details', icon: Users, href: '/doctor-details' },
  { name: 'Admit Patient', icon: UserPlus, href: '/admit-patient' },
  { name: 'ER Status', icon: Ambulance, href: '/emergency-status' },
  { name: 'Pharmacy', icon: FlaskConical, href: '/pharmacy-details' },
  { name: 'Search Patients', icon: Search, href: '/search-patients' },
  { name: 'Schedule', icon: CalendarDays, href: '/todays-schedule' },
  { name: 'Announcements', icon: Megaphone, href: '/announcements' },
  { name: 'Payment Details', icon: CreditCard, href: '/payment-details' },
  { name: 'E-Channeling', icon: PhoneCall, href: '/e-channeling' },
  { name: 'Settings', icon: Settings, href: '/settings' }, // Added Settings link
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Helper function to determine active state, considering base paths and dynamic routes
  const isActive = (href: string) => {
    // Handle exact match for root '/'
    if (href === '/') {
      return pathname === '/';
    }
    // Check if the current pathname starts with the href for nested routes
    // Ensure it's not just a partial match (e.g., '/' matching '/doctors')
    if (href !== '/' && pathname.startsWith(href)) {
      // Check if the next character after the href part is '/' or end of string
      const nextChar = pathname[href.length];
      return nextChar === '/' || nextChar === undefined;
    }
    return false;
  };


  // Find the active nav item for the header title
  // Prioritize longer matching paths for dynamic routes
   let activeNavItem = null;
   let longestMatchLength = 0;

    // First pass: Exact match or root
    for (const item of navItems) {
        if (pathname === item.href) {
            activeNavItem = item;
            longestMatchLength = item.href.length;
            break; // Exact match found, prioritize this
        }
    }

    // Second pass: StartsWith match (if no exact match found)
    if (!activeNavItem) {
        for (const item of navItems) {
            if (item.href !== '/' && pathname.startsWith(item.href)) {
                 const nextChar = pathname[item.href.length];
                 // Ensure it's a true sub-path or exact match start
                 if (nextChar === '/' || nextChar === undefined) {
                    if (item.href.length > longestMatchLength) {
                        activeNavItem = item;
                        longestMatchLength = item.href.length;
                    }
                 }
            }
        }
    }


  // Use "Home" as default title if no other item is active
  const headerTitle = activeNavItem ? activeNavItem.name : 'Home';


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-3 p-2">
            <Logo />
            <span className="font-semibold text-lg text-sidebar-foreground">
              MediCore Hospital
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2 flex-1">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  href={item.href}
                  isActive={isActive(item.href)} // Use updated isActive function
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarHeader className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 ">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://picsum.photos/seed/admin/40/40"
                alt="Admin User"
              />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sidebar-foreground">Admin User</p>
              <p className="text-xs text-sidebar-foreground/70">
                admin@medicore.com
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              asChild // Use asChild to make it a link if needed
            >
              <Link href="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </SidebarHeader>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            {/* Display the determined header title */}
            <h1 className="text-2xl font-semibold">
              {headerTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>
            <Avatar className="h-9 w-9 hidden md:flex">
              <AvatarImage
                src="https://picsum.photos/seed/admin/40/40"
                alt="Admin User"
              />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

