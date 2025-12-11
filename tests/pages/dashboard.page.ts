import { Page, Locator } from '@playwright/test'

export class DashboardPage {
  readonly page: Page
  readonly title: Locator
  readonly revenueCard: Locator
  readonly ordersCard: Locator
  readonly pendingOrdersCard: Locator
  readonly tablesInUseCard: Locator

  constructor(page: Page) {
    this.page = page
    this.title = page.getByRole('heading', { name: 'Dashboard' })
    this.revenueCard = page.locator('text=Doanh thu hôm nay').locator('..')
    this.ordersCard = page.locator('text=Đơn hàng hôm nay').locator('..')
    this.pendingOrdersCard = page.locator('text=Đơn đang chờ').locator('..')
    this.tablesInUseCard = page.locator('text=Bàn đang sử dụng').locator('..')
  }

  async goto() {
    await this.page.goto('/dashboard')
  }

  async waitForPageLoad() {
    await this.title.waitFor({ state: 'visible' })
  }

  async getRevenueValue(): Promise<string> {
    return await this.revenueCard.locator('.text-2xl').textContent() || ''
  }

  async getOrdersValue(): Promise<string> {
    return await this.ordersCard.locator('.text-2xl').textContent() || ''
  }

  async getPendingOrdersValue(): Promise<string> {
    return await this.pendingOrdersCard.locator('.text-2xl').textContent() || ''
  }

  async getTablesInUseValue(): Promise<string> {
    return await this.tablesInUseCard.locator('.text-2xl').textContent() || ''
  }

  async waitForStatsToLoad() {
    // Wait for skeleton loaders to disappear
    await this.page.waitForSelector('.skeleton', { state: 'hidden' }).catch(() => {})
    // Wait a bit more for data to render
    await this.page.waitForTimeout(500)
  }
}

