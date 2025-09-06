export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'organizer' | 'volunteer' | 'participant';
  eventIds: string[]; // Events the user is associated with
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  organizerId: string;
  createdAt: string;
  isActive: boolean;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  qrCode: string;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
  qrUsed: boolean; // For one-time use security
}

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  eventId: string;
}

export interface EventStats {
  eventId: string;
  totalRegistered: number;
  totalCheckedIn: number;
  registrationsByHour: { hour: string; count: number }[];
  checkinsByHour: { hour: string; count: number }[];
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'organizer' | 'volunteer' | 'participant';
  name: string;
}