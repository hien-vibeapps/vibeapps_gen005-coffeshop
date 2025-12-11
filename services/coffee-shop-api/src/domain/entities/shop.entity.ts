export class Shop {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  opening_time?: string;
  closing_time?: string;
  description?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  currency: string;
  timezone: string;
  vat_rate: number;
  service_fee_rate: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

