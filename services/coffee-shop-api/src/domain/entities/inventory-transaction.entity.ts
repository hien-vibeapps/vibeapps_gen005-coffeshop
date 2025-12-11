export class InventoryTransaction {
  id: string;
  shop_id: string;
  ingredient_id: string;
  transaction_type: 'in' | 'out' | 'auto_deduct';
  quantity: number;
  unit_price?: number;
  total_amount?: number;
  reason?: string;
  reference_id?: string;
  reference_type?: string;
  expiry_date?: Date;
  notes?: string;
  created_by?: string;
  created_at: Date;
}

