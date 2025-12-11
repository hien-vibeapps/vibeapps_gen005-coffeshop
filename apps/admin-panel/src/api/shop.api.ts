import { apiClient } from '@/lib/api-client'
import type { Shop, UpdateShopRequest, ApiResponse } from '@/types/api'

export const shopApi = {
  // Get shop info
  getShop: async (shopId: string): Promise<Shop> => {
    const response = await apiClient.get<ApiResponse<Shop>>(`/shops/${shopId}`)
    return response.data.data
  },

  // Update shop info
  updateShop: async (shopId: string, data: UpdateShopRequest): Promise<Shop> => {
    const response = await apiClient.put<ApiResponse<Shop>>(`/shops/${shopId}`, data)
    return response.data.data
  },
}

