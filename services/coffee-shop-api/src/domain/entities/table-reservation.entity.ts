export class TableReservation {
  id: string;
  shop_id: string;
  table_id?: string;
  customer_name: string;
  customer_phone: string;
  reservation_time: Date;
  number_of_guests: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_by?: string;
  created_at: Date;
  updated_at: Date;
  cancelled_at?: Date;
  cancelled_reason?: string;
}

