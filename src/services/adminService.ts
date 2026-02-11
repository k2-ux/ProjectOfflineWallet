// src/services/adminService.ts
import { fetchAdminStats } from '../api/adminApi';

export type AdminStats = {
  message: string;
  role: string;
  time: string;
};

export const getAdminStats = async (): Promise<AdminStats | null> => {
  try {
    return await fetchAdminStats();
  } catch (err: any) {
    if (err.message?.includes('403')) {
      return null; // not allowed
    }
    throw err;
  }
};
