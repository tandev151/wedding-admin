import { apiClient } from './client';
import type { Wedding, Rsvp } from '@/types';
import { API_BASE_URL } from '@/lib/config';
import { getAuthToken } from '@/store/auth-store';

export const getAllWeddings = async (): Promise<Wedding[]> => {
  const res = await apiClient.get('/weddings');
  return res.data;
};

export const getWedding = async (id: number): Promise<Wedding> => {
  const res = await apiClient.get(`/weddings/${id}`);
  return res.data;
};

export const updateWedding = async (id: number, data: Partial<Wedding>): Promise<Wedding> => {
  const res = await apiClient.patch(`/weddings/${id}`, data);
  return res.data;
};

export const publishWedding = async (id: number): Promise<Wedding> => {
  const res = await apiClient.patch(`/weddings/${id}/publish`);
  return res.data;
};

export const unpublishWedding = async (id: number): Promise<Wedding> => {
  const res = await apiClient.delete(`/weddings/${id}/publish`);
  return res.data;
};

export const getMyWedding = async (): Promise<Wedding> => {
  const res = await apiClient.get('/weddings/me');
  return res.data;
};

export const updateMyWedding = async (data: Partial<Wedding>): Promise<Wedding> => {
  const res = await apiClient.patch('/weddings/me', data);
  return res.data;
};

export const getWeddingRsvps = async (id: number): Promise<Rsvp[]> => {
  const res = await apiClient.get(`/weddings/${id}/rsvps`);
  return res.data;
};

export const getMyRsvps = async (): Promise<Rsvp[]> => {
  const res = await apiClient.get('/weddings/me/rsvps');
  return res.data;
};

export const getRsvpsExportUrl = (id: number) =>
  `${API_BASE_URL}/weddings/${id}/rsvps/export?token=${getAuthToken()}`;

export const getMyRsvpsExportUrl = () =>
  `${API_BASE_URL}/weddings/me/rsvps/export`;
