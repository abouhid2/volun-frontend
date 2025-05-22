import axiosInstance from './axios.config';
import { Event, Participant, ParticipationRequest, Entity, Car, Donation, DonationSettings, Comment } from '../types';
import { API_CONFIG } from '../config/api';

// Entity CRUD operations
export const getEntities = () => 
  axiosInstance.get<Entity[]>(`${API_CONFIG.baseURL}/entities`).then(res => res.data);

export const getEntity = (id: number) => 
  axiosInstance.get<Entity>(`${API_CONFIG.baseURL}/entities/${id}`).then(res => res.data);

export const createEntity = (entity: Omit<Entity, 'id'> & { user_id: number }) => 
  axiosInstance.post<Entity>(`${API_CONFIG.baseURL}/entities`, entity).then(res => res.data);

export const updateEntity = (id: number, entity: Partial<Omit<Entity, 'id'>>) => 
  axiosInstance.patch<Entity>(`${API_CONFIG.baseURL}/entities/${id}`, { entity }).then(res => res.data);

export const deleteEntity = (id: number) => 
  axiosInstance.delete(`${API_CONFIG.baseURL}/entities/${id}`).then(res => res.data);

export const duplicateEntity = (id: number) => 
  axiosInstance.post<Entity>(`${API_CONFIG.baseURL}/entities/${id}/duplicate`).then(res => res.data);

// Event CRUD operations
export const getEvents = (entityId: number) => 
  axiosInstance.get<Event[]>(`${API_CONFIG.baseURL}/entities/${entityId}/events`, {
    params: {
      include: ['participants', 'cars']
    }
  }).then(res => res.data);

export const getEvent = (entityId: number, eventId: number) => 
  axiosInstance.get<Event>(`${API_CONFIG.baseURL}/entities/${entityId}/events/${eventId}`).then(res => res.data);

export const createEvent = (event: Omit<Event, 'id' | 'participants_count' | 'is_participating' | 'participants' | 'entity'>) => {
  const { entityId, ...eventData } = event;
  return axiosInstance.post<Event>(`${API_CONFIG.baseURL}/entities/${entityId}/events`, { 
    event: eventData,
    entityId 
  }).then(res => res.data);
};

export const updateEvent = (entityId: number, eventId: number, event: Partial<Omit<Event, 'id' | 'entityId' | 'entity'>>) => 
  axiosInstance.patch<Event>(`${API_CONFIG.baseURL}/entities/${entityId}/events/${eventId}`, { event }).then(res => res.data);

export const deleteEvent = (entityId: number, eventId: number) => 
  axiosInstance.delete(`${API_CONFIG.baseURL}/entities/${entityId}/events/${eventId}`).then(res => res.data);

export const duplicateEvent = (
  entityId: number, 
  eventId: number, 
  data: { 
    title: string;
    description: string;
    date: string | Date;
    location: string;
    keepParticipants: boolean;
    keepCars: boolean;
    keepDonations: boolean;
  }
) => 
  axiosInstance.post<Event>(`${API_CONFIG.baseURL}/entities/${entityId}/events/${eventId}/duplicate`, data).then(res => res.data);

export const participate = async (eventId: number, data: ParticipationRequest): Promise<Participant> => {
  const response = await axiosInstance.post(`${API_CONFIG.baseURL}/events/${eventId}/participants`, data);
  return response.data;
};

export const unparticipate = async (eventId: number): Promise<void> => {
  await axiosInstance.delete(`${API_CONFIG.baseURL}/events/${eventId}/participants`);
};

export const getCars = (eventId: number) => 
  axiosInstance.get<Car[]>(`${API_CONFIG.baseURL}/events/${eventId}/cars`).then(res => res.data);

export const createCar = (eventId: number, car: Omit<Car, 'id'>) => 
  axiosInstance.post<Car>(`${API_CONFIG.baseURL}/events/${eventId}/cars`, car).then(res => res.data);

export const updateCar = (eventId: number, carId: number, car: Partial<Omit<Car, 'id' | 'event_id'>>) => 
  axiosInstance.patch<Car>(`${API_CONFIG.baseURL}/events/${eventId}/cars/${carId}`, car).then(res => res.data);

export const deleteCar = (eventId: number, carId: number) => 
  axiosInstance.delete(`${API_CONFIG.baseURL}/events/${eventId}/cars/${carId}`).then(res => res.data);

export const getDonations = (eventId: number) => 
  axiosInstance.get<Donation[]>(`${API_CONFIG.baseURL}/events/${eventId}/donations`).then(res => res.data);

export const createDonation = (eventId: number, donation: Omit<Donation, 'id'>) => 
  axiosInstance.post<Donation>(`${API_CONFIG.baseURL}/events/${eventId}/donations`, donation).then(res => res.data);

export const updateDonation = (eventId: number, donationId: number, donation: Partial<Omit<Donation, 'id' | 'event_id'>>) => 
  axiosInstance.patch<Donation>(`${API_CONFIG.baseURL}/events/${eventId}/donations/${donationId}`, donation).then(res => res.data);

export const deleteDonation = (eventId: number, donationId: number) => 
  axiosInstance.delete(`${API_CONFIG.baseURL}/events/${eventId}/donations/${donationId}`).then(res => res.data);

export const getParticipants = (eventId: number) => 
  axiosInstance.get<Participant[]>(`${API_CONFIG.baseURL}/events/${eventId}/participants`).then(res => res.data);

export const updateParticipant = async (eventId: number, participantId: number, data: Partial<ParticipationRequest>): Promise<Participant> => {
  const response = await axiosInstance.patch(`${API_CONFIG.baseURL}/events/${eventId}/participants/${participantId}`, data);
  return response.data;
};

export const deleteParticipant = async (eventId: number, participantId: number): Promise<void> => {
  await axiosInstance.delete(`${API_CONFIG.baseURL}/events/${eventId}/participants/${participantId}`);
};

export const cleanCarSeats = async (eventId: number, carId: number, driverIds: number[]): Promise<void> => {
  await axiosInstance.post(`${API_CONFIG.baseURL}/events/${eventId}/cars/${carId}/clean_seats`, { driver_ids: driverIds });
};

export const getDonationSettings = (eventId: number) => 
  axiosInstance.get<DonationSettings>(`${API_CONFIG.baseURL}/events/${eventId}/donation_settings`).then(res => res.data);

export const updateDonationSettings = (eventId: number, settings: { types: string[], units: string[] }) => 
  axiosInstance.patch<DonationSettings>(`${API_CONFIG.baseURL}/events/${eventId}/donation_settings`, settings).then(res => res.data);

export const getComments = (eventId: number) => 
  axiosInstance.get<Comment[]>(`${API_CONFIG.baseURL}/events/${eventId}/comments`, {
    params: {
      include: 'user'
    }
  }).then(res => res.data);

export const createComment = (eventId: number, content: string) => 
  axiosInstance.post<Comment>(`${API_CONFIG.baseURL}/events/${eventId}/comments`, { content }).then(res => res.data);

export const updateComment = (eventId: number, commentId: number, content: string) => 
  axiosInstance.patch<Comment>(`${API_CONFIG.baseURL}/events/${eventId}/comments/${commentId}`, { content }).then(res => res.data);

export const deleteComment = (eventId: number, commentId: number) => 
  axiosInstance.delete(`${API_CONFIG.baseURL}/events/${eventId}/comments/${commentId}`).then(res => res.data);