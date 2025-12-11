# Database Schema - Coffee Shop Management

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Author:** Database Engineer Team  
**Status:** Completed

---

## 📋 Tổng Quan

Schema database cho module **Coffee Shop Management** được thiết kế theo chuẩn **3NF (Third Normal Form)** với **18 entities** chính.

### Database Information
- **Database Type:** PostgreSQL 15+
- **Naming Convention:** `snake_case` cho tables và columns
- **Primary Keys:** UUID (gen_random_uuid())
- **Soft Delete:** Sử dụng `deleted_at` timestamp
- **Audit Fields:** `created_at`, `updated_at`, `created_by`, `updated_by`

---

## 📊 Tables Overview

| # | Table Name | Description | Records Est. |
|---|------------|-------------|--------------|
| 1 | `shop` | Thông tin quán | 1-10 |
| 2 | `category` | Danh mục sản phẩm | 10-50 |
| 3 | `product` | Sản phẩm trong menu | 50-500 |
| 4 | `product_image` | Ảnh sản phẩm | 100-2000 |
| 5 | `product_option_group` | Nhóm tùy chọn sản phẩm | 50-500 |
| 6 | `product_option` | Tùy chọn sản phẩm | 100-2000 |
| 7 | `area` | Khu vực trong quán | 5-20 |
| 8 | `table` | Bàn trong quán | 10-100 |
| 9 | `table_reservation` | Đặt bàn trước | 100-1000/day |
| 10 | `employee` | Nhân viên | 5-50 |
| 11 | `employee_permission` | Phân quyền nhân viên | 50-500 |
| 12 | `order` | Đơn hàng | 1000-10000/month |
| 13 | `order_item` | Chi tiết đơn hàng | 5000-50000/month |
| 14 | `payment` | Thanh toán | 1000-10000/month |
| 15 | `ingredient` | Nguyên liệu | 50-200 |
| 16 | `product_ingredient` | Công thức sản phẩm | 100-1000 |
| 17 | `inventory_transaction` | Giao dịch kho | 500-5000/month |
| 18 | `audit_log` | Nhật ký kiểm toán | 10000-100000/month |

---

## 📝 Chi tiết Tables

### 1. shop

**Mô tả:** Thông tin cơ bản của quán cà phê

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Tên quán |
| address | TEXT | | Địa chỉ |
| phone | VARCHAR(20) | | Số điện thoại |
| email | VARCHAR(255) | UNIQUE | Email |
| logo_url | VARCHAR(500) | | URL logo |
| opening_time | TIME | | Giờ mở cửa |
| closing_time | TIME | | Giờ đóng cửa |
| description | TEXT | | Mô tả quán |
| website | VARCHAR(255) | | Website |
| facebook | VARCHAR(255) | | Facebook page |
| instagram | VARCHAR(255) | | Instagram |
| currency | VARCHAR(10) | DEFAULT 'VND' | Đơn vị tiền tệ |
| timezone | VARCHAR(50) | DEFAULT 'Asia/Ho_Chi_Minh' | Múi giờ |
| vat_rate | DECIMAL(5,2) | DEFAULT 10.00 | Tỷ lệ VAT (%) |
| service_fee_rate | DECIMAL(5,2) | DEFAULT 0.00 | Tỷ lệ phí dịch vụ (%) |
| is_active | BOOLEAN | DEFAULT true | Trạng thái hoạt động |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE (name)
- UNIQUE (email)
- INDEX (is_active)

**Constraints:**
- CHECK (closing_time > opening_time)
- CHECK (vat_rate >= 0 AND vat_rate <= 100)
- CHECK (service_fee_rate >= 0 AND service_fee_rate <= 100)

---

### 2. category

**Mô tả:** Danh mục sản phẩm (Đồ uống, Đồ ăn, Bánh ngọt, etc.)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| shop_id | UUID | FK → shop.id, NOT NULL | Quán |
| name | VARCHAR(50) | NOT NULL | Tên danh mục |
| description | TEXT | | Mô tả |
| image_url | VARCHAR(500) | | Ảnh danh mục |
| display_order | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES shop(id)
- UNIQUE (shop_id, name)
- INDEX (shop_id, is_active, display_order)

---

### 3. product

**Mô tả:** Sản phẩm trong menu

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| shop_id | UUID | FK → shop.id, NOT NULL | Quán |
| category_id | UUID | FK → category.id, NOT NULL | Danh mục |
| name | VARCHAR(100) | NOT NULL | Tên sản phẩm |
| description | TEXT | | Mô tả |
| price | DECIMAL(10,2) | NOT NULL | Giá bán |
| estimated_prep_time | INTEGER | DEFAULT 0 | Thời gian chế biến (phút) |
| status | VARCHAR(20) | DEFAULT 'available' | Trạng thái |
| calories | INTEGER | | Calorie |
| allergen_info | TEXT | | Thông tin dị ứng |
| display_order | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES shop(id)
- FOREIGN KEY (category_id) REFERENCES category(id)
- UNIQUE (shop_id, category_id, name)
- INDEX (shop_id, category_id, is_active, status)
- INDEX (shop_id, display_order)

**Constraints:**
- CHECK (price > 0)
- CHECK (estimated_prep_time >= 0 AND estimated_prep_time <= 120)
- CHECK (status IN ('available', 'out_of_stock', 'suspended'))

---

### 4. product_image

**Mô tả:** Ảnh của sản phẩm (một sản phẩm có nhiều ảnh)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| product_id | UUID | FK → product.id, NOT NULL | Sản phẩm |
| image_url | VARCHAR(500) | NOT NULL | URL ảnh |
| display_order | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| is_primary | BOOLEAN | DEFAULT false | Ảnh chính |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
- INDEX (product_id, display_order)

**Constraints:**
- CHECK (display_order >= 0)

---

### 5. product_option_group

**Mô tả:** Nhóm tùy chọn cho sản phẩm (Size, Topping, Milk type, etc.)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| product_id | UUID | FK → product.id, NOT NULL | Sản phẩm |
| name | VARCHAR(50) | NOT NULL | Tên nhóm |
| is_required | BOOLEAN | DEFAULT false | Bắt buộc chọn |
| max_selections | INTEGER | DEFAULT 1 | Số lượng tối đa |
| display_order | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
- INDEX (product_id, display_order)

**Constraints:**
- CHECK (max_selections >= 1)

---

### 6. product_option

**Mô tả:** Các tùy chọn trong nhóm (Small, Medium, Large, etc.)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| option_group_id | UUID | FK → product_option_group.id, NOT NULL | Nhóm tùy chọn |
| name | VARCHAR(50) | NOT NULL | Tên tùy chọn |
| price_adjustment | DECIMAL(10,2) | DEFAULT 0.00 | Giá bổ sung |
| display_order | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (option_group_id) REFERENCES product_option_group(id) ON DELETE CASCADE
- UNIQUE (option_group_id, name)
- INDEX (option_group_id, display_order)

**Constraints:**
- CHECK (price_adjustment >= -9999999.99 AND price_adjustment <= 9999999.99)

---

### 7. area

**Mô tả:** Khu vực trong quán (Tầng 1, Tầng 2, Sân vườn, etc.)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| shop_id | UUID | FK → shop.id, NOT NULL | Quán |
| name | VARCHAR(50) | NOT NULL | Tên khu vực |
| description | TEXT | | Mô tả |
| floor_plan_url | VARCHAR(500) | | Sơ đồ khu vực |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES shop(id)
- UNIQUE (shop_id, name)
- INDEX (shop_id, is_active)

---

### 8. table

**Mô tả:** Bàn trong quán

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| area_id | UUID | FK → area.id, NOT NULL | Khu vực |
| table_number | VARCHAR(20) | NOT NULL | Số bàn/Tên bàn |
| capacity | INTEGER | DEFAULT 4 | Số chỗ ngồi |
| status | VARCHAR(20) | DEFAULT 'available' | Trạng thái |
| notes | TEXT | | Ghi chú |
| position_x | DECIMAL(10,2) | | Vị trí X trong sơ đồ |
| position_y | DECIMAL(10,2) | | Vị trí Y trong sơ đồ |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (area_id) REFERENCES area(id)
- UNIQUE (area_id, table_number)
- INDEX (area_id, status, is_active)

**Constraints:**
- CHECK (capacity > 0 AND capacity <= 50)
- CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance'))

---

### 9. table_reservation

**Mô tả:** Đặt bàn trước

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| shop_id | UUID | FK → shop.id, NOT NULL | Quán |
| table_id | UUID | FK → table.id | Bàn (có thể null) |
| customer_name | VARCHAR(100) | NOT NULL | Tên khách hàng |
| customer_phone | VARCHAR(20) | NOT NULL | Số điện thoại |
| reservation_time | TIMESTAMP | NOT NULL | Thời gian đặt |
| number_of_guests | INTEGER | NOT NULL | Số lượng người |
| notes | TEXT | | Ghi chú |
| status | VARCHAR(20) | DEFAULT 'pending' | Trạng thái |
| created_by | UUID | FK → employee.id | Người tạo |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| cancelled_at | TIMESTAMP | NULL | Thời gian hủy |
| cancelled_reason | TEXT | | Lý do hủy |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES shop(id)
- FOREIGN KEY (table_id) REFERENCES table(id)
- FOREIGN KEY (created_by) REFERENCES employee(id)
- INDEX (shop_id, reservation_time, status)
- INDEX (table_id, reservation_time, status)

**Constraints:**
- CHECK (number_of_guests > 0 AND number_of_guests <= 50)
- CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))

---

### 10. employee

**Mô tả:** Nhân viên

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| shop_id | UUID | FK → shop.id, NOT NULL | Quán |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email |
| phone | VARCHAR(20) | NOT NULL, UNIQUE | Số điện thoại |
| full_name | VARCHAR(100) | NOT NULL | Họ tên |
| role | VARCHAR(50) | NOT NULL | Vị trí |
| avatar_url | VARCHAR(500) | | Ảnh đại diện |
| start_date | DATE | | Ngày bắt đầu làm việc |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| last_login_at | TIMESTAMP | NULL | Lần đăng nhập cuối |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES shop(id)
- UNIQUE (email)
- UNIQUE (phone)
- INDEX (shop_id, role, is_active)

**Constraints:**
- CHECK (role IN ('owner', 'manager', 'shift_manager', 'waiter', 'cashier', 'barista'))

---

### 11. employee_permission

**Mô tả:** Phân quyền chi tiết cho nhân viên

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| employee_id | UUID | FK → employee.id, NOT NULL | Nhân viên |
| permission_code | VARCHAR(50) | NOT NULL | Mã quyền |
| is_granted | BOOLEAN | DEFAULT true | Được cấp quyền |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
- UNIQUE (employee_id, permission_code)

---

### 12. order

**Mô tả:** Đơn hàng

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| shop_id | UUID | FK → shop.id, NOT NULL | Quán |
| order_number | VARCHAR(50) | NOT NULL, UNIQUE | Số đơn hàng |
| table_id | UUID | FK → table.id | Bàn (null nếu takeaway/delivery) |
| order_type | VARCHAR(20) | DEFAULT 'dine_in' | Loại |
| customer_name | VARCHAR(100) | | Tên khách hàng |
| customer_phone | VARCHAR(20) | | Số điện thoại |
| delivery_address | TEXT | | Địa chỉ giao hàng |
| delivery_fee | DECIMAL(10,2) | DEFAULT 0.00 | Phí giao hàng |
| subtotal | DECIMAL(10,2) | NOT NULL | Tổng tiền sản phẩm |
| vat_amount | DECIMAL(10,2) | DEFAULT 0.00 | Tiền VAT |
| service_fee | DECIMAL(10,2) | DEFAULT 0.00 | Phí dịch vụ |
| total_amount | DECIMAL(10,2) | NOT NULL | Tổng cộng |
| status | VARCHAR(20) | DEFAULT 'pending' | Trạng thái |
| notes | TEXT | | Ghi chú |
| created_by | UUID | FK → employee.id | Người tạo |
| served_by | UUID | FK → employee.id | Người phục vụ |
| cancelled_by | UUID | FK → employee.id | Người hủy |
| cancelled_reason | TEXT | | Lý do hủy |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| paid_at | TIMESTAMP | NULL | Thời gian thanh toán |
| cancelled_at | TIMESTAMP | NULL | Thời gian hủy |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES shop(id)
- FOREIGN KEY (table_id) REFERENCES table(id)
- FOREIGN KEY (created_by) REFERENCES employee(id)
- FOREIGN KEY (served_by) REFERENCES employee(id)
- FOREIGN KEY (cancelled_by) REFERENCES employee(id)
- UNIQUE (order_number)
- INDEX (shop_id, status, created_at)
- INDEX (shop_id, table_id, status)
- INDEX (shop_id, created_at)
- INDEX (created_by, created_at)

**Constraints:**
- CHECK (order_type IN ('dine_in', 'takeaway', 'delivery'))
- CHECK (status IN ('pending', 'preparing', 'ready', 'served', 'paid', 'cancelled'))
- CHECK (subtotal >= 0)
- CHECK (vat_amount >= 0)
- CHECK (service_fee >= 0)
- CHECK (delivery_fee >= 0)
- CHECK (total_amount >= 0)

---

### 13. order_item

**Mô tả:** Sản phẩm trong đơn hàng

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| order_id | UUID | FK → order.id, NOT NULL | Đơn hàng |
| product_id | UUID | FK → product.id, NOT NULL | Sản phẩm |
| product_name | VARCHAR(100) | NOT NULL | Tên sản phẩm (snapshot) |
| product_price | DECIMAL(10,2) | NOT NULL | Giá sản phẩm (snapshot) |
| quantity | INTEGER | NOT NULL | Số lượng |
| unit_price | DECIMAL(10,2) | NOT NULL | Đơn giá (sau tùy chọn) |
| subtotal | DECIMAL(10,2) | NOT NULL | Tổng tiền |
| selected_options | JSONB | | Tùy chọn đã chọn (snapshot) |
| notes | TEXT | | Ghi chú đặc biệt |
| status | VARCHAR(20) | DEFAULT 'pending' | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (order_id) REFERENCES order(id) ON DELETE CASCADE
- FOREIGN KEY (product_id) REFERENCES product(id)
- INDEX (order_id)
- INDEX (product_id)

**Constraints:**
- CHECK (quantity > 0 AND quantity <= 999)
- CHECK (unit_price >= 0)
- CHECK (subtotal >= 0)
- CHECK (status IN ('pending', 'preparing', 'ready', 'served'))

---

### 14. payment

**Mô tả:** Giao dịch thanh toán

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| order_id | UUID | FK → order.id, NOT NULL | Đơn hàng |
| payment_method | VARCHAR(20) | NOT NULL | Phương thức |
| amount | DECIMAL(10,2) | NOT NULL | Số tiền thanh toán |
| received_amount | DECIMAL(10,2) | | Số tiền khách đưa |
| change_amount | DECIMAL(10,2) | | Tiền thừa |
| transaction_id | VARCHAR(100) | | Mã giao dịch |
| receipt_number | VARCHAR(50) | UNIQUE | Số hóa đơn |
| notes | TEXT | | Ghi chú |
| processed_by | UUID | FK → employee.id, NOT NULL | Người xử lý |
| processed_at | TIMESTAMP | DEFAULT NOW() | Thời gian thanh toán |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (order_id) REFERENCES order(id)
- FOREIGN KEY (processed_by) REFERENCES employee(id)
- UNIQUE (receipt_number)
- INDEX (order_id)
- INDEX (processed_by, processed_at)

**Constraints:**
- CHECK (amount > 0)
- CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'e_wallet'))
- CHECK (received_amount >= amount OR received_amount IS NULL)

---

### 15. ingredient

**Mô tả:** Nguyên liệu trong kho

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| shop_id | UUID | FK → shop.id, NOT NULL | Quán |
| name | VARCHAR(100) | NOT NULL | Tên nguyên liệu |
| unit | VARCHAR(20) | NOT NULL | Đơn vị tính |
| current_stock | DECIMAL(10,2) | DEFAULT 0.00 | Tồn kho hiện tại |
| min_stock_level | DECIMAL(10,2) | DEFAULT 0.00 | Mức tồn kho tối thiểu |
| unit_price | DECIMAL(10,2) | DEFAULT 0.00 | Giá đơn vị |
| supplier | VARCHAR(100) | | Nhà cung cấp |
| expiry_tracking | BOOLEAN | DEFAULT false | Theo dõi hết hạn |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES shop(id)
- UNIQUE (shop_id, name)
- INDEX (shop_id, is_active)
- INDEX (shop_id, current_stock, min_stock_level)

**Constraints:**
- CHECK (current_stock >= 0)
- CHECK (min_stock_level >= 0)
- CHECK (unit_price >= 0)

---

### 16. product_ingredient

**Mô tả:** Liên kết sản phẩm với nguyên liệu (Recipe)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| product_id | UUID | FK → product.id, NOT NULL | Sản phẩm |
| ingredient_id | UUID | FK → ingredient.id, NOT NULL | Nguyên liệu |
| quantity_required | DECIMAL(10,2) | NOT NULL | Số lượng cần thiết |
| unit | VARCHAR(20) | NOT NULL | Đơn vị |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
- FOREIGN KEY (ingredient_id) REFERENCES ingredient(id)
- UNIQUE (product_id, ingredient_id)
- INDEX (product_id)
- INDEX (ingredient_id)

**Constraints:**
- CHECK (quantity_required > 0)

---

### 17. inventory_transaction

**Mô tả:** Nhập/xuất kho

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| shop_id | UUID | FK → shop.id, NOT NULL | Quán |
| ingredient_id | UUID | FK → ingredient.id, NOT NULL | Nguyên liệu |
| transaction_type | VARCHAR(20) | NOT NULL | Loại |
| quantity | DECIMAL(10,2) | NOT NULL | Số lượng |
| unit_price | DECIMAL(10,2) | | Giá đơn vị |
| total_amount | DECIMAL(10,2) | | Tổng tiền |
| reason | VARCHAR(100) | | Lý do |
| reference_id | UUID | | ID tham chiếu |
| reference_type | VARCHAR(50) | | Loại tham chiếu |
| expiry_date | DATE | | Ngày hết hạn |
| notes | TEXT | | Ghi chú |
| created_by | UUID | FK → employee.id | Người tạo |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES shop(id)
- FOREIGN KEY (ingredient_id) REFERENCES ingredient(id)
- FOREIGN KEY (created_by) REFERENCES employee(id)
- INDEX (shop_id, ingredient_id, created_at)
- INDEX (shop_id, transaction_type, created_at)
- INDEX (reference_id, reference_type)

**Constraints:**
- CHECK (transaction_type IN ('in', 'out', 'auto_deduct'))
- CHECK (quantity > 0)

---

### 18. audit_log

**Mô tả:** Ghi log các thao tác quan trọng

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | Primary key |
| shop_id | UUID | FK → shop.id | Quán |
| user_id | UUID | FK → employee.id | Người thực hiện |
| action | VARCHAR(50) | NOT NULL | Hành động |
| entity_type | VARCHAR(50) | NOT NULL | Loại entity |
| entity_id | UUID | NOT NULL | ID entity |
| old_values | JSONB | | Giá trị cũ |
| new_values | JSONB | | Giá trị mới |
| ip_address | VARCHAR(50) | | IP address |
| user_agent | TEXT | | User agent |
| created_at | TIMESTAMP | DEFAULT NOW() | Thời gian |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES shop(id)
- FOREIGN KEY (user_id) REFERENCES employee(id)
- INDEX (shop_id, entity_type, entity_id, created_at)
- INDEX (user_id, created_at)
- INDEX (created_at)

---

## 🔍 Indexes Summary

### Primary Indexes
- Tất cả tables có PRIMARY KEY trên `id` (UUID)

### Foreign Key Indexes
- Tất cả foreign keys đều có index tự động

### Composite Indexes
- `(shop_id, status, created_at)` - For filtering orders
- `(shop_id, category_id, is_active, status)` - For product listing
- `(table_id, reservation_time, status)` - For reservation conflicts
- `(shop_id, current_stock, min_stock_level)` - For low stock alerts

### Unique Indexes
- `shop.name`
- `shop.email`
- `category(shop_id, name)`
- `product(shop_id, category_id, name)`
- `table(area_id, table_number)`
- `employee.email`
- `employee.phone`
- `order.order_number`
- `payment.receipt_number`
- `ingredient(shop_id, name)`
- `product_ingredient(product_id, ingredient_id)`
- `employee_permission(employee_id, permission_code)`
- `product_option(option_group_id, name)`

---

## 🔒 Constraints Summary

### Check Constraints
- Price validations: `> 0`
- Quantity validations: `> 0` and `<= max`
- Status validations: `IN (allowed_values)`
- Rate validations: `>= 0 AND <= 100`
- Time validations: `closing_time > opening_time`

### Foreign Key Constraints
- Tất cả foreign keys có referential integrity
- ON DELETE CASCADE cho child entities
- ON DELETE RESTRICT cho parent entities

### Not Null Constraints
- Tất cả các trường quan trọng đều NOT NULL
- Optional fields có thể NULL

---

## 📈 Performance Considerations

1. **Indexes**: Tất cả foreign keys và columns thường query đều có index
2. **Partitioning**: Có thể partition `audit_log` và `inventory_transaction` theo `created_at` (monthly)
3. **Archiving**: Archive logs cũ hơn 1 năm
4. **Query Optimization**: Sử dụng composite indexes cho các queries phức tạp

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Next Review:** 2025-12-17

