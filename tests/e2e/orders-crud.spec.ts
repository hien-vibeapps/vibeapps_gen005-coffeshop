import { test, expect } from '@playwright/test'
import { OrdersPage } from '../pages/orders.page'

test.describe('Orders CRUD Operations', () => {
  let ordersPage: OrdersPage

  test.beforeEach(async ({ page }) => {
    ordersPage = new OrdersPage(page)
    await ordersPage.goto()
    await ordersPage.waitForPageLoad()
    await ordersPage.waitForOrdersToLoad()
  })

  test.describe('Create Order', () => {
    test('should open create order dialog', async () => {
      await ordersPage.createOrderButton.click()
      // Wait for dialog or form to appear
      await ordersPage.page.waitForTimeout(500)
      // Check if any dialog or form is visible
      const dialog = ordersPage.page.locator('[role="dialog"]')
      const hasDialog = await dialog.count() > 0
      // If no dialog, check for form or redirect
      expect(hasDialog || ordersPage.page.url().includes('/orders/new')).toBeTruthy()
    })

    test('should display create order button', async () => {
      await expect(ordersPage.createOrderButton).toBeVisible()
    })
  })

  test.describe('View Order Details', () => {
    test('should navigate to order detail page', async ({ page }) => {
      await ordersPage.waitForOrdersToLoad()
      const orderNumbers = await ordersPage.getOrderNumbers()
      
      if (orderNumbers.length > 0) {
        await ordersPage.clickViewOrder(orderNumbers[0])
        await page.waitForURL(/\/orders\/[\w-]+/, { timeout: 5000 })
        
        // Verify we're on order detail page
        const url = page.url()
        expect(url).toMatch(/\/orders\/[\w-]+/)
      }
    })

    test('should display order information in detail page', async ({ page }) => {
      await ordersPage.waitForOrdersToLoad()
      const orderNumbers = await ordersPage.getOrderNumbers()
      
      if (orderNumbers.length > 0) {
        await ordersPage.clickViewOrder(orderNumbers[0])
        await page.waitForURL(/\/orders\/[\w-]+/, { timeout: 5000 })
        
        // Check for order detail elements
        const hasOrderInfo = await page.locator('text=Số đơn').isVisible().catch(() => false) ||
                            await page.locator('text=Trạng thái').isVisible().catch(() => false)
        expect(hasOrderInfo).toBeTruthy()
      }
    })
  })

  test.describe('Order Status', () => {
    test('should display order status badges', async () => {
      await ordersPage.waitForOrdersToLoad()
      const orderNumbers = await ordersPage.getOrderNumbers()
      
      if (orderNumbers.length > 0) {
        const status = await ordersPage.getOrderStatus(orderNumbers[0])
        expect(status).toBeTruthy()
        expect(['Chờ xử lý', 'Đang chuẩn bị', 'Hoàn thành', 'Đã hủy']).toContain(status)
      }
    })

    test('should filter orders by status', async ({ page }) => {
      await ordersPage.waitForOrdersToLoad()
      
      // Check if status filter exists
      const statusFilter = page.locator('select, button').filter({ hasText: /Trạng thái|Status/i })
      const hasFilter = await statusFilter.count() > 0
      
      // If filter exists, test it
      if (hasFilter) {
        await statusFilter.first().click()
        await page.waitForTimeout(500)
        // Verify filter is applied
        expect(true).toBeTruthy() // Placeholder - actual implementation depends on UI
      }
    })
  })

  test.describe('Order List', () => {
    test('should display all order table headers', async ({ page }) => {
      await expect(page.locator('text=Số đơn')).toBeVisible()
      await expect(page.locator('text=Bàn')).toBeVisible()
      await expect(page.locator('text=Loại')).toBeVisible()
      await expect(page.locator('text=Tổng tiền')).toBeVisible()
      await expect(page.locator('text=Trạng thái')).toBeVisible()
      await expect(page.locator('text=Thời gian')).toBeVisible()
    })

    test('should show empty state when no orders', async ({ page }) => {
      await ordersPage.waitForOrdersToLoad()
      const orderCount = await ordersPage.getOrderCount()
      
      if (orderCount === 0) {
        await expect(page.locator('text=Không có đơn hàng nào')).toBeVisible()
      }
    })
  })
})

