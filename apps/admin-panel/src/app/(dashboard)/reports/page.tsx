'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Báo cáo và Thống kê</h2>
        <p className="text-muted-foreground">Xem báo cáo doanh thu, bán hàng và kho hàng</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Báo cáo Doanh thu</CardTitle>
            <CardDescription>Xem doanh thu theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tính năng đang phát triển...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Báo cáo Bán hàng</CardTitle>
            <CardDescription>Phân tích sản phẩm bán chạy</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tính năng đang phát triển...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Báo cáo Kho hàng</CardTitle>
            <CardDescription>Thống kê tồn kho và chi phí</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tính năng đang phát triển...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

