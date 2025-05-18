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
}

export interface ParticipationRequest {
  name: string;
} 