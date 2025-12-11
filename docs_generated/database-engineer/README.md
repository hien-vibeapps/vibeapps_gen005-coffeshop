# Database Engineer - Coffee Shop Management

**Module:** Coffee Shop Management  
**Status:** ✅ Schema Design Completed  
**Last Updated:** 2025-12-10

---

## 📋 Tổng Quan

Database schema cho module **Coffee Shop Management** đã được thiết kế và implement với:

- ✅ **18 Tables** được thiết kế theo chuẩn 3NF
- ✅ **Migration Scripts** đã được tạo sẵn
- ✅ **Seed Data** đã được chuẩn bị
- ✅ **Documentation** đầy đủ

---

## 📁 Cấu Trúc Files

```
docs_generated/database-engineer/
├── README.md                              # Tài liệu này
├── erd-coffee-shop-management.md          # Entity Relationship Diagram
├── schema-coffee-shop-management.md       # Chi tiết schema
└── migration-summary.md                    # Hướng dẫn chạy migrations

scripts/database/
├── migrations/
│   └── 20251210180652-CreateCoffeeShopManagementSchema.ts
├── seeds/
│   └── seed-coffee-shop-management.ts
├── run-migrations.ts                      # Script chạy migrations
├── run-migrations.ps1                     # PowerShell script
└── README.md                              # Hướng dẫn sử dụng
```

---

## 🎯 Các Bước Tiếp Theo

### 1. Cấu hình Database Connection

Tạo file `.env` ở root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_shop_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 2. Chạy Migrations

```powershell
.\scripts\database\run-migrations.ps1
```

Hoặc:

```bash
npx ts-node scripts/database/run-migrations.ts
```

### 3. Chạy Seed Data (Optional)

```bash
npx ts-node scripts/database/seeds/seed-coffee-shop-management.ts
```

---

## 📊 Database Schema

### Tables Overview

| # | Table | Description | Relationships |
|---|-------|-------------|--------------|
| 1 | `shop` | Thông tin quán | Parent của nhiều tables |
| 2 | `category` | Danh mục sản phẩm | 1:N với product |
| 3 | `product` | Sản phẩm | 1:N với nhiều child tables |
| 4 | `product_image` | Ảnh sản phẩm | N:1 với product |
| 5 | `product_option_group` | Nhóm tùy chọn | N:1 với product |
| 6 | `product_option` | Tùy chọn | N:1 với option_group |
| 7 | `area` | Khu vực | 1:N với table |
| 8 | `table` | Bàn | 1:N với order, reservation |
| 9 | `employee` | Nhân viên | 1:N với nhiều tables |
| 10 | `employee_permission` | Phân quyền | N:1 với employee |
| 11 | `table_reservation` | Đặt bàn | N:1 với table, employee |
| 12 | `order` | Đơn hàng | 1:N với order_item, payment |
| 13 | `order_item` | Chi tiết đơn | N:1 với order, product |
| 14 | `payment` | Thanh toán | N:1 với order, employee |
| 15 | `ingredient` | Nguyên liệu | 1:N với product_ingredient |
| 16 | `product_ingredient` | Công thức | N:M (product ↔ ingredient) |
| 17 | `inventory_transaction` | Giao dịch kho | N:1 với ingredient |
| 18 | `audit_log` | Nhật ký | N:1 với shop, employee |

### Key Features

- ✅ **UUID Primary Keys**: Tất cả tables sử dụng UUID
- ✅ **Soft Delete**: Sử dụng `deleted_at` cho các entities quan trọng
- ✅ **Audit Fields**: `created_at`, `updated_at`, `created_by`, `updated_by`
- ✅ **Foreign Keys**: Tất cả relationships có foreign key constraints
- ✅ **Indexes**: Indexes cho foreign keys và columns thường query
- ✅ **Constraints**: Check constraints cho data validation
- ✅ **Normalization**: 3NF trở lên

---

## 🔍 Chi Tiết Schema

Xem file `schema-coffee-shop-management.md` để biết chi tiết về:
- Column definitions
- Data types
- Constraints
- Indexes
- Relationships

---

## 📐 ERD Diagram

Xem file `erd-coffee-shop-management.md` để xem:
- Entity Relationship Diagram (Mermaid)
- Relationship types (1:N, N:M)
- Cardinality
- Foreign key relationships

---

## 🚀 Migration Guide

Xem file `migration-summary.md` để biết:
- Cách chạy migrations
- Verification steps
- Troubleshooting
- Rollback procedures

---

## 📝 Seed Data

Seed data script tạo:
- 1 Shop mẫu
- 4 Categories
- 11 Products với images và options
- 3 Areas
- 7 Tables
- 5 Employees với permissions
- 8 Ingredients
- Product recipes
- Inventory transactions

---

## ✅ Checklist

- [x] ERD đã được thiết kế
- [x] Schema documentation đã được tạo
- [x] Migration scripts đã được viết
- [x] Seed data đã được chuẩn bị
- [x] Run scripts đã được tạo
- [x] Documentation đã được hoàn thành
- [x] Migrations đã được chạy (✅ Verified - All 19 tables created)
- [x] Seed data đã được chạy (✅ Verified - Sample data exists)

---

## 🔗 Liên Kết

- **Business Requirements**: `docs_generated/business-analyst/data-requirements-coffee-shop-management.md`
- **Business Rules**: `docs_generated/business-analyst/business-rules-coffee-shop-management.md`
- **Use Cases**: `docs_generated/business-analyst/use-cases-quan-ly-quan-coffee-shop.md`

---

## 📞 Support

Nếu có vấn đề khi chạy migrations hoặc cần hỗ trợ, xem:
- `scripts/database/README.md` - Hướng dẫn chi tiết
- `docs_generated/database-engineer/migration-summary.md` - Troubleshooting guide

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Author:** Database Engineer Team

