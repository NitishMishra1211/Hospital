import { MetricCard } from '@/components/dashboard/metric-card';
import { PatientTable } from '@/components/dashboard/patient-table';
import { DoctorList } from '@/components/dashboard/doctor-list';
import { ActionCard } from '@/components/dashboard/action-card';
import { mockPatients, mockDoctors } from '@/lib/mock-data';
import { LayoutDashboard, Users, PhoneCall, User } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left/Center Column (Metrics + Patient Table) */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Top Statistics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
              title="Total Appointments"
              value="140"
              icon={LayoutDashboard}
            />
            <MetricCard title="Total Patients" value="370" icon={Users} />
            <MetricCard
              title="Total Cancellations"
              value="070"
              icon={PhoneCall}
            />{' '}
            {/* Using PhoneCall for cancellations */}
            <MetricCard title="Avg Appts/Doctor" value="120" icon={User} />{' '}
            {/* Using User for doctor average */}
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
        <ActionCard title="Admit New Patient" iconName="UserPlus" />
        <ActionCard title="Emergency Room" iconName="Ambulance" />
        <ActionCard title="Pharmacy Details" iconName="FlaskConical" />
      </div>
    </div>
  );
}
