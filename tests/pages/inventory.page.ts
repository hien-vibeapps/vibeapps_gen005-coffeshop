import { Page, Locator } from '@playwright/test'

export class InventoryPage {
  readonly page: Page
  readonly title: Locator
  readonly addIngredientButton: Locator
  readonly lowStockAlert: Locator
  readonly ingredientsTable: Locator
  readonly ingredientsTableBody: Locator
  readonly ingredientDialog: Locator
  readonly ingredientNameInput: Locator
  readonly ingredientUnitInput: Locator
  readonly currentStockInput: Locator
  readonly minStockLevelInput: Locator
  readonly unitPriceInput: Locator
  readonly supplierInput: Locator
  readonly expiryTrackingCheckbox: Locator
  readonly isActiveCheckbox: Locator
  readonly submitButton: Locator
  readonly cancelButton: Locator
  readonly deleteConfirmButton: Locator

  constructor(page: Page) {
    this.page = page
    this.title = page.getByRole('heading', { name: 'Quản lý Kho hàng' })
    this.addIngredientButton = page.getByRole('button', { name: /Thêm nguyên liệu/i })
    this.lowStockAlert = page.locator('text=Cảnh báo tồn kho thấp').locator('..')
    this.ingredientsTable = page.locator('table')
    this.ingredientsTableBody = page.locator('tbody')
    this.ingredientDialog = page.locator('[role="dialog"]')
    this.ingredientNameInput = page.locator('#ingredient_name')
    this.ingredientUnitInput = page.locator('#ingredient_unit')
    this.currentStockInput = page.locator('#ingredient_current_stock')
    this.minStockLevelInput = page.locator('#ingredient_min_stock_level')
    this.unitPriceInput = page.locator('#ingredient_unit_price')
    this.supplierInput = page.locator('#ingredient_supplier')
    this.expiryTrackingCheckbox = page.locator('#ingredient_expiry_tracking')
    this.isActiveCheckbox = page.locator('#ingredient_is_active')
    this.submitButton = page.getByRole('button', { name: /Tạo mới|Cập nhật/i })
    this.cancelButton = page.getByRole('button', { name: /Hủy/i })
    this.deleteConfirmButton = page.getByRole('button', { name: /Xóa/i }).filter({ hasText: 'Xóa' })
  }

  async goto() {
    await this.page.goto('/inventory')
  }

  async waitForPageLoad() {
    await this.title.waitFor({ state: 'visible' })
  }

  async getIngredientCount(): Promise<number> {
    const rows = await this.ingredientsTableBody.locator('tr').count()
    const noIngredientsRow = await this.ingredientsTableBody.locator('text=Không có nguyên liệu nào').count()
    return noIngredientsRow > 0 ? 0 : rows
  }

  async getIngredientNames(): Promise<string[]> {
    const names: string[] = []
    const rows = await this.ingredientsTableBody.locator('tr').all()
    for (const row of rows) {
      const name = await row.locator('td').first().textContent()
      if (name && !name.includes('Không có nguyên liệu nào')) {
        names.push(name.trim())
      }
    }
    return names
  }

  async getIngredientStatus(ingredientName: string): Promise<string> {
    const row = this.ingredientsTableBody.locator('tr').filter({ hasText: ingredientName })
    const statusBadge = row.locator('[class*="badge"]')
    return await statusBadge.textContent() || ''
  }

  async isLowStockAlertVisible(): Promise<boolean> {
    return await this.lowStockAlert.isVisible().catch(() => false)
  }

  async waitForIngredientsToLoad() {
    await this.page.waitForSelector('.skeleton', { state: 'hidden' }).catch(() => {})
    await this.page.waitForTimeout(500)
  }

  async clickAddIngredient() {
    await this.addIngredientButton.click()
    await this.ingredientDialog.waitFor({ state: 'visible' })
  }

  async clickEditIngredient(ingredientName: string) {
    const row = this.ingredientsTableBody.locator('tr').filter({ hasText: ingredientName })
    await row.getByRole('button', { name: /Edit|Sửa/i }).first().click()
    await this.ingredientDialog.waitFor({ state: 'visible' })
  }

  async clickDeleteIngredient(ingredientName: string) {
    const row = this.ingredientsTableBody.locator('tr').filter({ hasText: ingredientName })
    await row.getByRole('button', { name: /Trash|Xóa/i }).last().click()
  }

  async fillIngredientForm(data: {
    name: string
    unit: string
    currentStock?: number
    minStockLevel?: number
    unitPrice?: number
    supplier?: string
    expiryTracking?: boolean
    isActive?: boolean
  }) {
    await this.ingredientNameInput.fill(data.name)
    await this.ingredientUnitInput.fill(data.unit)
    if (data.currentStock !== undefined) {
      await this.currentStockInput.fill(data.currentStock.toString())
    }
    if (data.minStockLevel !== undefined) {
      await this.minStockLevelInput.fill(data.minStockLevel.toString())
    }
    if (data.unitPrice !== undefined) {
      await this.unitPriceInput.fill(data.unitPrice.toString())
    }
    if (data.supplier !== undefined) {
      await this.supplierInput.fill(data.supplier)
    }
    if (data.expiryTracking !== undefined) {
      const isChecked = await this.expiryTrackingCheckbox.isChecked()
      if (data.expiryTracking !== isChecked) {
        await this.expiryTrackingCheckbox.click()
      }
    }
    if (data.isActive !== undefined) {
      const isChecked = await this.isActiveCheckbox.isChecked()
      if (data.isActive !== isChecked) {
        await this.isActiveCheckbox.click()
      }
    }
  }

  async submitIngredientForm() {
    await this.submitButton.click()
    await this.page.waitForTimeout(1000)
  }

  async confirmDelete() {
    await this.deleteConfirmButton.click()
    await this.page.waitForTimeout(1000)
  }

  async cancelDelete() {
    await this.cancelButton.click()
  }
}

