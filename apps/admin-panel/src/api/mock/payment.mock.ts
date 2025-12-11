/**
 * Mock Payment Service
 * CHỈ dùng cho external payment gateways (Stripe, PayPal, VNPay, MOMO, etc.)
 * KHÔNG dùng cho internal payment data - internal payment data phải lấy từ backend API
 */

export interface PaymentGatewayResponse {
  transactionId: string
  status: 'success' | 'failed' | 'pending'
  amount: number
  currency: string
  paymentMethod: string
  timestamp: string
  errorMessage?: string
}

export interface PaymentGatewayRequest {
  amount: number
  currency: string
  paymentMethod: 'stripe' | 'paypal' | 'vnpay' | 'momo' | 'zalopay'
  orderId: string
  customerInfo?: {
    name?: string
    email?: string
    phone?: string
  }
  returnUrl?: string
}

// Mock Stripe Payment
export const mockStripePayment = async (request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate success/failure (90% success rate)
  const isSuccess = Math.random() > 0.1

  if (isSuccess) {
    return {
      transactionId: `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'success',
      amount: request.amount,
      currency: request.currency,
      paymentMethod: 'stripe',
      timestamp: new Date().toISOString(),
    }
  } else {
    return {
      transactionId: '',
      status: 'failed',
      amount: request.amount,
      currency: request.currency,
      paymentMethod: 'stripe',
      timestamp: new Date().toISOString(),
      errorMessage: 'Payment failed. Please try again.',
    }
  }
}

// Mock PayPal Payment
export const mockPayPalPayment = async (request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const isSuccess = Math.random() > 0.1

  if (isSuccess) {
    return {
      transactionId: `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'success',
      amount: request.amount,
      currency: request.currency,
      paymentMethod: 'paypal',
      timestamp: new Date().toISOString(),
    }
  } else {
    return {
      transactionId: '',
      status: 'failed',
      amount: request.amount,
      currency: request.currency,
      paymentMethod: 'paypal',
      timestamp: new Date().toISOString(),
      errorMessage: 'PayPal payment failed.',
    }
  }
}

// Mock VNPay Payment
export const mockVNPayPayment = async (request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const isSuccess = Math.random() > 0.1

  if (isSuccess) {
    return {
      transactionId: `vnpay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'success',
      amount: request.amount,
      currency: request.currency,
      paymentMethod: 'vnpay',
      timestamp: new Date().toISOString(),
    }
  } else {
    return {
      transactionId: '',
      status: 'failed',
      amount: request.amount,
      currency: request.currency,
      paymentMethod: 'vnpay',
      timestamp: new Date().toISOString(),
      errorMessage: 'VNPay payment failed.',
    }
  }
}

// Mock MOMO Payment
export const mockMomoPayment = async (request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 900))

  const isSuccess = Math.random() > 0.1

  if (isSuccess) {
    return {
      transactionId: `momo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'success',
      amount: request.amount,
      currency: request.currency,
      paymentMethod: 'momo',
      timestamp: new Date().toISOString(),
    }
  } else {
    return {
      transactionId: '',
      status: 'failed',
      amount: request.amount,
      currency: request.currency,
      paymentMethod: 'momo',
      timestamp: new Date().toISOString(),
      errorMessage: 'MOMO payment failed.',
    }
  }
}

// Mock ZaloPay Payment
export const mockZaloPayPayment = async (request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 850))

  const isSuccess = Math.random() > 0.1

  if (isSuccess) {
    return {
      transactionId: `zalopay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'success',
      amount: request.amount,
      currency: request.currency,
      paymentMethod: 'zalopay',
      timestamp: new Date().toISOString(),
    }
  } else {
    return {
      transactionId: '',
      status: 'failed',
      amount: request.amount,
      currency: request.currency,
      paymentMethod: 'zalopay',
      timestamp: new Date().toISOString(),
      errorMessage: 'ZaloPay payment failed.',
    }
  }
}

// Main payment gateway function
export const processPayment = async (request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> => {
  switch (request.paymentMethod) {
    case 'stripe':
      return mockStripePayment(request)
    case 'paypal':
      return mockPayPalPayment(request)
    case 'vnpay':
      return mockVNPayPayment(request)
    case 'momo':
      return mockMomoPayment(request)
    case 'zalopay':
      return mockZaloPayPayment(request)
    default:
      throw new Error(`Unsupported payment method: ${request.paymentMethod}`)
  }
}

