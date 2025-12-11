import { Page, Locator } from '@playwright/test'

export class NavigationPage {
  readonly page: Page
  readonly sidebar: Locator
  readonly logo: Locator
  readonly dashboardLink: Locator
  readonly ordersLink: Locator
  readonly menuLink: Locator
  readonly tablesLink: Locator
  readonly employeesLink: Locator
  readonly inventoryLink: Locator
  readonly reportsLink: Locator
  readonly settingsLink: Locator

  constructor(page: Page) {
    this.page = page
    this.sidebar = page.locator('aside')
    this.logo = page.locator('text=Coffee Shop')
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' })
    this.ordersLink = page.getByRole('link', { name: 'Đơn hàng' })
    this.menuLink = page.getByRole('link', { name: 'Menu' })
    this.tablesLink = page.getByRole('link', { name: 'Bàn' })
    this.employeesLink = page.getByRole('link', { name: 'Nhân viên' })
    this.inventoryLink = page.getByRole('link', { name: 'Kho hàng' })
    this.reportsLink = page.getByRole('link', { name: 'Báo cáo' })
    this.settingsLink = page.getByRole('link', { name: 'Cài đặt' })
  }

  async goto(path: string = '/dashboard') {
    await this.page.goto(path)
  }

  async waitForSidebar() {
    await this.sidebar.waitFor({ state: 'visible' })
  }

  async clickDashboard() {
    await this.dashboardLink.click()
  }

  async clickOrders() {
    await this.ordersLink.click()
  }

  async clickMenu() {
    await this.menuLink.click()
  }

  async clickTables() {
    await this.tablesLink.click()
  }

  async clickEmployees() {
    await this.employeesLink.click()
  }

  async clickInventory() {
    await this.inventoryLink.click()
  }

  async clickReports() {
    await this.reportsLink.click()
  }

  async clickSettings() {
    await this.settingsLink.click()
  }

  async isLinkActive(linkName: string): Promise<boolean> {
    const link = this.page.getByRole('link', { name: linkName })
    const classes = await link.getAttribute('class') || ''
    return classes.includes('bg-primary')
  }
}

