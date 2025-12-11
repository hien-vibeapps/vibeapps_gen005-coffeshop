'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StatisticsSection } from '@/components/statistics-section'
import { paymentApi } from '@/api/payment.api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Eye } from 'lucide-react'
import Link from 'next/link'

const methodLabels: Record<string, string> = {
  cash: 'Tiền mặt',
  card: 'Thẻ',
  bank_transfer: 'Chuyển khoản',
  e_wallet: 'Ví điện tử',
}

export default function PaymentsPage() {
  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentApi.getPayments({ limit: 50 }),
  })

  const { data: paymentStats, isLoading: paymentStatsLoading } = useQuery({
    queryKey: ['payment-statistics'],
    queryFn: () => paymentApi.getPaymentStatistics(),
  })

  const payments = paymentsData?.data || []

  const paymentPieChart1 = paymentStats
    ? {
        title: 'Phân bổ thanh toán theo phương thức',
        data: paymentStats.methodDistribution.map((item) => ({
          name: methodLabels[item.method] || item.method,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  const paymentPieChart2 = paymentStats
    ? {
        title: 'Phân bổ thanh toán theo trạng thái',
        data: paymentStats.statusDistribution.map((item) => ({
          name: item.status,
          value: item.count,
        })),
      }
    : { title: '', data: [] }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Thanh toán</h2>
          <p className="text-muted-foreground">Xem và quản lý tất cả giao dịch thanh toán</p>
        </div>
      </div>

      {/* Statistics Section */}
      <StatisticsSection
        title="Thống kê Thanh toán"
        pieChart1={paymentPieChart1}
        pieChart2={paymentPieChart2}
        metrics={
          paymentStats
            ? [
                { label: 'Tổng số giao dịch hôm nay', value: paymentStats.totalTransactionsToday },
                { label: 'Tổng số tiền hôm nay', value: formatCurrency(paymentStats.totalAmountToday) },
              ]
            : undefined
        }
        isLoading={paymentStatsLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách thanh toán</CardTitle>
          <CardDescription>Tổng số giao dịch: {payments.length}</CardDescription>
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
                  <TableHead>Số hóa đơn</TableHead>
                  <TableHead>Số đơn hàng</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Không có giao dịch nào
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.receipt_number}</TableCell>
                      <TableCell>{payment.order?.order_number || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{methodLabels[payment.payment_method] || payment.payment_method}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{formatDate(payment.processed_at)}</TableCell>
                      <TableCell className="text-right">
                        {payment.order_id && (
                          <Link href={`/orders/${payment.order_id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
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


