export interface Entity {
  id: number;
  name: string;
  description: string;
  logo: string;
  website?: string;
  address: string;
  user_id: number;
  phone: string;
  email: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  entityId: number;
  user_id: number;
  entity?: Entity;
  participants_count: number;
  participants: Participant[];
  is_participating: boolean;
}

export interface Participant {
  id: number;
  name: string;
  user_id?: number;
  status?: string;
  car_id?: number;
}

export interface ParticipationRequest {
  name?: string;
  user_id?: number;
  status?: string;
  car_id?: number;
}

export interface Car {
  id: number;
  event_id: number;
  driver_name: string;
  seats: number;
  driver?: {
    id: number;
    name: string;
  };
  participants?: Participant[];
}

export interface Donation {
  id: number;
  event_id: number;
  user_id: number;
  donation_type: string;
  quantity: number;
  unit: string;
  description: string;
  car_id: number | null;
  user?: {
    id: number;
    name: string;
  };
} 

export interface DonationSettings {
  id: number;
  event_id: number;
  types: string[];
  units: string[];
}

export interface Comment {
  id: number;
  event_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
}