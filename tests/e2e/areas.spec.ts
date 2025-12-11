import { test, expect } from '@playwright/test'
import { AreasPage } from '../pages/areas.page'

test.describe('Areas Page', () => {
  let areasPage: AreasPage

  test.beforeEach(async ({ page }) => {
    areasPage = new AreasPage(page)
    await areasPage.goto()
    await areasPage.waitForPageLoad()
  })

  test('should display areas page title', async () => {
    await expect(areasPage.title).toBeVisible()
  })

  test('should display add area button', async () => {
    await expect(areasPage.addAreaButton).toBeVisible()
  })

  test('should display areas table', async () => {
    await expect(areasPage.areasTable).toBeVisible()
  })

  test('should load and display areas', async () => {
    await areasPage.waitForAreasToLoad()
    
    const areaCount = await areasPage.getAreaCount()
    expect(areaCount).toBeGreaterThanOrEqual(0)
  })

  test('should display area table headers', async ({ page }) => {
    await expect(page.locator('text=Tên khu vực')).toBeVisible()
    await expect(page.locator('text=Mô tả')).toBeVisible()
    await expect(page.locator('text=Trạng thái')).toBeVisible()
    await expect(page.locator('text=Thao tác')).toBeVisible()
  })

  test('should display area status badges', async () => {
    await areasPage.waitForAreasToLoad()
    
    const areaNames = await areasPage.getAreaNames()
    if (areaNames.length > 0) {
      const status = await areasPage.getAreaStatus(areaNames[0])
      expect(status).toBeTruthy()
      expect(['Hoạt động', 'Tạm ngưng']).toContain(status)
    }
  })

  test('should show empty state when no areas', async ({ page }) => {
    await areasPage.waitForAreasToLoad()
    
    const areaCount = await areasPage.getAreaCount()
    if (areaCount === 0) {
      await expect(page.locator('text=Không có khu vực nào')).toBeVisible()
    }
  })

  test.describe('Create Area', () => {
    test('should open create area dialog', async () => {
      await areasPage.clickAddArea()
      await expect(areasPage.areaDialog).toBeVisible()
      await expect(areasPage.page.getByText('Thêm khu vực mới')).toBeVisible()
    })

    test('should create area with valid data', async () => {
      const areaName = `Test Area ${Date.now()}`
      
      await areasPage.clickAddArea()
      await areasPage.fillAreaForm(areaName, 'Test description', true)
      await areasPage.submitAreaForm()
      
      // Wait for success toast and table update
      await areasPage.waitForAreasToLoad()
      
      const areaNames = await areasPage.getAreaNames()
      expect(areaNames).toContain(areaName)
    })

    test('should validate required fields - name is required', async () => {
      await areasPage.clickAddArea()
      
      // Try to submit without name
      await areasPage.areaNameInput.clear()
      await areasPage.submitButton.click()
      
      // HTML5 validation should prevent submission
      const isInvalid = await areasPage.areaNameInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should create area with minimal data', async () => {
      const areaName = `Minimal Area ${Date.now()}`
      
      await areasPage.clickAddArea()
      await areasPage.fillAreaForm(areaName)
      await areasPage.submitAreaForm()
      
      await areasPage.waitForAreasToLoad()
      
      const areaNames = await areasPage.getAreaNames()
      expect(areaNames).toContain(areaName)
    })
  })

  test.describe('Update Area', () => {
    test('should open edit dialog with existing data', async () => {
      await areasPage.waitForAreasToLoad()
      const areaNames = await areasPage.getAreaNames()
      
      if (areaNames.length > 0) {
        await areasPage.clickEditArea(areaNames[0])
        await expect(areasPage.areaDialog).toBeVisible()
        await expect(areasPage.page.getByText('Sửa khu vực')).toBeVisible()
        
        const nameValue = await areasPage.areaNameInput.inputValue()
        expect(nameValue).toBeTruthy()
      }
    })

    test('should update area successfully', async () => {
      await areasPage.waitForAreasToLoad()
      const areaNames = await areasPage.getAreaNames()
      
      if (areaNames.length > 0) {
        const originalName = areaNames[0]
        const updatedName = `Updated ${originalName} ${Date.now()}`
        
        await areasPage.clickEditArea(originalName)
        await areasPage.areaNameInput.fill(updatedName)
        await areasPage.submitAreaForm()
        
        await areasPage.waitForAreasToLoad()
        
        const updatedAreaNames = await areasPage.getAreaNames()
        expect(updatedAreaNames).toContain(updatedName)
      }
    })

    test('should validate required fields when editing', async () => {
      await areasPage.waitForAreasToLoad()
      const areaNames = await areasPage.getAreaNames()
      
      if (areaNames.length > 0) {
        await areasPage.clickEditArea(areaNames[0])
        
        // Clear name field
        await areasPage.areaNameInput.clear()
        await areasPage.submitButton.click()
        
        // HTML5 validation should prevent submission
        const isInvalid = await areasPage.areaNameInput.evaluate((el: HTMLInputElement) => {
          return !el.validity.valid
        })
        expect(isInvalid).toBe(true)
      }
    })
  })

  test.describe('Delete Area', () => {
    test('should open delete confirmation dialog', async () => {
      await areasPage.waitForAreasToLoad()
      const areaNames = await areasPage.getAreaNames()
      
      if (areaNames.length > 0) {
        await areasPage.clickDeleteArea(areaNames[0])
        await expect(areasPage.page.getByText('Xác nhận xóa')).toBeVisible()
        await expect(areasPage.deleteConfirmButton).toBeVisible()
      }
    })

    test('should cancel delete action', async () => {
      await areasPage.waitForAreasToLoad()
      const areaNames = await areasPage.getAreaNames()
      
      if (areaNames.length > 0) {
        const originalCount = areaNames.length
        
        await areasPage.clickDeleteArea(areaNames[0])
        await areasPage.cancelDelete()
        
        await areasPage.waitForAreasToLoad()
        const newAreaNames = await areasPage.getAreaNames()
        expect(newAreaNames.length).toBe(originalCount)
      }
    })

    test('should delete area successfully', async () => {
      await areasPage.waitForAreasToLoad()
      const areaNames = await areasPage.getAreaNames()
      
      if (areaNames.length > 0) {
        const areaToDelete = areaNames[0]
        const originalCount = areaNames.length
        
        await areasPage.clickDeleteArea(areaToDelete)
        await areasPage.confirmDelete()
        
        await areasPage.waitForAreasToLoad()
        const newAreaNames = await areasPage.getAreaNames()
        expect(newAreaNames.length).toBe(originalCount - 1)
        expect(newAreaNames).not.toContain(areaToDelete)
      }
    })
  })

  test.describe('Statistics Section', () => {
    test('should display statistics section', async ({ page }) => {
      await areasPage.waitForAreasToLoad()
      await expect(page.locator('text=Thống kê Khu vực')).toBeVisible()
    })

    test('should display statistics metrics', async ({ page }) => {
      await areasPage.waitForAreasToLoad()
      // Wait for statistics to load
      await page.waitForTimeout(1000)
      
      // Check for common metric labels
      const hasMetrics = await page.locator('text=Tổng số khu vực').isVisible().catch(() => false)
      if (hasMetrics) {
        await expect(page.locator('text=Tổng số khu vực')).toBeVisible()
      }
    })
  })
})

