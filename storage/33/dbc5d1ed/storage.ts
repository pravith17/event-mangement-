import { User, Event, Registration, EventStats, AuthUser } from '@/types';

const USERS_KEY = 'event-users';
const EVENTS_KEY = 'event-events';
const REGISTRATIONS_KEY = 'event-registrations';
const AUTH_KEY = 'event-auth';
const THEME_KEY = 'event-theme';

// Theme Management
export const getTheme = (): 'light' | 'dark' => {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return (theme as 'light' | 'dark') || 'light';
  } catch {
    return 'light';
  }
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

// Auth Management
export const getCurrentUser = (): AuthUser | null => {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: AuthUser | null): void => {
  try {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch (error) {
    console.error('Error saving auth user:', error);
  }
};

// User Management
export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveUser = (user: User): void => {
  try {
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Event Management
export const getEvents = (): Event[] => {
  try {
    const data = localStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveEvent = (event: Event): void => {
  try {
    const events = getEvents();
    const existingIndex = events.findIndex(e => e.id === event.id);
    if (existingIndex >= 0) {
      events[existingIndex] = event;
    } else {
      events.push(event);
    }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving event:', error);
  }
};

export const getEventById = (eventId: string): Event | undefined => {
  const events = getEvents();
  return events.find(e => e.id === eventId);
};

export const getEventsByOrganizer = (organizerId: string): Event[] => {
  const events = getEvents();
  return events.filter(e => e.organizerId === organizerId);
};

// Registration Management
export const getRegistrations = (): Registration[] => {
  try {
    const data = localStorage.getItem(REGISTRATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveRegistration = (registration: Registration): void => {
  try {
    const registrations = getRegistrations();
    registrations.push(registration);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
  } catch (error) {
    console.error('Error saving registration:', error);
  }
};

export const updateRegistration = (registrationId: string, updates: Partial<Registration>): void => {
  try {
    const registrations = getRegistrations();
    const index = registrations.findIndex(r => r.id === registrationId);
    if (index !== -1) {
      registrations[index] = { ...registrations[index], ...updates };
      localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
    }
  } catch (error) {
    console.error('Error updating registration:', error);
  }
};

export const getRegistrationsByEvent = (eventId: string): Registration[] => {
  const registrations = getRegistrations();
  return registrations.filter(r => r.eventId === eventId);
};

export const findRegistrationByQRCode = (qrCode: string): Registration | undefined => {
  const registrations = getRegistrations();
  return registrations.find(r => r.qrCode === qrCode);
};

export const getEventStats = (eventId: string): EventStats => {
  const registrations = getRegistrationsByEvent(eventId);
  const checkedIn = registrations.filter(r => r.checkedIn);
  
  // Group registrations by hour
  const registrationsByHour: { [key: string]: number } = {};
  const checkinsByHour: { [key: string]: number } = {};
  
  registrations.forEach(reg => {
    const hour = new Date(reg.registeredAt).getHours();
    const hourKey = `${hour}:00`;
    registrationsByHour[hourKey] = (registrationsByHour[hourKey] || 0) + 1;
  });
  
  checkedIn.forEach(reg => {
    if (reg.checkedInAt) {
      const hour = new Date(reg.checkedInAt).getHours();
      const hourKey = `${hour}:00`;
      checkinsByHour[hourKey] = (checkinsByHour[hourKey] || 0) + 1;
    }
  });
  
  return {
    eventId,
    totalRegistered: registrations.length,
    totalCheckedIn: checkedIn.length,
    registrationsByHour: Object.entries(registrationsByHour).map(([hour, count]) => ({ hour, count })),
    checkinsByHour: Object.entries(checkinsByHour).map(([hour, count]) => ({ hour, count })),
  };
};

// Utility Functions
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Export Functions
export const exportToCSV = (eventId: string): string => {
  const registrations = getRegistrationsByEvent(eventId);
  const users = getUsers();
  const event = getEventById(eventId);
  
  const headers = ['Name', 'Email', 'Phone', 'Registered At', 'Checked In', 'Checked In At'];
  const rows = registrations.map(reg => {
    const user = users.find(u => u.id === reg.userId);
    return [
      user?.name || 'Unknown',
      user?.email || 'Unknown',
      user?.phone || 'Unknown',
      new Date(reg.registeredAt).toLocaleString(),
      reg.checkedIn ? 'Yes' : 'No',
      reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleString() : 'N/A'
    ];
  });
  
  const csvContent = [
    `Event: ${event?.name || 'Unknown Event'}`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

// Email simulation (in real app, this would integrate with email service)
export const sendQRCodeEmail = async (email: string, qrCode: string, eventName: string): Promise<boolean> => {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, this would integrate with an email service like SendGrid, Mailgun, etc.
  console.log(`Email sent to ${email} with QR code for event: ${eventName}`);
  console.log(`QR Code: ${qrCode}`);
  
  // For demo purposes, always return true
  return true;
};