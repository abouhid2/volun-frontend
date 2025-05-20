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
  entityId: number;
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