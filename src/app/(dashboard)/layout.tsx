
'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
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
  LayoutDashboard,
  User,
  Users,
  CreditCard,
  PhoneCall,
  Bell,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Patient Details', icon: User, href: '/patient-details' },
  { name: 'Doctor Details', icon: Users, href: '/doctor-details' },
  { name: 'Payment Details', icon: CreditCard, href: '#' }, // Placeholder href
  { name: 'E-Channeling', icon: PhoneCall, href: '#' }, // Placeholder href
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Helper function to determine active state, considering '/' specifically
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    // For other paths, check if the pathname starts with the href
    return pathname.startsWith(href) && href !== '/';
  };


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
                  isActive={isActive(item.href)}
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
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </SidebarHeader>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            {/* Find the current nav item to display its name as the title */}
            <h1 className="text-2xl font-semibold">
              {navItems.find((item) => isActive(item.href))?.name || 'MediCore'}
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
