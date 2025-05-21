
// This file can still be used for other mock data like doctors, country codes, etc.
// The Patient type is now primarily defined in src/lib/types.ts for API consistency.

// import type { Patient as ApiPatientType } from './types'; // Example if you needed to reference it here

export type Doctor = {
  id: string;
  name: string;
  avatarUrl: string;
  specialization: string;
};

export type CountryCode = {
  code: string;
  name: string;
  dial_code: string;
};

// Keeping mockDoctors for now as it's used on other pages.
// If Doctor data also comes from an API, this would be replaced.
export const mockDoctors: Doctor[] = [
  {
    id: 'D001', // Matched to example doctorid from API
    name: 'Dr. Smith',
    avatarUrl: 'https://picsum.photos/seed/drsmith/40/40',
    specialization: 'Cardiology',
  },
  {
    id: 'd2',
    name: 'Dr. Lee',
    avatarUrl: 'https://picsum.photos/seed/drlee/40/40',
    specialization: 'Neurology',
  },
  {
    id: 'd3',
    name: 'Dr. Green',
    avatarUrl: 'https://picsum.photos/seed/drgreen/40/40',
    specialization: 'Pediatrics',
  },
   {
    id: 'd4',
    name: 'Dr. Jones',
    avatarUrl: 'https://picsum.photos/seed/drjones/40/40',
    specialization: 'Orthopedics',
  },
   {
    id: 'd5',
    name: 'Dr. Taylor',
    avatarUrl: 'https://picsum.photos/seed/drtaylor/40/40',
    specialization: 'Dermatology',
  },
];

export const mockCountryCodes: CountryCode[] = [
  { name: 'United States', code: 'US', dial_code: '+1' },
  { name: 'Canada', code: 'CA', dial_code: '+1' }, // Note: same dial_code, unique code 'CA'
  { name: 'United Kingdom', code: 'GB', dial_code: '+44' },
  { name: 'India', code: 'IN', dial_code: '+91' },
  { name: 'Australia', code: 'AU', dial_code: '+61' },
  { name: 'Germany', code: 'DE', dial_code: '+49' },
];

// Old mockPatients is no longer the source of truth for patient-details page.
// It might still be used by other components like `search-patients` or `todays-schedule`
// until those are also updated to use API data.
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
    id: 'p1', // This 'id' is different from 'pid' from API
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
