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
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const typeLabels: Record<string, string> = {
  in: 'Nhập kho',
  out: 'Xuất kho',
  auto_deduct: 'Tự động trừ',
}

export default function InventoryTransactionsPage() {
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['inventory-transactions'],
    queryFn: () => inventoryApi.getTransactions({ limit: 50 }),
  })

  const { data: transactionStats, isLoading: transactionStatsLoading } = useQuery({
    queryKey: ['inventory-transaction-statistics'],
    queryFn: () => inventoryApi.getTransactionStatistics(),
  })

  const { data: ingredientsData } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => inventoryApi.getIngredients(),
  })

  const createTransactionMutation = useMutation({
    mutationFn: inventoryApi.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-transaction-statistics'] })
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      setTransactionDialogOpen(false)
      toast.success('Tạo giao dịch kho thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    },
  })

  const transactions = transactionsData?.data || []
  const ingredients = ingredientsData?.data || []

  const transactionPieChart1 = transactionStats
    ? {
        title: 'Phân bổ giao dịch theo loại',
        data: transactionStats.typeDistribution.map((item) => ({
          name: typeLabels[item.type] || item.type,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const transactionPieChart2 = transactionStats
    ? {
        title: 'Phân bổ giao dịch theo lý do',
        data: transactionStats.reasonDistribution.map((item) => ({
          name: item.reason || 'Không có lý do',
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const handleTransactionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      shop_id: 'default-shop-id', // TODO: Get from context/auth
      ingredient_id: formData.get('ingredient_id') as string,
      transaction_type: formData.get('transaction_type') as any,
      quantity: parseFloat(formData.get('quantity') as string),
      unit_price: parseFloat(formData.get('unit_price') as string) || undefined,
      reason: formData.get('reason') as string,
      notes: formData.get('notes') as string,
    }

    createTransactionMutation.mutate(data as any)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lịch sử Giao dịch Kho</h2>
          <p className="text-muted-foreground">Xem và quản lý lịch sử nhập/xuất kho</p>
        </div>
        <Dialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo giao dịch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleTransactionSubmit}>
              <DialogHeader>
                <DialogTitle>Tạo giao dịch kho mới</DialogTitle>
                <DialogDescription>Nhập thông tin giao dịch nhập/xuất kho</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="transaction_ingredient_id">Nguyên liệu *</Label>
                  <select
                    id="transaction_ingredient_id"
                    name="ingredient_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Chọn nguyên liệu</option>
                    {ingredients.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name} ({ingredient.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction_type">Loại giao dịch *</Label>
                  <select
                    id="transaction_type"
                    name="transaction_type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Chọn loại</option>
                    <option value="in">Nhập kho</option>
                    <option value="out">Xuất kho</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction_quantity">Số lượng *</Label>
                  <Input
                    id="transaction_quantity"
                    name="quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="Nhập số lượng"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction_unit_price">Giá đơn vị</Label>
                  <Input
                    id="transaction_unit_price"
                    name="unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Nhập giá đơn vị (cho nhập kho)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction_reason">Lý do</Label>
                  <Input id="transaction_reason" name="reason" placeholder="Nhập lý do (cho xuất kho)" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction_notes">Ghi chú</Label>
                  <Input id="transaction_notes" name="notes" placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createTransactionMutation.isPending}>
                  Tạo mới
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Section */}
      <StatisticsSection
        title="Thống kê Giao dịch Kho"
        pieChart1={transactionPieChart1}
        pieChart2={transactionPieChart2}
        metrics={
          transactionStats
            ? [
                { label: 'Tổng số giao dịch tháng này', value: transactionStats.totalTransactionsThisMonth },
                { label: 'Tổng giá trị nhập kho', value: formatCurrency(transactionStats.totalInValueThisMonth) },
                { label: 'Tổng giá trị xuất kho', value: formatCurrency(transactionStats.totalOutValueThisMonth) },
              ]
            : undefined
        }
        isLoading={transactionStatsLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
          <CardDescription>Tổng số giao dịch: {transactions.length}</CardDescription>
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
                  <TableHead>Nguyên liệu</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Không có giao dịch nào
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.ingredient?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.transaction_type === 'in' ? 'default' : 'secondary'}>
                          {typeLabels[transaction.transaction_type] || transaction.transaction_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>
                        {transaction.total_amount ? formatCurrency(transaction.total_amount) : '-'}
                      </TableCell>
                      <TableCell>{transaction.reason || '-'}</TableCell>
                      <TableCell>{formatDate(transaction.created_at)}</TableCell>
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


