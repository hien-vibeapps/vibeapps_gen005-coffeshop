import { apiClient } from '@/lib/api-client'
import type {
  Payment,
  CreatePaymentRequest,
  PaymentStatistics,
  ApiResponse,
  PaginatedResponse,
  ListQueryParams,
} from '@/types/api'

export const paymentApi = {
  // Get all payments
  getPayments: async (params?: ListQueryParams & { order_id?: string; payment_method?: string }): Promise<PaginatedResponse<Payment>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Payment>>>('/payments', { params })
    return response.data.data
  },

  // Get payment by ID
  getPayment: async (paymentId: string): Promise<Payment> => {
    const response = await apiClient.get<ApiResponse<Payment>>(`/payments/${paymentId}`)
    return response.data.data
  },

  // Get payment statistics
  getPaymentStatistics: async (): Promise<PaymentStatistics> => {
    const response = await apiClient.get<ApiResponse<PaymentStatistics>>('/payments/statistics')
    return response.data.data
  },

  // Create payment
  createPayment: async (data: CreatePaymentRequest): Promise<Payment> => {
    const response = await apiClient.post<ApiResponse<Payment>>('/payments', data)
    return response.data.data
  },
}

