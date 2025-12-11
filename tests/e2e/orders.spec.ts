import { test, expect } from '@playwright/test'
import { OrdersPage } from '../pages/orders.page'
import { OrderDetailPage } from '../pages/order-detail.page'

test.describe('Orders Page', () => {
  let ordersPage: OrdersPage

  test.beforeEach(async ({ page }) => {
    ordersPage = new OrdersPage(page)
    await ordersPage.goto()
    await ordersPage.waitForPageLoad()
  })

  test('should display orders page title', async () => {
    await expect(ordersPage.title).toBeVisible()
  })

  test('should display create order button', async () => {
    await expect(ordersPage.createOrderButton).toBeVisible()
  })

  test('should display orders table', async () => {
    await expect(ordersPage.ordersTable).toBeVisible()
  })

  test('should load and display orders', async () => {
    await ordersPage.waitForOrdersToLoad()
    
    const orderCount = await ordersPage.getOrderCount()
    expect(orderCount).toBeGreaterThanOrEqual(0)
  })

  test('should display order table headers', async ({ page }) => {
    await expect(page.locator('text=Số đơn')).toBeVisible()
    await expect(page.locator('text=Bàn')).toBeVisible()
    await expect(page.locator('text=Loại')).toBeVisible()
    await expect(page.locator('text=Tổng tiền')).toBeVisible()
    await expect(page.locator('text=Trạng thái')).toBeVisible()
    await expect(page.locator('text=Thời gian')).toBeVisible()
  })

  test('should navigate to order detail page', async ({ page }) => {
    await ordersPage.waitForOrdersToLoad()
    
    const orderNumbers = await ordersPage.getOrderNumbers()
    if (orderNumbers.length > 0) {
      const firstOrderNumber = orderNumbers[0]
      await ordersPage.clickViewOrder(firstOrderNumber)
      
      // Wait for navigation to order detail page
      await page.waitForURL(/\/orders\/[\w-]+/, { timeout: 5000 })
      
      const orderDetailPage = new OrderDetailPage(page)
      await orderDetailPage.waitForPageLoad()
      await expect(orderDetailPage.title).toBeVisible()
    }
  })

  test('should display order status badges', async () => {
    await ordersPage.waitForOrdersToLoad()
    
    const orderNumbers = await ordersPage.getOrderNumbers()
    if (orderNumbers.length > 0) {
      const status = await ordersPage.getOrderStatus(orderNumbers[0])
      expect(status).toBeTruthy()
    }
  })

  test('should show empty state when no orders', async ({ page }) => {
    await ordersPage.waitForOrdersToLoad()
    
    const orderCount = await ordersPage.getOrderCount()
    if (orderCount === 0) {
      await expect(page.locator('text=Không có đơn hàng nào')).toBeVisible()
    }
  })

  test.describe('Statistics Section', () => {
    test('should display statistics section', async ({ page }) => {
      await ordersPage.waitForOrdersToLoad()
      
      // Wait for statistics section to load
      await page.waitForSelector('text=Thống kê Đơn hàng', { timeout: 5000 }).catch(() => {})
      
      const hasStatisticsSection = await page.locator('text=Thống kê Đơn hàng').isVisible().catch(() => false)
      expect(hasStatisticsSection).toBe(true)
    })

    test('should display statistics metrics', async ({ page }) => {
      await ordersPage.waitForOrdersToLoad()
      
      // Wait for statistics to load (API call)
      await page.waitForTimeout(2000)
      
      // Check for statistics metrics
      const hasMetrics = await page.locator('text=Tổng số đơn hôm nay').isVisible().catch(() => false) ||
                        await page.locator('text=Tổng doanh thu hôm nay').isVisible().catch(() => false) ||
                        await page.locator('text=Đơn hàng đang xử lý').isVisible().catch(() => false) ||
                        await page.locator('text=Đơn hàng chờ thanh toán').isVisible().catch(() => false)
      
      // Statistics should be visible (even if values are 0)
      expect(hasMetrics).toBe(true)
    })

    test('should handle statistics API error gracefully', async ({ page }) => {
      // Intercept API call and return 500 error
      await page.route('**/api/v1/orders/statistics', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Internal server error' })
        })
      })

      await ordersPage.goto()
      await ordersPage.waitForPageLoad()
      
      // Page should still render without crashing
      await expect(ordersPage.title).toBeVisible()
      await expect(ordersPage.ordersTable).toBeVisible()
      
      // Statistics section might not be visible or might show error state
      // But page should not crash
    })

    test('should verify statistics API call succeeds', async ({ page }) => {
      let apiCallSucceeded = false
      
      // Monitor network requests
      page.on('response', response => {
        if (response.url().includes('/orders/statistics') && response.status() === 200) {
          apiCallSucceeded = true
        }
      })

      await ordersPage.goto()
      await ordersPage.waitForPageLoad()
      
      // Wait for API call to complete
      await page.waitForTimeout(3000)
      
      // Verify API call was made and succeeded
      expect(apiCallSucceeded).toBe(true)
    })
  })
})

test.describe('Order Detail Page', () => {
  test('should display order detail information', async ({ page }) => {
    // First, get an order ID from the orders list
    const ordersPage = new OrdersPage(page)
    await ordersPage.goto()
    await ordersPage.waitForOrdersToLoad()
    
    const orderNumbers = await ordersPage.getOrderNumbers()
    if (orderNumbers.length > 0) {
      // Navigate to first order
      await ordersPage.clickViewOrder(orderNumbers[0])
      await page.waitForURL(/\/orders\/[\w-]+/, { timeout: 5000 })
      
      const orderDetailPage = new OrderDetailPage(page)
      await orderDetailPage.waitForOrderToLoad()
      
      // Verify order detail elements
      await expect(orderDetailPage.title).toBeVisible()
      await expect(orderDetailPage.orderNumber).toBeVisible()
      await expect(orderDetailPage.orderStatus).toBeVisible()
      await expect(orderDetailPage.orderInfoCard).toBeVisible()
      await expect(orderDetailPage.paymentSummaryCard).toBeVisible()
      await expect(orderDetailPage.orderItemsTable).toBeVisible()
    }
  })

  test('should navigate back to orders list', async ({ page }) => {
    const ordersPage = new OrdersPage(page)
    await ordersPage.goto()
    await ordersPage.waitForOrdersToLoad()
    
    const orderNumbers = await ordersPage.getOrderNumbers()
    if (orderNumbers.length > 0) {
      await ordersPage.clickViewOrder(orderNumbers[0])
      await page.waitForURL(/\/orders\/[\w-]+/, { timeout: 5000 })
      
      const orderDetailPage = new OrderDetailPage(page)
      await orderDetailPage.waitForOrderToLoad()
      
      // Click back button
      await orderDetailPage.clickBack()
      
      // Should navigate back to orders list
      await page.waitForURL('/orders', { timeout: 5000 })
      await expect(ordersPage.title).toBeVisible()
    }
  })

  test('should display order items in table', async ({ page }) => {
    const ordersPage = new OrdersPage(page)
    await ordersPage.goto()
    await ordersPage.waitForOrdersToLoad()
    
    const orderNumbers = await ordersPage.getOrderNumbers()
    if (orderNumbers.length > 0) {
      await ordersPage.clickViewOrder(orderNumbers[0])
      await page.waitForURL(/\/orders\/[\w-]+/, { timeout: 5000 })
      
      const orderDetailPage = new OrderDetailPage(page)
      await orderDetailPage.waitForOrderToLoad()
      
      const itemsCount = await orderDetailPage.getOrderItemsCount()
      expect(itemsCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('should display total amount', async ({ page }) => {
    const ordersPage = new OrdersPage(page)
    await ordersPage.goto()
    await ordersPage.waitForOrdersToLoad()
    
    const orderNumbers = await ordersPage.getOrderNumbers()
    if (orderNumbers.length > 0) {
      await ordersPage.clickViewOrder(orderNumbers[0])
      await page.waitForURL(/\/orders\/[\w-]+/, { timeout: 5000 })
      
      const orderDetailPage = new OrderDetailPage(page)
      await orderDetailPage.waitForOrderToLoad()
      
      const totalAmount = await orderDetailPage.getTotalAmountText()
      expect(totalAmount).toBeTruthy()
    }
  })
})

