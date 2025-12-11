export class Order {
  id: string;
  shop_id: string;
  order_number: string;
  table_id?: string;
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  customer_name?: string;
  customer_phone?: string;
  delivery_address?: string;
  delivery_fee: number;
  subtotal: number;
  vat_amount: number;
  service_fee: number;
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
  notes?: string;
  created_by?: string;
  served_by?: string;
  cancelled_by?: string;
  cancelled_reason?: string;
  created_at: Date;
  updated_at: Date;
  paid_at?: Date;
  cancelled_at?: Date;
}

