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
import { inventoryApi } from '@/api/inventory.api'
import { formatCurrency } from '@/lib/utils'
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function InventoryPage() {
  const [ingredientDialogOpen, setIngredientDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null)
  const [deleteIngredientId, setDeleteIngredientId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: ingredientsData, isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => inventoryApi.getIngredients(),
  })

  const { data: ingredientStats, isLoading: ingredientStatsLoading } = useQuery({
    queryKey: ['ingredient-statistics'],
    queryFn: () => inventoryApi.getIngredientStatistics(),
  })

  const createIngredientMutation = useMutation({
    mutationFn: inventoryApi.createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({ queryKey: ['ingredient-statistics'] })
      setIngredientDialogOpen(false)
      toast.success('Tạo nguyên liệu thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const updateIngredientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => inventoryApi.updateIngredient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({ queryKey: ['ingredient-statistics'] })
      setIngredientDialogOpen(false)
      setEditingIngredient(null)
      toast.success('Cập nhật nguyên liệu thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const deleteIngredientMutation = useMutation({
    mutationFn: inventoryApi.deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({ queryKey: ['ingredient-statistics'] })
      setDeleteIngredientId(null)
      toast.success('Xóa nguyên liệu thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const ingredients = ingredientsData?.data || []
  const lowStockItems = ingredients.filter((item) => item.current_stock <= item.min_stock_level)

  const ingredientPieChart1 = ingredientStats
    ? {
        title: 'Phân bổ nguyên liệu theo trạng thái tồn kho',
        data: ingredientStats.stockStatusDistribution.map((item) => ({
          name: item.status,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const ingredientPieChart2 = ingredientStats
    ? {
        title: 'Phân bổ nguyên liệu theo đơn vị tính',
        data: ingredientStats.unitDistribution.map((item) => ({
          name: item.unit,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const handleIngredientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Get shop_id from existing ingredient if editing, or from first ingredient if available
    let shopId = editingIngredientData?.shop_id
    if (!shopId && ingredients.length > 0) {
      shopId = ingredients[0].shop_id
    }
    
    // If still no shop_id, this is an error - should not happen in normal flow
    if (!shopId) {
      toast.error('Không tìm thấy shop_id. Vui lòng thử lại sau.')
      return
    }
    
    const data = {
      shop_id: shopId,
      name: formData.get('name') as string,
      unit: formData.get('unit') as string,
      current_stock: parseFloat(formData.get('current_stock') as string) || 0,
      min_stock_level: parseFloat(formData.get('min_stock_level') as string) || 0,
      unit_price: parseFloat(formData.get('unit_price') as string) || 0,
      supplier: formData.get('supplier') as string,
      expiry_tracking: formData.get('expiry_tracking') === 'on',
      is_active: formData.get('is_active') === 'on',
    }

    if (editingIngredient) {
      updateIngredientMutation.mutate({ id: editingIngredient, data })
    } else {
      createIngredientMutation.mutate(data as any)
    }
  }

  const editingIngredientData = editingIngredient ? ingredients.find((i) => i.id === editingIngredient) : null

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Kho hàng</h2>
          <p className="text-muted-foreground">Quản lý nguyên liệu và tồn kho</p>
        </div>
        <Dialog
          open={ingredientDialogOpen}
          onOpenChange={(open) => {
            setIngredientDialogOpen(open)
            if (!open) {
              setEditingIngredient(null)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nguyên liệu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleIngredientSubmit}>
              <DialogHeader>
                <DialogTitle>{editingIngredient ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu mới'}</DialogTitle>
                <DialogDescription>
                  {editingIngredient ? 'Cập nhật thông tin nguyên liệu' : 'Nhập thông tin nguyên liệu mới'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="ingredient_name">Tên nguyên liệu *</Label>
                  <Input
                    id="ingredient_name"
                    name="name"
                    defaultValue={editingIngredientData?.name}
                    required
                    placeholder="Nhập tên nguyên liệu"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ingredient_unit">Đơn vị tính *</Label>
                  <Input
                    id="ingredient_unit"
                    name="unit"
                    defaultValue={editingIngredientData?.unit}
                    required
                    placeholder="kg, l, pcs, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ingredient_current_stock">Tồn kho hiện tại</Label>
                  <Input
                    id="ingredient_current_stock"
                    name="current_stock"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingIngredientData?.current_stock || 0}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ingredient_min_stock_level">Mức tồn kho tối thiểu</Label>
                  <Input
                    id="ingredient_min_stock_level"
                    name="min_stock_level"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingIngredientData?.min_stock_level || 0}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ingredient_unit_price">Giá đơn vị</Label>
                  <Input
                    id="ingredient_unit_price"
                    name="unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingIngredientData?.unit_price || 0}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ingredient_supplier">Nhà cung cấp</Label>
                  <Input
                    id="ingredient_supplier"
                    name="supplier"
                    defaultValue={editingIngredientData?.supplier}
                    placeholder="Nhập tên nhà cung cấp"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="ingredient_expiry_tracking"
                    name="expiry_tracking"
                    type="checkbox"
                    defaultChecked={editingIngredientData?.expiry_tracking ?? false}
                    className="rounded"
                  />
                  <Label htmlFor="ingredient_expiry_tracking">Theo dõi hết hạn</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="ingredient_is_active"
                    name="is_active"
                    type="checkbox"
                    defaultChecked={editingIngredientData?.is_active ?? true}
                    className="rounded"
                  />
                  <Label htmlFor="ingredient_is_active">Hoạt động</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createIngredientMutation.isPending || updateIngredientMutation.isPending}>
                  {editingIngredient ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo tồn kho thấp
            </CardTitle>
            <CardDescription>Có {lowStockItems.length} nguyên liệu sắp hết hàng</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Statistics Section */}
      <StatisticsSection
        title="Thống kê Nguyên liệu"
        pieChart1={ingredientPieChart1}
        pieChart2={ingredientPieChart2}
        metrics={
          ingredientStats
            ? [
                { label: 'Tổng số nguyên liệu', value: ingredientStats.totalIngredients },
                { label: 'Đủ hàng', value: ingredientStats.sufficientStock },
                { label: 'Sắp hết', value: ingredientStats.lowStock },
                { label: 'Hết hàng', value: ingredientStats.outOfStock },
                { label: 'Tổng giá trị tồn kho', value: formatCurrency(ingredientStats.totalInventoryValue) },
              ]
            : undefined
        }
        isLoading={ingredientStatsLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nguyên liệu</CardTitle>
          <CardDescription>Tổng số nguyên liệu: {ingredients.length}</CardDescription>
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
                  <TableHead>Tên nguyên liệu</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Mức tối thiểu</TableHead>
                  <TableHead>Giá đơn vị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Không có nguyên liệu nào
                    </TableCell>
                  </TableRow>
                ) : (
                  ingredients.map((ingredient) => {
                    const isLowStock = ingredient.current_stock <= ingredient.min_stock_level
                    return (
                      <TableRow key={ingredient.id}>
                        <TableCell className="font-medium">{ingredient.name}</TableCell>
                        <TableCell>{ingredient.unit}</TableCell>
                        <TableCell>
                          <span className={isLowStock ? 'text-destructive font-bold' : ''}>
                            {ingredient.current_stock}
                          </span>
                        </TableCell>
                        <TableCell>{ingredient.min_stock_level}</TableCell>
                        <TableCell>{formatCurrency(ingredient.unit_price)}</TableCell>
                        <TableCell>
                          <Badge variant={isLowStock ? 'destructive' : 'default'}>
                            {isLowStock ? 'Sắp hết' : 'Đủ hàng'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingIngredient(ingredient.id)
                                setIngredientDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Dialog
                              open={deleteIngredientId === ingredient.id}
                              onOpenChange={(open) => !open && setDeleteIngredientId(null)}
                            >
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setDeleteIngredientId(ingredient.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Xác nhận xóa</DialogTitle>
                                  <DialogDescription>
                                    Bạn có chắc chắn muốn xóa nguyên liệu &quot;{ingredient.name}&quot;? Hành động này không thể hoàn tác.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setDeleteIngredientId(null)}>
                                    Hủy
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      deleteIngredientMutation.mutate(ingredient.id)
                                    }}
                                    disabled={deleteIngredientMutation.isPending}
                                  >
                                    Xóa
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
