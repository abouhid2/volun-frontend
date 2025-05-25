export interface Request {
  id: number;
  entity_id: number;
  item_name: string;
  item_type: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'approved' | 'rejected';
  fulfilled: boolean;
  fulfilled_at?: string;
  requested_by?: string;
  notes?: string;
  requested_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface RequestFormValues {
  item_name: string;
  item_type: string;
  quantity: number;
  unit: string;
  requested_by?: string;
  notes?: string;
  status?: 'pending' | 'approved' | 'rejected';
  requested_at?: string;
} 