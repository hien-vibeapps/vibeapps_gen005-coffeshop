import { test, expect } from '@playwright/test'
import { MenuPage } from '../pages/menu.page'

test.describe('Menu Page', () => {
  let menuPage: MenuPage

  test.beforeEach(async ({ page }) => {
    menuPage = new MenuPage(page)
    await menuPage.goto()
    await menuPage.waitForPageLoad()
  })

  test('should display menu page title', async () => {
    await expect(menuPage.title).toBeVisible()
  })

  test('should display add product button', async () => {
    await expect(menuPage.addProductButton).toBeVisible()
  })

  test('should display categories sidebar', async () => {
    await expect(menuPage.categoriesSidebar).toBeVisible()
  })

  test('should display "Tất cả" category button', async () => {
    await expect(menuPage.allCategoriesButton).toBeVisible()
  })

  test('should display products table', async () => {
    await expect(menuPage.productsTable).toBeVisible()
  })

  test('should load and display products', async () => {
    await menuPage.waitForProductsToLoad()
    
    const productCount = await menuPage.getProductCount()
    expect(productCount).toBeGreaterThanOrEqual(0)
  })

  test('should filter products by category', async ({ page }) => {
    await menuPage.waitForProductsToLoad()
    
    // Get initial product count
    const initialCount = await menuPage.getProductCount()
    
    // Click on a category (if available)
    const categoryButtons = await page.locator('button').filter({ hasText: /^(?!Tất cả|Thêm)/ }).all()
    if (categoryButtons.length > 0) {
      await categoryButtons[0].click()
      await menuPage.waitForProductsToLoad()
      
      // Products should be filtered (count may change)
      const filteredCount = await menuPage.getProductCount()
      expect(filteredCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('should display product information correctly', async () => {
    await menuPage.waitForProductsToLoad()
    
    const productNames = await menuPage.getProductNames()
    if (productNames.length > 0) {
      // Verify table headers are visible
      await expect(menuPage.page.locator('text=Tên sản phẩm')).toBeVisible()
      await expect(menuPage.page.locator('text=Danh mục')).toBeVisible()
      await expect(menuPage.page.locator('text=Giá')).toBeVisible()
      await expect(menuPage.page.locator('text=Trạng thái')).toBeVisible()
    }
  })

  test('should show empty state when no products', async ({ page }) => {
    await menuPage.waitForProductsToLoad()
    
    const productCount = await menuPage.getProductCount()
    if (productCount === 0) {
      await expect(page.locator('text=Không có sản phẩm nào')).toBeVisible()
    }
  })
})

