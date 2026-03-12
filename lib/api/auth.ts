import { apiClient } from './client';
import type { AuthUser } from '@/types';

export async function login(email: string, password: string): Promise<{ access_token: string; user: AuthUser }> {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
}
