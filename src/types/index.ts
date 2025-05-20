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
  date: Date;
  location: string;
  entityId: number;
  entity: Entity;
}

export interface Participant {
  id: number;
  event_id: number;
  user_id: number;
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
  description: string;
  car_id: number | null;
} 