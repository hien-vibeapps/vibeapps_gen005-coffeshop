# Test Cases - Coffee Shop Management System

## Tổng quan

Tài liệu này mô tả tất cả các E2E test cases đã được viết cho hệ thống Quản lý quán Coffee Shop.

## Test Coverage

### 1. Dashboard Tests (`tests/e2e/dashboard.spec.ts`)
- ✅ Display dashboard title
- ✅ Display all stats cards (revenue, orders, pending orders, tables in use)
- ✅ Load and display stats values
- ✅ Display correct card descriptions

### 2. Menu Tests

#### Basic Menu Tests (`tests/e2e/menu.spec.ts`)
- ✅ Display menu page title
- ✅ Display add product button
- ✅ Display categories sidebar
- ✅ Display "Tất cả" category button
- ✅ Display products table
- ✅ Load and display products
- ✅ Filter products by category
- ✅ Display product information correctly
- ✅ Show empty state when no products

#### Menu CRUD Tests (`tests/e2e/menu-crud.spec.ts`)
- ✅ **Category CRUD:**
  - Create category with valid data
  - Validate required fields (name is required)
  - Update category successfully
  - Delete category successfully
- ✅ **Product CRUD:**
  - Create product with valid data
  - Validate required fields (name, category)
  - Update product successfully
  - Delete product successfully

### 3. Orders Tests

#### Basic Orders Tests (`tests/e2e/orders.spec.ts`)
- ✅ Display orders page title
- ✅ Display create order button
- ✅ Display orders table
- ✅ Load and display orders
- ✅ Display order table headers
- ✅ Navigate to order detail page
- ✅ Display order status badges
- ✅ Show empty state when no orders
- ✅ Display order detail information
- ✅ Navigate back to orders list
- ✅ Display order items in table
- ✅ Display total amount

#### Orders CRUD Tests (`tests/e2e/orders-crud.spec.ts`)
- ✅ Open create order dialog
- ✅ Display create order button
- ✅ Navigate to order detail page
- ✅ Display order information in detail page
- ✅ Display order status badges
- ✅ Filter orders by status
- ✅ Display all order table headers
- ✅ Show empty state when no orders

### 4. Tables Tests

#### Basic Tables Tests (`tests/e2e/tables.spec.ts`)
- ✅ Display tables page title
- ✅ Display add table button
- ✅ Display tables table
- ✅ Load and display tables
- ✅ Display table table headers
- ✅ Display table status badges
- ✅ Show empty state when no tables

#### Tables CRUD Tests (`tests/e2e/tables-crud.spec.ts`)
- ✅ **Create Table:**
  - Create table with valid data
  - Validate required fields (area, table number)
- ✅ **Update Table:**
  - Update table successfully
  - Update table status
- ✅ **Delete Table:**
  - Delete table successfully
  - Cancel delete action

### 5. Areas Tests (`tests/e2e/areas.spec.ts`)
- ✅ Display areas page title
- ✅ Display add area button
- ✅ Display areas table
- ✅ Load and display areas
- ✅ Display area table headers
- ✅ Display area status badges
- ✅ Show empty state when no areas
- ✅ **Create Area:**
  - Open create area dialog
  - Create area with valid data
  - Validate required fields (name is required)
  - Create area with minimal data
- ✅ **Update Area:**
  - Open edit dialog with existing data
  - Update area successfully
  - Validate required fields when editing
- ✅ **Delete Area:**
  - Open delete confirmation dialog
  - Cancel delete action
  - Delete area successfully
- ✅ **Statistics Section:**
  - Display statistics section
  - Display statistics metrics

### 6. Employees Tests (`tests/e2e/employees.spec.ts`)
- ✅ Display employees page title
- ✅ Display add employee button
- ✅ Display employees table
- ✅ Load and display employees
- ✅ Display employee table headers
- ✅ Display employee role and status badges
- ✅ Show empty state when no employees
- ✅ **Create Employee:**
  - Open create employee dialog
  - Create employee with valid data
  - Validate required fields (full name, email, phone, role)
  - Validate email format
  - Create employee with all roles
- ✅ **Update Employee:**
  - Open edit dialog with existing data
  - Update employee successfully
  - Not allow editing email
- ✅ **Delete Employee:**
  - Open delete confirmation dialog
  - Cancel delete action
  - Delete employee successfully
- ✅ **Statistics Section:**
  - Display statistics section
  - Display statistics metrics

### 7. Inventory Tests (`tests/e2e/inventory.spec.ts`)
- ✅ Display inventory page title
- ✅ Display add ingredient button
- ✅ Display ingredients table
- ✅ Load and display ingredients
- ✅ Display ingredient table headers
- ✅ Display ingredient status badges
- ✅ Show low stock alert when applicable
- ✅ Show empty state when no ingredients
- ✅ **Create Ingredient:**
  - Open create ingredient dialog
  - Create ingredient with valid data
  - Validate required fields (name, unit)
  - Create ingredient with minimal data
  - Create ingredient with low stock level
- ✅ **Update Ingredient:**
  - Open edit dialog with existing data
  - Update ingredient successfully
  - Update stock levels
- ✅ **Delete Ingredient:**
  - Open delete confirmation dialog
  - Cancel delete action
  - Delete ingredient successfully
- ✅ **Statistics Section:**
  - Display statistics section
  - Display statistics metrics

### 8. Navigation Tests (`tests/e2e/navigation.spec.ts`)
- ✅ Display sidebar navigation
- ✅ Display all navigation links
- ✅ Navigate to Dashboard
- ✅ Navigate to Orders
- ✅ Navigate to Menu
- ✅ Navigate to Tables
- ✅ Navigate to Employees
- ✅ Navigate to Inventory
- ✅ Navigate to Reports
- ✅ Navigate to Settings
- ✅ Highlight active navigation link
- ✅ Navigate through all pages sequentially
- ✅ Maintain navigation state after page reload

### 9. Reports & Settings Tests (`tests/e2e/reports-settings.spec.ts`)
- ✅ **Reports Page:**
  - Display reports page title
  - Display page description
  - Display revenue report card
  - Display sales report card
  - Display inventory report card
  - Display development status for all report cards
  - Have all report cards visible
- ✅ **Settings Page:**
  - Display settings page title
  - Display page description
  - Display shop information card
  - Display system configuration card
  - Display development status for all setting cards
  - Have all setting cards visible

## Page Objects

Tất cả các page objects được tổ chức trong `tests/pages/`:

- `dashboard.page.ts` - Dashboard page object
- `menu.page.ts` - Menu page object (với CRUD methods cho categories và products)
- `orders.page.ts` - Orders page object
- `order-detail.page.ts` - Order detail page object
- `tables.page.ts` - Tables page object (với CRUD methods)
- `areas.page.ts` - Areas page object (với CRUD methods)
- `employees.page.ts` - Employees page object (với CRUD methods)
- `inventory.page.ts` - Inventory page object (với CRUD methods)
- `navigation.page.ts` - Navigation page object

## Test Scenarios Covered

### Happy Path
- ✅ Tất cả các user flows thành công
- ✅ CRUD operations cho tất cả entities
- ✅ Navigation giữa các pages
- ✅ Form submissions thành công

### Edge Cases
- ✅ Empty states (khi không có data)
- ✅ Validation errors
- ✅ Cancel actions
- ✅ Minimal data inputs

### Error Cases
- ✅ Required field validation
- ✅ Invalid input formats (email)
- ✅ HTML5 form validation

### Business Rules
- ✅ Status badges hiển thị đúng
- ✅ Statistics sections hoạt động
- ✅ Form validation theo business rules

### Browser UI Coverage
- ✅ Tất cả màn hình giao diện
- ✅ Menus, modals, navigation
- ✅ Tables và lists
- ✅ Forms và dialogs

### Menu Navigation
- ✅ Tất cả menu items
- ✅ Submenus (nếu có)
- ✅ Active link highlighting

### Submit Actions
- ✅ Validation trước khi submit
- ✅ Success/error handling sau submit
- ✅ Form reset sau submit thành công

## Cách chạy Tests

### Cài đặt Dependencies

```bash
# Cài đặt Playwright (nếu chưa có)
npm install -D @playwright/test
npx playwright install
```

### Chạy tất cả tests

```bash
cd tests
npx playwright test
```

### Chạy tests với HTML report

```bash
cd tests
npx playwright test --reporter=html
```

Sau khi chạy xong, mở file `tests/reports/html-report/index.html` để xem report.

### Chạy tests cho một file cụ thể

```bash
cd tests
npx playwright test e2e/dashboard.spec.ts
```

### Chạy tests trong một browser cụ thể

```bash
cd tests
npx playwright test --project=chromium
```

## Test Reports

Sau khi chạy tests, reports sẽ được tạo trong:
- **HTML Report**: `tests/reports/html-report/index.html`
- **JSON Report**: `tests/reports/test-results.json`
- **JUnit Report**: `tests/reports/junit.xml`

## Test Configuration

Cấu hình Playwright được định nghĩa trong `tests/playwright.config.ts`:
- Base URL: `http://localhost:9000`
- Test directory: `./e2e`
- Reporters: HTML, JSON, JUnit
- Browsers: Chromium, Firefox, WebKit
- Screenshots: on failure
- Videos: on failure
- Traces: on first retry

## Notes

- Tất cả tests sử dụng Page Object Model pattern
- Tests được thiết kế để chạy độc lập
- Tests có retry logic cho flaky tests
- Tests có thể chạy parallel
- Tests có thể chạy trong CI/CD pipeline

## Tổng kết

- **Tổng số test files**: 11 files
- **Tổng số test cases**: ~100+ test cases
- **Coverage**: 
  - ✅ Dashboard
  - ✅ Menu (Categories & Products)
  - ✅ Orders
  - ✅ Tables
  - ✅ Areas
  - ✅ Employees
  - ✅ Inventory
  - ✅ Navigation
  - ✅ Reports
  - ✅ Settings

Tất cả các tính năng chính của hệ thống đã được cover với E2E tests.

