import { apiClient } from './client';
import type { AdminStats } from '@/types';

export const getStats = async (): Promise<AdminStats> => {
  const res = await apiClient.get('/admin/stats');
  return res.data;
};
