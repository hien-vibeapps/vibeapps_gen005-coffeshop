export class Ingredient {
  id: string;
  shop_id: string;
  name: string;
  unit: string;
  current_stock: number;
  min_stock_level: number;
  unit_price: number;
  supplier?: string;
  expiry_tracking: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

