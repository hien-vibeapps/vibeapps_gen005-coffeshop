import { test, expect } from '@playwright/test'
import { MenuPage } from '../pages/menu.page'

test.describe('Menu CRUD Operations', () => {
  let menuPage: MenuPage

  test.beforeEach(async ({ page }) => {
    menuPage = new MenuPage(page)
    await menuPage.goto()
    await menuPage.waitForPageLoad()
    await menuPage.waitForProductsToLoad()
  })

  test.describe('Category CRUD', () => {
    test('should create category with valid data', async () => {
      const categoryName = `Test Category ${Date.now()}`
      
      await menuPage.clickAddCategory()
      await menuPage.fillCategoryForm({
        name: categoryName,
        description: 'Test description',
        displayOrder: 1,
        isActive: true,
      })
      await menuPage.submitCategoryForm()
      
      await menuPage.waitForProductsToLoad()
      
      const categoryNames = await menuPage.getCategoryNames()
      expect(categoryNames.some(name => name.includes(categoryName))).toBeTruthy()
    })

    test('should validate required fields - category name is required', async () => {
      await menuPage.clickAddCategory()
      
      await menuPage.categoryNameInput.clear()
      await menuPage.categorySubmitButton.click()
      
      const isInvalid = await menuPage.categoryNameInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should update category successfully', async () => {
      await menuPage.waitForProductsToLoad()
      const categoryNames = await menuPage.getCategoryNames()
      
      if (categoryNames.length > 0) {
        const originalName = categoryNames[0]
        const updatedName = `Updated ${originalName} ${Date.now()}`
        
        await menuPage.clickEditCategory(originalName)
        await menuPage.categoryNameInput.fill(updatedName)
        await menuPage.submitCategoryForm()
        
        await menuPage.waitForProductsToLoad()
        const updatedCategoryNames = await menuPage.getCategoryNames()
        expect(updatedCategoryNames.some(name => name.includes(updatedName))).toBeTruthy()
      }
    })

    test('should delete category successfully', async () => {
      await menuPage.waitForProductsToLoad()
      const categoryNames = await menuPage.getCategoryNames()
      
      if (categoryNames.length > 0) {
        const categoryToDelete = categoryNames[0]
        const originalCount = categoryNames.length
        
        await menuPage.clickDeleteCategory(categoryToDelete)
        await menuPage.confirmDeleteCategory()
        
        await menuPage.waitForProductsToLoad()
        const newCategoryNames = await menuPage.getCategoryNames()
        expect(newCategoryNames.length).toBeLessThan(originalCount)
      }
    })
  })

  test.describe('Product CRUD', () => {
    test('should create product with valid data', async () => {
      // First, get a category ID
      await menuPage.waitForProductsToLoad()
      const categoryNames = await menuPage.getCategoryNames()
      
      if (categoryNames.length > 0) {
        const productName = `Test Product ${Date.now()}`
        
        // Get first available category option
        const categorySelect = menuPage.page.locator('select[name="category_id"]')
        const firstOption = await categorySelect.locator('option').nth(1).getAttribute('value')
        
        if (firstOption) {
          await menuPage.clickAddProduct()
          await menuPage.fillProductForm({
            name: productName,
            categoryId: firstOption,
            description: 'Test product description',
            price: 50000,
            estimatedPrepTime: 10,
            status: 'available',
            displayOrder: 1,
            isActive: true,
          })
          await menuPage.submitProductForm()
          
          await menuPage.waitForProductsToLoad()
          
          const productNames = await menuPage.getProductNames()
          expect(productNames).toContain(productName)
        }
      }
    })

    test('should validate required fields - product name is required', async () => {
      await menuPage.clickAddProduct()
      
      await menuPage.productNameInput.clear()
      await menuPage.productSubmitButton.click()
      
      const isInvalid = await menuPage.productNameInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should validate required fields - category is required', async () => {
      await menuPage.clickAddProduct()
      
      await menuPage.productCategorySelect.selectOption('')
      await menuPage.productSubmitButton.click()
      
      const isInvalid = await menuPage.productCategorySelect.evaluate((el: HTMLSelectElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should update product successfully', async () => {
      await menuPage.waitForProductsToLoad()
      const productNames = await menuPage.getProductNames()
      
      if (productNames.length > 0) {
        const originalName = productNames[0]
        const updatedName = `Updated ${originalName} ${Date.now()}`
        
        await menuPage.clickEditProduct(originalName)
        await menuPage.productNameInput.fill(updatedName)
        await menuPage.submitProductForm()
        
        await menuPage.waitForProductsToLoad()
        const updatedProductNames = await menuPage.getProductNames()
        expect(updatedProductNames).toContain(updatedName)
      }
    })

    test('should delete product successfully', async () => {
      await menuPage.waitForProductsToLoad()
      const productNames = await menuPage.getProductNames()
      
      if (productNames.length > 0) {
        const productToDelete = productNames[0]
        const originalCount = productNames.length
        
        await menuPage.clickDeleteProduct(productToDelete)
        await menuPage.confirmDeleteProduct()
        
        await menuPage.waitForProductsToLoad()
        const newProductNames = await menuPage.getProductNames()
        expect(newProductNames.length).toBe(originalCount - 1)
        expect(newProductNames).not.toContain(productToDelete)
      }
    })
  })
})

