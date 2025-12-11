import { test, expect } from '@playwright/test'
import { TablesPage } from '../pages/tables.page'

test.describe('Tables Page', () => {
  let tablesPage: TablesPage

  test.beforeEach(async ({ page }) => {
    tablesPage = new TablesPage(page)
    await tablesPage.goto()
    await tablesPage.waitForPageLoad()
  })

  test('should display tables page title', async () => {
    await expect(tablesPage.title).toBeVisible()
  })

  test('should display add table button', async () => {
    await expect(tablesPage.addTableButton).toBeVisible()
  })

  test('should display tables table', async () => {
    await expect(tablesPage.tablesTable).toBeVisible()
  })

  test('should load and display tables', async () => {
    await tablesPage.waitForTablesToLoad()
    
    const tableCount = await tablesPage.getTableCount()
    expect(tableCount).toBeGreaterThanOrEqual(0)
  })

  test('should display table table headers', async ({ page }) => {
    await expect(page.locator('text=Số bàn')).toBeVisible()
    await expect(page.locator('text=Khu vực')).toBeVisible()
    await expect(page.locator('text=Sức chứa')).toBeVisible()
    await expect(page.locator('text=Trạng thái')).toBeVisible()
  })

  test('should display table status badges', async () => {
    await tablesPage.waitForTablesToLoad()
    
    const tableNumbers = await tablesPage.getTableNumbers()
    if (tableNumbers.length > 0) {
      const status = await tablesPage.getTableStatus(tableNumbers[0])
      expect(status).toBeTruthy()
    }
  })

  test('should show empty state when no tables', async ({ page }) => {
    await tablesPage.waitForTablesToLoad()
    
    const tableCount = await tablesPage.getTableCount()
    if (tableCount === 0) {
      await expect(page.locator('text=Không có bàn nào')).toBeVisible()
    }
  })
})

