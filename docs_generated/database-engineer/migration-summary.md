# Migration Summary - Coffee Shop Management

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Author:** Database Engineer Team  
**Status:** Ready for Execution

---

## 📋 Tổng Quan

Migration script đã được tạo để thiết lập database schema cho module **Coffee Shop Management** với **18 tables** chính.

### Migration File
- **File:** `scripts/database/migrations/20251210180652-CreateCoffeeShopManagementSchema.ts`
- **Timestamp:** 2025-12-10 18:06:52
- **Type:** TypeORM Migration
- **Status:** ✅ Ready

---

## 📊 Tables Created

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

## 🚀 Cách Chạy Migrations

### Bước 1: Cấu hình Database Connection

Tạo file `.env` ở root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_shop_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### Bước 2: Tạo Database (nếu chưa có)

```sql
CREATE DATABASE coffee_shop_db;
```

### Bước 3: Cài đặt Dependencies

```bash
npm install typeorm pg dotenv
npm install -D typescript ts-node @types/node
```

### Bước 4: Chạy Migrations

**Option 1: Sử dụng PowerShell Script (Windows)**

```powershell
.\scripts\database\run-migrations.ps1
```

**Option 2: Sử dụng TypeScript trực tiếp**

```bash
npx ts-node scripts/database/run-migrations.ts
```

**Option 3: Sử dụng TypeORM CLI**

```bash
npx typeorm migration:run -d scripts/database/data-source.ts
```

### Bước 5: Chạy Seed Data (Optional)

Sau khi migrations hoàn thành, chạy seed data để có dữ liệu test:

```bash
npx ts-node scripts/database/seeds/seed-coffee-shop-management.ts
```

---

## ✅ Verification

Sau khi chạy migrations, verify bằng cách:

### 1. Kiểm tra Tables đã được tạo

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Kết quả mong đợi: 18 tables + 1 table `migrations`

### 2. Kiểm tra Migration Status

```sql
SELECT * FROM migrations ORDER BY timestamp DESC;
```

### 3. Kiểm tra Foreign Keys

```sql
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;
```

### 4. Kiểm tra Indexes

```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## 🔄 Rollback (Nếu cần)

Để rollback migration:

```bash
npx typeorm migration:revert -d scripts/database/data-source.ts
```

Hoặc manually drop tables:

```sql
-- Drop tables in reverse order
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS inventory_transaction CASCADE;
DROP TABLE IF EXISTS product_ingredient CASCADE;
DROP TABLE IF EXISTS ingredient CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS order CASCADE;
DROP TABLE IF EXISTS table_reservation CASCADE;
DROP TABLE IF EXISTS employee_permission CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS table CASCADE;
DROP TABLE IF EXISTS area CASCADE;
DROP TABLE IF EXISTS product_option CASCADE;
DROP TABLE IF EXISTS product_option_group CASCADE;
DROP TABLE IF EXISTS product_image CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS shop CASCADE;
```

---

## 📝 Seed Data

Seed data script tạo:

- **1 Shop**: Coffee House Central
- **4 Categories**: Đồ uống nóng, Đồ uống lạnh, Bánh ngọt, Đồ ăn nhẹ
- **11 Products**: Các sản phẩm mẫu
- **3 Areas**: Tầng 1, Tầng 2, Sân vườn
- **7 Tables**: Bàn mẫu
- **5 Employees**: Owner, Manager, Waiter, Cashier, Barista
- **8 Ingredients**: Nguyên liệu mẫu
- **Product Recipes**: Công thức sản phẩm
- **Inventory Transactions**: Giao dịch kho mẫu

---

## ⚠️ Lưu Ý Quan Trọng

1. **Backup Database**: Luôn backup database trước khi chạy migrations trong production
2. **Test First**: Test migrations trong development/staging trước
3. **Review Code**: Review migration code trước khi execute
4. **Environment Variables**: Đảm bảo `.env` file có đúng thông tin kết nối
5. **Database Exists**: Đảm bảo database đã được tạo trước khi chạy migrations
6. **Permissions**: Đảm bảo user có quyền CREATE TABLE, CREATE INDEX, etc.

---

## 🐛 Troubleshooting

### Error: Cannot connect to database

**Solution:**
- Kiểm tra PostgreSQL đang chạy
- Verify `.env` file có đúng credentials
- Test connection: `psql -h localhost -U postgres -d coffee_shop_db`

### Error: Migration already executed

**Solution:**
- Check `migrations` table: `SELECT * FROM migrations;`
- Nếu migration đã chạy, skip hoặc revert trước

### Error: Permission denied

**Solution:**
- Đảm bảo user có quyền CREATE TABLE
- Grant permissions: `GRANT ALL PRIVILEGES ON DATABASE coffee_shop_db TO postgres;`

### Error: Table already exists

**Solution:**
- Drop existing tables hoặc database
- Hoặc skip migration nếu schema đã đúng

---

## 📚 Tài liệu Liên quan

- **Schema Documentation**: `docs_generated/database-engineer/schema-coffee-shop-management.md`
- **ERD**: `docs_generated/database-engineer/erd-coffee-shop-management.md`
- **Migration Script**: `scripts/database/migrations/20251210180652-CreateCoffeeShopManagementSchema.ts`
- **Seed Script**: `scripts/database/seeds/seed-coffee-shop-management.ts`
- **Run Script**: `scripts/database/run-migrations.ps1`

---

## ✅ Checklist Trước Khi Chạy

- [ ] PostgreSQL đã được cài đặt và đang chạy
- [ ] Database đã được tạo
- [ ] File `.env` đã được cấu hình đúng
- [ ] Dependencies đã được cài đặt (`npm install`)
- [ ] Đã backup database (nếu production)
- [ ] Đã test connection đến database
- [ ] Đã review migration code

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Next Review:** 2025-12-17

