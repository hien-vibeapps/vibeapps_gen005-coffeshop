import { apiClient } from '@/lib/api-client'
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderStatistics,
  ApiResponse,
  PaginatedResponse,
  OrderListQueryParams,
} from '@/types/api'

export const orderApi = {
  // Get all orders
  getOrders: async (params?: OrderListQueryParams): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>('/orders', { params })
    return response.data.data
  },

  // Get order by ID
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`)
    return response.data.data
  },

  // Get order statistics
  getOrderStatistics: async (): Promise<OrderStatistics> => {
    const response = await apiClient.get<ApiResponse<OrderStatistics>>('/orders/statistics')
    return response.data.data
  },

  // Create order
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data)
    return response.data.data
  },

  // Update order
  updateOrder: async (orderId: string, data: UpdateOrderRequest): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<Order>>(`/orders/${orderId}`, data)
    return response.data.data
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason: string): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`, { reason })
    return response.data.data
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status })
    return response.data.data
  },
}

