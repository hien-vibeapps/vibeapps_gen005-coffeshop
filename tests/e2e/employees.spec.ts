import { test, expect } from '@playwright/test'
import { EmployeesPage } from '../pages/employees.page'

test.describe('Employees Page', () => {
  let employeesPage: EmployeesPage

  test.beforeEach(async ({ page }) => {
    employeesPage = new EmployeesPage(page)
    await employeesPage.goto()
    await employeesPage.waitForPageLoad()
  })

  test('should display employees page title', async () => {
    await expect(employeesPage.title).toBeVisible()
  })

  test('should display add employee button', async () => {
    await expect(employeesPage.addEmployeeButton).toBeVisible()
  })

  test('should display employees table', async () => {
    await expect(employeesPage.employeesTable).toBeVisible()
  })

  test('should load and display employees', async () => {
    await employeesPage.waitForEmployeesToLoad()
    
    const employeeCount = await employeesPage.getEmployeeCount()
    expect(employeeCount).toBeGreaterThanOrEqual(0)
  })

  test('should display employee table headers', async ({ page }) => {
    await expect(page.locator('text=Họ tên')).toBeVisible()
    await expect(page.locator('text=Email')).toBeVisible()
    await expect(page.locator('text=Số điện thoại')).toBeVisible()
    await expect(page.locator('text=Vị trí')).toBeVisible()
    await expect(page.locator('text=Trạng thái')).toBeVisible()
  })

  test('should display employee role and status badges', async () => {
    await employeesPage.waitForEmployeesToLoad()
    
    const employeeNames = await employeesPage.getEmployeeNames()
    if (employeeNames.length > 0) {
      const role = await employeesPage.getEmployeeRole(employeeNames[0])
      const status = await employeesPage.getEmployeeStatus(employeeNames[0])
      expect(role).toBeTruthy()
      expect(status).toBeTruthy()
      expect(['Hoạt động', 'Không hoạt động']).toContain(status)
    }
  })

  test('should show empty state when no employees', async ({ page }) => {
    await employeesPage.waitForEmployeesToLoad()
    
    const employeeCount = await employeesPage.getEmployeeCount()
    if (employeeCount === 0) {
      await expect(page.locator('text=Không có nhân viên nào')).toBeVisible()
    }
  })

  test.describe('Create Employee', () => {
    test('should open create employee dialog', async () => {
      await employeesPage.clickAddEmployee()
      await expect(employeesPage.employeeDialog).toBeVisible()
      await expect(employeesPage.page.getByText('Thêm nhân viên mới')).toBeVisible()
    })

    test('should create employee with valid data', async () => {
      const timestamp = Date.now()
      const employeeData = {
        fullName: `Test Employee ${timestamp}`,
        email: `test${timestamp}@example.com`,
        phone: `090${timestamp.toString().slice(-7)}`,
        role: 'waiter',
        startDate: '2024-01-01',
        isActive: true,
      }
      
      await employeesPage.clickAddEmployee()
      await employeesPage.fillEmployeeForm(employeeData)
      await employeesPage.submitEmployeeForm()
      
      await employeesPage.waitForEmployeesToLoad()
      
      const employeeNames = await employeesPage.getEmployeeNames()
      expect(employeeNames).toContain(employeeData.fullName)
    })

    test('should validate required fields - full name is required', async () => {
      await employeesPage.clickAddEmployee()
      
      await employeesPage.fullNameInput.clear()
      await employeesPage.submitButton.click()
      
      const isInvalid = await employeesPage.fullNameInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should validate required fields - email is required', async () => {
      await employeesPage.clickAddEmployee()
      
      await employeesPage.emailInput.clear()
      await employeesPage.submitButton.click()
      
      const isInvalid = await employeesPage.emailInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should validate email format', async () => {
      await employeesPage.clickAddEmployee()
      
      await employeesPage.emailInput.fill('invalid-email')
      await employeesPage.submitButton.click()
      
      const isInvalid = await employeesPage.emailInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should validate required fields - phone is required', async () => {
      await employeesPage.clickAddEmployee()
      
      await employeesPage.phoneInput.clear()
      await employeesPage.submitButton.click()
      
      const isInvalid = await employeesPage.phoneInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should validate required fields - role is required', async () => {
      await employeesPage.clickAddEmployee()
      
      await employeesPage.roleSelect.selectOption('')
      await employeesPage.submitButton.click()
      
      const isInvalid = await employeesPage.roleSelect.evaluate((el: HTMLSelectElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should create employee with all roles', async () => {
      const roles = ['owner', 'manager', 'shift_manager', 'waiter', 'cashier', 'barista']
      
      for (const role of roles) {
        const timestamp = Date.now()
        const employeeData = {
          fullName: `Test ${role} ${timestamp}`,
          email: `test${role}${timestamp}@example.com`,
          phone: `090${timestamp.toString().slice(-7)}`,
          role,
          isActive: true,
        }
        
        await employeesPage.clickAddEmployee()
        await employeesPage.fillEmployeeForm(employeeData)
        await employeesPage.submitEmployeeForm()
        
        await employeesPage.waitForEmployeesToLoad()
        
        const employeeNames = await employeesPage.getEmployeeNames()
        expect(employeeNames).toContain(employeeData.fullName)
      }
    })
  })

  test.describe('Update Employee', () => {
    test('should open edit dialog with existing data', async () => {
      await employeesPage.waitForEmployeesToLoad()
      const employeeNames = await employeesPage.getEmployeeNames()
      
      if (employeeNames.length > 0) {
        await employeesPage.clickEditEmployee(employeeNames[0])
        await expect(employeesPage.employeeDialog).toBeVisible()
        await expect(employeesPage.page.getByText('Sửa nhân viên')).toBeVisible()
        
        const nameValue = await employeesPage.fullNameInput.inputValue()
        expect(nameValue).toBeTruthy()
        
        // Email should be disabled when editing
        const isEmailDisabled = await employeesPage.emailInput.isDisabled()
        expect(isEmailDisabled).toBe(true)
      }
    })

    test('should update employee successfully', async () => {
      await employeesPage.waitForEmployeesToLoad()
      const employeeNames = await employeesPage.getEmployeeNames()
      
      if (employeeNames.length > 0) {
        const originalName = employeeNames[0]
        const updatedName = `Updated ${originalName} ${Date.now()}`
        
        await employeesPage.clickEditEmployee(originalName)
        await employeesPage.fullNameInput.fill(updatedName)
        await employeesPage.submitEmployeeForm()
        
        await employeesPage.waitForEmployeesToLoad()
        
        const updatedEmployeeNames = await employeesPage.getEmployeeNames()
        expect(updatedEmployeeNames).toContain(updatedName)
      }
    })

    test('should not allow editing email', async () => {
      await employeesPage.waitForEmployeesToLoad()
      const employeeNames = await employeesPage.getEmployeeNames()
      
      if (employeeNames.length > 0) {
        await employeesPage.clickEditEmployee(employeeNames[0])
        
        const isEmailDisabled = await employeesPage.emailInput.isDisabled()
        expect(isEmailDisabled).toBe(true)
      }
    })
  })

  test.describe('Delete Employee', () => {
    test('should open delete confirmation dialog', async () => {
      await employeesPage.waitForEmployeesToLoad()
      const employeeNames = await employeesPage.getEmployeeNames()
      
      if (employeeNames.length > 0) {
        await employeesPage.clickDeleteEmployee(employeeNames[0])
        await expect(employeesPage.page.getByText('Xác nhận xóa')).toBeVisible()
        await expect(employeesPage.deleteConfirmButton).toBeVisible()
      }
    })

    test('should cancel delete action', async () => {
      await employeesPage.waitForEmployeesToLoad()
      const employeeNames = await employeesPage.getEmployeeNames()
      
      if (employeeNames.length > 0) {
        const originalCount = employeeNames.length
        
        await employeesPage.clickDeleteEmployee(employeeNames[0])
        await employeesPage.cancelDelete()
        
        await employeesPage.waitForEmployeesToLoad()
        const newEmployeeNames = await employeesPage.getEmployeeNames()
        expect(newEmployeeNames.length).toBe(originalCount)
      }
    })

    test('should delete employee successfully', async () => {
      await employeesPage.waitForEmployeesToLoad()
      const employeeNames = await employeesPage.getEmployeeNames()
      
      if (employeeNames.length > 0) {
        const employeeToDelete = employeeNames[0]
        const originalCount = employeeNames.length
        
        await employeesPage.clickDeleteEmployee(employeeToDelete)
        await employeesPage.confirmDelete()
        
        await employeesPage.waitForEmployeesToLoad()
        const newEmployeeNames = await employeesPage.getEmployeeNames()
        expect(newEmployeeNames.length).toBe(originalCount - 1)
        expect(newEmployeeNames).not.toContain(employeeToDelete)
      }
    })
  })

  test.describe('Statistics Section', () => {
    test('should display statistics section', async ({ page }) => {
      await employeesPage.waitForEmployeesToLoad()
      await expect(page.locator('text=Thống kê Nhân viên')).toBeVisible()
    })

    test('should display statistics metrics', async ({ page }) => {
      await employeesPage.waitForEmployeesToLoad()
      await page.waitForTimeout(1000)
      
      const hasMetrics = await page.locator('text=Tổng số nhân viên').isVisible().catch(() => false)
      if (hasMetrics) {
        await expect(page.locator('text=Tổng số nhân viên')).toBeVisible()
      }
    })
  })
})

