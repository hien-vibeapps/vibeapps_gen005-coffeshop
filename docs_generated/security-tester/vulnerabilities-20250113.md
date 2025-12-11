# Security Vulnerabilities List - Coffee Shop Management System

**Date:** 2025-01-13  
**Total Vulnerabilities:** 18  
**Critical:** 5  
**High:** 6  
**Medium:** 4  
**Low:** 3

---

## Critical Severity Vulnerabilities

### VULN-018: SQL Query Builder Bug in Order Statistics Endpoint
- **Severity:** 🔴 CRITICAL
- **CVSS Score:** 9.1 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Location:** `services/coffee-shop-api/src/presentation/modules/order/order.service.ts:270-273`
- **Description:** Critical bug in `getStatistics()` method where `.where()` call overwrites previous `andWhere()` conditions, causing SQL query errors and 500 Internal Server Error.
- **Vulnerable Code:**
```typescript
const todayQuery = this.orderRepository.createQueryBuilder('order');
if (shopId) {
  todayQuery.where('order.shop_id = :shopId', { shopId });
}
todayQuery.andWhere('order.created_at >= :today', { today });
todayQuery.andWhere('order.created_at < :tomorrow', { tomorrow });

const totalOrdersToday = await todayQuery.getCount();

// BUG: .where() overwrites all previous andWhere() conditions!
const todayRevenueResult = await todayQuery
  .select('SUM(order.total_amount)', 'total')
  .where('order.status = :status', { status: 'paid' })  // ❌ This overwrites date filters!
  .getRawOne();
```
- **Impact:**
  - **500 Internal Server Error** when calling `/api/v1/orders/statistics`
  - Incorrect revenue calculations (if query doesn't fail)
  - Service unavailability
  - Poor user experience
  - Potential data inconsistency
- **Root Cause:**
  - TypeORM's `.where()` method replaces all existing WHERE conditions
  - Should use `.andWhere()` to add additional conditions
  - No error handling in service method
  - No try-catch blocks to handle exceptions gracefully
- **Proof of Concept:**
```bash
# This endpoint returns 500 Internal Server Error
curl http://localhost:9001/api/v1/orders/statistics

# Response:
# HTTP/1.1 500 Internal Server Error
# {
#   "success": false,
#   "message": "Internal server error"
# }
```
- **Remediation:**
```typescript
async getStatistics(shopId?: string): Promise<any> {
  try {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    if (shopId) {
      queryBuilder.where('order.shop_id = :shopId', { shopId });
    }

    // Status distribution
    const statusDistribution = await queryBuilder
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    // Type distribution
    const typeDistribution = await queryBuilder
      .select('order.order_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.order_type')
      .getRawMany();

    // Today's statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total orders today
    const todayQuery = this.orderRepository.createQueryBuilder('order');
    if (shopId) {
      todayQuery.where('order.shop_id = :shopId', { shopId });
    }
    todayQuery.andWhere('order.created_at >= :today', { today });
    todayQuery.andWhere('order.created_at < :tomorrow', { tomorrow });

    const totalOrdersToday = await todayQuery.getCount();

    // FIX: Use andWhere() instead of where() to preserve date filters
    const todayRevenueQuery = this.orderRepository.createQueryBuilder('order');
    if (shopId) {
      todayRevenueQuery.where('order.shop_id = :shopId', { shopId });
    }
    todayRevenueQuery.andWhere('order.created_at >= :today', { today });
    todayRevenueQuery.andWhere('order.created_at < :tomorrow', { tomorrow });
    todayRevenueQuery.andWhere('order.status = :status', { status: 'paid' }); // ✅ Use andWhere()

    const todayRevenueResult = await todayRevenueQuery
      .select('SUM(order.total_amount)', 'total')
      .getRawOne();

    const totalRevenueToday = parseFloat(todayRevenueResult?.total || '0');

    // Pending orders
    const pendingOrdersQuery = this.orderRepository.createQueryBuilder('order');
    if (shopId) {
      pendingOrdersQuery.where('order.shop_id = :shopId', { shopId });
    }
    pendingOrdersQuery.andWhere('order.status = :status', { status: 'pending' });
    const pendingOrders = await pendingOrdersQuery.getCount();

    // Orders awaiting payment
    const ordersAwaitingPaymentQuery = this.orderRepository.createQueryBuilder('order');
    if (shopId) {
      ordersAwaitingPaymentQuery.where('order.shop_id = :shopId', { shopId });
    }
    ordersAwaitingPaymentQuery.andWhere('order.status = :status', { status: 'served' });
    const ordersAwaitingPayment = await ordersAwaitingPaymentQuery.getCount();

    return {
      statusDistribution: statusDistribution.map((item) => ({
        status: item.status,
        count: parseInt(item.count, 10),
      })),
      typeDistribution: typeDistribution.map((item) => ({
        type: item.type,
        count: parseInt(item.count, 10),
      })),
      totalOrdersToday,
      totalRevenueToday,
      pendingOrders,
      ordersAwaitingPayment,
    };
  } catch (error) {
    // Log error for debugging
    console.error('Error in getStatistics:', error);
    // Re-throw with more context
    throw new Error(`Failed to get order statistics: ${error.message}`);
  }
}
```
- **Additional Recommendations:**
  1. Add comprehensive error handling to all service methods
  2. Add input validation for `shopId` parameter
  3. Add unit tests for `getStatistics()` method
  4. Add integration tests for `/orders/statistics` endpoint
  5. Consider using transactions for complex queries
  6. Add logging for debugging production issues
- **Priority:** P0 - Immediate

---

## Automation Testing Gap Analysis

### Issue: Automation Tester Did Not Detect This Bug

**Why automation-tester did not detect this vulnerability:**

1. **No Test Coverage for Statistics Endpoint:**
   - ❌ No test cases in `tests/e2e/orders.spec.ts` for statistics section
   - ❌ No test cases in `tests/e2e/orders-crud.spec.ts` for statistics
   - ✅ Other modules (Areas, Employees, Inventory) have statistics tests, but Orders does not

2. **UI-Focused Testing:**
   - Automation-tester only tests UI elements and user interactions
   - Does not verify API responses or error handling
   - Does not check for HTTP 500 errors

3. **Frontend Error Handling:**
   - Frontend uses React Query with error handling
   - When API returns 500, `orderStats` becomes `undefined`
   - Page still renders successfully (just without statistics)
   - Test would pass even if API fails

4. **Missing API-Level Tests:**
   - No API integration tests
   - No tests that verify API responses
   - No tests that check for error responses

**Recommendations for Automation Tester:**

1. **Add Statistics Section Tests:**
```typescript
// tests/e2e/orders.spec.ts
test.describe('Statistics Section', () => {
  test('should display statistics section', async ({ page }) => {
    await ordersPage.goto()
    await ordersPage.waitForPageLoad()
    
    // Wait for statistics to load
    await page.waitForSelector('text=Thống kê Đơn hàng', { timeout: 5000 })
    await expect(page.locator('text=Thống kê Đơn hàng')).toBeVisible()
  })

  test('should display statistics metrics', async ({ page }) => {
    await ordersPage.goto()
    await ordersPage.waitForPageLoad()
    
    // Wait for statistics to load
    await page.waitForTimeout(2000)
    
    // Check for statistics metrics
    const hasMetrics = await page.locator('text=Tổng số đơn hôm nay').isVisible().catch(() => false) ||
                      await page.locator('text=Tổng doanh thu hôm nay').isVisible().catch(() => false)
    expect(hasMetrics).toBeTruthy()
  })

  test('should handle statistics API error gracefully', async ({ page }) => {
    // Intercept API call and return 500 error
    await page.route('**/api/v1/orders/statistics', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Internal server error' })
      })
    })

    await ordersPage.goto()
    await ordersPage.waitForPageLoad()
    
    // Page should still render without crashing
    await expect(ordersPage.title).toBeVisible()
    await expect(ordersPage.ordersTable).toBeVisible()
  })
})
```

2. **Add API Integration Tests:**
   - Create separate API test suite
   - Test all endpoints directly
   - Verify response status codes
   - Verify response data structure
   - Test error handling

3. **Add Network Monitoring:**
   - Monitor network requests in tests
   - Verify API calls succeed
   - Check for 4xx/5xx errors
   - Log failed API calls

---

## Summary

### New Vulnerability Added
- **VULN-018:** SQL Query Builder Bug in Order Statistics Endpoint (Critical)

### Testing Gaps Identified
- Missing test coverage for Orders statistics section
- No API-level error testing
- Frontend error handling masks API failures

### Remediation Priority
- **P0 (Immediate):** Fix SQL query bug in `order.service.ts`
- **P1 (High):** Add test coverage for statistics endpoints
- **P2 (Medium):** Add API integration tests
- **P3 (Low):** Improve error handling and logging

---

**Report Generated:** 2025-01-13  
**Related Issue:** HTTP 500 error on `GET /api/v1/orders/statistics`  
**Next Review:** After fix implementation

