
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
  id: string;
  name: string;
  avatarUrl: string;
  specialization: string;
  // Add other doctor properties if needed from an API
};

export type CountryCode = {
  code: string;
  name: string;
  dial_code: string;
};
