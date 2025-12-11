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
import { tableApi } from '@/api/table.api'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  available: 'default',
  occupied: 'secondary',
  reserved: 'outline',
  maintenance: 'destructive',
}

const statusLabels: Record<string, string> = {
  available: 'Trống',
  occupied: 'Đang sử dụng',
  reserved: 'Đã đặt',
  maintenance: 'Bảo trì',
}

export default function TablesPage() {
  const [tableDialogOpen, setTableDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<string | null>(null)
  const [deleteTableId, setDeleteTableId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: tablesData, isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApi.getTables(),
  })

  const { data: tableStats, isLoading: tableStatsLoading } = useQuery({
    queryKey: ['table-statistics'],
    queryFn: () => tableApi.getTableStatistics(),
  })

  const { data: areasData } = useQuery({
    queryKey: ['areas'],
    queryFn: () => tableApi.getAreas(),
  })

  const createTableMutation = useMutation({
    mutationFn: tableApi.createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['table-statistics'] })
      setTableDialogOpen(false)
      toast.success('Tạo bàn thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const updateTableMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tableApi.updateTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['table-statistics'] })
      setTableDialogOpen(false)
      setEditingTable(null)
      toast.success('Cập nhật bàn thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const deleteTableMutation = useMutation({
    mutationFn: tableApi.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['table-statistics'] })
      setDeleteTableId(null)
      toast.success('Xóa bàn thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const tables = tablesData?.data || []
  const areas = areasData?.data || []

  const tablePieChart1 = tableStats
    ? {
        title: 'Phân bổ bàn theo trạng thái',
        data: tableStats.statusDistribution.map((item) => ({
          name: statusLabels[item.status] || item.status,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const tablePieChart2 = tableStats
    ? {
        title: 'Phân bổ bàn theo khu vực',
        data: tableStats.areaDistribution.map((item) => ({
          name: item.area,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const handleTableSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      area_id: formData.get('area_id') as string,
      table_number: formData.get('table_number') as string,
      capacity: parseInt(formData.get('capacity') as string) || 4,
      status: (formData.get('status') as any) || 'available',
      notes: formData.get('notes') as string,
    }

    if (editingTable) {
      updateTableMutation.mutate({ id: editingTable, data })
    } else {
      createTableMutation.mutate(data as any)
    }
  }

  const editingTableData = editingTable ? tables.find((t) => t.id === editingTable) : null

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Bàn</h2>
          <p className="text-muted-foreground">Quản lý khu vực và bàn trong quán</p>
        </div>
        <Dialog
          open={tableDialogOpen}
          onOpenChange={(open) => {
            setTableDialogOpen(open)
            if (!open) {
              setEditingTable(null)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm bàn
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleTableSubmit}>
              <DialogHeader>
                <DialogTitle>{editingTable ? 'Sửa bàn' : 'Thêm bàn mới'}</DialogTitle>
                <DialogDescription>{editingTable ? 'Cập nhật thông tin bàn' : 'Nhập thông tin bàn mới'}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="area_id">Khu vực *</Label>
                  <select
                    id="area_id"
                    name="area_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={editingTableData?.area_id}
                    required
                  >
                    <option value="">Chọn khu vực</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="table_number">Số bàn/Tên bàn *</Label>
                  <Input
                    id="table_number"
                    name="table_number"
                    defaultValue={editingTableData?.table_number}
                    required
                    placeholder="Nhập số bàn"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Sức chứa</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    max="50"
                    defaultValue={editingTableData?.capacity || 4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <select
                    id="status"
                    name="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={editingTableData?.status || 'available'}
                  >
                    <option value="available">Trống</option>
                    <option value="occupied">Đang sử dụng</option>
                    <option value="reserved">Đã đặt</option>
                    <option value="maintenance">Bảo trì</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Input id="notes" name="notes" defaultValue={editingTableData?.notes} placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createTableMutation.isPending || updateTableMutation.isPending}>
                  {editingTable ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Section */}
      <StatisticsSection
        title="Thống kê Bàn"
        pieChart1={tablePieChart1}
        pieChart2={tablePieChart2}
        metrics={
          tableStats
            ? [
                { label: 'Tổng số bàn', value: tableStats.totalTables },
                { label: 'Bàn trống', value: tableStats.availableTables },
                { label: 'Bàn đang sử dụng', value: tableStats.occupiedTables },
                { label: 'Bàn đã đặt', value: tableStats.reservedTables },
              ]
            : undefined
        }
        isLoading={tableStatsLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bàn</CardTitle>
          <CardDescription>Tổng số bàn: {tables.length}</CardDescription>
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
                  <TableHead>Số bàn</TableHead>
                  <TableHead>Khu vực</TableHead>
                  <TableHead>Sức chứa</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Không có bàn nào
                    </TableCell>
                  </TableRow>
                ) : (
                  tables.map((table) => (
                    <TableRow key={table.id}>
                      <TableCell className="font-medium">{table.table_number}</TableCell>
                      <TableCell>{table.area?.name || '-'}</TableCell>
                      <TableCell>{table.capacity} người</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[table.status] || 'default'}>
                          {statusLabels[table.status] || table.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingTable(table.id)
                              setTableDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog open={deleteTableId === table.id} onOpenChange={(open) => !open && setDeleteTableId(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteTableId(table.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Xác nhận xóa</DialogTitle>
                                <DialogDescription>
                                  Bạn có chắc chắn muốn xóa bàn &quot;{table.table_number}&quot;? Hành động này không thể hoàn tác.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteTableId(null)}>
                                  Hủy
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    deleteTableMutation.mutate(table.id)
                                  }}
                                  disabled={deleteTableMutation.isPending}
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
