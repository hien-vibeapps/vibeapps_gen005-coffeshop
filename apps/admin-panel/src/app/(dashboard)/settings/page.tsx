'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cài đặt</h2>
        <p className="text-muted-foreground">Quản lý thông tin quán và cấu hình hệ thống</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Quán</CardTitle>
            <CardDescription>Cập nhật thông tin cơ bản của quán</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tính năng đang phát triển...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cấu hình Hệ thống</CardTitle>
            <CardDescription>Thiết lập các thông số hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tính năng đang phát triển...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

