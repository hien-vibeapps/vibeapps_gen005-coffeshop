import { test, expect } from '@playwright/test'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9001/api/v1'

test.describe('Orders API', () => {
  test.describe('GET /orders/statistics', () => {
    test('should return 200 with statistics data', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/orders/statistics`)
      
      expect(response.status()).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('success')
      expect(data.success).toBe(true)
      expect(data).toHaveProperty('data')
      
      const statistics = data.data
      expect(statistics).toHaveProperty('statusDistribution')
      expect(statistics).toHaveProperty('typeDistribution')
      expect(statistics).toHaveProperty('totalOrdersToday')
      expect(statistics).toHaveProperty('totalRevenueToday')
      expect(statistics).toHaveProperty('pendingOrders')
      expect(statistics).toHaveProperty('ordersAwaitingPayment')
    })

    test('should return valid statistics data structure', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/orders/statistics`)
      
      expect(response.status()).toBe(200)
      
      const data = await response.json()
      const statistics = data.data
      
      // Verify statusDistribution structure
      expect(Array.isArray(statistics.statusDistribution)).toBe(true)
      if (statistics.statusDistribution.length > 0) {
        const statusItem = statistics.statusDistribution[0]
        expect(statusItem).toHaveProperty('status')
        expect(statusItem).toHaveProperty('count')
        expect(typeof statusItem.count).toBe('number')
      }
      
      // Verify typeDistribution structure
      expect(Array.isArray(statistics.typeDistribution)).toBe(true)
      if (statistics.typeDistribution.length > 0) {
        const typeItem = statistics.typeDistribution[0]
        expect(typeItem).toHaveProperty('type')
        expect(typeItem).toHaveProperty('count')
        expect(typeof typeItem.count).toBe('number')
      }
      
      // Verify numeric fields
      expect(typeof statistics.totalOrdersToday).toBe('number')
      expect(typeof statistics.totalRevenueToday).toBe('number')
      expect(typeof statistics.pendingOrders).toBe('number')
      expect(typeof statistics.ordersAwaitingPayment).toBe('number')
      
      // Verify non-negative values
      expect(statistics.totalOrdersToday).toBeGreaterThanOrEqual(0)
      expect(statistics.totalRevenueToday).toBeGreaterThanOrEqual(0)
      expect(statistics.pendingOrders).toBeGreaterThanOrEqual(0)
      expect(statistics.ordersAwaitingPayment).toBeGreaterThanOrEqual(0)
    })

    test('should accept shop_id query parameter', async ({ request }) => {
      // Test with shop_id parameter
      const response = await request.get(`${API_BASE_URL}/orders/statistics?shop_id=test-shop-id`)
      
      // Should return 200 (even if shop doesn't exist, should return empty stats)
      expect([200, 400, 404]).toContain(response.status())
      
      if (response.status() === 200) {
        const data = await response.json()
        expect(data.success).toBe(true)
        expect(data.data).toBeDefined()
      }
    })

    test('should handle errors gracefully (not return 500)', async ({ request }) => {
      // Test that endpoint doesn't crash with invalid data
      const response = await request.get(`${API_BASE_URL}/orders/statistics`)
      
      // Should NOT return 500 Internal Server Error
      expect(response.status()).not.toBe(500)
      
      // Should return either 200 (success) or proper error code (400, 401, etc.)
      expect([200, 400, 401, 403, 404]).toContain(response.status())
    })

    test('should return consistent response format', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/orders/statistics`)
      
      expect(response.status()).toBe(200)
      
      const data = await response.json()
      
      // Verify API response format
      expect(data).toHaveProperty('success')
      expect(data).toHaveProperty('data')
      expect(data).toHaveProperty('message')
      
      // Verify data is object (not null or undefined)
      expect(data.data).toBeDefined()
      expect(typeof data.data).toBe('object')
    })
  })

  test.describe('GET /orders', () => {
    test('should return 200 with orders list', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/orders`)
      
      expect(response.status()).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('success')
      expect(data.success).toBe(true)
      expect(data).toHaveProperty('data')
    })

    test('should support pagination parameters', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/orders?page=1&limit=10`)
      
      expect(response.status()).toBe(200)
      
      const data = await response.json()
      expect(data.success).toBe(true)
    })
  })

  test.describe('API Error Handling', () => {
    test('should return proper error format for invalid endpoints', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/orders/invalid-endpoint`)
      
      // Should return 404 or proper error
      expect([404, 400]).toContain(response.status())
      
      if (response.status() !== 404) {
        const data = await response.json()
        expect(data).toHaveProperty('success')
        expect(data.success).toBe(false)
      }
    })
  })
})

