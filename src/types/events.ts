export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  entityId: number;
  entity?: Entity;
  participants_count?: number;
  is_participating?: boolean;
  participants?: Participant[];
}

export interface Car {
  id: number;
  driver_name: string;
  seats: number;
  event_id: number;
}

export interface Donation {
  id: number;
  donation_type: string;
  quantity: number;
  unit: string;
  description?: string;
  car_id: number | null;
  event_id: number;
  user_id: number;
}

export interface Participant {
  id: number;
  name: string;
  status: 'going' | 'not_going' | 'maybe';
  car_id?: number;
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
  types: string[];
  units: string[];
}

export interface ParticipantFormData {
  name: string;
  status: 'going' | 'not_going' | 'maybe';
  car_id?: number;
} 