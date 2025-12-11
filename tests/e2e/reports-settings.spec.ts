import { test, expect } from '@playwright/test'

test.describe('Reports Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
  })

  test('should display reports page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Báo cáo và Thống kê' })).toBeVisible()
  })

  test('should display page description', async ({ page }) => {
    await expect(page.getByText('Xem báo cáo doanh thu, bán hàng và kho hàng')).toBeVisible()
  })

  test('should display revenue report card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Báo cáo Doanh thu' })).toBeVisible()
    await expect(page.getByText('Xem doanh thu theo thời gian')).toBeVisible()
  })

  test('should display sales report card', async ({ page }) => {
    await expect(page.getByText('Báo cáo Bán hàng')).toBeVisible()
    await expect(page.getByText('Phân tích sản phẩm bán chạy')).toBeVisible()
  })

  test('should display inventory report card', async ({ page }) => {
    await expect(page.getByText('Báo cáo Kho hàng')).toBeVisible()
    await expect(page.getByText('Thống kê tồn kho và chi phí')).toBeVisible()
  })

  test('should display development status for all report cards', async ({ page }) => {
    const developmentTexts = await page.locator('text=Tính năng đang phát triển...').all()
    expect(developmentTexts.length).toBeGreaterThanOrEqual(3)
  })

  test('should have all report cards visible', async ({ page }) => {
    const cards = page.locator('[class*="card"]')
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThanOrEqual(3)
  })
})

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings')
  })

  test('should display settings page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Cài đặt' })).toBeVisible()
  })

  test('should display page description', async ({ page }) => {
    await expect(page.getByText('Quản lý thông tin quán và cấu hình hệ thống')).toBeVisible()
  })

  test('should display shop information card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Thông tin Quán' })).toBeVisible()
    await expect(page.getByText('Cập nhật thông tin cơ bản của quán')).toBeVisible()
  })

  test('should display system configuration card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Cấu hình Hệ thống' })).toBeVisible()
    await expect(page.getByText('Thiết lập các thông số hệ thống')).toBeVisible()
  })

  test('should display development status for all setting cards', async ({ page }) => {
    const developmentTexts = await page.locator('text=Tính năng đang phát triển...').all()
    expect(developmentTexts.length).toBeGreaterThanOrEqual(2)
  })

  test('should have all setting cards visible', async ({ page }) => {
    const cards = page.locator('[class*="card"]')
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThanOrEqual(2)
  })
})

