import { Page, Locator } from '@playwright/test'

export class TablesPage {
  readonly page: Page
  readonly title: Locator
  readonly addTableButton: Locator
  readonly tablesTable: Locator
  readonly tablesTableBody: Locator
  readonly tableDialog: Locator
  readonly areaSelect: Locator
  readonly tableNumberInput: Locator
  readonly capacityInput: Locator
  readonly statusSelect: Locator
  readonly notesInput: Locator
  readonly submitButton: Locator
  readonly cancelButton: Locator
  readonly deleteConfirmButton: Locator

  constructor(page: Page) {
    this.page = page
    this.title = page.getByRole('heading', { name: 'Quản lý Bàn' })
    this.addTableButton = page.getByRole('button', { name: /Thêm bàn/i })
    this.tablesTable = page.locator('table')
    this.tablesTableBody = page.locator('tbody')
    this.tableDialog = page.locator('[role="dialog"]')
    this.areaSelect = page.locator('#area_id')
    this.tableNumberInput = page.locator('#table_number')
    this.capacityInput = page.locator('#capacity')
    this.statusSelect = page.locator('#status')
    this.notesInput = page.locator('#notes')
    this.submitButton = page.getByRole('button', { name: /Tạo mới|Cập nhật/i })
    this.cancelButton = page.getByRole('button', { name: /Hủy/i })
    this.deleteConfirmButton = page.getByRole('button', { name: /Xóa/i }).filter({ hasText: 'Xóa' })
  }

  async goto() {
    await this.page.goto('/tables')
  }

  async waitForPageLoad() {
    await this.title.waitFor({ state: 'visible' })
  }

  async getTableCount(): Promise<number> {
    const rows = await this.tablesTableBody.locator('tr').count()
    const noTablesRow = await this.tablesTableBody.locator('text=Không có bàn nào').count()
    return noTablesRow > 0 ? 0 : rows
  }

  async getTableNumbers(): Promise<string[]> {
    const numbers: string[] = []
    const rows = await this.tablesTableBody.locator('tr').all()
    for (const row of rows) {
      const tableNumber = await row.locator('td').first().textContent()
      if (tableNumber && !tableNumber.includes('Không có bàn nào')) {
        numbers.push(tableNumber.trim())
      }
    }
    return numbers
  }

  async getTableStatus(tableNumber: string): Promise<string> {
    const row = this.tablesTableBody.locator('tr').filter({ hasText: tableNumber })
    // Badge component không có class chứa "badge", tìm bằng text content trong cell chứa status
    // Status là cột thứ 4 (sau Table number, Area, Capacity)
    const statusCell = row.locator('td').nth(3)
    const badgeText = await statusCell.textContent()
    return badgeText?.trim() || ''
  }

  async waitForTablesToLoad() {
    await this.page.waitForSelector('.skeleton', { state: 'hidden' }).catch(() => {})
    await this.page.waitForTimeout(500)
  }

  async clickAddTable() {
    await this.addTableButton.click()
    await this.tableDialog.waitFor({ state: 'visible' })
  }

  async clickEditTable(tableNumber: string) {
    const row = this.tablesTableBody.locator('tr').filter({ hasText: tableNumber })
    // Button chỉ có icon Edit, không có text. Tìm button đầu tiên trong actions cell
    const actionsCell = row.locator('td').last()
    await actionsCell.getByRole('button').first().click()
    await this.tableDialog.waitFor({ state: 'visible' })
  }

  async clickDeleteTable(tableNumber: string) {
    const row = this.tablesTableBody.locator('tr').filter({ hasText: tableNumber })
    // Button chỉ có icon Trash2, không có text. Tìm button thứ hai trong actions cell
    const actionsCell = row.locator('td').last()
    await actionsCell.getByRole('button').last().click()
  }

  async fillTableForm(data: {
    areaId: string
    tableNumber: string
    capacity?: number
    status?: string
    notes?: string
  }) {
    // Wait for area select to have options before selecting
    await this.areaSelect.waitFor({ state: 'visible' })
    await this.page.waitForTimeout(500) // Wait for options to load
    // Verify at least one option (excluding the default "Chọn khu vực")
    await this.areaSelect.locator('option').nth(1).waitFor({ state: 'attached' }).catch(() => {})
    await this.areaSelect.selectOption(data.areaId)
    await this.tableNumberInput.fill(data.tableNumber)
    if (data.capacity !== undefined) {
      await this.capacityInput.fill(data.capacity.toString())
    }
    if (data.status !== undefined) {
      await this.statusSelect.selectOption(data.status)
    }
    if (data.notes !== undefined) {
      await this.notesInput.fill(data.notes)
    }
  }

  async submitTableForm() {
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
