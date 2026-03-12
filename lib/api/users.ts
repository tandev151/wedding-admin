import { apiClient } from './client';
import type { User } from '@/types';

export const getUsers = async (): Promise<User[]> => {
  const res = await apiClient.get('/users');
  return res.data;
};

export const createUser = async (data: { email: string; password: string; role: string }): Promise<User> => {
  const res = await apiClient.post('/users', data);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
