import { apiClient } from '@/lib/api-client'
import type {
  Area,
  CreateAreaRequest,
  UpdateAreaRequest,
  AreaStatistics,
  Table,
  CreateTableRequest,
  UpdateTableRequest,
  TableStatistics,
  TableReservation,
  CreateTableReservationRequest,
  UpdateTableReservationRequest,
  ApiResponse,
  PaginatedResponse,
  ListQueryParams,
} from '@/types/api'

export const tableApi = {
  // Areas
  getAreas: async (params?: ListQueryParams): Promise<PaginatedResponse<Area>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Area>>>('/areas', { params })
    return response.data.data
  },

  getArea: async (areaId: string): Promise<Area> => {
    const response = await apiClient.get<ApiResponse<Area>>(`/areas/${areaId}`)
    return response.data.data
  },

  getAreaStatistics: async (): Promise<AreaStatistics> => {
    const response = await apiClient.get<ApiResponse<AreaStatistics>>('/areas/statistics')
    return response.data.data
  },

  createArea: async (data: CreateAreaRequest): Promise<Area> => {
    const response = await apiClient.post<ApiResponse<Area>>('/areas', data)
    return response.data.data
  },

  updateArea: async (areaId: string, data: UpdateAreaRequest): Promise<Area> => {
    const response = await apiClient.put<ApiResponse<Area>>(`/areas/${areaId}`, data)
    return response.data.data
  },

  deleteArea: async (areaId: string): Promise<void> => {
    await apiClient.delete(`/areas/${areaId}`)
  },

  // Tables
  getTables: async (params?: ListQueryParams & { area_id?: string; status?: string }): Promise<PaginatedResponse<Table>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Table>>>('/tables', { params })
    return response.data.data
  },

  getTable: async (tableId: string): Promise<Table> => {
    const response = await apiClient.get<ApiResponse<Table>>(`/tables/${tableId}`)
    return response.data.data
  },

  getTableStatistics: async (): Promise<TableStatistics> => {
    const response = await apiClient.get<ApiResponse<TableStatistics>>('/tables/statistics')
    return response.data.data
  },

  createTable: async (data: CreateTableRequest): Promise<Table> => {
    const response = await apiClient.post<ApiResponse<Table>>('/tables', data)
    return response.data.data
  },

  updateTable: async (tableId: string, data: UpdateTableRequest): Promise<Table> => {
    const response = await apiClient.put<ApiResponse<Table>>(`/tables/${tableId}`, data)
    return response.data.data
  },

  deleteTable: async (tableId: string): Promise<void> => {
    await apiClient.delete(`/tables/${tableId}`)
  },

  // Reservations
  getReservations: async (params?: ListQueryParams & { status?: string; table_id?: string }): Promise<PaginatedResponse<TableReservation>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<TableReservation>>>('/table-reservations', { params })
    return response.data.data
  },

  getReservation: async (reservationId: string): Promise<TableReservation> => {
    const response = await apiClient.get<ApiResponse<TableReservation>>(`/table-reservations/${reservationId}`)
    return response.data.data
  },

  createReservation: async (data: CreateTableReservationRequest): Promise<TableReservation> => {
    const response = await apiClient.post<ApiResponse<TableReservation>>('/table-reservations', data)
    return response.data.data
  },

  updateReservation: async (reservationId: string, data: UpdateTableReservationRequest): Promise<TableReservation> => {
    const response = await apiClient.put<ApiResponse<TableReservation>>(`/table-reservations/${reservationId}`, data)
    return response.data.data
  },

  cancelReservation: async (reservationId: string, reason?: string): Promise<TableReservation> => {
    const response = await apiClient.post<ApiResponse<TableReservation>>(`/table-reservations/${reservationId}/cancel`, { reason })
    return response.data.data
  },
}

