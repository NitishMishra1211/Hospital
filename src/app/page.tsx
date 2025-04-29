import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Settings, LayoutDashboard, User, Users, CreditCard, PhoneCall, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MetricCard } from '@/components/dashboard/metric-card';
import { PatientTable } from '@/components/dashboard/patient-table';
import { DoctorList } from '@/components/dashboard/doctor-list';
import { ActionCard } from '@/components/dashboard/action-card';
import { mockPatients, mockDoctors } from '@/lib/mock-data';
import { Badge } from "@/components/ui/badge";

// Placeholder function for action card clicks - Removed as it cannot be passed to client component

export default function Home() {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { name: 'Patient Details', icon: User, href: '#' },
    { name: 'Doctor Details', icon: Users, href: '#' },
    { name: 'Payment Details', icon: CreditCard, href: '#' },
    { name: 'E-Channeling', icon: PhoneCall, href: '#' },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
           <div className="flex items-center gap-3 p-2">
            <Logo />
            <span className="font-semibold text-lg text-sidebar-foreground">MediCore Hospital</span>
           </div>
        </SidebarHeader>
        <SidebarContent className="p-2 flex-1">
           <SidebarMenu>
             {navItems.map((item) => (
               <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton href={item.href} isActive={item.name === 'Dashboard'}>
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
                 <AvatarImage src="https://picsum.photos/seed/admin/40/40" alt="Admin User" />
                 <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sidebar-foreground">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70">admin@medicore.com</p>
              </div>
               <Button variant="ghost" size="icon" className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                 <Settings className="h-5 w-5" />
               </Button>
            </div>
        </SidebarHeader>
      </Sidebar>
      <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden"/>
                 <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>
             <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" className="relative">
                 <Bell className="h-5 w-5" />
                 <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">3</Badge>
               </Button>
                <Avatar className="h-9 w-9 hidden md:flex">
                 <AvatarImage src="https://picsum.photos/seed/admin/40/40" alt="Admin User" />
                 <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

              {/* Left/Center Column (Patient Table) */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Top Statistics Row */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <MetricCard title="Total Appointments" value="140" icon={LayoutDashboard} />
                  <MetricCard title="Total Patients" value="370" icon={Users} />
                  <MetricCard title="Total Cancellations" value="070" icon={PhoneCall} /> {/* Using PhoneCall for cancellations */}
                  <MetricCard title="Total Avg per Doctor" value="120" icon={User} /> {/* Using User for doctor average */}
                </div>

                {/* Patient Details Table */}
                <PatientTable patients={mockPatients} />
              </div>

              {/* Right Column (Doctor List) */}
              <div className="lg:col-span-1 h-full">
                <DoctorList doctors={mockDoctors} />
              </div>
            </div>

            {/* Bottom Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Pass iconName as string */}
              <ActionCard title="Admit New Patient" iconName="UserPlus" />
              <ActionCard title="Emergency Room" iconName="Ambulance" />
              <ActionCard title="Pharmacy Details" iconName="FlaskConical" />
            </div>
          </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
