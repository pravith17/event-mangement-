export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  qrCode: string;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
}