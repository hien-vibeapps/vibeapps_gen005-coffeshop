import { Page, Locator } from '@playwright/test'

export class EmployeesPage {
  readonly page: Page
  readonly title: Locator
  readonly addEmployeeButton: Locator
  readonly employeesTable: Locator
  readonly employeesTableBody: Locator
  readonly employeeDialog: Locator
  readonly fullNameInput: Locator
  readonly emailInput: Locator
  readonly phoneInput: Locator
  readonly roleSelect: Locator
  readonly startDateInput: Locator
  readonly isActiveCheckbox: Locator
  readonly submitButton: Locator
  readonly cancelButton: Locator
  readonly deleteConfirmButton: Locator

  constructor(page: Page) {
    this.page = page
    this.title = page.getByRole('heading', { name: 'Quản lý Nhân viên' })
    this.addEmployeeButton = page.getByRole('button', { name: /Thêm nhân viên/i })
    this.employeesTable = page.locator('table')
    this.employeesTableBody = page.locator('tbody')
    this.employeeDialog = page.locator('[role="dialog"]')
    this.fullNameInput = page.locator('#full_name')
    this.emailInput = page.locator('#email')
    this.phoneInput = page.locator('#phone')
    this.roleSelect = page.locator('#role')
    this.startDateInput = page.locator('#start_date')
    this.isActiveCheckbox = page.locator('#is_active')
    this.submitButton = page.getByRole('button', { name: /Tạo mới|Cập nhật/i })
    this.cancelButton = page.getByRole('button', { name: /Hủy/i })
    this.deleteConfirmButton = page.getByRole('button', { name: /Xóa/i }).filter({ hasText: 'Xóa' })
  }

  async goto() {
    await this.page.goto('/employees')
  }

  async waitForPageLoad() {
    await this.title.waitFor({ state: 'visible' })
  }

  async getEmployeeCount(): Promise<number> {
    const rows = await this.employeesTableBody.locator('tr').count()
    const noEmployeesRow = await this.employeesTableBody.locator('text=Không có nhân viên nào').count()
    return noEmployeesRow > 0 ? 0 : rows
  }

  async getEmployeeNames(): Promise<string[]> {
    const names: string[] = []
    const rows = await this.employeesTableBody.locator('tr').all()
    for (const row of rows) {
      const name = await row.locator('td').first().textContent()
      if (name && !name.includes('Không có nhân viên nào')) {
        names.push(name.trim())
      }
    }
    return names
  }

  async getEmployeeRole(employeeName: string): Promise<string> {
    const row = this.employeesTableBody.locator('tr').filter({ hasText: employeeName })
    const roleBadge = row.locator('[class*="badge"]').first()
    return await roleBadge.textContent() || ''
  }

  async getEmployeeStatus(employeeName: string): Promise<string> {
    const row = this.employeesTableBody.locator('tr').filter({ hasText: employeeName })
    const statusBadge = row.locator('[class*="badge"]').last()
    return await statusBadge.textContent() || ''
  }

  async waitForEmployeesToLoad() {
    await this.page.waitForSelector('.skeleton', { state: 'hidden' }).catch(() => {})
    await this.page.waitForTimeout(500)
  }

  async clickAddEmployee() {
    await this.addEmployeeButton.click()
    await this.employeeDialog.waitFor({ state: 'visible' })
  }

  async clickEditEmployee(employeeName: string) {
    const row = this.employeesTableBody.locator('tr').filter({ hasText: employeeName })
    await row.getByRole('button', { name: /Edit|Sửa/i }).first().click()
    await this.employeeDialog.waitFor({ state: 'visible' })
  }

  async clickDeleteEmployee(employeeName: string) {
    const row = this.employeesTableBody.locator('tr').filter({ hasText: employeeName })
    await row.getByRole('button', { name: /Trash|Xóa/i }).last().click()
  }

  async fillEmployeeForm(data: {
    fullName: string
    email: string
    phone: string
    role: string
    startDate?: string
    isActive?: boolean
  }) {
    await this.fullNameInput.fill(data.fullName)
    await this.emailInput.fill(data.email)
    await this.phoneInput.fill(data.phone)
    await this.roleSelect.selectOption(data.role)
    if (data.startDate) {
      await this.startDateInput.fill(data.startDate)
    }
    if (data.isActive !== undefined) {
      const isChecked = await this.isActiveCheckbox.isChecked()
      if (data.isActive !== isChecked) {
        await this.isActiveCheckbox.click()
      }
    }
  }

  async submitEmployeeForm() {
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

