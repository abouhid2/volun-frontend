export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  participants_count: number;
  is_participating: boolean;
  participants?: Participant[];
}

export interface Participant {
  id: number;
  name: string;
  user_id?: number;
}

export interface ParticipationRequest {
  name: string;
} 