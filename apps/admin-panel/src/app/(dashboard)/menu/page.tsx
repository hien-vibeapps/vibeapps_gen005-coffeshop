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
import { categoryApi } from '@/api/category.api'
import { productApi } from '@/api/product.api'
import { formatCurrency } from '@/lib/utils'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
  })

  // Fetch category statistics
  const { data: categoryStats, isLoading: categoryStatsLoading } = useQuery({
    queryKey: ['category-statistics'],
    queryFn: () => categoryApi.getCategoryStatistics(),
  })

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => productApi.getProducts({ category_id: selectedCategory || undefined }),
  })

  // Fetch product statistics
  const { data: productStats, isLoading: productStatsLoading } = useQuery({
    queryKey: ['product-statistics'],
    queryFn: () => productApi.getProductStatistics(),
  })

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-statistics'] })
      setCategoryDialogOpen(false)
      toast.success('Tạo danh mục thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-statistics'] })
      setCategoryDialogOpen(false)
      setEditingCategory(null)
      toast.success('Cập nhật danh mục thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-statistics'] })
      setDeleteCategoryId(null)
      toast.success('Xóa danh mục thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-statistics'] })
      setProductDialogOpen(false)
      toast.success('Tạo sản phẩm thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-statistics'] })
      setProductDialogOpen(false)
      setEditingProduct(null)
      toast.success('Cập nhật sản phẩm thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product-statistics'] })
      setDeleteProductId(null)
      toast.success('Xóa sản phẩm thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const categories = categoriesData?.data || []
  const products = productsData?.data || []

  // Prepare category statistics data
  const categoryPieChart1 = categoryStats
    ? {
        title: 'Phân bổ danh mục theo trạng thái',
        data: categoryStats.statusDistribution.map((item) => ({
          name: item.status === 'true' ? 'Hoạt động' : 'Tạm ngưng',
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const categoryPieChart2 = categoryStats
    ? {
        title: 'Phân bổ danh mục theo số lượng sản phẩm',
        data: categoryStats.productCountDistribution.map((item) => ({
          name: item.range,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  // Prepare product statistics data
  const productPieChart1 = productStats
    ? {
        title: 'Phân bổ sản phẩm theo trạng thái',
        data: productStats.statusDistribution.map((item) => ({
          name:
            item.status === 'available'
              ? 'Có sẵn'
              : item.status === 'out_of_stock'
              ? 'Hết hàng'
              : 'Tạm ngừng',
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const productPieChart2 = productStats
    ? {
        title: 'Phân bổ sản phẩm theo danh mục',
        data: productStats.categoryDistribution.map((item) => ({
          name: item.category,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const handleCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Get shop_id from existing category if editing, or from first category if available
    const editingCategoryData = editingCategory ? categories.find((c) => c.id === editingCategory) : null
    let shopId = editingCategoryData?.shop_id
    if (!shopId && categories.length > 0) {
      shopId = categories[0].shop_id
    }
    
    // If still no shop_id, this is an error - should not happen in normal flow
    if (!shopId) {
      toast.error('Không tìm thấy shop_id. Vui lòng thử lại sau.')
      return
    }
    
    const data = {
      shop_id: shopId,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    }

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory, data })
    } else {
      createCategoryMutation.mutate(data as any)
    }
  }

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Get shop_id from existing product if editing, or from first product if available, or from category
    let shopId = editingProductData?.shop_id
    if (!shopId && products.length > 0) {
      shopId = products[0].shop_id
    }
    if (!shopId && categories.length > 0) {
      shopId = categories[0].shop_id
    }
    
    // If still no shop_id, this is an error - should not happen in normal flow
    if (!shopId) {
      toast.error('Không tìm thấy shop_id. Vui lòng thử lại sau.')
      return
    }
    
    const data = {
      shop_id: shopId,
      category_id: formData.get('category_id') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      estimated_prep_time: parseInt(formData.get('estimated_prep_time') as string) || 0,
      status: (formData.get('status') as any) || 'available',
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on',
    }

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct, data })
    } else {
      createProductMutation.mutate(data as any)
    }
  }

  const editingCategoryData = editingCategory ? categories.find((c) => c.id === editingCategory) : null
  const editingProductData = editingProduct ? products.find((p) => p.id === editingProduct) : null

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Menu</h2>
          <p className="text-muted-foreground">Quản lý danh mục và sản phẩm</p>
        </div>
      </div>

      {/* Category Statistics Section */}
      <StatisticsSection
        title="Thống kê Danh mục"
        pieChart1={categoryPieChart1}
        pieChart2={categoryPieChart2}
        metrics={
          categoryStats
            ? [
                { label: 'Tổng số danh mục', value: categoryStats.totalCategories },
                { label: 'Danh mục đang hoạt động', value: categoryStats.activeCategories },
                { label: 'Danh mục có sản phẩm', value: categoryStats.categoriesWithProducts },
              ]
            : undefined
        }
        isLoading={categoryStatsLoading}
      />

      {/* Product Statistics Section */}
      <StatisticsSection
        title="Thống kê Sản phẩm"
        pieChart1={productPieChart1}
        pieChart2={productPieChart2}
        metrics={
          productStats
            ? [
                { label: 'Tổng số sản phẩm', value: productStats.totalProducts },
                { label: 'Sản phẩm có sẵn', value: productStats.availableProducts },
                { label: 'Sản phẩm hết hàng', value: productStats.outOfStockProducts },
                { label: 'Sản phẩm tạm ngừng', value: productStats.suspendedProducts },
              ]
            : undefined
        }
        isLoading={productStatsLoading}
      />

      <div className="grid gap-4 md:grid-cols-4">
        {/* Categories Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh mục</CardTitle>
              <Dialog
                open={categoryDialogOpen}
                onOpenChange={(open) => {
                  setCategoryDialogOpen(open)
                  if (!open) {
                    setEditingCategory(null)
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleCategorySubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
                      <DialogDescription>
                        {editingCategory ? 'Cập nhật thông tin danh mục' : 'Nhập thông tin danh mục mới'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Tên danh mục *</Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={editingCategoryData?.name}
                          required
                          placeholder="Nhập tên danh mục"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Input
                          id="description"
                          name="description"
                          defaultValue={editingCategoryData?.description}
                          placeholder="Nhập mô tả"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="display_order">Thứ tự hiển thị</Label>
                        <Input
                          id="display_order"
                          name="display_order"
                          type="number"
                          defaultValue={editingCategoryData?.display_order || 0}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="is_active"
                          name="is_active"
                          type="checkbox"
                          defaultChecked={editingCategoryData?.is_active ?? true}
                          className="rounded"
                        />
                        <Label htmlFor="is_active">Hoạt động</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                        {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>Chọn danh mục để xem sản phẩm</CardDescription>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  Tất cả
                </Button>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <Button
                      variant={selectedCategory === category.id ? 'default' : 'ghost'}
                      className="flex-1 justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingCategory(category.id)
                        setCategoryDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Dialog open={deleteCategoryId === category.id} onOpenChange={(open) => !open && setDeleteCategoryId(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteCategoryId(category.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Xác nhận xóa</DialogTitle>
                          <DialogDescription>
                            Bạn có chắc chắn muốn xóa danh mục &quot;{category.name}&quot;? Hành động này không thể hoàn tác.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteCategoryId(null)}>
                            Hủy
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              deleteCategoryMutation.mutate(category.id)
                            }}
                            disabled={deleteCategoryMutation.isPending}
                          >
                            Xóa
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products List */}
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sản phẩm</CardTitle>
                <CardDescription>
                  {selectedCategory
                    ? `Sản phẩm trong danh mục: ${categories.find((c) => c.id === selectedCategory)?.name}`
                    : 'Tất cả sản phẩm'}
                </CardDescription>
              </div>
              <Dialog
                open={productDialogOpen}
                onOpenChange={(open) => {
                  setProductDialogOpen(open)
                  if (!open) {
                    setEditingProduct(null)
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm sản phẩm
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleProductSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
                      <DialogDescription>
                        {editingProduct ? 'Cập nhật thông tin sản phẩm' : 'Nhập thông tin sản phẩm mới'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="product_category_id">Danh mục *</Label>
                        <select
                          id="product_category_id"
                          name="category_id"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          defaultValue={editingProductData?.category_id}
                          required
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="product_name">Tên sản phẩm *</Label>
                        <Input
                          id="product_name"
                          name="name"
                          defaultValue={editingProductData?.name}
                          required
                          placeholder="Nhập tên sản phẩm"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="product_description">Mô tả</Label>
                        <Input
                          id="product_description"
                          name="description"
                          defaultValue={editingProductData?.description}
                          placeholder="Nhập mô tả"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="product_price">Giá bán *</Label>
                        <Input
                          id="product_price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={editingProductData?.price}
                          required
                          placeholder="Nhập giá bán"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="product_estimated_prep_time">Thời gian chế biến (phút)</Label>
                        <Input
                          id="product_estimated_prep_time"
                          name="estimated_prep_time"
                          type="number"
                          min="0"
                          max="120"
                          defaultValue={editingProductData?.estimated_prep_time || 0}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="product_status">Trạng thái</Label>
                        <select
                          id="product_status"
                          name="status"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          defaultValue={editingProductData?.status || 'available'}
                        >
                          <option value="available">Có sẵn</option>
                          <option value="out_of_stock">Hết hàng</option>
                          <option value="suspended">Tạm ngừng</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="product_display_order">Thứ tự hiển thị</Label>
                        <Input
                          id="product_display_order"
                          name="display_order"
                          type="number"
                          defaultValue={editingProductData?.display_order || 0}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="product_is_active"
                          name="is_active"
                          type="checkbox"
                          defaultChecked={editingProductData?.is_active ?? true}
                          className="rounded"
                        />
                        <Label htmlFor="product_is_active">Hoạt động</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                        {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Không có sản phẩm nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category?.name || '-'}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.status === 'available'
                                ? 'default'
                                : product.status === 'out_of_stock'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {product.status === 'available'
                              ? 'Có sẵn'
                              : product.status === 'out_of_stock'
                              ? 'Hết hàng'
                              : 'Tạm ngừng'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingProduct(product.id)
                                setProductDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Dialog open={deleteProductId === product.id} onOpenChange={(open) => !open && setDeleteProductId(null)}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setDeleteProductId(product.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Xác nhận xóa</DialogTitle>
                                  <DialogDescription>
                                    Bạn có chắc chắn muốn xóa sản phẩm &quot;{product.name}&quot;? Hành động này không thể hoàn tác.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setDeleteProductId(null)}>
                                    Hủy
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      deleteProductMutation.mutate(product.id)
                                    }}
                                    disabled={deleteProductMutation.isPending}
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
    </div>
  )
}
