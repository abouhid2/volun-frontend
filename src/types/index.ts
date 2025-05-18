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