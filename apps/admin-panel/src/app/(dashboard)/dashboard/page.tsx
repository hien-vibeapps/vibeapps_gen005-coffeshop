'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { orderApi } from '@/api/order.api'
import { formatCurrency } from '@/lib/utils'
import { ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  // Fetch today's orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', 'today'],
    queryFn: () =>
      orderApi.getOrders({
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
      }),
  })

  const todayRevenue = ordersData?.data
    ?.filter((order) => order.status === 'paid')
    .reduce((sum, order) => sum + order.total_amount, 0) || 0

  const todayOrders = ordersData?.data?.length || 0
  const pendingOrders = ordersData?.data?.filter((order) => order.status === 'pending').length || 0

  const stats = [
    {
      title: 'Doanh thu hôm nay',
      value: formatCurrency(todayRevenue),
      icon: DollarSign,
      description: 'Tổng doanh thu đã thanh toán',
    },
    {
      title: 'Đơn hàng hôm nay',
      value: todayOrders.toString(),
      icon: ShoppingCart,
      description: 'Tổng số đơn hàng',
    },
    {
      title: 'Đơn đang chờ',
      value: pendingOrders.toString(),
      icon: TrendingUp,
      description: 'Đơn hàng cần xử lý',
    },
    {
      title: 'Bàn đang sử dụng',
      value: '0',
      icon: Users,
      description: 'Số bàn đang phục vụ',
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

