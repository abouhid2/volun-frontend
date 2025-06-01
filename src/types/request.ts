export interface Request {
  id: number;
  entity_id: number;
  item_name: string;
  item_type: string;
  quantity: string;
  unit: string;
  fulfilled: boolean;
  fulfilled_at: string | null;
  requested_by: string;
  notes: string;
  created_at: string;
  updated_at: string;
  requested_at: string;
  deleted_at: string | null;
}

export interface RequestFormValues {
  item_name: string;
  item_type: string;
  quantity: string;
  unit: string;
  requested_by?: string;
  notes?: string;
  requested_at?: string;
} 