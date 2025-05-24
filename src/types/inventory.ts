export interface Inventory {
  id: number;
  entity_id: number;
  item_name: string;
  item_type: string;
  quantity: number;
  unit: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: number;
  inventory_id: number;
  event_id?: number;
  donation_id?: number;
  user_id: number;
  transaction_type: 'addition' | 'deduction' | 'transfer';
  quantity: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  event?: {
    id: number;
    title: string;
  };
  donation?: {
    id: number;
    donation_type: string;
    quantity: number;
  };
}

export interface InventoryFormValues {
  item_name: string;
  item_type: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface UseStockFormValues {
  inventory_id: number;
  event_id?: number;
  quantity: number;
  notes?: string;
} 