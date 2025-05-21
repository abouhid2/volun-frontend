export interface Entity {
  id: number;
  name: string;
  description: string;
  logo: string;
  website?: string;
  address: string;
  phone: string;
  email: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  max_participants: number;
  entity_id: number;
  entity?: Entity;
  participants_count?: number;
  is_participating?: boolean;
  participants: Participant[];
  cars: Car[];
  donations: Donation[];
}

export interface Participant {
  id: number;
  event_id: number;
  user_id: number;
  status: 'going' | 'not_going' | 'maybe';
  name: string;
  email: string;
  phone?: string;
  car_id?: number;
  car?: Car;
}

export interface ParticipationRequest {
  user_id?: number;
  name?: string;
  status?: string;
}

export interface Donation {
  id: number;
  event_id: number;
  donation_type: string;
  quantity: number;
  unit: string;
  description?: string;
  car_id: number | null;
  user_id: number;
}

export interface Car {
  id: number;
  event_id: number;
  driver_id: number;
  driver_name: string;
  driver_phone: string;
  seats: number;
  available_seats: number;
  passengers: Participant[];
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  date: Date;
  entityId: number;
} 