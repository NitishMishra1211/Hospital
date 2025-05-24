
import type { Doctor as DoctorType } from './types'; // Import the updated Doctor type

export type CountryCode = {
  code: string;
  name: string;
  dial_code: string;
};

export const mockDoctors: DoctorType[] = [
  {
    id: 'D001',
    name: 'Dr. Smith',
    avatarUrl: 'https://picsum.photos/seed/drsmith/80/80',
    specialization: 'Cardiology',
    department: 'Cardiovascular Unit',
    email: 'dr.smith@medicore.com',
    phoneNumber: '+15551112222',
    availableTimeSlots: ['Mon 9am-12pm', 'Wed 2pm-5pm', 'Fri 9am-11am'],
    isActive: true,
  },
  {
    id: 'd2',
    name: 'Dr. Lee',
    avatarUrl: 'https://picsum.photos/seed/drlee/80/80',
    specialization: 'Neurology',
    department: 'Neurology Department',
    email: 'dr.lee@medicore.com',
    phoneNumber: '+15553334444',
    availableTimeSlots: ['Tue 10am-1pm', 'Thu 3pm-6pm'],
    isActive: true,
  },
  {
    id: 'd3',
    name: 'Dr. Green',
    avatarUrl: 'https://picsum.photos/seed/drgreen/80/80',
    specialization: 'Pediatrics',
    department: 'Pediatric Care',
    email: 'dr.green@medicore.com',
    phoneNumber: '+15555556666',
    availableTimeSlots: ['Mon 1pm-4pm', 'Wed 9am-12pm', 'Fri 2pm-4pm'],
    isActive: false, // Example of an inactive doctor
  },
   {
    id: 'd4',
    name: 'Dr. Jones',
    avatarUrl: 'https://picsum.photos/seed/drjones/80/80',
    specialization: 'Orthopedics',
    department: 'Orthopedic Surgery',
    email: 'dr.jones@medicore.com',
    phoneNumber: '+15557778888',
    availableTimeSlots: ['Tue 9am-12pm', 'Thu 1pm-4pm'],
    isActive: true,
  },
   {
    id: 'd5',
    name: 'Dr. Taylor',
    avatarUrl: 'https://picsum.photos/seed/drtaylor/80/80',
    specialization: 'Dermatology',
    department: 'Skin & Cosmetic Clinic',
    email: 'dr.taylor@medicore.com',
    phoneNumber: '+15559990000',
    availableTimeSlots: null, // Example of no specific slots listed
    isActive: true,
  },
];

export const mockCountryCodes: CountryCode[] = [
  { name: 'United States', code: 'US', dial_code: '+1' },
  { name: 'Canada', code: 'CA', dial_code: '+1' },
  { name: 'United Kingdom', code: 'GB', dial_code: '+44' },
  { name: 'India', code: 'IN', dial_code: '+91' },
  { name: 'Australia', code: 'AU', dial_code: '+61' },
  { name: 'Germany', code: 'DE', dial_code: '+49' },
];

// LegacyPatient type might still be used by other components not yet updated.
export type LegacyPatient = {
  id: string;
  name: string;
  avatarUrl: string;
  mobile: string;
  appointmentDate: string;
  appointmentTime: string;
  doctor: string;
  department: string;
  departmentCode: string;
};

export const mockPatients: LegacyPatient[] = [
  {
    id: 'p1',
    name: 'Alice Johnson (Mock)',
    avatarUrl: 'https://picsum.photos/seed/alice/40/40',
    mobile: '555-1234',
    appointmentDate: '2024-08-15',
    appointmentTime: '10:00 AM',
    doctor: 'Dr. Smith',
    department: 'Cardiology',
    departmentCode: 'CARD-01',
  },
    {
    id: 'p2',
    name: 'Bob Williams (Mock)',
    avatarUrl: 'https://picsum.photos/seed/bob/40/40',
    mobile: '555-5678',
    appointmentDate: '2024-08-15',
    appointmentTime: '11:30 AM',
    doctor: 'Dr. Lee',
    department: 'Neurology',
    departmentCode: 'NEUR-03',
  },
];
