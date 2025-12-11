import { Page, Locator } from '@playwright/test'

export class OrderDetailPage {
  readonly page: Page
  readonly backButton: Locator
  readonly title: Locator
  readonly orderNumber: Locator
  readonly orderStatus: Locator
  readonly orderInfoCard: Locator
  readonly paymentSummaryCard: Locator
  readonly orderItemsTable: Locator
  readonly totalAmount: Locator

  constructor(page: Page) {
    this.page = page
    this.backButton = page.getByRole('button').filter({ has: page.locator('svg') })
    this.title = page.getByRole('heading', { name: 'Chi tiết đơn hàng' })
    this.orderNumber = page.locator('text=Số đơn:')
    this.orderStatus = page.locator('text=Trạng thái').locator('..').locator('[class*="badge"]')
    this.orderInfoCard = page.locator('text=Thông tin đơn hàng').locator('..')
    this.paymentSummaryCard = page.locator('text=Tổng thanh toán').locator('..')
    this.orderItemsTable = page.locator('text=Chi tiết sản phẩm').locator('..').locator('table')
    this.totalAmount = page.locator('text=Tổng cộng').locator('..').locator('.font-bold').last()
  }

  async goto(orderId: string) {
    await this.page.goto(`/orders/${orderId}`)
  }

  async waitForPageLoad() {
    await this.title.waitFor({ state: 'visible' })
  }

  async clickBack() {
    await this.backButton.click()
  }

  async getOrderNumberText(): Promise<string> {
    return await this.orderNumber.textContent() || ''
  }

  async getOrderStatusText(): Promise<string> {
    return await this.orderStatus.textContent() || ''
  }

  async getTotalAmountText(): Promise<string> {
    return await this.totalAmount.textContent() || ''
  }

  async getOrderItemsCount(): Promise<number> {
    const rows = await this.orderItemsTable.locator('tbody tr').count()
    const noItemsRow = await this.orderItemsTable.locator('text=Không có sản phẩm nào').count()
    return noItemsRow > 0 ? 0 : rows
  }

  async waitForOrderToLoad() {
    await this.page.waitForSelector('.skeleton', { state: 'hidden' }).catch(() => {})
    await this.page.waitForTimeout(500)
  }
}

