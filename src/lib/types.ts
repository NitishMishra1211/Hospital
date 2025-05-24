
export type Patient = {
  pid: string;
  name: string;
  age: number;
  weight: number;
  gender: string;
  address: string;
  insuranceProvider: string;
  policyNumber: string;
  phoneno: string;
  disease: string;
  doctorid: string;
};

export type Doctor = {
  id: string; // Corresponds to Id
  name: string; // Corresponds to Name
  avatarUrl?: string | null; // Corresponds to AvatarUrl
  specialization: string; // Corresponds to Specialization
  department?: string | null; // Corresponds to Department
  email?: string | null; // Corresponds to Email
  phoneNumber?: string | null; // Corresponds to PhoneNumber
  availableTimeSlots?: string[] | null; // Corresponds to AvailableTimeSlots
  isActive: boolean; // Corresponds to IsActive
};

export type CountryCode = {
  code: string;
  name: string;
  dial_code: string;
};
