import { User } from '@/types';

const STORAGE_KEY = 'event-users';

export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const saveUser = (user: User): void => {
  try {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const updateUser = (userId: string, updates: Partial<User>): void => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  } catch (error) {
    console.error('Error updating user in localStorage:', error);
  }
};

export const findUserByQRCode = (qrCode: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.qrCode === qrCode);
};

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};