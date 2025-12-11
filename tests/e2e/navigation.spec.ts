import { test, expect } from '@playwright/test'
import { NavigationPage } from '../pages/navigation.page'

test.describe('Navigation', () => {
  let navigationPage: NavigationPage

  test.beforeEach(async ({ page }) => {
    navigationPage = new NavigationPage(page)
    await navigationPage.goto('/dashboard')
    await navigationPage.waitForSidebar()
  })

  test('should display sidebar navigation', async () => {
    await expect(navigationPage.sidebar).toBeVisible()
  })

  test('should display all navigation links', async () => {
    await expect(navigationPage.dashboardLink).toBeVisible()
    await expect(navigationPage.ordersLink).toBeVisible()
    await expect(navigationPage.menuLink).toBeVisible()
    await expect(navigationPage.tablesLink).toBeVisible()
    await expect(navigationPage.employeesLink).toBeVisible()
    await expect(navigationPage.inventoryLink).toBeVisible()
    await expect(navigationPage.reportsLink).toBeVisible()
    await expect(navigationPage.settingsLink).toBeVisible()
  })

  test('should navigate to Dashboard', async ({ page }) => {
    await navigationPage.clickDashboard()
    await page.waitForURL('/dashboard', { timeout: 5000 })
    await expect(page.getByRole('heading', { name: /Dashboard|Tổng quan/i })).toBeVisible()
  })

  test('should navigate to Orders', async ({ page }) => {
    await navigationPage.clickOrders()
    await page.waitForURL('/orders', { timeout: 5000 })
    await expect(page.getByRole('heading', { name: /Quản lý Đơn hàng/i })).toBeVisible()
  })

  test('should navigate to Menu', async ({ page }) => {
    await navigationPage.clickMenu()
    await page.waitForURL('/menu', { timeout: 5000 })
    await expect(page.getByRole('heading', { name: /Quản lý Menu/i })).toBeVisible()
  })

  test('should navigate to Tables', async ({ page }) => {
    await navigationPage.clickTables()
    await page.waitForURL('/tables', { timeout: 5000 })
    await expect(page.getByRole('heading', { name: /Quản lý Bàn/i })).toBeVisible()
  })

  test('should navigate to Employees', async ({ page }) => {
    await navigationPage.clickEmployees()
    await page.waitForURL('/employees', { timeout: 5000 })
    await expect(page.getByRole('heading', { name: /Quản lý Nhân viên/i })).toBeVisible()
  })

  test('should navigate to Inventory', async ({ page }) => {
    await navigationPage.clickInventory()
    await page.waitForURL('/inventory', { timeout: 5000 })
    await expect(page.getByRole('heading', { name: /Quản lý Kho hàng/i })).toBeVisible()
  })

  test('should navigate to Reports', async ({ page }) => {
    await navigationPage.clickReports()
    await page.waitForURL('/reports', { timeout: 5000 })
    await expect(page.getByRole('heading', { name: /Báo cáo và Thống kê/i })).toBeVisible()
  })

  test('should navigate to Settings', async ({ page }) => {
    await navigationPage.clickSettings()
    await page.waitForURL('/settings', { timeout: 5000 })
    await expect(page.getByRole('heading', { name: /Cài đặt/i })).toBeVisible()
  })

  test('should highlight active navigation link', async ({ page }) => {
    // Navigate to a page
    await navigationPage.clickMenu()
    await page.waitForURL('/menu', { timeout: 5000 })
    
    // Check if menu link is active
    const isMenuActive = await navigationPage.isLinkActive('Menu')
    expect(isMenuActive).toBe(true)
  })

  test('should navigate through all pages sequentially', async ({ page }) => {
    const pages = [
      { link: navigationPage.dashboardLink, url: '/dashboard', heading: /Dashboard|Tổng quan/i },
      { link: navigationPage.ordersLink, url: '/orders', heading: /Quản lý Đơn hàng/i },
      { link: navigationPage.menuLink, url: '/menu', heading: /Quản lý Menu/i },
      { link: navigationPage.tablesLink, url: '/tables', heading: /Quản lý Bàn/i },
      { link: navigationPage.employeesLink, url: '/employees', heading: /Quản lý Nhân viên/i },
      { link: navigationPage.inventoryLink, url: '/inventory', heading: /Quản lý Kho hàng/i },
      { link: navigationPage.reportsLink, url: '/reports', heading: /Báo cáo và Thống kê/i },
      { link: navigationPage.settingsLink, url: '/settings', heading: /Cài đặt/i },
    ]

    for (const pageInfo of pages) {
      await pageInfo.link.click()
      await page.waitForURL(pageInfo.url, { timeout: 5000 })
      await expect(page.getByRole('heading', { name: pageInfo.heading })).toBeVisible()
    }
  })

  test('should maintain navigation state after page reload', async ({ page }) => {
    await navigationPage.clickMenu()
    await page.waitForURL('/menu', { timeout: 5000 })
    
    // Reload page
    await page.reload()
    await page.waitForURL('/menu', { timeout: 5000 })
    
    // Navigation should still be visible
    await expect(navigationPage.sidebar).toBeVisible()
    await expect(page.getByRole('heading', { name: /Quản lý Menu/i })).toBeVisible()
  })
})

