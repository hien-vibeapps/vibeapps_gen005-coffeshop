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

export default function AreasPage() {
  const [areaDialogOpen, setAreaDialogOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<string | null>(null)
  const [deleteAreaId, setDeleteAreaId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: areasData, isLoading } = useQuery({
    queryKey: ['areas'],
    queryFn: () => tableApi.getAreas(),
  })

  const { data: areaStats, isLoading: areaStatsLoading } = useQuery({
    queryKey: ['area-statistics'],
    queryFn: () => tableApi.getAreaStatistics(),
  })

  const createAreaMutation = useMutation({
    mutationFn: tableApi.createArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      queryClient.invalidateQueries({ queryKey: ['area-statistics'] })
      setAreaDialogOpen(false)
      toast.success('Tạo khu vực thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const updateAreaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tableApi.updateArea(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      queryClient.invalidateQueries({ queryKey: ['area-statistics'] })
      setAreaDialogOpen(false)
      setEditingArea(null)
      toast.success('Cập nhật khu vực thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const deleteAreaMutation = useMutation({
    mutationFn: tableApi.deleteArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      queryClient.invalidateQueries({ queryKey: ['area-statistics'] })
      setDeleteAreaId(null)
      toast.success('Xóa khu vực thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const areas = areasData?.data || []

  const areaPieChart1 = areaStats
    ? {
        title: 'Phân bổ khu vực theo trạng thái',
        data: areaStats.statusDistribution.map((item) => ({
          name: item.status === 'true' ? 'Hoạt động' : 'Tạm ngưng',
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const areaPieChart2 = areaStats
    ? {
        title: 'Phân bổ khu vực theo số lượng bàn',
        data: areaStats.tableCountDistribution.map((item) => ({
          name: item.range,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const handleAreaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      shop_id: 'default-shop-id', // TODO: Get from context/auth
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      is_active: formData.get('is_active') === 'on',
    }

    if (editingArea) {
      updateAreaMutation.mutate({ id: editingArea, data })
    } else {
      createAreaMutation.mutate(data as any)
    }
  }

  const editingAreaData = editingArea ? areas.find((a) => a.id === editingArea) : null

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Khu vực</h2>
          <p className="text-muted-foreground">Quản lý các khu vực trong quán</p>
        </div>
        <Dialog
          open={areaDialogOpen}
          onOpenChange={(open) => {
            setAreaDialogOpen(open)
            if (!open) {
              setEditingArea(null)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khu vực
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAreaSubmit}>
              <DialogHeader>
                <DialogTitle>{editingArea ? 'Sửa khu vực' : 'Thêm khu vực mới'}</DialogTitle>
                <DialogDescription>{editingArea ? 'Cập nhật thông tin khu vực' : 'Nhập thông tin khu vực mới'}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="area_name">Tên khu vực *</Label>
                  <Input
                    id="area_name"
                    name="name"
                    defaultValue={editingAreaData?.name}
                    required
                    placeholder="Nhập tên khu vực"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="area_description">Mô tả</Label>
                  <Input
                    id="area_description"
                    name="description"
                    defaultValue={editingAreaData?.description}
                    placeholder="Nhập mô tả"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="area_is_active"
                    name="is_active"
                    type="checkbox"
                    defaultChecked={editingAreaData?.is_active ?? true}
                    className="rounded"
                  />
                  <Label htmlFor="area_is_active">Hoạt động</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createAreaMutation.isPending || updateAreaMutation.isPending}>
                  {editingArea ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Section */}
      <StatisticsSection
        title="Thống kê Khu vực"
        pieChart1={areaPieChart1}
        pieChart2={areaPieChart2}
        metrics={
          areaStats
            ? [
                { label: 'Tổng số khu vực', value: areaStats.totalAreas },
                { label: 'Khu vực đang hoạt động', value: areaStats.activeAreas },
                { label: 'Tổng số bàn', value: areaStats.totalTables },
              ]
            : undefined
        }
        isLoading={areaStatsLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách khu vực</CardTitle>
          <CardDescription>Tổng số khu vực: {areas.length}</CardDescription>
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
                  <TableHead>Tên khu vực</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Không có khu vực nào
                    </TableCell>
                  </TableRow>
                ) : (
                  areas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.name}</TableCell>
                      <TableCell>{area.description || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={area.is_active ? 'default' : 'secondary'}>
                          {area.is_active ? 'Hoạt động' : 'Tạm ngưng'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingArea(area.id)
                              setAreaDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog open={deleteAreaId === area.id} onOpenChange={(open) => !open && setDeleteAreaId(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteAreaId(area.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Xác nhận xóa</DialogTitle>
                                <DialogDescription>
                                  Bạn có chắc chắn muốn xóa khu vực &quot;{area.name}&quot;? Hành động này không thể hoàn tác.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteAreaId(null)}>
                                  Hủy
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    deleteAreaMutation.mutate(area.id)
                                  }}
                                  disabled={deleteAreaMutation.isPending}
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


