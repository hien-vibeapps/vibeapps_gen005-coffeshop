export class OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  selected_options?: Record<string, any>;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  created_at: Date;
  updated_at: Date;
}

