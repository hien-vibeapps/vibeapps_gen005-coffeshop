import { apiClient } from '@/lib/api-client'
import type {
  Ingredient,
  CreateIngredientRequest,
  UpdateIngredientRequest,
  IngredientStatistics,
  InventoryTransaction,
  CreateInventoryTransactionRequest,
  InventoryTransactionStatistics,
  ApiResponse,
  PaginatedResponse,
  ListQueryParams,
} from '@/types/api'

export const inventoryApi = {
  // Ingredients
  getIngredients: async (params?: ListQueryParams & { is_active?: boolean }): Promise<PaginatedResponse<Ingredient>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Ingredient>>>('/ingredients', { params })
    return response.data.data
  },

  getIngredient: async (ingredientId: string): Promise<Ingredient> => {
    const response = await apiClient.get<ApiResponse<Ingredient>>(`/ingredients/${ingredientId}`)
    return response.data.data
  },

  getIngredientStatistics: async (): Promise<IngredientStatistics> => {
    const response = await apiClient.get<ApiResponse<IngredientStatistics>>('/ingredients/statistics')
    return response.data.data
  },

  createIngredient: async (data: CreateIngredientRequest): Promise<Ingredient> => {
    const response = await apiClient.post<ApiResponse<Ingredient>>('/ingredients', data)
    return response.data.data
  },

  updateIngredient: async (ingredientId: string, data: UpdateIngredientRequest): Promise<Ingredient> => {
    const response = await apiClient.put<ApiResponse<Ingredient>>(`/ingredients/${ingredientId}`, data)
    return response.data.data
  },

  deleteIngredient: async (ingredientId: string): Promise<void> => {
    await apiClient.delete(`/ingredients/${ingredientId}`)
  },

  // Inventory Transactions
  getTransactions: async (params?: ListQueryParams & { ingredient_id?: string; transaction_type?: string }): Promise<PaginatedResponse<InventoryTransaction>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<InventoryTransaction>>>('/inventory-transactions', { params })
    return response.data.data
  },

  getTransaction: async (transactionId: string): Promise<InventoryTransaction> => {
    const response = await apiClient.get<ApiResponse<InventoryTransaction>>(`/inventory-transactions/${transactionId}`)
    return response.data.data
  },

  getTransactionStatistics: async (): Promise<InventoryTransactionStatistics> => {
    const response = await apiClient.get<ApiResponse<InventoryTransactionStatistics>>('/inventory-transactions/statistics')
    return response.data.data
  },

  createTransaction: async (data: CreateInventoryTransactionRequest): Promise<InventoryTransaction> => {
    const response = await apiClient.post<ApiResponse<InventoryTransaction>>('/inventory-transactions', data)
    return response.data.data
  },
}

