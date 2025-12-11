import { apiClient } from '@/lib/api-client'
import type {
  RevenueReport,
  SalesReport,
  InventoryReport,
  ApiResponse,
} from '@/types/api'

export const reportApi = {
  // Revenue Report
  getRevenueReport: async (params: { start_date: string; end_date: string; group_by?: 'day' | 'week' | 'month' }): Promise<RevenueReport> => {
    const response = await apiClient.get<ApiResponse<RevenueReport>>('/reports/revenue', { params })
    return response.data.data
  },

  // Sales Report
  getSalesReport: async (params: { start_date: string; end_date: string }): Promise<SalesReport> => {
    const response = await apiClient.get<ApiResponse<SalesReport>>('/reports/sales', { params })
    return response.data.data
  },

  // Inventory Report
  getInventoryReport: async (): Promise<InventoryReport> => {
    const response = await apiClient.get<ApiResponse<InventoryReport>>('/reports/inventory')
    return response.data.data
  },
}

