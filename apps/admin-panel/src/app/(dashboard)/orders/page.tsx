'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StatisticsSection } from '@/components/statistics-section'
import { orderApi } from '@/api/order.api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Eye } from 'lucide-react'
import Link from 'next/link'

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  preparing: 'default',
  ready: 'default',
  served: 'default',
  paid: 'default',
  cancelled: 'destructive',
}

const statusLabels: Record<string, string> = {
  pending: 'Chờ xử lý',
  preparing: 'Đang chế biến',
  ready: 'Sẵn sàng',
  served: 'Đã phục vụ',
  paid: 'Đã thanh toán',
  cancelled: 'Đã hủy',
}

const typeLabels: Record<string, string> = {
  dine_in: 'Tại quán',
  takeaway: 'Mang đi',
  delivery: 'Giao hàng',
}

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getOrders({ limit: 50 }),
  })

  const { data: orderStats, isLoading: orderStatsLoading } = useQuery({
    queryKey: ['order-statistics'],
    queryFn: () => orderApi.getOrderStatistics(),
  })

  const orders = ordersData?.data || []

  const orderPieChart1 = orderStats
    ? {
        title: 'Phân bổ đơn hàng theo trạng thái',
        data: orderStats.statusDistribution.map((item) => ({
          name: statusLabels[item.status] || item.status,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const orderPieChart2 = orderStats
    ? {
        title: 'Phân bổ đơn hàng theo loại',
        data: orderStats.typeDistribution.map((item) => ({
          name: typeLabels[item.type] || item.type,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Đơn hàng</h2>
          <p className="text-muted-foreground">Xem và quản lý tất cả đơn hàng</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo đơn hàng mới
        </Button>
      </div>

      {/* Statistics Section */}
      <StatisticsSection
        title="Thống kê Đơn hàng"
        pieChart1={orderPieChart1}
        pieChart2={orderPieChart2}
        metrics={
          orderStats
            ? [
                { label: 'Tổng số đơn hôm nay', value: orderStats.totalOrdersToday },
                { label: 'Tổng doanh thu hôm nay', value: formatCurrency(orderStats.totalRevenueToday) },
                { label: 'Đơn hàng đang xử lý', value: orderStats.pendingOrders },
                { label: 'Đơn hàng chờ thanh toán', value: orderStats.ordersAwaitingPayment },
              ]
            : undefined
        }
        isLoading={orderStatsLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>Tổng số đơn hàng: {orders.length}</CardDescription>
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
                  <TableHead>Số đơn</TableHead>
                  <TableHead>Bàn</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Không có đơn hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>
                        {order.table?.table_number ||
                          (order.order_type === 'takeaway' ? 'Mang đi' : order.order_type === 'delivery' ? 'Giao hàng' : '-')}
                      </TableCell>
                      <TableCell>{typeLabels[order.order_type] || order.order_type}</TableCell>
                      <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[order.status] || 'default'}>
                          {statusLabels[order.status] || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
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
