import { apiClient } from '@/lib/api-client'
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryStatistics,
  ApiResponse,
  PaginatedResponse,
  ListQueryParams,
} from '@/types/api'

export const categoryApi = {
  // Get all categories
  getCategories: async (params?: ListQueryParams): Promise<PaginatedResponse<Category>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Category>>>('/categories', { params })
    return response.data.data
  },

  // Get category by ID
  getCategory: async (categoryId: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${categoryId}`)
    return response.data.data
  },

  // Get category statistics
  getCategoryStatistics: async (): Promise<CategoryStatistics> => {
    const response = await apiClient.get<ApiResponse<CategoryStatistics>>('/categories/statistics')
    return response.data.data
  },

  // Create category
  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data)
    return response.data.data
  },

  // Update category
  updateCategory: async (categoryId: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${categoryId}`, data)
    return response.data.data
  },

  // Delete category
  deleteCategory: async (categoryId: string): Promise<void> => {
    await apiClient.delete(`/categories/${categoryId}`)
  },
}

