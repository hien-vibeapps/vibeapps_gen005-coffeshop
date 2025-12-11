import { Page, Locator } from '@playwright/test'

export class OrdersPage {
  readonly page: Page
  readonly title: Locator
  readonly createOrderButton: Locator
  readonly ordersTable: Locator
  readonly ordersTableBody: Locator

  constructor(page: Page) {
    this.page = page
    this.title = page.getByRole('heading', { name: 'Quản lý Đơn hàng' })
    this.createOrderButton = page.getByRole('button', { name: /Tạo đơn hàng mới/i })
    this.ordersTable = page.locator('table')
    this.ordersTableBody = page.locator('tbody')
  }

  async goto() {
    await this.page.goto('/orders')
  }

  async waitForPageLoad() {
    await this.title.waitFor({ state: 'visible' })
  }

  async getOrderCount(): Promise<number> {
    const rows = await this.ordersTableBody.locator('tr').count()
    const noOrdersRow = await this.ordersTableBody.locator('text=Không có đơn hàng nào').count()
    return noOrdersRow > 0 ? 0 : rows
  }

  async getOrderNumbers(): Promise<string[]> {
    const numbers: string[] = []
    const rows = await this.ordersTableBody.locator('tr').all()
    for (const row of rows) {
      const orderNumber = await row.locator('td').first().textContent()
      if (orderNumber && !orderNumber.includes('Không có đơn hàng nào')) {
        numbers.push(orderNumber.trim())
      }
    }
    return numbers
  }

  async clickViewOrder(orderNumber: string) {
    const row = this.ordersTableBody.locator('tr').filter({ hasText: orderNumber })
    await row.getByRole('button').click()
  }

  async waitForOrdersToLoad() {
    await this.page.waitForSelector('.skeleton', { state: 'hidden' }).catch(() => {})
    await this.page.waitForTimeout(500)
  }

  async getOrderStatus(orderNumber: string): Promise<string> {
    const row = this.ordersTableBody.locator('tr').filter({ hasText: orderNumber })
    // Status badge là cột thứ 5 (sau Số đơn, Bàn, Loại, Tổng tiền)
    const statusCell = row.locator('td').nth(4)
    const badgeText = await statusCell.textContent()
    return badgeText?.trim() || ''
  }

  async waitForStatisticsToLoad() {
    // Wait for statistics section to appear
    await this.page.waitForSelector('text=Thống kê Đơn hàng', { timeout: 5000 }).catch(() => {})
    // Wait for API call to complete
    await this.page.waitForTimeout(2000)
  }

  async getStatisticsSection() {
    return this.page.locator('text=Thống kê Đơn hàng').locator('..')
  }
}

