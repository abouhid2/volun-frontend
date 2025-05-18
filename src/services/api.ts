import { Event, Participant, ParticipationRequest } from '../types';
import axiosInstance from './axios.config';

export const getEvents = async (): Promise<Event[]> => {
  const response = await axiosInstance.get('/events');
  return response.data;
};

export const createEvent = async (event: Omit<Event, 'id' | 'participants_count' | 'is_participating' | 'participants'>): Promise<Event> => {
  const response = await axiosInstance.post('/events', event);
  return response.data;
};

export const participate = async (eventId: number, data: ParticipationRequest): Promise<Participant> => {
  const response = await axiosInstance.post(`/events/${eventId}/participants`, data);
  return response.data;
};

export const unparticipate = async (eventId: number): Promise<void> => {
  await axiosInstance.delete(`/events/${eventId}/participants`);
}; 