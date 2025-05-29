
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

// Updated Doctor type to align with the API response for GET all,
// mapping doctorname -> name and dept -> department,
// and making other fields optional.
export type Doctor = {
  id: string;
  name: string; // Mapped from doctorname if that's what the API returns
  department: string; // Mapped from dept if that's what the API returns
  avatarUrl?: string | null;
  specialization?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  availableTimeSlots?: string[] | null;
  isActive?: boolean; // Default to true if not provided by API
};

export type CountryCode = {
  code: string;
  name: string;
  dial_code: string;
};

export type MedicalRecord = {
  recordID: string;
  patientID: string;
  doctorID: string;
  appointmentID: string; // Assuming this might be useful context later
  diagnosis: string;
  prescription: string;
  testResults: string; // Assuming this might be useful context later
};
