import { Page, Locator } from '@playwright/test'

export class AreasPage {
  readonly page: Page
  readonly title: Locator
  readonly addAreaButton: Locator
  readonly areasTable: Locator
  readonly areasTableBody: Locator
  readonly areaDialog: Locator
  readonly areaNameInput: Locator
  readonly areaDescriptionInput: Locator
  readonly areaIsActiveCheckbox: Locator
  readonly submitButton: Locator
  readonly cancelButton: Locator
  readonly deleteConfirmButton: Locator

  constructor(page: Page) {
    this.page = page
    this.title = page.getByRole('heading', { name: 'Quản lý Khu vực' })
    this.addAreaButton = page.getByRole('button', { name: /Thêm khu vực/i })
    this.areasTable = page.locator('table')
    this.areasTableBody = page.locator('tbody')
    this.areaDialog = page.locator('[role="dialog"]')
    this.areaNameInput = page.locator('#area_name')
    this.areaDescriptionInput = page.locator('#area_description')
    this.areaIsActiveCheckbox = page.locator('#area_is_active')
    this.submitButton = page.getByRole('button', { name: /Tạo mới|Cập nhật/i })
    this.cancelButton = page.getByRole('button', { name: /Hủy/i })
    this.deleteConfirmButton = page.getByRole('button', { name: /Xóa/i }).filter({ hasText: 'Xóa' })
  }

  async goto() {
    await this.page.goto('/areas')
  }

  async waitForPageLoad() {
    await this.title.waitFor({ state: 'visible' })
  }

  async getAreaCount(): Promise<number> {
    const rows = await this.areasTableBody.locator('tr').count()
    const noAreasRow = await this.areasTableBody.locator('text=Không có khu vực nào').count()
    return noAreasRow > 0 ? 0 : rows
  }

  async getAreaNames(): Promise<string[]> {
    const names: string[] = []
    const rows = await this.areasTableBody.locator('tr').all()
    for (const row of rows) {
      const name = await row.locator('td').first().textContent()
      if (name && !name.includes('Không có khu vực nào')) {
        names.push(name.trim())
      }
    }
    return names
  }

  async getAreaStatus(areaName: string): Promise<string> {
    const row = this.areasTableBody.locator('tr').filter({ hasText: areaName })
    const statusBadge = row.locator('[class*="badge"]')
    return await statusBadge.textContent() || ''
  }

  async waitForAreasToLoad() {
    await this.page.waitForSelector('.skeleton', { state: 'hidden' }).catch(() => {})
    await this.page.waitForTimeout(500)
  }

  async clickAddArea() {
    await this.addAreaButton.click()
    await this.areaDialog.waitFor({ state: 'visible' })
  }

  async clickEditArea(areaName: string) {
    const row = this.areasTableBody.locator('tr').filter({ hasText: areaName })
    await row.getByRole('button', { name: /Edit|Sửa/i }).first().click()
    await this.areaDialog.waitFor({ state: 'visible' })
  }

  async clickDeleteArea(areaName: string) {
    const row = this.areasTableBody.locator('tr').filter({ hasText: areaName })
    await row.getByRole('button', { name: /Trash|Xóa/i }).last().click()
  }

  async fillAreaForm(name: string, description?: string, isActive: boolean = true) {
    await this.areaNameInput.fill(name)
    if (description !== undefined) {
      await this.areaDescriptionInput.fill(description)
    }
    const isChecked = await this.areaIsActiveCheckbox.isChecked()
    if (isActive !== isChecked) {
      await this.areaIsActiveCheckbox.click()
    }
  }

  async submitAreaForm() {
    await this.submitButton.click()
    await this.page.waitForTimeout(1000) // Wait for form submission
  }

  async confirmDelete() {
    await this.deleteConfirmButton.click()
    await this.page.waitForTimeout(1000) // Wait for deletion
  }

  async cancelDelete() {
    await this.cancelButton.click()
  }
}

