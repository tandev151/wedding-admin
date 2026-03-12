import { apiClient } from './client';
import type { LoveStoryEvent } from '@/types';

export const getLoveStory = async (): Promise<LoveStoryEvent[]> => {
  const res = await apiClient.get('/weddings/me/love-story');
  return res.data;
};

export const addEvent = async (data: { dateLabel: string; title: string; description: string; order?: number }): Promise<LoveStoryEvent> => {
  const res = await apiClient.post('/weddings/me/love-story', data);
  return res.data;
};

export const updateEvent = async (id: number, data: Partial<LoveStoryEvent>): Promise<LoveStoryEvent> => {
  const res = await apiClient.patch(`/weddings/me/love-story/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await apiClient.delete(`/weddings/me/love-story/${id}`);
};
