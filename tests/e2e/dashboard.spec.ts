import { test, expect } from '@playwright/test'
import { DashboardPage } from '../pages/dashboard.page'

test.describe('Dashboard Page', () => {
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page)
    await dashboardPage.goto()
    await dashboardPage.waitForPageLoad()
  })

  test('should display dashboard title', async () => {
    await expect(dashboardPage.title).toBeVisible()
  })

  test('should display all stats cards', async () => {
    await expect(dashboardPage.revenueCard).toBeVisible()
    await expect(dashboardPage.ordersCard).toBeVisible()
    await expect(dashboardPage.pendingOrdersCard).toBeVisible()
    await expect(dashboardPage.tablesInUseCard).toBeVisible()
  })

  test('should load and display stats values', async () => {
    await dashboardPage.waitForStatsToLoad()
    
    const revenue = await dashboardPage.getRevenueValue()
    const orders = await dashboardPage.getOrdersValue()
    const pendingOrders = await dashboardPage.getPendingOrdersValue()
    const tablesInUse = await dashboardPage.getTablesInUseValue()

    // Values should be displayed (not empty)
    expect(revenue).toBeTruthy()
    expect(orders).toBeTruthy()
    expect(pendingOrders).toBeTruthy()
    expect(tablesInUse).toBeTruthy()
  })

  test('should display correct card descriptions', async ({ page }) => {
    await expect(page.locator('text=Tổng doanh thu đã thanh toán')).toBeVisible()
    await expect(page.locator('text=Tổng số đơn hàng')).toBeVisible()
    await expect(page.locator('text=Đơn hàng cần xử lý')).toBeVisible()
    await expect(page.locator('text=Số bàn đang phục vụ')).toBeVisible()
  })
})

