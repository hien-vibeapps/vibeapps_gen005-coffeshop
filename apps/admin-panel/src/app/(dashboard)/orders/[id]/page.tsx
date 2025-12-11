'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { orderApi } from '@/api/order.api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const statusLabels: Record<string, string> = {
  pending: 'Chờ xử lý',
  preparing: 'Đang chế biến',
  ready: 'Sẵn sàng',
  served: 'Đã phục vụ',
  paid: 'Đã thanh toán',
  cancelled: 'Đã hủy',
}

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrder(orderId),
  })

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <p>Không tìm thấy đơn hàng</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href="/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chi tiết đơn hàng</h2>
          <p className="text-muted-foreground">Số đơn: {order.order_number}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Trạng thái</p>
              <Badge className="mt-1">{statusLabels[order.status] || order.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loại đơn</p>
              <p className="mt-1">
                {order.order_type === 'dine_in' ? 'Tại quán' : order.order_type === 'takeaway' ? 'Mang đi' : 'Giao hàng'}
              </p>
            </div>
            {order.table && (
              <div>
                <p className="text-sm text-muted-foreground">Bàn</p>
                <p className="mt-1">{order.table.table_number}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Thời gian tạo</p>
              <p className="mt-1">{formatDate(order.created_at)}</p>
            </div>
            {order.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Ghi chú</p>
                <p className="mt-1">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng tiền sản phẩm</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.delivery_fee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí giao hàng</span>
                <span>{formatCurrency(order.delivery_fee)}</span>
              </div>
            )}
            {order.vat_amount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT</span>
                <span>{formatCurrency(order.vat_amount)}</span>
              </div>
            )}
            {order.service_fee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí dịch vụ</span>
                <span>{formatCurrency(order.service_fee)}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold">
                <span>Tổng cộng</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Thành tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {item.status === 'pending'
                          ? 'Chờ'
                          : item.status === 'preparing'
                          ? 'Đang chế biến'
                          : item.status === 'ready'
                          ? 'Sẵn sàng'
                          : 'Đã phục vụ'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Không có sản phẩm nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

