import { apiClient } from '@/lib/api-client'
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeePermission,
  EmployeeStatistics,
  ApiResponse,
  PaginatedResponse,
  ListQueryParams,
} from '@/types/api'

export const employeeApi = {
  // Get all employees
  getEmployees: async (params?: ListQueryParams & { role?: string; is_active?: boolean }): Promise<PaginatedResponse<Employee>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Employee>>>('/employees', { params })
    return response.data.data
  },

  // Get employee by ID
  getEmployee: async (employeeId: string): Promise<Employee> => {
    const response = await apiClient.get<ApiResponse<Employee>>(`/employees/${employeeId}`)
    return response.data.data
  },

  // Get employee statistics
  getEmployeeStatistics: async (): Promise<EmployeeStatistics> => {
    const response = await apiClient.get<ApiResponse<EmployeeStatistics>>('/employees/statistics')
    return response.data.data
  },

  // Create employee
  createEmployee: async (data: CreateEmployeeRequest): Promise<Employee> => {
    const response = await apiClient.post<ApiResponse<Employee>>('/employees', data)
    return response.data.data
  },

  // Update employee
  updateEmployee: async (employeeId: string, data: UpdateEmployeeRequest): Promise<Employee> => {
    const response = await apiClient.put<ApiResponse<Employee>>(`/employees/${employeeId}`, data)
    return response.data.data
  },

  // Delete employee
  deleteEmployee: async (employeeId: string): Promise<void> => {
    await apiClient.delete(`/employees/${employeeId}`)
  },

  // Permissions
  getEmployeePermissions: async (employeeId: string): Promise<EmployeePermission[]> => {
    const response = await apiClient.get<ApiResponse<EmployeePermission[]>>(`/employees/${employeeId}/permissions`)
    return response.data.data
  },

  updateEmployeePermissions: async (employeeId: string, permissions: { permission_code: string; is_granted: boolean }[]): Promise<EmployeePermission[]> => {
    const response = await apiClient.put<ApiResponse<EmployeePermission[]>>(`/employees/${employeeId}/permissions`, { permissions })
    return response.data.data
  },
}

