// Base types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

// Shop types
export interface Shop {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  logo_url?: string
  opening_time?: string
  closing_time?: string
  description?: string
  website?: string
  facebook?: string
  instagram?: string
  currency: string
  timezone: string
  vat_rate: number
  service_fee_rate: number
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface UpdateShopRequest {
  name?: string
  address?: string
  phone?: string
  email?: string
  logo_url?: string
  opening_time?: string
  closing_time?: string
  description?: string
  website?: string
  facebook?: string
  instagram?: string
  currency?: string
  timezone?: string
  vat_rate?: number
  service_fee_rate?: number
  is_active?: boolean
}

// Category types
export interface Category {
  id: string
  shop_id: string
  name: string
  description?: string
  image_url?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface CreateCategoryRequest {
  shop_id: string
  name: string
  description?: string
  image_url?: string
  display_order?: number
  is_active?: boolean
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  image_url?: string
  display_order?: number
  is_active?: boolean
}

// Product types
export interface Product {
  id: string
  shop_id: string
  category_id: string
  name: string
  description?: string
  price: number
  estimated_prep_time: number
  status: 'available' | 'out_of_stock' | 'suspended'
  calories?: number
  allergen_info?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
  category?: Category
  images?: ProductImage[]
  option_groups?: ProductOptionGroup[]
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  display_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductOptionGroup {
  id: string
  product_id: string
  name: string
  is_required: boolean
  max_selections: number
  display_order: number
  created_at: string
  options?: ProductOption[]
}

export interface ProductOption {
  id: string
  option_group_id: string
  name: string
  price_adjustment: number
  display_order: number
  is_active: boolean
  created_at: string
}

export interface CreateProductRequest {
  shop_id: string
  category_id: string
  name: string
  description?: string
  price: number
  estimated_prep_time?: number
  status?: 'available' | 'out_of_stock' | 'suspended'
  calories?: number
  allergen_info?: string
  display_order?: number
  is_active?: boolean
}

export interface UpdateProductRequest {
  category_id?: string
  name?: string
  description?: string
  price?: number
  estimated_prep_time?: number
  status?: 'available' | 'out_of_stock' | 'suspended'
  calories?: number
  allergen_info?: string
  display_order?: number
  is_active?: boolean
}

// Area types
export interface Area {
  id: string
  shop_id: string
  name: string
  description?: string
  floor_plan_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface CreateAreaRequest {
  shop_id: string
  name: string
  description?: string
  floor_plan_url?: string
  is_active?: boolean
}

export interface UpdateAreaRequest {
  name?: string
  description?: string
  floor_plan_url?: string
  is_active?: boolean
}

// Table types
export interface Table {
  id: string
  area_id: string
  table_number: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  notes?: string
  position_x?: number
  position_y?: number
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
  area?: Area
}

export interface CreateTableRequest {
  area_id: string
  table_number: string
  capacity?: number
  status?: 'available' | 'occupied' | 'reserved' | 'maintenance'
  notes?: string
  position_x?: number
  position_y?: number
  is_active?: boolean
}

export interface UpdateTableRequest {
  area_id?: string
  table_number?: string
  capacity?: number
  status?: 'available' | 'occupied' | 'reserved' | 'maintenance'
  notes?: string
  position_x?: number
  position_y?: number
  is_active?: boolean
}

// Table Reservation types
export interface TableReservation {
  id: string
  shop_id: string
  table_id?: string
  customer_name: string
  customer_phone: string
  reservation_time: string
  number_of_guests: number
  notes?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_by?: string
  created_at: string
  updated_at: string
  cancelled_at?: string
  cancelled_reason?: string
  table?: Table
}

export interface CreateTableReservationRequest {
  shop_id: string
  table_id?: string
  customer_name: string
  customer_phone: string
  reservation_time: string
  number_of_guests: number
  notes?: string
}

export interface UpdateTableReservationRequest {
  table_id?: string
  customer_name?: string
  customer_phone?: string
  reservation_time?: string
  number_of_guests?: number
  notes?: string
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
}

// Employee types
export interface Employee {
  id: string
  shop_id: string
  email: string
  phone: string
  full_name: string
  role: 'owner' | 'manager' | 'shift_manager' | 'waiter' | 'cashier' | 'barista'
  avatar_url?: string
  start_date?: string
  is_active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface CreateEmployeeRequest {
  shop_id: string
  email: string
  phone: string
  full_name: string
  role: 'owner' | 'manager' | 'shift_manager' | 'waiter' | 'cashier' | 'barista'
  avatar_url?: string
  start_date?: string
  is_active?: boolean
}

export interface UpdateEmployeeRequest {
  email?: string
  phone?: string
  full_name?: string
  role?: 'owner' | 'manager' | 'shift_manager' | 'waiter' | 'cashier' | 'barista'
  avatar_url?: string
  start_date?: string
  is_active?: boolean
}

export interface EmployeePermission {
  id: string
  employee_id: string
  permission_code: string
  is_granted: boolean
  created_at: string
  updated_at: string
}

// Order types
export interface Order {
  id: string
  shop_id: string
  order_number: string
  table_id?: string
  order_type: 'dine_in' | 'takeaway' | 'delivery'
  customer_name?: string
  customer_phone?: string
  delivery_address?: string
  delivery_fee: number
  subtotal: number
  vat_amount: number
  service_fee: number
  total_amount: number
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled'
  notes?: string
  created_by?: string
  served_by?: string
  cancelled_by?: string
  cancelled_reason?: string
  created_at: string
  updated_at: string
  paid_at?: string
  cancelled_at?: string
  table?: Table
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  unit_price: number
  subtotal: number
  selected_options?: Record<string, any>
  notes?: string
  status: 'pending' | 'preparing' | 'ready' | 'served'
  created_at: string
  updated_at: string
  product?: Product
}

export interface CreateOrderRequest {
  shop_id: string
  table_id?: string
  order_type: 'dine_in' | 'takeaway' | 'delivery'
  customer_name?: string
  customer_phone?: string
  delivery_address?: string
  delivery_fee?: number
  notes?: string
  items: CreateOrderItemRequest[]
}

export interface CreateOrderItemRequest {
  product_id: string
  quantity: number
  selected_options?: Record<string, any>
  notes?: string
}

export interface UpdateOrderRequest {
  table_id?: string
  order_type?: 'dine_in' | 'takeaway' | 'delivery'
  customer_name?: string
  customer_phone?: string
  delivery_address?: string
  delivery_fee?: number
  notes?: string
  status?: 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled'
  cancelled_reason?: string
}

// Payment types
export interface Payment {
  id: string
  order_id: string
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'e_wallet'
  amount: number
  received_amount?: number
  change_amount?: number
  transaction_id?: string
  receipt_number: string
  notes?: string
  processed_by: string
  processed_at: string
  created_at: string
  order?: Order
}

export interface CreatePaymentRequest {
  order_id: string
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'e_wallet'
  amount: number
  received_amount?: number
  transaction_id?: string
  notes?: string
}

// Ingredient types
export interface Ingredient {
  id: string
  shop_id: string
  name: string
  unit: string
  current_stock: number
  min_stock_level: number
  unit_price: number
  supplier?: string
  expiry_tracking: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface CreateIngredientRequest {
  shop_id: string
  name: string
  unit: string
  current_stock?: number
  min_stock_level?: number
  unit_price?: number
  supplier?: string
  expiry_tracking?: boolean
  is_active?: boolean
}

export interface UpdateIngredientRequest {
  name?: string
  unit?: string
  current_stock?: number
  min_stock_level?: number
  unit_price?: number
  supplier?: string
  expiry_tracking?: boolean
  is_active?: boolean
}

// Inventory Transaction types
export interface InventoryTransaction {
  id: string
  shop_id: string
  ingredient_id: string
  transaction_type: 'in' | 'out' | 'auto_deduct'
  quantity: number
  unit_price?: number
  total_amount?: number
  reason?: string
  reference_id?: string
  reference_type?: string
  expiry_date?: string
  notes?: string
  created_by?: string
  created_at: string
  ingredient?: Ingredient
}

export interface CreateInventoryTransactionRequest {
  shop_id: string
  ingredient_id: string
  transaction_type: 'in' | 'out' | 'auto_deduct'
  quantity: number
  unit_price?: number
  reason?: string
  reference_id?: string
  reference_type?: string
  expiry_date?: string
  notes?: string
}

// Report types
export interface RevenueReport {
  period: string
  total_revenue: number
  total_orders: number
  average_order_value: number
  revenue_by_payment_method: Record<string, number>
  revenue_by_category: Record<string, number>
  daily_revenue?: Array<{
    date: string
    revenue: number
    orders: number
  }>
}

export interface SalesReport {
  period: string
  top_products: Array<{
    product_id: string
    product_name: string
    quantity_sold: number
    revenue: number
  }>
  sales_by_category: Record<string, number>
  sales_trend: Array<{
    date: string
    sales: number
  }>
}

export interface InventoryReport {
  total_ingredients: number
  low_stock_items: Ingredient[]
  total_inventory_value: number
  inventory_by_category: Record<string, number>
}

// Query params
export interface ListQueryParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface OrderListQueryParams extends ListQueryParams {
  status?: string
  order_type?: string
  table_id?: string
  created_by?: string
  start_date?: string
  end_date?: string
}

export interface ProductListQueryParams extends ListQueryParams {
  category_id?: string
  status?: string
  is_active?: boolean
}

// Statistics types
export interface CategoryStatistics {
  statusDistribution: Array<{ status: string; count: number }>
  productCountDistribution: Array<{ range: string; count: number }>
  totalCategories: number
  activeCategories: number
  categoriesWithProducts: number
}

export interface ProductStatistics {
  statusDistribution: Array<{ status: string; count: number }>
  categoryDistribution: Array<{ category: string; count: number }>
  totalProducts: number
  availableProducts: number
  outOfStockProducts: number
  suspendedProducts: number
}

export interface AreaStatistics {
  statusDistribution: Array<{ status: string; count: number }>
  tableCountDistribution: Array<{ range: string; count: number }>
  totalAreas: number
  activeAreas: number
  totalTables: number
}

export interface TableStatistics {
  statusDistribution: Array<{ status: string; count: number }>
  areaDistribution: Array<{ area: string; count: number }>
  totalTables: number
  availableTables: number
  occupiedTables: number
  reservedTables: number
  maintenanceTables: number
}

export interface EmployeeStatistics {
  statusDistribution: Array<{ status: string; count: number }>
  roleDistribution: Array<{ role: string; count: number }>
  totalEmployees: number
  activeEmployees: number
  newEmployeesThisMonth: number
}

export interface OrderStatistics {
  statusDistribution: Array<{ status: string; count: number }>
  typeDistribution: Array<{ type: string; count: number }>
  totalOrdersToday: number
  totalRevenueToday: number
  pendingOrders: number
  ordersAwaitingPayment: number
}

export interface PaymentStatistics {
  methodDistribution: Array<{ method: string; count: number }>
  statusDistribution: Array<{ status: string; count: number }>
  totalTransactionsToday: number
  totalAmountToday: number
}

export interface IngredientStatistics {
  stockStatusDistribution: Array<{ status: string; count: number }>
  unitDistribution: Array<{ unit: string; count: number }>
  totalIngredients: number
  sufficientStock: number
  lowStock: number
  outOfStock: number
  totalInventoryValue: number
}

export interface InventoryTransactionStatistics {
  typeDistribution: Array<{ type: string; count: number }>
  reasonDistribution: Array<{ reason: string; count: number }>
  totalTransactionsThisMonth: number
  totalInValueThisMonth: number
  totalOutValueThisMonth: number
}

