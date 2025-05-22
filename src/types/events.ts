export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  entityId: number;
  user_id: number;
  max_participants?: number;
  entity?: Entity;
  participants_count: number;
  is_participating: boolean;
  participants: Participant[];
  cars: Car[];
  donations: Donation[];
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

export interface Donation {
  id: number;
  event_id: number;
  user_id: number;
  donation_type: string;
  quantity: number;
  unit: string;
  description?: string;
  car_id: number | null;
  user?: {
    id: number;
    name: string;
  };
}

export interface Participant {
  id: number;
  event_id: number;
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  status: 'going' | 'not_going' | 'maybe';
  car_id?: number;
  car?: Car;
}

export interface Entity {
  id: number;
  name: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: Date;
  location: string;
  entityId: number;
}

export interface DuplicateEventData {
  title: string;
  description: string;
  date: Date;
  location: string;
  keepParticipants: boolean;
  keepCars: boolean;
  keepDonations: boolean;
}

export interface DonationSettings {
  id: number;
  event_id: number;
  types: string[];
  units: string[];
}

export interface ParticipantFormData {
  name: string;
  status: 'going' | 'not_going' | 'maybe';
  car_id?: number;
}

export interface ParticipationRequest {
  user_id?: number;
  name?: string;
  status?: string;
  car_id?: number;
} 