'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StatisticsSection } from '@/components/statistics-section'
import { employeeApi } from '@/api/employee.api'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const roleLabels: Record<string, string> = {
  owner: 'Chủ quán',
  manager: 'Quản lý',
  shift_manager: 'Quản lý ca',
  waiter: 'Nhân viên phục vụ',
  cashier: 'Thu ngân',
  barista: 'Barista',
}

export default function EmployeesPage() {
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null)
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: employeesData, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeApi.getEmployees(),
  })

  const { data: employeeStats, isLoading: employeeStatsLoading } = useQuery({
    queryKey: ['employee-statistics'],
    queryFn: () => employeeApi.getEmployeeStatistics(),
  })

  const createEmployeeMutation = useMutation({
    mutationFn: employeeApi.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['employee-statistics'] })
      setEmployeeDialogOpen(false)
      toast.success('Tạo nhân viên thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => employeeApi.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['employee-statistics'] })
      setEmployeeDialogOpen(false)
      setEditingEmployee(null)
      toast.success('Cập nhật nhân viên thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const deleteEmployeeMutation = useMutation({
    mutationFn: employeeApi.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['employee-statistics'] })
      setDeleteEmployeeId(null)
      toast.success('Xóa nhân viên thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const employees = employeesData?.data || []

  const employeePieChart1 = employeeStats
    ? {
        title: 'Phân bổ nhân viên theo trạng thái',
        data: employeeStats.statusDistribution.map((item) => ({
          name: item.status === 'true' ? 'Hoạt động' : 'Không hoạt động',
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const employeePieChart2 = employeeStats
    ? {
        title: 'Phân bổ nhân viên theo vị trí',
        data: employeeStats.roleDistribution.map((item) => ({
          name: roleLabels[item.role] || item.role,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const handleEmployeeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      shop_id: 'default-shop-id', // TODO: Get from context/auth
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      full_name: formData.get('full_name') as string,
      role: formData.get('role') as any,
      start_date: formData.get('start_date') as string,
      is_active: formData.get('is_active') === 'on',
    }

    if (editingEmployee) {
      updateEmployeeMutation.mutate({ id: editingEmployee, data })
    } else {
      createEmployeeMutation.mutate(data as any)
    }
  }

  const editingEmployeeData = editingEmployee ? employees.find((e) => e.id === editingEmployee) : null

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Nhân viên</h2>
          <p className="text-muted-foreground">Quản lý thông tin và phân quyền nhân viên</p>
        </div>
        <Dialog
          open={employeeDialogOpen}
          onOpenChange={(open) => {
            setEmployeeDialogOpen(open)
            if (!open) {
              setEditingEmployee(null)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleEmployeeSubmit}>
              <DialogHeader>
                <DialogTitle>{editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}</DialogTitle>
                <DialogDescription>
                  {editingEmployee ? 'Cập nhật thông tin nhân viên' : 'Nhập thông tin nhân viên mới'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Họ tên *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={editingEmployeeData?.full_name}
                    required
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={editingEmployeeData?.email}
                    required
                    placeholder="Nhập email"
                    disabled={!!editingEmployee}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={editingEmployeeData?.phone}
                    required
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Vị trí *</Label>
                  <select
                    id="role"
                    name="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={editingEmployeeData?.role}
                    required
                  >
                    <option value="">Chọn vị trí</option>
                    <option value="owner">Chủ quán</option>
                    <option value="manager">Quản lý</option>
                    <option value="shift_manager">Quản lý ca</option>
                    <option value="waiter">Nhân viên phục vụ</option>
                    <option value="cashier">Thu ngân</option>
                    <option value="barista">Barista</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Ngày bắt đầu làm việc</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    defaultValue={editingEmployeeData?.start_date ? editingEmployeeData.start_date.split('T')[0] : ''}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    defaultChecked={editingEmployeeData?.is_active ?? true}
                    className="rounded"
                  />
                  <Label htmlFor="is_active">Hoạt động</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}>
                  {editingEmployee ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Section */}
      <StatisticsSection
        title="Thống kê Nhân viên"
        pieChart1={employeePieChart1}
        pieChart2={employeePieChart2}
        metrics={
          employeeStats
            ? [
                { label: 'Tổng số nhân viên', value: employeeStats.totalEmployees },
                { label: 'Nhân viên đang làm việc', value: employeeStats.activeEmployees },
                { label: 'Nhân viên mới trong tháng', value: employeeStats.newEmployeesThisMonth },
              ]
            : undefined
        }
        isLoading={employeeStatsLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription>Tổng số nhân viên: {employees.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Không có nhân viên nào
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.full_name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{roleLabels[employee.role] || employee.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.is_active ? 'default' : 'secondary'}>
                          {employee.is_active ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingEmployee(employee.id)
                              setEmployeeDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog open={deleteEmployeeId === employee.id} onOpenChange={(open) => !open && setDeleteEmployeeId(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteEmployeeId(employee.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Xác nhận xóa</DialogTitle>
                                <DialogDescription>
                                  Bạn có chắc chắn muốn xóa nhân viên &quot;{employee.full_name}&quot;? Hành động này không thể hoàn tác.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteEmployeeId(null)}>
                                  Hủy
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    deleteEmployeeMutation.mutate(employee.id)
                                  }}
                                  disabled={deleteEmployeeMutation.isPending}
                                >
                                  Xóa
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
