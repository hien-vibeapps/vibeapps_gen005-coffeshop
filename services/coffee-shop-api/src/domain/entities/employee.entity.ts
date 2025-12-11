export class Employee {
  id: string;
  shop_id: string;
  email: string;
  phone: string;
  full_name: string;
  role: 'owner' | 'manager' | 'shift_manager' | 'waiter' | 'cashier' | 'barista';
  avatar_url?: string;
  start_date?: Date;
  is_active: boolean;
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

