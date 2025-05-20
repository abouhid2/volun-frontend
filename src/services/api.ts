import axiosInstance from './axios.config';
import { Event, Participant, ParticipationRequest, Entity } from '../types';
import { API_CONFIG } from '../config/api';

// Entity CRUD operations
export const getEntities = () => 
  axiosInstance.get<Entity[]>(`${API_CONFIG.baseURL}/entities`).then(res => res.data);

export const getEntity = (id: number) => 
  axiosInstance.get<Entity>(`${API_CONFIG.baseURL}/entities/${id}`).then(res => res.data);

export const createEntity = (entity: Omit<Entity, 'id'>) => 
  axiosInstance.post<Entity>(`${API_CONFIG.baseURL}/entities`, entity).then(res => res.data);

export const updateEntity = (id: number, entity: Partial<Omit<Entity, 'id'>>) => 
  axiosInstance.patch<Entity>(`${API_CONFIG.baseURL}/entities/${id}`, entity).then(res => res.data);

export const deleteEntity = (id: number) => 
  axiosInstance.delete(`${API_CONFIG.baseURL}/entities/${id}`).then(res => res.data);

// Event CRUD operations
export const getEvents = (entityId: number) => 
  axiosInstance.get<Event[]>(`${API_CONFIG.baseURL}/entities/${entityId}/events`).then(res => res.data);

export const getEvent = (entityId: number, eventId: number) => 
  axiosInstance.get<Event>(`${API_CONFIG.baseURL}/entities/${entityId}/events/${eventId}`).then(res => res.data);

export const createEvent = (event: Omit<Event, 'id' | 'participants_count' | 'is_participating' | 'participants' | 'entity'>) => 
  axiosInstance.post<Event>(`${API_CONFIG.baseURL}/entities/${event.entityId}/events`, event).then(res => res.data);

export const updateEvent = (entityId: number, eventId: number, event: Partial<Omit<Event, 'id' | 'entityId' | 'entity'>>) => 
  axiosInstance.patch<Event>(`${API_CONFIG.baseURL}/entities/${entityId}/events/${eventId}`, event).then(res => res.data);

export const deleteEvent = (entityId: number, eventId: number) => 
  axiosInstance.delete(`${API_CONFIG.baseURL}/entities/${entityId}/events/${eventId}`).then(res => res.data);

export const participate = async (eventId: number, data: ParticipationRequest): Promise<Participant> => {
  const response = await axiosInstance.post(`${API_CONFIG.baseURL}/events/${eventId}/participants`, data);
  return response.data;
};

export const unparticipate = async (eventId: number): Promise<void> => {
  await axiosInstance.delete(`${API_CONFIG.baseURL}/events/${eventId}/participants`);
}; 