import { apiClient } from './client';
import type { GalleryPhoto } from '@/types';

export const getGallery = async (): Promise<GalleryPhoto[]> => {
  const res = await apiClient.get('/weddings/me/gallery');
  return res.data;
};

export const addPhoto = async (data: { imageUrl: string; alt?: string; order?: number }): Promise<GalleryPhoto> => {
  const res = await apiClient.post('/weddings/me/gallery', data);
  return res.data;
};

export const updatePhoto = async (id: number, data: Partial<GalleryPhoto>): Promise<GalleryPhoto> => {
  const res = await apiClient.patch(`/weddings/me/gallery/${id}`, data);
  return res.data;
};

export const deletePhoto = async (id: number): Promise<void> => {
  await apiClient.delete(`/weddings/me/gallery/${id}`);
};
