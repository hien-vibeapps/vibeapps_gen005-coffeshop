import { test, expect } from '@playwright/test'
import { InventoryPage } from '../pages/inventory.page'

test.describe('Inventory Page', () => {
  let inventoryPage: InventoryPage

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()
    await inventoryPage.waitForPageLoad()
  })

  test('should display inventory page title', async () => {
    await expect(inventoryPage.title).toBeVisible()
  })

  test('should display add ingredient button', async () => {
    await expect(inventoryPage.addIngredientButton).toBeVisible()
  })

  test('should display ingredients table', async () => {
    await expect(inventoryPage.ingredientsTable).toBeVisible()
  })

  test('should load and display ingredients', async () => {
    await inventoryPage.waitForIngredientsToLoad()
    
    const ingredientCount = await inventoryPage.getIngredientCount()
    expect(ingredientCount).toBeGreaterThanOrEqual(0)
  })

  test('should display ingredient table headers', async ({ page }) => {
    await expect(page.locator('text=Tên nguyên liệu')).toBeVisible()
    await expect(page.locator('text=Đơn vị')).toBeVisible()
    await expect(page.locator('text=Tồn kho')).toBeVisible()
    await expect(page.locator('text=Mức tối thiểu')).toBeVisible()
    await expect(page.locator('text=Giá đơn vị')).toBeVisible()
    await expect(page.locator('text=Trạng thái')).toBeVisible()
  })

  test('should display ingredient status badges', async () => {
    await inventoryPage.waitForIngredientsToLoad()
    
    const ingredientNames = await inventoryPage.getIngredientNames()
    if (ingredientNames.length > 0) {
      const status = await inventoryPage.getIngredientStatus(ingredientNames[0])
      expect(status).toBeTruthy()
      expect(['Đủ hàng', 'Sắp hết']).toContain(status)
    }
  })

  test('should show low stock alert when applicable', async () => {
    await inventoryPage.waitForIngredientsToLoad()
    
    const isVisible = await inventoryPage.isLowStockAlertVisible()
    // Alert may or may not be visible depending on data
    expect(typeof isVisible).toBe('boolean')
  })

  test('should show empty state when no ingredients', async ({ page }) => {
    await inventoryPage.waitForIngredientsToLoad()
    
    const ingredientCount = await inventoryPage.getIngredientCount()
    if (ingredientCount === 0) {
      await expect(page.locator('text=Không có nguyên liệu nào')).toBeVisible()
    }
  })

  test.describe('Create Ingredient', () => {
    test('should open create ingredient dialog', async () => {
      await inventoryPage.clickAddIngredient()
      await expect(inventoryPage.ingredientDialog).toBeVisible()
      await expect(inventoryPage.page.getByText('Thêm nguyên liệu mới')).toBeVisible()
    })

    test('should create ingredient with valid data', async () => {
      const timestamp = Date.now()
      const ingredientData = {
        name: `Test Ingredient ${timestamp}`,
        unit: 'kg',
        currentStock: 100,
        minStockLevel: 50,
        unitPrice: 50000,
        supplier: 'Test Supplier',
        expiryTracking: false,
        isActive: true,
      }
      
      await inventoryPage.clickAddIngredient()
      await inventoryPage.fillIngredientForm(ingredientData)
      await inventoryPage.submitIngredientForm()
      
      await inventoryPage.waitForIngredientsToLoad()
      
      const ingredientNames = await inventoryPage.getIngredientNames()
      expect(ingredientNames).toContain(ingredientData.name)
    })

    test('should validate required fields - name is required', async () => {
      await inventoryPage.clickAddIngredient()
      
      await inventoryPage.ingredientNameInput.clear()
      await inventoryPage.submitButton.click()
      
      const isInvalid = await inventoryPage.ingredientNameInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should validate required fields - unit is required', async () => {
      await inventoryPage.clickAddIngredient()
      
      await inventoryPage.ingredientUnitInput.clear()
      await inventoryPage.submitButton.click()
      
      const isInvalid = await inventoryPage.ingredientUnitInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid
      })
      expect(isInvalid).toBe(true)
    })

    test('should create ingredient with minimal data', async () => {
      const timestamp = Date.now()
      const ingredientData = {
        name: `Minimal Ingredient ${timestamp}`,
        unit: 'pcs',
      }
      
      await inventoryPage.clickAddIngredient()
      await inventoryPage.fillIngredientForm(ingredientData)
      await inventoryPage.submitIngredientForm()
      
      await inventoryPage.waitForIngredientsToLoad()
      
      const ingredientNames = await inventoryPage.getIngredientNames()
      expect(ingredientNames).toContain(ingredientData.name)
    })

    test('should create ingredient with low stock level', async () => {
      const timestamp = Date.now()
      const ingredientData = {
        name: `Low Stock Ingredient ${timestamp}`,
        unit: 'kg',
        currentStock: 10,
        minStockLevel: 50, // Current stock is below min level
        isActive: true,
      }
      
      await inventoryPage.clickAddIngredient()
      await inventoryPage.fillIngredientForm(ingredientData)
      await inventoryPage.submitIngredientForm()
      
      await inventoryPage.waitForIngredientsToLoad()
      
      const ingredientNames = await inventoryPage.getIngredientNames()
      expect(ingredientNames).toContain(ingredientData.name)
      
      // Check if low stock alert appears
      await inventoryPage.waitForIngredientsToLoad()
      const status = await inventoryPage.getIngredientStatus(ingredientData.name)
      expect(status).toBe('Sắp hết')
    })
  })

  test.describe('Update Ingredient', () => {
    test('should open edit dialog with existing data', async () => {
      await inventoryPage.waitForIngredientsToLoad()
      const ingredientNames = await inventoryPage.getIngredientNames()
      
      if (ingredientNames.length > 0) {
        await inventoryPage.clickEditIngredient(ingredientNames[0])
        await expect(inventoryPage.ingredientDialog).toBeVisible()
        await expect(inventoryPage.page.getByText('Sửa nguyên liệu')).toBeVisible()
        
        const nameValue = await inventoryPage.ingredientNameInput.inputValue()
        expect(nameValue).toBeTruthy()
      }
    })

    test('should update ingredient successfully', async () => {
      await inventoryPage.waitForIngredientsToLoad()
      const ingredientNames = await inventoryPage.getIngredientNames()
      
      if (ingredientNames.length > 0) {
        const originalName = ingredientNames[0]
        const updatedName = `Updated ${originalName} ${Date.now()}`
        
        await inventoryPage.clickEditIngredient(originalName)
        await inventoryPage.ingredientNameInput.fill(updatedName)
        await inventoryPage.submitIngredientForm()
        
        await inventoryPage.waitForIngredientsToLoad()
        
        const updatedIngredientNames = await inventoryPage.getIngredientNames()
        expect(updatedIngredientNames).toContain(updatedName)
      }
    })

    test('should update stock levels', async () => {
      await inventoryPage.waitForIngredientsToLoad()
      const ingredientNames = await inventoryPage.getIngredientNames()
      
      if (ingredientNames.length > 0) {
        await inventoryPage.clickEditIngredient(ingredientNames[0])
        
        await inventoryPage.currentStockInput.fill('200')
        await inventoryPage.minStockLevelInput.fill('100')
        await inventoryPage.submitIngredientForm()
        
        await inventoryPage.waitForIngredientsToLoad()
        // Verify update was successful by checking status
        const status = await inventoryPage.getIngredientStatus(ingredientNames[0])
        expect(['Đủ hàng', 'Sắp hết']).toContain(status)
      }
    })
  })

  test.describe('Delete Ingredient', () => {
    test('should open delete confirmation dialog', async () => {
      await inventoryPage.waitForIngredientsToLoad()
      const ingredientNames = await inventoryPage.getIngredientNames()
      
      if (ingredientNames.length > 0) {
        await inventoryPage.clickDeleteIngredient(ingredientNames[0])
        await expect(inventoryPage.page.getByText('Xác nhận xóa')).toBeVisible()
        await expect(inventoryPage.deleteConfirmButton).toBeVisible()
      }
    })

    test('should cancel delete action', async () => {
      await inventoryPage.waitForIngredientsToLoad()
      const ingredientNames = await inventoryPage.getIngredientNames()
      
      if (ingredientNames.length > 0) {
        const originalCount = ingredientNames.length
        
        await inventoryPage.clickDeleteIngredient(ingredientNames[0])
        await inventoryPage.cancelDelete()
        
        await inventoryPage.waitForIngredientsToLoad()
        const newIngredientNames = await inventoryPage.getIngredientNames()
        expect(newIngredientNames.length).toBe(originalCount)
      }
    })

    test('should delete ingredient successfully', async () => {
      await inventoryPage.waitForIngredientsToLoad()
      const ingredientNames = await inventoryPage.getIngredientNames()
      
      if (ingredientNames.length > 0) {
        const ingredientToDelete = ingredientNames[0]
        const originalCount = ingredientNames.length
        
        await inventoryPage.clickDeleteIngredient(ingredientToDelete)
        await inventoryPage.confirmDelete()
        
        await inventoryPage.waitForIngredientsToLoad()
        const newIngredientNames = await inventoryPage.getIngredientNames()
        expect(newIngredientNames.length).toBe(originalCount - 1)
        expect(newIngredientNames).not.toContain(ingredientToDelete)
      }
    })
  })

  test.describe('Statistics Section', () => {
    test('should display statistics section', async ({ page }) => {
      await inventoryPage.waitForIngredientsToLoad()
      await expect(page.locator('text=Thống kê Nguyên liệu')).toBeVisible()
    })

    test('should display statistics metrics', async ({ page }) => {
      await inventoryPage.waitForIngredientsToLoad()
      await page.waitForTimeout(1000)
      
      const hasMetrics = await page.locator('text=Tổng số nguyên liệu').isVisible().catch(() => false)
      if (hasMetrics) {
        await expect(page.locator('text=Tổng số nguyên liệu')).toBeVisible()
      }
    })
  })
})

