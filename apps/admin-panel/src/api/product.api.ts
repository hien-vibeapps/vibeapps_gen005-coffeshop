import { apiClient } from '@/lib/api-client'
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductImage,
  ProductOptionGroup,
  ProductOption,
  ProductStatistics,
  ApiResponse,
  PaginatedResponse,
  ProductListQueryParams,
} from '@/types/api'

export const productApi = {
  // Get all products
  getProducts: async (params?: ProductListQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params })
    return response.data.data
  },

  // Get product by ID
  getProduct: async (productId: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${productId}`)
    return response.data.data
  },

  // Get product statistics
  getProductStatistics: async (): Promise<ProductStatistics> => {
    const response = await apiClient.get<ApiResponse<ProductStatistics>>('/products/statistics')
    return response.data.data
  },

  // Create product
  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data)
    return response.data.data
  },

  // Update product
  updateProduct: async (productId: string, data: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${productId}`, data)
    return response.data.data
  },

  // Delete product
  deleteProduct: async (productId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}`)
  },

  // Product Images
  uploadProductImage: async (productId: string, imageFile: File): Promise<ProductImage> => {
    const formData = new FormData()
    formData.append('image', imageFile)
    const response = await apiClient.post<ApiResponse<ProductImage>>(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  deleteProductImage: async (productId: string, imageId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}/images/${imageId}`)
  },

  // Product Options
  createOptionGroup: async (productId: string, data: Partial<ProductOptionGroup>): Promise<ProductOptionGroup> => {
    const response = await apiClient.post<ApiResponse<ProductOptionGroup>>(`/products/${productId}/option-groups`, data)
    return response.data.data
  },

  updateOptionGroup: async (
    productId: string,
    optionGroupId: string,
    data: Partial<ProductOptionGroup>
  ): Promise<ProductOptionGroup> => {
    const response = await apiClient.put<ApiResponse<ProductOptionGroup>>(
      `/products/${productId}/option-groups/${optionGroupId}`,
      data
    )
    return response.data.data
  },

  deleteOptionGroup: async (productId: string, optionGroupId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}/option-groups/${optionGroupId}`)
  },

  createOption: async (
    productId: string,
    optionGroupId: string,
    data: Partial<ProductOption>
  ): Promise<ProductOption> => {
    const response = await apiClient.post<ApiResponse<ProductOption>>(
      `/products/${productId}/option-groups/${optionGroupId}/options`,
      data
    )
    return response.data.data
  },

  updateOption: async (
    productId: string,
    optionGroupId: string,
    optionId: string,
    data: Partial<ProductOption>
  ): Promise<ProductOption> => {
    const response = await apiClient.put<ApiResponse<ProductOption>>(
      `/products/${productId}/option-groups/${optionGroupId}/options/${optionId}`,
      data
    )
    return response.data.data
  },

  deleteOption: async (productId: string, optionGroupId: string, optionId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}/option-groups/${optionGroupId}/options/${optionId}`)
  },
}

