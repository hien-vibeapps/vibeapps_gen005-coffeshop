'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart } from '@/components/ui/pie-chart'
import { Skeleton } from '@/components/ui/skeleton'

interface PieChartData {
  name: string
  value: number
}

interface StatisticsSectionProps {
  title?: string
  pieChart1: {
    title: string
    data: PieChartData[]
  }
  pieChart2: {
    title: string
    data: PieChartData[]
  }
  metrics?: Array<{
    label: string
    value: string | number
  }>
  isLoading?: boolean
}

export function StatisticsSection({
  title = 'Thống kê',
  pieChart1,
  pieChart2,
  metrics,
  isLoading = false,
}: StatisticsSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {title && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          {metrics && (
            <Card>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics.map((_, index) => (
                    <Skeleton key={index} className="h-8 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-6">
      {title && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Pie Chart 1 */}
        <Card>
          <CardHeader>
            <CardTitle>{pieChart1.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={pieChart1.data} />
          </CardContent>
        </Card>

        {/* Pie Chart 2 */}
        <Card>
          <CardHeader>
            <CardTitle>{pieChart2.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={pieChart2.data} />
          </CardContent>
        </Card>

        {/* Metrics Cards (Optional) */}
        {metrics && metrics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Chỉ số</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    <span className="text-lg font-semibold">{metric.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


