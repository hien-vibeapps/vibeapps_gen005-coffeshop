import { test, expect } from '@playwright/test'
import { TablesPage } from '../pages/tables.page'

test.describe('Tables CRUD Operations', () => {
  let tablesPage: TablesPage

  test.beforeEach(async ({ page }) => {
    tablesPage = new TablesPage(page)
    await tablesPage.goto()
    await tablesPage.waitForPageLoad()
    await tablesPage.waitForTablesToLoad()
  })

  test.describe('Create Table', () => {
    test('should create table with valid data', async () => {
      // First, get an area ID
      const areaSelect = tablesPage.page.locator('#area_id')
      const firstOption = await areaSelect.locator('option').nth(1).getAttribute('value')
      
      if (firstOption) {
        const tableNumber = `Table ${Date.now()}`
        
        await tablesPage.clickAddTable()
        await tablesPage.fillTableForm({
          areaId: firstOption,
          tableNumber,
          capacity: 4,
          status: 'available',
          notes: 'Test table',
        })
        await tablesPage.submitTableForm()
        
        await tablesPage.waitForTablesToLoad()
        
        const tableNumbers = await tablesPage.getTableNumbers()
        expect(tableNumbers).toContain(tableNumber)
      }
    })

    test('should validate required fields - area is required', async () => {
      await tablesPage.clickAddTable()
      
      await tablesPage.areaSelect.selectOption('')
      await tablesPage.submitButton.click()
      
      const isInvalid = await tablesPage.areaSelect.evaluate((el: HTMLSelectElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should validate required fields - table number is required', async () => {
      const areaSelect = tablesPage.page.locator('#area_id')
      const firstOption = await areaSelect.locator('option').nth(1).getAttribute('value')
      
      if (firstOption) {
        await tablesPage.clickAddTable()
        await tablesPage.areaSelect.selectOption(firstOption)
        await tablesPage.tableNumberInput.clear()
        await tablesPage.submitButton.click()
        
        const isInvalid = await tablesPage.tableNumberInput.evaluate((el: HTMLInputElement) => {
          return !el.validity.valid
        })
        expect(isInvalid).toBe(true)
      }
    })
  })

  test.describe('Update Table', () => {
    test('should update table successfully', async () => {
      await tablesPage.waitForTablesToLoad()
      const tableNumbers = await tablesPage.getTableNumbers()
      
      if (tableNumbers.length > 0) {
        const originalNumber = tableNumbers[0]
        const updatedNumber = `Updated ${originalNumber} ${Date.now()}`
        
        await tablesPage.clickEditTable(originalNumber)
        await tablesPage.tableNumberInput.fill(updatedNumber)
        await tablesPage.submitTableForm()
        
        await tablesPage.waitForTablesToLoad()
        const updatedTableNumbers = await tablesPage.getTableNumbers()
        expect(updatedTableNumbers).toContain(updatedNumber)
      }
    })

    test('should update table status', async () => {
      await tablesPage.waitForTablesToLoad()
      const tableNumbers = await tablesPage.getTableNumbers()
      
      if (tableNumbers.length > 0) {
        await tablesPage.clickEditTable(tableNumbers[0])
        await tablesPage.statusSelect.selectOption('occupied')
        await tablesPage.submitTableForm()
        
        await tablesPage.waitForTablesToLoad()
        const status = await tablesPage.getTableStatus(tableNumbers[0])
        expect(status).toBeTruthy()
      }
    })
  })

  test.describe('Delete Table', () => {
    test('should delete table successfully', async () => {
      await tablesPage.waitForTablesToLoad()
      const tableNumbers = await tablesPage.getTableNumbers()
      
      if (tableNumbers.length > 0) {
        const tableToDelete = tableNumbers[0]
        const originalCount = tableNumbers.length
        
        await tablesPage.clickDeleteTable(tableToDelete)
        await tablesPage.confirmDelete()
        
        await tablesPage.waitForTablesToLoad()
        const newTableNumbers = await tablesPage.getTableNumbers()
        expect(newTableNumbers.length).toBe(originalCount - 1)
        expect(newTableNumbers).not.toContain(tableToDelete)
      }
    })

    test('should cancel delete action', async () => {
      await tablesPage.waitForTablesToLoad()
      const tableNumbers = await tablesPage.getTableNumbers()
      
      if (tableNumbers.length > 0) {
        const originalCount = tableNumbers.length
        
        await tablesPage.clickDeleteTable(tableNumbers[0])
        await tablesPage.cancelDelete()
        
        await tablesPage.waitForTablesToLoad()
        const newTableNumbers = await tablesPage.getTableNumbers()
        expect(newTableNumbers.length).toBe(originalCount)
      }
    })
  })
})

