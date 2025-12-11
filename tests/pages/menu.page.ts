import { Page, Locator } from '@playwright/test'

export class MenuPage {
  readonly page: Page
  readonly title: Locator
  readonly addProductButton: Locator
  readonly categoriesSidebar: Locator
  readonly allCategoriesButton: Locator
  readonly productsTable: Locator
  readonly productsTableBody: Locator
  
  // Category locators
  readonly addCategoryButton: Locator
  readonly categoryDialog: Locator
  readonly categoryNameInput: Locator
  readonly categoryDescriptionInput: Locator
  readonly categoryDisplayOrderInput: Locator
  readonly categoryIsActiveCheckbox: Locator
  readonly categorySubmitButton: Locator
  readonly categoryCancelButton: Locator
  readonly deleteCategoryConfirmButton: Locator
  
  // Product locators
  readonly productDialog: Locator
  readonly productNameInput: Locator
  readonly productDescriptionInput: Locator
  readonly productCategorySelect: Locator
  readonly productPriceInput: Locator
  readonly productEstimatedPrepTimeInput: Locator
  readonly productStatusSelect: Locator
  readonly productDisplayOrderInput: Locator
  readonly productIsActiveCheckbox: Locator
  readonly productSubmitButton: Locator
  readonly productCancelButton: Locator
  readonly deleteProductConfirmButton: Locator

  constructor(page: Page) {
    this.page = page
    this.title = page.getByRole('heading', { name: 'Quản lý Menu' })
    this.addProductButton = page.getByRole('button', { name: /Thêm sản phẩm/i })
    this.categoriesSidebar = page.locator('text=Danh mục').locator('..')
    this.allCategoriesButton = page.getByRole('button', { name: 'Tất cả' })
    this.productsTable = page.locator('table')
    this.productsTableBody = page.locator('tbody')
    
    // Category locators
    this.addCategoryButton = page.locator('button').filter({ hasText: /Plus|Thêm/i }).first()
    this.categoryDialog = page.locator('[role="dialog"]').filter({ hasText: /danh mục/i })
    this.categoryNameInput = page.locator('#name').first()
    this.categoryDescriptionInput = page.locator('#description').first()
    this.categoryDisplayOrderInput = page.locator('#display_order').first()
    this.categoryIsActiveCheckbox = page.locator('#is_active').first()
    this.categorySubmitButton = page.getByRole('button', { name: /Tạo mới|Cập nhật/i }).first()
    this.categoryCancelButton = page.getByRole('button', { name: /Hủy/i }).first()
    this.deleteCategoryConfirmButton = page.getByRole('button', { name: /Xóa/i }).filter({ hasText: 'Xóa' }).first()
    
    // Product locators
    this.productDialog = page.locator('[role="dialog"]').filter({ hasText: /sản phẩm/i })
    this.productNameInput = page.locator('input[name="name"]').last()
    this.productDescriptionInput = page.locator('input[name="description"]').last()
    this.productCategorySelect = page.locator('select[name="category_id"]')
    this.productPriceInput = page.locator('input[name="price"]')
    this.productEstimatedPrepTimeInput = page.locator('input[name="estimated_prep_time"]')
    this.productStatusSelect = page.locator('select[name="status"]')
    this.productDisplayOrderInput = page.locator('input[name="display_order"]').last()
    this.productIsActiveCheckbox = page.locator('input[name="is_active"]').last()
    this.productSubmitButton = page.getByRole('button', { name: /Tạo mới|Cập nhật/i }).last()
    this.productCancelButton = page.getByRole('button', { name: /Hủy/i }).last()
    this.deleteProductConfirmButton = page.getByRole('button', { name: /Xóa/i }).filter({ hasText: 'Xóa' }).last()
  }

  async goto() {
    await this.page.goto('/menu')
  }

  async waitForPageLoad() {
    await this.title.waitFor({ state: 'visible' })
  }

  async clickCategory(categoryName: string) {
    await this.page.getByRole('button', { name: categoryName }).click()
  }

  async clickAllCategories() {
    await this.allCategoriesButton.click()
  }

  async getProductCount(): Promise<number> {
    const rows = await this.productsTableBody.locator('tr').count()
    const noProductsRow = await this.productsTableBody.locator('text=Không có sản phẩm nào').count()
    return noProductsRow > 0 ? 0 : rows
  }

  async getProductNames(): Promise<string[]> {
    const names: string[] = []
    const rows = await this.productsTableBody.locator('tr').all()
    for (const row of rows) {
      const name = await row.locator('td').first().textContent()
      if (name && !name.includes('Không có sản phẩm nào')) {
        names.push(name.trim())
      }
    }
    return names
  }

  async waitForProductsToLoad() {
    await this.page.waitForSelector('.skeleton', { state: 'hidden' }).catch(() => {})
    await this.page.waitForTimeout(500)
  }

  async clickEditProduct(productName: string) {
    const row = this.productsTableBody.locator('tr').filter({ hasText: productName })
    await row.getByRole('button').first().click()
  }

  async clickDeleteProduct(productName: string) {
    const row = this.productsTableBody.locator('tr').filter({ hasText: productName })
    await row.getByRole('button').last().click()
  }

  // Category methods
  async clickAddCategory() {
    await this.addCategoryButton.click()
    await this.page.waitForTimeout(500)
    // Wait for dialog to appear
    await this.page.waitForSelector('[role="dialog"]', { state: 'visible' }).catch(() => {})
  }

  async clickEditCategory(categoryName: string) {
    const categoryButton = this.page.getByRole('button', { name: categoryName })
    const categoryRow = categoryButton.locator('..')
    await categoryRow.getByRole('button', { name: /Edit|Sửa/i }).click()
    await this.page.waitForTimeout(500)
  }

  async clickDeleteCategory(categoryName: string) {
    const categoryButton = this.page.getByRole('button', { name: categoryName })
    const categoryRow = categoryButton.locator('..')
    await categoryRow.getByRole('button', { name: /Trash|Xóa/i }).click()
  }

  async fillCategoryForm(data: {
    name: string
    description?: string
    displayOrder?: number
    isActive?: boolean
  }) {
    await this.categoryNameInput.fill(data.name)
    if (data.description !== undefined) {
      await this.categoryDescriptionInput.fill(data.description)
    }
    if (data.displayOrder !== undefined) {
      await this.categoryDisplayOrderInput.fill(data.displayOrder.toString())
    }
    if (data.isActive !== undefined) {
      const isChecked = await this.categoryIsActiveCheckbox.isChecked()
      if (data.isActive !== isChecked) {
        await this.categoryIsActiveCheckbox.click()
      }
    }
  }

  async submitCategoryForm() {
    await this.categorySubmitButton.click()
    await this.page.waitForTimeout(1000)
  }

  async confirmDeleteCategory() {
    await this.deleteCategoryConfirmButton.click()
    await this.page.waitForTimeout(1000)
  }

  async cancelDeleteCategory() {
    await this.categoryCancelButton.click()
  }

  async getCategoryNames(): Promise<string[]> {
    await this.page.waitForTimeout(500)
    const names: string[] = []
    const buttons = await this.page.locator('button').all()
    for (const button of buttons) {
      const text = await button.textContent()
      if (text && text.trim() !== 'Tất cả' && !text.includes('Thêm') && !text.includes('Edit') && !text.includes('Trash') && text.trim().length > 0) {
        // Check if it's a category button (not in table)
        const parent = button.locator('..')
        const isInSidebar = await parent.getAttribute('class')?.includes('sidebar') || false
        if (isInSidebar || text.trim() !== 'Tất cả') {
          names.push(text.trim())
        }
      }
    }
    return [...new Set(names)] // Remove duplicates
  }

  // Product methods
  async clickAddProduct() {
    await this.addProductButton.click()
    await this.page.waitForTimeout(500)
    await this.page.waitForSelector('[role="dialog"]', { state: 'visible' }).catch(() => {})
  }

  async fillProductForm(data: {
    name: string
    categoryId: string
    description?: string
    price: number
    estimatedPrepTime?: number
    status?: string
    displayOrder?: number
    isActive?: boolean
  }) {
    await this.productNameInput.fill(data.name)
    await this.productCategorySelect.selectOption(data.categoryId)
    if (data.description !== undefined) {
      await this.productDescriptionInput.fill(data.description)
    }
    await this.productPriceInput.fill(data.price.toString())
    if (data.estimatedPrepTime !== undefined) {
      await this.productEstimatedPrepTimeInput.fill(data.estimatedPrepTime.toString())
    }
    if (data.status !== undefined) {
      await this.productStatusSelect.selectOption(data.status)
    }
    if (data.displayOrder !== undefined) {
      await this.productDisplayOrderInput.fill(data.displayOrder.toString())
    }
    if (data.isActive !== undefined) {
      const isChecked = await this.productIsActiveCheckbox.isChecked()
      if (data.isActive !== isChecked) {
        await this.productIsActiveCheckbox.click()
      }
    }
  }

  async submitProductForm() {
    await this.productSubmitButton.click()
    await this.page.waitForTimeout(1000)
  }

  async confirmDeleteProduct() {
    await this.deleteProductConfirmButton.click()
    await this.page.waitForTimeout(1000)
  }

  async cancelDeleteProduct() {
    await this.productCancelButton.click()
  }
}
