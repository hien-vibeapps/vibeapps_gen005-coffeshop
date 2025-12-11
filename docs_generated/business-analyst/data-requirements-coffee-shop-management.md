# Data Requirements - Coffee Shop Management

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Author:** Business Analyst Team  
**Status:** In Progress

---

## 📋 Tổng Quan

Tài liệu này mô tả chi tiết các **Data Requirements** (Yêu cầu dữ liệu) cho module **Coffee Shop Management**, bao gồm các entities, attributes, relationships và constraints.

---

## 🎯 Mục đích

Tài liệu này cung cấp:
- Danh sách đầy đủ các data entities cần thiết
- Chi tiết attributes cho từng entity
- Relationships giữa các entities
- Data constraints và validation rules
- Indexes và performance considerations
- Input cho Database Engineer để thiết kế database schema

---

## 📊 Entity Relationship Diagram (Text-based)

```
┌─────────────────┐
│      Shop       │
│  (Quán)         │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐      ┌──────────────┐      ┌──────────────┐
│    Category     │      │   Product     │      │ ProductOption│
│  (Danh mục)     │◄─────┤ (Sản phẩm)    │──────┤ (Tùy chọn)   │
└─────────────────┘  N   └──────┬───────┘  N    └──────────────┘
                                │
                                │ N
                                │
                    ┌───────────▼───────────┐
                    │    ProductOptionGroup │
                    │  (Nhóm tùy chọn)      │
                    └───────────────────────┘

┌─────────────────┐      ┌──────────────┐      ┌──────────────┐
│      Area       │      │     Table    │      │    Order     │
│  (Khu vực)      │◄─────┤   (Bàn)      │──────┤ (Đơn hàng)   │
└─────────────────┘  N   └──────────────┘  N   └──────┬───────┘
                                                       │
                                                       │ N
                                                       │
                    ┌─────────────────────────────────▼──────────┐
                    │           OrderItem                        │
                    │      (Chi tiết đơn hàng)                   │
                    └───────────────────────────────────────────┘

┌─────────────────┐      ┌──────────────┐      ┌──────────────┐
│    Employee     │      │   Payment    │      │   Ingredient │
│  (Nhân viên)    │──────┤ (Thanh toán)  │      │ (Nguyên liệu)│
└─────────────────┘  N   └──────────────┘      └──────┬───────┘
                                                        │
                                                        │ N
                    ┌───────────────────────────────────▼──────────┐
                    │      ProductIngredient (Recipe)              │
                    │   (Công thức - Sản phẩm & Nguyên liệu)       │
                    └──────────────────────────────────────────────┘

┌─────────────────┐      ┌──────────────────────────────┐
│  InventoryTrans │      │      TableReservation         │
│  (Giao dịch kho)│      │      (Đặt bàn)                │
└─────────────────┘      └──────────────────────────────┘
```

---

## 📝 Chi tiết Entities

### 1. Shop (Quán)

**Mô tả:** Thông tin cơ bản của quán cà phê

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
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

**Business Rules:**
- Tên quán phải unique trong hệ thống
- Email phải unique và đúng format
- Giờ đóng cửa phải sau giờ mở cửa
- VAT rate và Service fee rate có thể cấu hình

---

### 2. Category (Danh mục)

**Mô tả:** Danh mục sản phẩm (Đồ uống, Đồ ăn, Bánh ngọt, etc.)

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| shop_id | UUID | FK → Shop.id, NOT NULL | Quán |
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
- FOREIGN KEY (shop_id) REFERENCES Shop(id)
- UNIQUE (shop_id, name) - Tên danh mục unique trong quán
- INDEX (shop_id, is_active, display_order)

**Business Rules:**
- Tên danh mục phải unique trong cùng quán
- Không thể xóa danh mục nếu còn sản phẩm
- Display order dùng để sắp xếp

---

### 3. Product (Sản phẩm)

**Mô tả:** Sản phẩm trong menu

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| shop_id | UUID | FK → Shop.id, NOT NULL | Quán |
| category_id | UUID | FK → Category.id, NOT NULL | Danh mục |
| name | VARCHAR(100) | NOT NULL | Tên sản phẩm |
| description | TEXT | | Mô tả |
| price | DECIMAL(10,2) | NOT NULL, > 0 | Giá bán |
| estimated_prep_time | INTEGER | DEFAULT 0 | Thời gian chế biến (phút) |
| status | VARCHAR(20) | DEFAULT 'available' | Trạng thái: available/out_of_stock/suspended |
| calories | INTEGER | | Calorie |
| allergen_info | TEXT | | Thông tin dị ứng |
| display_order | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES Shop(id)
- FOREIGN KEY (category_id) REFERENCES Category(id)
- UNIQUE (shop_id, category_id, name) - Tên sản phẩm unique trong danh mục
- INDEX (shop_id, category_id, is_active, status)
- INDEX (shop_id, display_order)

**Business Rules:**
- Tên sản phẩm phải unique trong cùng danh mục
- Giá phải > 0
- Status: available, out_of_stock, suspended
- Không thể xóa sản phẩm đã có trong đơn hàng

**Related Entities:**
- ProductImage (Nhiều ảnh)
- ProductOptionGroup (Tùy chọn)

---

### 4. ProductImage (Ảnh sản phẩm)

**Mô tả:** Ảnh của sản phẩm (một sản phẩm có nhiều ảnh)

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| product_id | UUID | FK → Product.id, NOT NULL | Sản phẩm |
| image_url | VARCHAR(500) | NOT NULL | URL ảnh |
| display_order | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| is_primary | BOOLEAN | DEFAULT false | Ảnh chính |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
- INDEX (product_id, display_order)

**Business Rules:**
- Một sản phẩm có thể có nhiều ảnh (tối đa 5)
- Chỉ có một ảnh primary

---

### 5. ProductOptionGroup (Nhóm tùy chọn)

**Mô tả:** Nhóm tùy chọn cho sản phẩm (Size, Topping, Milk type, etc.)

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| product_id | UUID | FK → Product.id, NOT NULL | Sản phẩm |
| name | VARCHAR(50) | NOT NULL | Tên nhóm (Size, Topping, etc.) |
| is_required | BOOLEAN | DEFAULT false | Bắt buộc chọn |
| max_selections | INTEGER | DEFAULT 1 | Số lượng tối đa có thể chọn |
| display_order | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
- INDEX (product_id, display_order)

**Business Rules:**
- Một sản phẩm có thể có nhiều nhóm tùy chọn
- Max_selections >= 1

---

### 6. ProductOption (Tùy chọn)

**Mô tả:** Các tùy chọn trong nhóm (Small, Medium, Large, etc.)

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| option_group_id | UUID | FK → ProductOptionGroup.id, NOT NULL | Nhóm tùy chọn |
| name | VARCHAR(50) | NOT NULL | Tên tùy chọn |
| price_adjustment | DECIMAL(10,2) | DEFAULT 0.00 | Giá bổ sung (có thể âm) |
| display_order | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (option_group_id) REFERENCES ProductOptionGroup(id) ON DELETE CASCADE
- INDEX (option_group_id, display_order)

**Business Rules:**
- Price_adjustment có thể âm (giảm giá)
- Tên tùy chọn phải unique trong cùng nhóm

---

### 7. Area (Khu vực)

**Mô tả:** Khu vực trong quán (Tầng 1, Tầng 2, Sân vườn, etc.)

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| shop_id | UUID | FK → Shop.id, NOT NULL | Quán |
| name | VARCHAR(50) | NOT NULL | Tên khu vực |
| description | TEXT | | Mô tả |
| floor_plan_url | VARCHAR(500) | | Sơ đồ khu vực |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES Shop(id)
- UNIQUE (shop_id, name) - Tên khu vực unique trong quán
- INDEX (shop_id, is_active)

**Business Rules:**
- Tên khu vực phải unique trong cùng quán

---

### 8. Table (Bàn)

**Mô tả:** Bàn trong quán

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| area_id | UUID | FK → Area.id, NOT NULL | Khu vực |
| table_number | VARCHAR(20) | NOT NULL | Số bàn/Tên bàn |
| capacity | INTEGER | DEFAULT 4 | Số chỗ ngồi |
| status | VARCHAR(20) | DEFAULT 'available' | Trạng thái: available/occupied/reserved/maintenance |
| notes | TEXT | | Ghi chú |
| position_x | DECIMAL(10,2) | | Vị trí X trong sơ đồ |
| position_y | DECIMAL(10,2) | | Vị trí Y trong sơ đồ |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (area_id) REFERENCES Area(id)
- UNIQUE (area_id, table_number) - Số bàn unique trong khu vực
- INDEX (area_id, status, is_active)

**Business Rules:**
- Số bàn phải unique trong cùng khu vực
- Status: available, occupied, reserved, maintenance
- Capacity phải > 0

---

### 9. TableReservation (Đặt bàn)

**Mô tả:** Đặt bàn trước

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| shop_id | UUID | FK → Shop.id, NOT NULL | Quán |
| table_id | UUID | FK → Table.id | Bàn (có thể null nếu chưa chọn) |
| customer_name | VARCHAR(100) | NOT NULL | Tên khách hàng |
| customer_phone | VARCHAR(20) | NOT NULL | Số điện thoại |
| reservation_time | TIMESTAMP | NOT NULL | Thời gian đặt |
| number_of_guests | INTEGER | NOT NULL | Số lượng người |
| notes | TEXT | | Ghi chú |
| status | VARCHAR(20) | DEFAULT 'pending' | Trạng thái: pending/confirmed/cancelled/completed |
| created_by | UUID | FK → Employee.id | Người tạo |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| cancelled_at | TIMESTAMP | NULL | Thời gian hủy |
| cancelled_reason | TEXT | | Lý do hủy |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES Shop(id)
- FOREIGN KEY (table_id) REFERENCES Table(id)
- FOREIGN KEY (created_by) REFERENCES Employee(id)
- INDEX (shop_id, reservation_time, status)
- INDEX (table_id, reservation_time, status)

**Business Rules:**
- Thời gian đặt phải trong tương lai hoặc hiện tại
- Số lượng người <= Capacity của bàn
- Không thể đặt bàn trùng thời gian
- Tự động hủy nếu khách không đến sau 15 phút

---

### 10. Order (Đơn hàng)

**Mô tả:** Đơn hàng

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| shop_id | UUID | FK → Shop.id, NOT NULL | Quán |
| order_number | VARCHAR(50) | NOT NULL, UNIQUE | Số đơn hàng |
| table_id | UUID | FK → Table.id | Bàn (null nếu takeaway/delivery) |
| order_type | VARCHAR(20) | DEFAULT 'dine_in' | Loại: dine_in/takeaway/delivery |
| customer_name | VARCHAR(100) | | Tên khách hàng (takeaway/delivery) |
| customer_phone | VARCHAR(20) | | Số điện thoại (takeaway/delivery) |
| delivery_address | TEXT | | Địa chỉ giao hàng (delivery) |
| delivery_fee | DECIMAL(10,2) | DEFAULT 0.00 | Phí giao hàng |
| subtotal | DECIMAL(10,2) | NOT NULL | Tổng tiền sản phẩm |
| vat_amount | DECIMAL(10,2) | DEFAULT 0.00 | Tiền VAT |
| service_fee | DECIMAL(10,2) | DEFAULT 0.00 | Phí dịch vụ |
| total_amount | DECIMAL(10,2) | NOT NULL | Tổng cộng |
| status | VARCHAR(20) | DEFAULT 'pending' | Trạng thái: pending/preparing/ready/served/paid/cancelled |
| notes | TEXT | | Ghi chú |
| created_by | UUID | FK → Employee.id | Người tạo |
| served_by | UUID | FK → Employee.id | Người phục vụ |
| cancelled_by | UUID | FK → Employee.id | Người hủy |
| cancelled_reason | TEXT | | Lý do hủy |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| paid_at | TIMESTAMP | NULL | Thời gian thanh toán |
| cancelled_at | TIMESTAMP | NULL | Thời gian hủy |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES Shop(id)
- FOREIGN KEY (table_id) REFERENCES Table(id)
- FOREIGN KEY (created_by) REFERENCES Employee(id)
- FOREIGN KEY (served_by) REFERENCES Employee(id)
- FOREIGN KEY (cancelled_by) REFERENCES Employee(id)
- UNIQUE (order_number)
- INDEX (shop_id, status, created_at)
- INDEX (shop_id, table_id, status)
- INDEX (shop_id, created_at) - For reports
- INDEX (created_by, created_at)

**Business Rules:**
- Order_number phải unique và tự động generate
- Status: pending → preparing → ready → served → paid
- Hoặc bất kỳ → cancelled
- Total_amount = Subtotal + VAT + ServiceFee + DeliveryFee
- Một bàn chỉ có một đơn hàng chưa thanh toán tại một thời điểm

---

### 11. OrderItem (Chi tiết đơn hàng)

**Mô tả:** Sản phẩm trong đơn hàng

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| order_id | UUID | FK → Order.id, NOT NULL | Đơn hàng |
| product_id | UUID | FK → Product.id, NOT NULL | Sản phẩm |
| product_name | VARCHAR(100) | NOT NULL | Tên sản phẩm (snapshot) |
| product_price | DECIMAL(10,2) | NOT NULL | Giá sản phẩm (snapshot) |
| quantity | INTEGER | NOT NULL, > 0 | Số lượng |
| unit_price | DECIMAL(10,2) | NOT NULL | Đơn giá (sau tùy chọn) |
| subtotal | DECIMAL(10,2) | NOT NULL | Tổng tiền = unit_price × quantity |
| selected_options | JSONB | | Tùy chọn đã chọn (snapshot) |
| notes | TEXT | | Ghi chú đặc biệt |
| status | VARCHAR(20) | DEFAULT 'pending' | Trạng thái: pending/preparing/ready/served |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (order_id) REFERENCES Order(id) ON DELETE CASCADE
- FOREIGN KEY (product_id) REFERENCES Product(id)
- INDEX (order_id)
- INDEX (product_id)

**Business Rules:**
- Quantity phải > 0
- Product_name, product_price, selected_options là snapshot (không thay đổi khi sản phẩm thay đổi)
- Subtotal = Unit_price × Quantity
- Unit_price = Product_price + Sum(Option price_adjustment)

**Selected_options JSON Structure:**
```json
[
  {
    "option_group_id": "uuid",
    "option_group_name": "Size",
    "option_id": "uuid",
    "option_name": "Large",
    "price_adjustment": 10000
  }
]
```

---

### 12. Payment (Thanh toán)

**Mô tả:** Giao dịch thanh toán

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| order_id | UUID | FK → Order.id, NOT NULL | Đơn hàng |
| payment_method | VARCHAR(20) | NOT NULL | Phương thức: cash/card/bank_transfer/e_wallet |
| amount | DECIMAL(10,2) | NOT NULL | Số tiền thanh toán |
| received_amount | DECIMAL(10,2) | | Số tiền khách đưa (tiền mặt) |
| change_amount | DECIMAL(10,2) | | Tiền thừa (tiền mặt) |
| transaction_id | VARCHAR(100) | | Mã giao dịch (thẻ/chuyển khoản) |
| receipt_number | VARCHAR(50) | UNIQUE | Số hóa đơn |
| notes | TEXT | | Ghi chú |
| processed_by | UUID | FK → Employee.id, NOT NULL | Người xử lý |
| processed_at | TIMESTAMP | DEFAULT NOW() | Thời gian thanh toán |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (order_id) REFERENCES Order(id)
- FOREIGN KEY (processed_by) REFERENCES Employee(id)
- UNIQUE (receipt_number)
- INDEX (order_id)
- INDEX (shop_id, processed_at) - For reports
- INDEX (processed_by, processed_at)

**Business Rules:**
- Amount phải > 0
- Nếu payment_method = 'cash', received_amount >= amount
- Change_amount = Received_amount - Amount (nếu tiền mặt)
- Receipt_number tự động generate và unique
- Một đơn hàng có thể có nhiều payment (thanh toán một phần)

---

### 13. Employee (Nhân viên)

**Mô tả:** Nhân viên

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| shop_id | UUID | FK → Shop.id, NOT NULL | Quán |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email |
| phone | VARCHAR(20) | NOT NULL, UNIQUE | Số điện thoại |
| full_name | VARCHAR(100) | NOT NULL | Họ tên |
| role | VARCHAR(50) | NOT NULL | Vị trí: owner/manager/shift_manager/waiter/cashier/barista |
| avatar_url | VARCHAR(500) | | Ảnh đại diện |
| start_date | DATE | | Ngày bắt đầu làm việc |
| is_active | BOOLEAN | DEFAULT true | Trạng thái |
| last_login_at | TIMESTAMP | NULL | Lần đăng nhập cuối |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES Shop(id)
- UNIQUE (email)
- UNIQUE (phone)
- INDEX (shop_id, role, is_active)

**Business Rules:**
- Email và phone phải unique trong hệ thống
- Role phải là một trong: owner, manager, shift_manager, waiter, cashier, barista
- Không thể xóa nhân viên đã tạo đơn hàng

**Related Entities:**
- EmployeePermission (Phân quyền chi tiết)
- EmployeeShift (Ca làm việc)

---

### 14. EmployeePermission (Phân quyền nhân viên)

**Mô tả:** Phân quyền chi tiết cho nhân viên

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| employee_id | UUID | FK → Employee.id, NOT NULL | Nhân viên |
| permission_code | VARCHAR(50) | NOT NULL | Mã quyền |
| is_granted | BOOLEAN | DEFAULT true | Được cấp quyền |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE
- UNIQUE (employee_id, permission_code)

**Permission Codes:**
- menu.manage
- menu.view
- order.create
- order.update
- order.cancel
- order.view
- payment.process
- table.manage
- table.view
- inventory.manage
- inventory.view
- report.view
- report.financial
- employee.manage
- employee.view

---

### 15. Ingredient (Nguyên liệu)

**Mô tả:** Nguyên liệu trong kho

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| shop_id | UUID | FK → Shop.id, NOT NULL | Quán |
| name | VARCHAR(100) | NOT NULL | Tên nguyên liệu |
| unit | VARCHAR(20) | NOT NULL | Đơn vị tính (kg, l, pcs, etc.) |
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
- FOREIGN KEY (shop_id) REFERENCES Shop(id)
- UNIQUE (shop_id, name) - Tên nguyên liệu unique trong quán
- INDEX (shop_id, is_active)
- INDEX (shop_id, current_stock, min_stock_level) - For low stock alerts

**Business Rules:**
- Tên nguyên liệu phải unique trong cùng quán
- Current_stock >= 0
- Min_stock_level >= 0
- Cảnh báo khi current_stock <= min_stock_level

---

### 16. ProductIngredient (Công thức sản phẩm)

**Mô tả:** Liên kết sản phẩm với nguyên liệu (Recipe)

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| product_id | UUID | FK → Product.id, NOT NULL | Sản phẩm |
| ingredient_id | UUID | FK → Ingredient.id, NOT NULL | Nguyên liệu |
| quantity_required | DECIMAL(10,2) | NOT NULL, > 0 | Số lượng cần thiết |
| unit | VARCHAR(20) | NOT NULL | Đơn vị |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updated_at | TIMESTAMP | DEFAULT NOW() | Ngày cập nhật |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
- FOREIGN KEY (ingredient_id) REFERENCES Ingredient(id)
- UNIQUE (product_id, ingredient_id) - Một sản phẩm không thể có nguyên liệu trùng
- INDEX (product_id)
- INDEX (ingredient_id)

**Business Rules:**
- Quantity_required phải > 0
- Khi bán sản phẩm, tự động trừ kho theo công thức

---

### 17. InventoryTransaction (Giao dịch kho)

**Mô tả:** Nhập/xuất kho

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| shop_id | UUID | FK → Shop.id, NOT NULL | Quán |
| ingredient_id | UUID | FK → Ingredient.id, NOT NULL | Nguyên liệu |
| transaction_type | VARCHAR(20) | NOT NULL | Loại: in/out/auto_deduct |
| quantity | DECIMAL(10,2) | NOT NULL | Số lượng |
| unit_price | DECIMAL(10,2) | | Giá đơn vị (nhập kho) |
| total_amount | DECIMAL(10,2) | | Tổng tiền |
| reason | VARCHAR(100) | | Lý do (Sử dụng, Hỏng, Mất, etc.) |
| reference_id | UUID | | ID tham chiếu (Order.id nếu auto_deduct) |
| reference_type | VARCHAR(50) | | Loại tham chiếu (order, manual, etc.) |
| expiry_date | DATE | | Ngày hết hạn (nếu có) |
| notes | TEXT | | Ghi chú |
| created_by | UUID | FK → Employee.id | Người tạo |
| created_at | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES Shop(id)
- FOREIGN KEY (ingredient_id) REFERENCES Ingredient(id)
- FOREIGN KEY (created_by) REFERENCES Employee(id)
- INDEX (shop_id, ingredient_id, created_at)
- INDEX (shop_id, transaction_type, created_at)
- INDEX (reference_id, reference_type)

**Business Rules:**
- Transaction_type: in (nhập), out (xuất), auto_deduct (tự động trừ từ bán hàng)
- Quantity phải > 0
- Nếu transaction_type = 'out', quantity <= current_stock
- Tự động cập nhật current_stock sau mỗi transaction

---

### 18. AuditLog (Nhật ký kiểm toán)

**Mô tả:** Ghi log các thao tác quan trọng

**Attributes:**
| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Primary key |
| shop_id | UUID | FK → Shop.id | Quán |
| user_id | UUID | FK → Employee.id | Người thực hiện |
| action | VARCHAR(50) | NOT NULL | Hành động (create, update, delete, etc.) |
| entity_type | VARCHAR(50) | NOT NULL | Loại entity (Order, Product, etc.) |
| entity_id | UUID | NOT NULL | ID entity |
| old_values | JSONB | | Giá trị cũ |
| new_values | JSONB | | Giá trị mới |
| ip_address | VARCHAR(50) | | IP address |
| user_agent | TEXT | | User agent |
| created_at | TIMESTAMP | DEFAULT NOW() | Thời gian |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (shop_id) REFERENCES Shop(id)
- FOREIGN KEY (user_id) REFERENCES Employee(id)
- INDEX (shop_id, entity_type, entity_id, created_at)
- INDEX (user_id, created_at)
- INDEX (created_at) - For cleanup old logs

**Business Rules:**
- Ghi log cho các thao tác: create, update, delete, payment, cancel
- Lưu old_values và new_values dạng JSON
- Có thể xóa log cũ (sau 1 năm)

---

## 🔗 Relationships Summary

### One-to-Many (1:N)
- Shop → Categories
- Shop → Products
- Shop → Areas
- Shop → Tables
- Shop → Employees
- Shop → Orders
- Shop → Ingredients
- Category → Products
- Area → Tables
- Product → ProductImages
- Product → ProductOptionGroups
- Product → OrderItems
- ProductOptionGroup → ProductOptions
- Table → Orders
- Table → TableReservations
- Order → OrderItems
- Order → Payments
- Order → TableReservations
- Employee → Orders (created_by)
- Ingredient → InventoryTransactions
- Product → ProductIngredients

### Many-to-Many (N:M)
- Product ↔ Ingredient (through ProductIngredient)

---

## 📊 Data Constraints Summary

### Primary Keys
- Tất cả entities có UUID primary key

### Foreign Keys
- Tất cả relationships được enforce bằng foreign keys
- ON DELETE CASCADE cho các child entities (ProductImage, OrderItem, etc.)

### Unique Constraints
- Shop.name
- Shop.email
- Category(shop_id, name)
- Product(shop_id, category_id, name)
- Table(area_id, table_number)
- Employee.email
- Employee.phone
- Order.order_number
- Payment.receipt_number

### Check Constraints
- Product.price > 0
- OrderItem.quantity > 0
- Table.capacity > 0
- Ingredient.current_stock >= 0
- Ingredient.min_stock_level >= 0
- ProductIngredient.quantity_required > 0

### Not Null Constraints
- Tất cả các trường quan trọng đều NOT NULL
- Các trường optional có thể NULL

---

## 📈 Performance Considerations

### Indexes
1. **Frequently queried fields:**
   - shop_id (hầu hết entities)
   - status fields (Order.status, Table.status, etc.)
   - created_at (for reports and sorting)

2. **Foreign keys:** Tất cả foreign keys đều có index

3. **Composite indexes:**
   - (shop_id, status, created_at) - For filtering orders
   - (shop_id, category_id, is_active) - For product listing
   - (table_id, reservation_time, status) - For reservation conflicts

### Partitioning
- **AuditLog:** Có thể partition theo created_at (monthly)
- **InventoryTransaction:** Có thể partition theo created_at (monthly)

### Archiving
- **AuditLog:** Archive logs cũ hơn 1 năm
- **Orders:** Archive orders đã thanh toán > 1 năm (nếu cần)

---

## 🔄 Data Migration Considerations

1. **Initial Data:**
   - Tạo Shop mặc định khi setup
   - Tạo Owner account đầu tiên
   - Setup default categories nếu cần

2. **Data Seeding:**
   - Sample products, tables, areas (cho demo)

3. **Data Migration:**
   - Migration từ hệ thống cũ (nếu có)
   - Import từ Excel/CSV

---

## ✅ Data Validation Rules

Tất cả validation rules từ Business Rules document phải được implement:
- Format validation (email, phone, etc.)
- Range validation (price > 0, quantity > 0, etc.)
- Business logic validation (closing_time > opening_time, etc.)
- Uniqueness validation (unique constraints)

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Next Review:** 2025-12-17

