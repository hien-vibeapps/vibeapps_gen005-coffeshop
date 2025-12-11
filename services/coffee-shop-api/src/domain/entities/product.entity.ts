export class Product {
  id: string;
  shop_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  estimated_prep_time: number;
  status: 'available' | 'out_of_stock' | 'suspended';
  calories?: number;
  allergen_info?: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

