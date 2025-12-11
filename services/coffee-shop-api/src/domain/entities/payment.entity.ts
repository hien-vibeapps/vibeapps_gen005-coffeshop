export class Payment {
  id: string;
  order_id: string;
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'e_wallet';
  amount: number;
  received_amount?: number;
  change_amount?: number;
  transaction_id?: string;
  receipt_number: string;
  notes?: string;
  processed_by: string;
  processed_at: Date;
  created_at: Date;
}

