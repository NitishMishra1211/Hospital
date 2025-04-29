export type Patient = {
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

export type Doctor = {
  id: string;
  name: string;
  avatarUrl: string;
  specialization: string;
};

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Alice Johnson',
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
    name: 'Bob Williams',
    avatarUrl: 'https://picsum.photos/seed/bob/40/40',
    mobile: '555-5678',
    appointmentDate: '2024-08-15',
    appointmentTime: '11:30 AM',
    doctor: 'Dr. Lee',
    department: 'Neurology',
    departmentCode: 'NEUR-03',
  },
  {
    id: 'p3',
    name: 'Charlie Brown',
    avatarUrl: 'https://picsum.photos/seed/charlie/40/40',
    mobile: '555-8765',
    appointmentDate: '2024-08-16',
    appointmentTime: '09:00 AM',
    doctor: 'Dr. Green',
    department: 'Pediatrics',
    departmentCode: 'PEDS-02',
  },
    {
    id: 'p4',
    name: 'Diana Prince',
    avatarUrl: 'https://picsum.photos/seed/diana/40/40',
    mobile: '555-4321',
    appointmentDate: '2024-08-16',
    appointmentTime: '02:00 PM',
    doctor: 'Dr. Smith',
    department: 'Cardiology',
    departmentCode: 'CARD-01',
  },
  {
    id: 'p5',
    name: 'Ethan Hunt',
    avatarUrl: 'https://picsum.photos/seed/ethan/40/40',
    mobile: '555-1122',
    appointmentDate: '2024-08-17',
    appointmentTime: '01:00 PM',
    doctor: 'Dr. Jones',
    department: 'Orthopedics',
    departmentCode: 'ORTH-05',
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
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
