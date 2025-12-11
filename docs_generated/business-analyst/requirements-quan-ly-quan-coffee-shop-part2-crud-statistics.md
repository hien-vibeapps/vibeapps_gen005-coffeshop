# Business Requirements Document - Quản lý quán Coffee Shop
## Part 2: CRUD Operations & Statistics Requirements

**Document Version:** 1.1  
**Last Updated:** 2025-12-10  
**Author:** Business Analyst Team  
**Status:** In Progress

---

## 📋 Tổng Quan

Tài liệu này bổ sung các yêu cầu chi tiết về **CRUD Operations** và **Statistics Section** cho tất cả các entities trong hệ thống Quản lý quán Coffee Shop.

**Lưu ý:** Đây là phần bổ sung cho file `requirements-quan-ly-quan-coffee-shop.md`. Tài liệu này tập trung vào:
- CRUD operations đầy đủ cho TẤT CẢ entities
- Statistics Section với ít nhất 2 Pie Charts cho mỗi màn hình danh sách

---

## 🎯 Nguyên tắc CRUD Operations

### Yêu cầu BẮT BUỘC

Tất cả các entities trong hệ thống PHẢI có đầy đủ 4 operations:

1. **Create (Thêm mới)**
   - Use case chi tiết
   - Business rules và validation rules
   - Error cases và edge cases
   - Acceptance criteria (Given-When-Then)

2. **Read/View (Xem)**
   - Xem danh sách (List view)
   - Xem chi tiết (Detail view)
   - Filter, search, pagination
   - Statistics Section (BẮT BUỘC cho List view)

3. **Update (Sửa)**
   - Use case chi tiết
   - Business rules và validation rules
   - Error cases và edge cases
   - Acceptance criteria

4. **Delete (Xóa)**
   - Use case chi tiết
   - Business rules (soft delete nếu cần)
   - Error cases (không cho xóa nếu có dependencies)
   - Acceptance criteria

---

## 📊 Statistics Section Requirements

### Yêu cầu BẮT BUỘC

**TẤT CẢ màn hình danh sách (List pages) PHẢI có Statistics Section** với các đặc điểm:

1. **Vị trí:** Phía trên cùng của page, trước phần danh sách
2. **Layout:** Grid layout responsive (2-3 columns trên desktop, 1 column trên mobile)
3. **BẮT BUỘC:** Ít nhất 2 biểu đồ dạng Pie Chart
4. **Optional:** Metrics cards (số liệu tổng quan) nếu cần

### Pie Chart Requirements

**Tối thiểu 2 Pie Charts** cho mỗi màn hình danh sách:

- **Master Data** (Nhân viên, Sản phẩm, Danh mục, Bàn, v.v.):
  - Pie Chart 1: Phân bổ theo trạng thái (Active/Inactive, Published/Draft, v.v.)
  - Pie Chart 2: Phân bổ theo loại/category/department (nếu có)

- **Transaction Data** (Đơn hàng, Thanh toán, v.v.):
  - Pie Chart 1: Phân bổ theo trạng thái (Pending/Completed/Cancelled, v.v.)
  - Pie Chart 2: Phân bổ theo phương thức thanh toán/loại đơn (nếu có)

- **Configuration Data:**
  - Pie Chart 1: Phân bổ theo loại cấu hình
  - Pie Chart 2: Phân bổ theo trạng thái

---

## 📝 Chi tiết CRUD Operations cho từng Entity

### 1. Shop (Quán)

#### 1.1. Create Shop
**Use Case:** UC-SHOP-001 - Tạo mới thông tin quán

**Preconditions:**
- User có quyền Owner/Manager
- Chưa có quán nào trong hệ thống (hoặc có quyền tạo quán mới)

**Main Success Scenario:**
1. Owner truy cập trang "Cài đặt quán"
2. Hệ thống hiển thị form tạo quán
3. Owner nhập thông tin:
   - Tên quán (3-100 ký tự, unique)
   - Địa chỉ
   - Số điện thoại (format hợp lệ, unique)
   - Email (format hợp lệ, unique)
   - Logo quán (JPG/PNG/GIF, tối đa 5MB)
   - Giờ mở cửa/đóng cửa
   - Mô tả
4. Owner click "Lưu"
5. Hệ thống validate dữ liệu
6. Hệ thống tạo quán mới
7. Hệ thống hiển thị thông báo "Tạo quán thành công"

**Business Rules:**
- BR-VR1.1: Tên quán phải từ 3-100 ký tự
- BR-VR1.2: Email phải đúng format và unique
- BR-VR1.3: Số điện thoại phải đúng format
- BR-VR1.4: Giờ đóng cửa phải sau giờ mở cửa

**Exception Flows:**
- E1: Email đã tồn tại → Hiển thị lỗi "Email đã được sử dụng"
- E2: Tên quán đã tồn tại → Hiển thị lỗi "Tên quán đã được sử dụng"
- E3: Logo không hợp lệ → Hiển thị lỗi "File ảnh không hợp lệ"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Nhập đầy đủ thông tin hợp lệ và click "Lưu"
- **Then:** Quán được tạo thành công và hiển thị trong hệ thống

#### 1.2. Read Shop
**Use Case:** UC-SHOP-002 - Xem thông tin quán

**Main Success Scenario:**
1. User truy cập trang "Thông tin quán"
2. Hệ thống hiển thị thông tin quán hiện tại
3. User có thể xem tất cả thông tin: tên, địa chỉ, liên hệ, logo, giờ mở cửa, cấu hình

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập trang thông tin quán
- **Then:** Hiển thị đầy đủ thông tin quán

**Note:** Shop không có màn hình danh sách (chỉ có 1 quán), nên không cần Statistics Section.

#### 1.3. Update Shop
**Use Case:** UC-SHOP-003 - Cập nhật thông tin quán

**Main Success Scenario:**
1. Owner truy cập trang "Cài đặt quán"
2. Hệ thống hiển thị form với thông tin hiện tại
3. Owner chỉnh sửa thông tin
4. Owner click "Lưu"
5. Hệ thống validate và cập nhật
6. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Business Rules:**
- Áp dụng tất cả validation rules như Create
- Không thể thay đổi một số thông tin quan trọng (nếu có quy định)

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập và có quán
- **When:** Chỉnh sửa thông tin và click "Lưu"
- **Then:** Thông tin quán được cập nhật thành công

#### 1.4. Delete Shop
**Use Case:** UC-SHOP-004 - Xóa quán

**Main Success Scenario:**
1. Owner truy cập trang "Cài đặt quán"
2. Owner click "Xóa quán"
3. Hệ thống hiển thị dialog xác nhận với cảnh báo
4. Owner nhập mật khẩu xác nhận
5. Owner click "Xác nhận xóa"
6. Hệ thống kiểm tra dependencies (đơn hàng, nhân viên, v.v.)
7. Hệ thống thực hiện soft delete
8. Hệ thống hiển thị thông báo "Xóa quán thành công"

**Business Rules:**
- BR-DI1.1: Không thể xóa quán nếu còn đơn hàng chưa thanh toán
- BR-DI1.2: Sử dụng soft delete (đánh dấu deleted_at)
- BR-AR1.1: Chỉ Owner có quyền xóa quán

**Exception Flows:**
- E1: Còn dependencies → Hiển thị cảnh báo và không cho xóa
- E2: Mật khẩu sai → Hiển thị lỗi "Mật khẩu không đúng"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xác nhận xóa quán với mật khẩu đúng
- **Then:** Quán được đánh dấu xóa (soft delete)

---

### 2. Category (Danh mục)

#### 2.1. Create Category
**Use Case:** UC-CAT-001 - Tạo danh mục mới

**Main Success Scenario:**
1. Owner/Manager truy cập "Quản lý Menu"
2. Owner click "Thêm danh mục"
3. Hệ thống hiển thị form tạo danh mục
4. Owner nhập:
   - Tên danh mục (2-50 ký tự, unique trong quán)
   - Mô tả
   - Upload ảnh (tùy chọn)
   - Thứ tự hiển thị
5. Owner click "Lưu"
6. Hệ thống validate và tạo danh mục
7. Hệ thống hiển thị danh mục mới trong danh sách

**Business Rules:**
- BR-VR2.1: Tên danh mục phải từ 2-50 ký tự, unique trong cùng cấp
- BR-BL3.1: Không thể xóa danh mục nếu còn sản phẩm

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập tên danh mục hợp lệ và click "Lưu"
- **Then:** Danh mục được tạo và hiển thị trong menu

#### 2.2. Read Category
**Use Case:** UC-CAT-002 - Xem danh sách danh mục

**Main Success Scenario:**
1. User truy cập "Quản lý Menu"
2. Hệ thống hiển thị danh sách danh mục với Statistics Section

**Statistics Section (BẮT BUỘC):**

**Pie Chart 1: Phân bổ danh mục theo trạng thái**
- Active (Đang hoạt động)
- Inactive (Tạm ngưng)
- Data source: `SELECT status, COUNT(*) FROM category WHERE shop_id = ? GROUP BY status`

**Pie Chart 2: Phân bổ danh mục theo số lượng sản phẩm**
- 0 sản phẩm
- 1-10 sản phẩm
- 11-50 sản phẩm
- > 50 sản phẩm
- Data source: `SELECT COUNT(p.id) as product_count, COUNT(DISTINCT c.id) FROM category c LEFT JOIN product p ON c.id = p.category_id WHERE c.shop_id = ? GROUP BY c.id`

**Metrics Cards (Optional):**
- Tổng số danh mục
- Số danh mục đang hoạt động
- Số danh mục có sản phẩm

**Use Case:** UC-CAT-003 - Xem chi tiết danh mục

**Main Success Scenario:**
1. User click vào danh mục trong danh sách
2. Hệ thống hiển thị chi tiết:
   - Thông tin danh mục
   - Danh sách sản phẩm trong danh mục
   - Số lượng sản phẩm

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Menu"
- **Then:** Hiển thị danh sách danh mục với Statistics Section (2 Pie Charts)

#### 2.3. Update Category
**Use Case:** UC-CAT-004 - Cập nhật danh mục

**Main Success Scenario:**
1. Owner chọn danh mục cần sửa
2. Owner click "Sửa"
3. Hệ thống hiển thị form với thông tin hiện tại
4. Owner chỉnh sửa
5. Owner click "Lưu"
6. Hệ thống validate và cập nhật
7. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Business Rules:**
- Áp dụng validation rules như Create
- Không thể đổi tên thành tên đã tồn tại

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Sửa thông tin danh mục và click "Lưu"
- **Then:** Danh mục được cập nhật thành công

#### 2.4. Delete Category
**Use Case:** UC-CAT-005 - Xóa danh mục

**Main Success Scenario:**
1. Owner chọn danh mục cần xóa
2. Owner click "Xóa"
3. Hệ thống hiển thị dialog xác nhận
4. Hệ thống kiểm tra danh mục có sản phẩm không
5. Nếu không có sản phẩm:
   - Owner xác nhận xóa
   - Hệ thống thực hiện soft delete
   - Hệ thống hiển thị thông báo "Xóa thành công"
6. Nếu có sản phẩm:
   - Hệ thống hiển thị cảnh báo "Không thể xóa danh mục có sản phẩm"
   - Đề xuất chuyển sản phẩm sang danh mục khác

**Business Rules:**
- BR-BL3.1: Không thể xóa danh mục nếu còn sản phẩm
- BR-DI1.2: Sử dụng soft delete

**Exception Flows:**
- E1: Danh mục có sản phẩm → Không cho xóa, đề xuất chuyển sản phẩm

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa danh mục không có sản phẩm
- **Then:** Danh mục được xóa thành công

---

### 3. Product (Sản phẩm)

#### 3.1. Create Product
**Use Case:** UC-PROD-001 - Tạo sản phẩm mới

**Main Success Scenario:**
1. Owner/Manager truy cập "Quản lý Menu"
2. Owner chọn danh mục
3. Owner click "Thêm sản phẩm"
4. Hệ thống hiển thị form tạo sản phẩm
5. Owner nhập:
   - Tên sản phẩm (2-100 ký tự, unique trong danh mục)
   - Mô tả
   - Giá bán (> 0, <= 99,999,999 VNĐ)
   - Upload ảnh (tối đa 5 ảnh, mỗi ảnh <= 10MB)
   - Thời gian chế biến (0-120 phút)
   - Trạng thái (Có sẵn/Hết hàng/Tạm ngừng)
   - Calorie, Allergen info (tùy chọn)
6. Owner cấu hình tùy chọn (nếu có)
7. Owner click "Lưu"
8. Hệ thống validate và tạo sản phẩm
9. Hệ thống hiển thị sản phẩm mới trong menu

**Business Rules:**
- BR-VR2.2: Tên sản phẩm phải từ 2-100 ký tự, unique trong danh mục
- BR-VR2.3: Giá sản phẩm phải > 0
- BR-VR2.4: Thời gian chế biến từ 0-120 phút
- BR-VR2.5: Tối đa 5 ảnh, mỗi ảnh <= 10MB

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập đầy đủ thông tin sản phẩm hợp lệ và click "Lưu"
- **Then:** Sản phẩm được tạo và hiển thị trong menu

#### 3.2. Read Product
**Use Case:** UC-PROD-002 - Xem danh sách sản phẩm

**Main Success Scenario:**
1. User truy cập "Quản lý Menu" → "Sản phẩm"
2. Hệ thống hiển thị danh sách sản phẩm với Statistics Section

**Statistics Section (BẮT BUỘC):**

**Pie Chart 1: Phân bổ sản phẩm theo trạng thái**
- Available (Có sẵn)
- Out of Stock (Hết hàng)
- Suspended (Tạm ngừng)
- Data source: `SELECT status, COUNT(*) FROM product WHERE shop_id = ? AND deleted_at IS NULL GROUP BY status`

**Pie Chart 2: Phân bổ sản phẩm theo danh mục**
- Group by category name
- Data source: `SELECT c.name, COUNT(p.id) FROM category c LEFT JOIN product p ON c.id = p.category_id WHERE c.shop_id = ? AND p.deleted_at IS NULL GROUP BY c.id, c.name`

**Metrics Cards (Optional):**
- Tổng số sản phẩm
- Số sản phẩm có sẵn
- Số sản phẩm hết hàng
- Số sản phẩm tạm ngừng

**Use Case:** UC-PROD-003 - Xem chi tiết sản phẩm

**Main Success Scenario:**
1. User click vào sản phẩm trong danh sách
2. Hệ thống hiển thị chi tiết:
   - Thông tin sản phẩm
   - Ảnh sản phẩm
   - Tùy chọn (nếu có)
   - Công thức nguyên liệu (nếu có)

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Menu" → "Sản phẩm"
- **Then:** Hiển thị danh sách sản phẩm với Statistics Section (2 Pie Charts)

#### 3.3. Update Product
**Use Case:** UC-PROD-004 - Cập nhật sản phẩm

**Main Success Scenario:**
1. Owner chọn sản phẩm cần sửa
2. Owner click "Sửa"
3. Hệ thống hiển thị form với thông tin hiện tại
4. Owner chỉnh sửa
5. Owner click "Lưu"
6. Hệ thống validate và cập nhật
7. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Business Rules:**
- BR-BL1.2: Nếu thay đổi giá và có đơn hàng chưa thanh toán → Cảnh báo
- Áp dụng validation rules như Create

**Exception Flows:**
- E1: Sản phẩm đang có trong đơn hàng chưa thanh toán → Cảnh báo khi thay đổi giá

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Sửa thông tin sản phẩm và click "Lưu"
- **Then:** Sản phẩm được cập nhật thành công

#### 3.4. Delete Product
**Use Case:** UC-PROD-005 - Xóa sản phẩm

**Main Success Scenario:**
1. Owner chọn sản phẩm cần xóa
2. Owner click "Xóa"
3. Hệ thống hiển thị dialog xác nhận
4. Hệ thống kiểm tra sản phẩm có trong đơn hàng không
5. Nếu không có trong đơn hàng:
   - Owner xác nhận xóa
   - Hệ thống thực hiện soft delete
   - Hệ thống hiển thị thông báo "Xóa thành công"
6. Nếu có trong đơn hàng:
   - Hệ thống hiển thị cảnh báo "Không thể xóa sản phẩm đã có trong đơn hàng"
   - Đề xuất chuyển trạng thái sang "Tạm ngừng" hoặc "Hết hàng"

**Business Rules:**
- BR-BL3.2: Không thể xóa sản phẩm nếu đã có trong đơn hàng
- BR-DI1.2: Sử dụng soft delete

**Exception Flows:**
- E1: Sản phẩm có trong đơn hàng → Không cho xóa, đề xuất tạm ngừng

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa sản phẩm không có trong đơn hàng
- **Then:** Sản phẩm được xóa thành công

---

### 4. Area (Khu vực)

#### 4.1. Create Area
**Use Case:** UC-AREA-001 - Tạo khu vực mới

**Main Success Scenario:**
1. Owner/Manager truy cập "Quản lý Khu vực & Bàn"
2. Owner click "Thêm khu vực"
3. Hệ thống hiển thị form
4. Owner nhập:
   - Tên khu vực (2-50 ký tự, unique trong quán)
   - Mô tả
   - Upload sơ đồ (tùy chọn)
5. Owner click "Lưu"
6. Hệ thống validate và tạo khu vực
7. Hệ thống hiển thị khu vực mới trong danh sách

**Business Rules:**
- BR-VR4.1: Tên khu vực phải từ 2-50 ký tự, unique trong quán

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập tên khu vực hợp lệ và click "Lưu"
- **Then:** Khu vực được tạo và hiển thị trong danh sách

#### 4.2. Read Area
**Use Case:** UC-AREA-002 - Xem danh sách khu vực

**Main Success Scenario:**
1. User truy cập "Quản lý Khu vực & Bàn"
2. Hệ thống hiển thị danh sách khu vực với Statistics Section

**Statistics Section (BẮT BUỘC):**

**Pie Chart 1: Phân bổ khu vực theo trạng thái**
- Active (Đang hoạt động)
- Inactive (Tạm ngưng)
- Data source: `SELECT is_active, COUNT(*) FROM area WHERE shop_id = ? AND deleted_at IS NULL GROUP BY is_active`

**Pie Chart 2: Phân bổ khu vực theo số lượng bàn**
- 0 bàn
- 1-5 bàn
- 6-10 bàn
- > 10 bàn
- Data source: `SELECT COUNT(t.id) as table_count, COUNT(DISTINCT a.id) FROM area a LEFT JOIN table t ON a.id = t.area_id WHERE a.shop_id = ? AND a.deleted_at IS NULL GROUP BY a.id`

**Metrics Cards (Optional):**
- Tổng số khu vực
- Số khu vực đang hoạt động
- Tổng số bàn trong tất cả khu vực

**Use Case:** UC-AREA-003 - Xem chi tiết khu vực

**Main Success Scenario:**
1. User click vào khu vực trong danh sách
2. Hệ thống hiển thị chi tiết:
   - Thông tin khu vực
   - Danh sách bàn trong khu vực
   - Sơ đồ khu vực (nếu có)

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Khu vực & Bàn"
- **Then:** Hiển thị danh sách khu vực với Statistics Section (2 Pie Charts)

#### 4.3. Update Area
**Use Case:** UC-AREA-004 - Cập nhật khu vực

**Main Success Scenario:**
1. Owner chọn khu vực cần sửa
2. Owner click "Sửa"
3. Hệ thống hiển thị form với thông tin hiện tại
4. Owner chỉnh sửa
5. Owner click "Lưu"
6. Hệ thống validate và cập nhật
7. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Sửa thông tin khu vực và click "Lưu"
- **Then:** Khu vực được cập nhật thành công

#### 4.4. Delete Area
**Use Case:** UC-AREA-005 - Xóa khu vực

**Main Success Scenario:**
1. Owner chọn khu vực cần xóa
2. Owner click "Xóa"
3. Hệ thống hiển thị dialog xác nhận
4. Hệ thống kiểm tra khu vực có bàn không
5. Nếu không có bàn:
   - Owner xác nhận xóa
   - Hệ thống thực hiện soft delete
   - Hệ thống hiển thị thông báo "Xóa thành công"
6. Nếu có bàn:
   - Hệ thống hiển thị cảnh báo "Không thể xóa khu vực có bàn"
   - Đề xuất xóa hoặc chuyển bàn sang khu vực khác trước

**Business Rules:**
- BR-DI1.1: Không thể xóa khu vực nếu còn bàn
- BR-DI1.2: Sử dụng soft delete

**Exception Flows:**
- E1: Khu vực có bàn → Không cho xóa

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa khu vực không có bàn
- **Then:** Khu vực được xóa thành công

---

### 5. Table (Bàn)

#### 5.1. Create Table
**Use Case:** UC-TABLE-001 - Tạo bàn mới

**Main Success Scenario:**
1. Owner/Manager truy cập "Quản lý Khu vực & Bàn"
2. Owner chọn khu vực
3. Owner click "Thêm bàn"
4. Hệ thống hiển thị form
5. Owner nhập:
   - Số bàn/Tên bàn (1-20 ký tự, unique trong khu vực)
   - Khu vực (bắt buộc)
   - Số chỗ ngồi (1-50)
   - Ghi chú
6. Owner click "Lưu"
7. Hệ thống validate và tạo bàn
8. Hệ thống hiển thị bàn mới trong sơ đồ

**Business Rules:**
- BR-VR4.2: Số bàn phải từ 1-20 ký tự, unique trong khu vực
- BR-VR4.3: Số chỗ ngồi phải từ 1-50

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập thông tin bàn hợp lệ và click "Lưu"
- **Then:** Bàn được tạo và hiển thị trong sơ đồ

#### 5.2. Read Table
**Use Case:** UC-TABLE-002 - Xem danh sách bàn

**Main Success Scenario:**
1. User truy cập "Quản lý Khu vực & Bàn" → "Bàn"
2. Hệ thống hiển thị danh sách bàn với Statistics Section

**Statistics Section (BẮT BUỘC):**

**Pie Chart 1: Phân bổ bàn theo trạng thái**
- Available (Trống)
- Occupied (Đang sử dụng)
- Reserved (Đã đặt trước)
- Maintenance (Tạm ngưng)
- Data source: `SELECT status, COUNT(*) FROM table WHERE area_id IN (SELECT id FROM area WHERE shop_id = ?) AND deleted_at IS NULL GROUP BY status`

**Pie Chart 2: Phân bổ bàn theo khu vực**
- Group by area name
- Data source: `SELECT a.name, COUNT(t.id) FROM area a LEFT JOIN table t ON a.id = t.area_id WHERE a.shop_id = ? AND t.deleted_at IS NULL GROUP BY a.id, a.name`

**Metrics Cards (Optional):**
- Tổng số bàn
- Số bàn trống
- Số bàn đang sử dụng
- Số bàn đã đặt trước

**Use Case:** UC-TABLE-003 - Xem chi tiết bàn

**Main Success Scenario:**
1. User click vào bàn trong danh sách hoặc sơ đồ
2. Hệ thống hiển thị chi tiết:
   - Thông tin bàn
   - Trạng thái hiện tại
   - Đơn hàng hiện tại (nếu có)
   - Lịch sử đặt bàn

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Khu vực & Bàn" → "Bàn"
- **Then:** Hiển thị danh sách bàn với Statistics Section (2 Pie Charts)

#### 5.3. Update Table
**Use Case:** UC-TABLE-004 - Cập nhật bàn

**Main Success Scenario:**
1. Owner chọn bàn cần sửa
2. Owner click "Sửa"
3. Hệ thống hiển thị form với thông tin hiện tại
4. Owner chỉnh sửa
5. Owner click "Lưu"
6. Hệ thống validate và cập nhật
7. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Business Rules:**
- Không thể thay đổi số bàn nếu đang có đơn hàng
- Có thể thay đổi số chỗ ngồi (nhưng phải >= số người trong đơn hàng hiện tại)

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Sửa thông tin bàn và click "Lưu"
- **Then:** Bàn được cập nhật thành công

#### 5.4. Delete Table
**Use Case:** UC-TABLE-005 - Xóa bàn

**Main Success Scenario:**
1. Owner chọn bàn cần xóa
2. Owner click "Xóa"
3. Hệ thống hiển thị dialog xác nhận
4. Hệ thống kiểm tra bàn có đơn hàng không
5. Nếu không có đơn hàng:
   - Owner xác nhận xóa
   - Hệ thống thực hiện soft delete
   - Hệ thống hiển thị thông báo "Xóa thành công"
6. Nếu có đơn hàng:
   - Hệ thống hiển thị cảnh báo "Không thể xóa bàn đã có đơn hàng"
   - Đề xuất chuyển trạng thái sang "Maintenance"

**Business Rules:**
- BR-DI1.1: Không thể xóa bàn nếu đã có đơn hàng
- BR-DI1.2: Sử dụng soft delete

**Exception Flows:**
- E1: Bàn có đơn hàng → Không cho xóa

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa bàn không có đơn hàng
- **Then:** Bàn được xóa thành công

---

### 6. Employee (Nhân viên)

#### 6.1. Create Employee
**Use Case:** UC-EMP-001 - Tạo nhân viên mới

**Main Success Scenario:**
1. Owner/Manager truy cập "Quản lý Nhân viên"
2. Owner click "Thêm nhân viên"
3. Hệ thống hiển thị form đăng ký
4. Owner nhập:
   - Họ tên (bắt buộc)
   - Email (bắt buộc, unique)
   - Số điện thoại (bắt buộc, unique)
   - Vị trí công việc (Role) (bắt buộc)
   - Upload ảnh đại diện
   - Ngày bắt đầu làm việc
5. Owner phân quyền cho nhân viên
6. Owner click "Tạo tài khoản"
7. Hệ thống tạo tài khoản và gửi email mật khẩu tạm
8. Hệ thống hiển thị thông báo "Tạo tài khoản thành công"

**Business Rules:**
- BR-VR5.1: Email phải đúng format và unique
- BR-VR5.2: Số điện thoại phải đúng format và unique
- BR-VR5.3: Role phải là một trong: owner, manager, shift_manager, waiter, cashier, barista

**Exception Flows:**
- E1: Email đã tồn tại → Hiển thị lỗi "Email đã được sử dụng"
- E2: Email không hợp lệ → Hiển thị lỗi "Email không hợp lệ"
- E3: Gửi email thất bại → Vẫn tạo tài khoản, hiển thị cảnh báo

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập đầy đủ thông tin nhân viên hợp lệ và click "Tạo tài khoản"
- **Then:** Nhân viên được tạo và nhận email mật khẩu tạm

#### 6.2. Read Employee
**Use Case:** UC-EMP-002 - Xem danh sách nhân viên

**Main Success Scenario:**
1. Owner/Manager truy cập "Quản lý Nhân viên"
2. Hệ thống hiển thị danh sách nhân viên với Statistics Section

**Statistics Section (BẮT BUỘC):**

**Pie Chart 1: Phân bổ nhân viên theo trạng thái**
- Active (Đang làm việc)
- Inactive (Đã nghỉ)
- On Leave (Nghỉ phép)
- Data source: `SELECT is_active, COUNT(*) FROM employee WHERE shop_id = ? AND deleted_at IS NULL GROUP BY is_active`

**Pie Chart 2: Phân bổ nhân viên theo vị trí (Role)**
- Owner
- Manager
- Shift Manager
- Waiter
- Cashier
- Barista
- Data source: `SELECT role, COUNT(*) FROM employee WHERE shop_id = ? AND deleted_at IS NULL GROUP BY role`

**Metrics Cards (Optional):**
- Tổng số nhân viên
- Số nhân viên đang làm việc
- Nhân viên mới trong tháng
- Số nhân viên theo từng role

**Use Case:** UC-EMP-003 - Xem chi tiết nhân viên

**Main Success Scenario:**
1. Owner click vào nhân viên trong danh sách
2. Hệ thống hiển thị chi tiết:
   - Thông tin cá nhân
   - Vị trí và quyền
   - Lịch sử làm việc
   - Số đơn hàng đã xử lý
   - Lịch sử chấm công

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Truy cập "Quản lý Nhân viên"
- **Then:** Hiển thị danh sách nhân viên với Statistics Section (2 Pie Charts)

#### 6.3. Update Employee
**Use Case:** UC-EMP-004 - Cập nhật nhân viên

**Main Success Scenario:**
1. Owner chọn nhân viên cần sửa
2. Owner click "Sửa"
3. Hệ thống hiển thị form với thông tin hiện tại
4. Owner chỉnh sửa
5. Owner cập nhật quyền (nếu cần)
6. Owner click "Lưu"
7. Hệ thống validate và cập nhật
8. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Business Rules:**
- Không thể thay đổi email (unique constraint)
- Có thể thay đổi role và quyền

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Sửa thông tin nhân viên và click "Lưu"
- **Then:** Nhân viên được cập nhật thành công

#### 6.4. Delete Employee
**Use Case:** UC-EMP-005 - Xóa nhân viên

**Main Success Scenario:**
1. Owner chọn nhân viên cần xóa
2. Owner click "Xóa"
3. Hệ thống hiển thị dialog xác nhận
4. Hệ thống kiểm tra nhân viên có đơn hàng không
5. Nếu không có đơn hàng:
   - Owner xác nhận xóa
   - Hệ thống thực hiện soft delete
   - Hệ thống hiển thị thông báo "Xóa thành công"
6. Nếu có đơn hàng:
   - Hệ thống hiển thị cảnh báo "Không thể xóa nhân viên đã tạo đơn hàng"
   - Đề xuất chuyển trạng thái sang "Inactive"

**Business Rules:**
- BR-DI1.1: Không thể xóa nhân viên đã tạo đơn hàng
- BR-DI1.2: Sử dụng soft delete
- BR-AR2.5: Chỉ Owner/Manager có quyền xóa nhân viên

**Exception Flows:**
- E1: Nhân viên có đơn hàng → Không cho xóa, đề xuất inactive

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa nhân viên không có đơn hàng
- **Then:** Nhân viên được xóa thành công

---

### 7. Order (Đơn hàng)

#### 7.1. Create Order
**Use Case:** UC-ORDER-001 - Tạo đơn hàng mới

**Main Success Scenario:**
1. Waiter truy cập "Quản lý Đơn hàng"
2. Waiter click "Tạo đơn hàng mới"
3. Hệ thống hiển thị form tạo đơn
4. Waiter chọn bàn (hoặc takeaway/delivery)
5. Waiter chọn sản phẩm từ menu
6. Waiter chọn tùy chọn (nếu có)
7. Waiter nhập số lượng
8. Waiter thêm ghi chú (nếu có)
9. Waiter click "Thêm vào đơn"
10. Hệ thống cập nhật tổng tiền
11. Waiter lặp lại bước 5-10 cho các sản phẩm khác
12. Waiter click "Lưu đơn hàng"
13. Hệ thống validate đơn hàng
14. Hệ thống tạo đơn hàng với trạng thái "Pending"
15. Bàn chuyển sang trạng thái "Occupied"
16. Hệ thống hiển thị thông báo "Tạo đơn hàng thành công"

**Business Rules:**
- BR-VR3.1: Đơn hàng phải có ít nhất 1 sản phẩm
- BR-VR3.2: Số lượng sản phẩm phải > 0 và <= 999
- BR-BL1.4: Tự động cập nhật bàn khi tạo đơn
- BR-BL1.6: Một bàn chỉ có một đơn hàng chưa thanh toán

**Acceptance Criteria:**
- **Given:** Waiter đã đăng nhập và có bàn trống
- **When:** Tạo đơn hàng với ít nhất 1 sản phẩm và click "Lưu đơn hàng"
- **Then:** Đơn hàng được tạo với trạng thái "Pending" và bàn chuyển sang "Occupied"

#### 7.2. Read Order
**Use Case:** UC-ORDER-002 - Xem danh sách đơn hàng

**Main Success Scenario:**
1. User truy cập "Quản lý Đơn hàng"
2. Hệ thống hiển thị danh sách đơn hàng với Statistics Section

**Statistics Section (BẮT BUỘC):**

**Pie Chart 1: Phân bổ đơn hàng theo trạng thái**
- Pending (Đang chờ)
- Preparing (Đang chế biến)
- Ready (Sẵn sàng)
- Served (Đã phục vụ)
- Paid (Đã thanh toán)
- Cancelled (Đã hủy)
- Data source: `SELECT status, COUNT(*) FROM order WHERE shop_id = ? AND deleted_at IS NULL GROUP BY status`

**Pie Chart 2: Phân bổ đơn hàng theo loại**
- Dine-in (Tại quán)
- Takeaway (Mang đi)
- Delivery (Giao hàng)
- Data source: `SELECT order_type, COUNT(*) FROM order WHERE shop_id = ? AND deleted_at IS NULL GROUP BY order_type`

**Metrics Cards (Optional):**
- Tổng số đơn hàng hôm nay
- Tổng doanh thu hôm nay
- Đơn hàng đang xử lý
- Đơn hàng chờ thanh toán

**Use Case:** UC-ORDER-003 - Xem chi tiết đơn hàng

**Main Success Scenario:**
1. User click vào đơn hàng trong danh sách
2. Hệ thống hiển thị chi tiết:
   - Thông tin đơn hàng
   - Danh sách sản phẩm
   - Tổng tiền
   - Trạng thái và lịch sử cập nhật
   - Thông tin thanh toán (nếu có)

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Đơn hàng"
- **Then:** Hiển thị danh sách đơn hàng với Statistics Section (2 Pie Charts)

#### 7.3. Update Order
**Use Case:** UC-ORDER-004 - Cập nhật đơn hàng

**Main Success Scenario:**
1. Waiter chọn đơn hàng cần sửa
2. Waiter click "Sửa"
3. Hệ thống kiểm tra trạng thái đơn hàng
4. Nếu đơn hàng chưa thanh toán:
   - Hệ thống hiển thị form với thông tin hiện tại
   - Waiter thêm/sửa/xóa sản phẩm
   - Waiter cập nhật số lượng
   - Waiter click "Lưu"
   - Hệ thống validate và cập nhật
   - Hệ thống hiển thị thông báo "Cập nhật thành công"
5. Nếu đơn hàng đã thanh toán:
   - Hệ thống hiển thị cảnh báo "Không thể sửa đơn hàng đã thanh toán"

**Business Rules:**
- BR-BL1.2: Đơn hàng đã thanh toán không thể sửa
- BR-AR2.1: Waiter chỉ có thể sửa đơn hàng do chính mình tạo

**Exception Flows:**
- E1: Đơn hàng đã thanh toán → Không cho sửa

**Acceptance Criteria:**
- **Given:** Waiter đã đăng nhập
- **When:** Sửa đơn hàng chưa thanh toán và click "Lưu"
- **Then:** Đơn hàng được cập nhật thành công

#### 7.4. Delete Order (Cancel Order)
**Use Case:** UC-ORDER-005 - Hủy đơn hàng

**Main Success Scenario:**
1. User chọn đơn hàng cần hủy
2. User click "Hủy đơn hàng"
3. Hệ thống hiển thị dialog yêu cầu nhập lý do
4. User nhập lý do hủy
5. Hệ thống kiểm tra trạng thái đơn hàng
6. Nếu đơn hàng "Pending" hoặc "Preparing":
   - User xác nhận hủy
   - Hệ thống cập nhật trạng thái "Cancelled"
   - Hệ thống giải phóng bàn (nếu có)
   - Hệ thống hiển thị thông báo "Hủy đơn hàng thành công"
7. Nếu đơn hàng "Ready" hoặc "Served":
   - Chỉ Manager có thể hủy
   - Manager xác nhận hủy
   - Hệ thống cập nhật trạng thái "Cancelled"
8. Nếu đơn hàng "Paid":
   - Hệ thống hiển thị cảnh báo "Không thể hủy đơn hàng đã thanh toán"
   - Đề xuất tạo đơn hoàn tiền

**Business Rules:**
- BR-BL1.3: Đơn hàng "Pending" hoặc "Preparing" có thể hủy bởi Waiter/Manager
- BR-BL1.3: Đơn hàng "Ready" hoặc "Served" chỉ có thể hủy bởi Manager
- BR-BL1.3: Đơn hàng "Paid" không thể hủy

**Exception Flows:**
- E1: Đơn hàng đã thanh toán → Không cho hủy

**Acceptance Criteria:**
- **Given:** Waiter/Manager đã đăng nhập
- **When:** Hủy đơn hàng "Pending" với lý do
- **Then:** Đơn hàng chuyển sang trạng thái "Cancelled"

---

### 8. Payment (Thanh toán)

#### 8.1. Create Payment
**Use Case:** UC-PAY-001 - Thanh toán đơn hàng

**Main Success Scenario:**
1. Cashier truy cập "Thanh toán"
2. Cashier chọn đơn hàng cần thanh toán
3. Hệ thống hiển thị chi tiết đơn hàng
4. Cashier chọn phương thức thanh toán
5. Nếu tiền mặt:
   - Cashier nhập số tiền khách đưa
   - Hệ thống tính tiền thừa
6. Cashier click "Xác nhận thanh toán"
7. Hệ thống validate
8. Hệ thống tạo giao dịch thanh toán
9. Hệ thống cập nhật trạng thái đơn hàng thành "Paid"
10. Bàn chuyển sang trạng thái "Available"
11. Hệ thống hiển thị dialog in hóa đơn
12. Cashier click "In hóa đơn"
13. Hệ thống in hóa đơn
14. Hệ thống hiển thị thông báo "Thanh toán thành công"

**Business Rules:**
- BR-BL4.1: Số tiền khách đưa phải >= Tổng tiền (nếu tiền mặt)
- BR-BL4.4: Hóa đơn chỉ có thể in sau khi thanh toán thành công
- BR-FR1.4: Doanh thu chỉ được ghi nhận khi đơn hàng "Paid"

**Acceptance Criteria:**
- **Given:** Cashier đã đăng nhập và có đơn hàng "Served"
- **When:** Thanh toán đơn hàng với số tiền đủ và click "Xác nhận thanh toán"
- **Then:** Đơn hàng chuyển sang "Paid", bàn chuyển "Available", và hóa đơn được in

#### 8.2. Read Payment
**Use Case:** UC-PAY-002 - Xem danh sách thanh toán

**Main Success Scenario:**
1. User truy cập "Quản lý Thanh toán"
2. Hệ thống hiển thị danh sách thanh toán với Statistics Section

**Statistics Section (BẮT BUỘC):**

**Pie Chart 1: Phân bổ thanh toán theo phương thức**
- Cash (Tiền mặt)
- Card (Thẻ)
- Bank Transfer (Chuyển khoản)
- E-wallet (Ví điện tử)
- Data source: `SELECT payment_method, COUNT(*) FROM payment WHERE order_id IN (SELECT id FROM order WHERE shop_id = ?) GROUP BY payment_method`

**Pie Chart 2: Phân bổ thanh toán theo trạng thái đơn hàng**
- Paid (Đã thanh toán đủ)
- Partial (Thanh toán một phần)
- Data source: `SELECT CASE WHEN SUM(amount) >= o.total_amount THEN 'Paid' ELSE 'Partial' END as payment_status, COUNT(*) FROM payment p JOIN order o ON p.order_id = o.id WHERE o.shop_id = ? GROUP BY payment_status`

**Metrics Cards (Optional):**
- Tổng số giao dịch hôm nay
- Tổng số tiền thanh toán hôm nay
- Số giao dịch theo từng phương thức

**Use Case:** UC-PAY-003 - Xem chi tiết thanh toán

**Main Success Scenario:**
1. User click vào thanh toán trong danh sách
2. Hệ thống hiển thị chi tiết:
   - Thông tin giao dịch
   - Thông tin đơn hàng
   - Phương thức thanh toán
   - Hóa đơn (nếu có)

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Thanh toán"
- **Then:** Hiển thị danh sách thanh toán với Statistics Section (2 Pie Charts)

#### 8.3. Update Payment
**Use Case:** UC-PAY-004 - Cập nhật thanh toán

**Note:** Thanh toán thường không thể sửa sau khi đã tạo. Nếu cần điều chỉnh, phải tạo đơn hoàn tiền hoặc thanh toán bổ sung.

**Exception Case:**
- Chỉ Owner/Manager có thể điều chỉnh thanh toán với lý do và audit log

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Điều chỉnh thanh toán với lý do
- **Then:** Thanh toán được cập nhật và ghi audit log

#### 8.4. Delete Payment (Refund)
**Use Case:** UC-PAY-005 - Hoàn tiền

**Main Success Scenario:**
1. Manager truy cập "Quản lý Thanh toán"
2. Manager chọn thanh toán cần hoàn tiền
3. Manager click "Hoàn tiền"
4. Hệ thống hiển thị dialog yêu cầu nhập lý do
5. Manager nhập lý do hoàn tiền
6. Manager chọn phương thức hoàn tiền
7. Manager click "Xác nhận hoàn tiền"
8. Hệ thống tạo giao dịch hoàn tiền
9. Hệ thống cập nhật lại doanh thu
10. Hệ thống hiển thị thông báo "Hoàn tiền thành công"

**Business Rules:**
- BR-AR2.5: Chỉ Manager có quyền hoàn tiền
- Hoàn tiền theo phương thức thanh toán ban đầu

**Acceptance Criteria:**
- **Given:** Manager đã đăng nhập
- **When:** Hoàn tiền với lý do và phương thức
- **Then:** Giao dịch hoàn tiền được tạo và doanh thu được cập nhật lại

---

### 9. Ingredient (Nguyên liệu)

#### 9.1. Create Ingredient
**Use Case:** UC-ING-001 - Tạo nguyên liệu mới

**Main Success Scenario:**
1. Owner/Manager truy cập "Quản lý Kho"
2. Owner click "Thêm nguyên liệu"
3. Hệ thống hiển thị form
4. Owner nhập:
   - Tên nguyên liệu (2-100 ký tự, unique trong quán)
   - Đơn vị tính (kg, l, pcs, etc.)
   - Giá nhập (>= 0)
   - Nhà cung cấp
   - Mức tồn kho tối thiểu (>= 0)
   - Ngày hết hạn (nếu có)
5. Owner click "Lưu"
6. Hệ thống validate và tạo nguyên liệu
7. Hệ thống hiển thị nguyên liệu mới trong danh sách

**Business Rules:**
- BR-VR6.1: Tên nguyên liệu phải từ 2-100 ký tự, unique trong quán
- BR-VR6.3: Giá nhập phải >= 0
- BR-VR6.5: Mức tồn kho tối thiểu phải >= 0

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập thông tin nguyên liệu hợp lệ và click "Lưu"
- **Then:** Nguyên liệu được tạo và hiển thị trong danh sách

#### 9.2. Read Ingredient
**Use Case:** UC-ING-002 - Xem danh sách nguyên liệu

**Main Success Scenario:**
1. User truy cập "Quản lý Kho"
2. Hệ thống hiển thị danh sách nguyên liệu với Statistics Section

**Statistics Section (BẮT BUỘC):**

**Pie Chart 1: Phân bổ nguyên liệu theo trạng thái tồn kho**
- Đủ hàng (current_stock > min_stock_level)
- Sắp hết (current_stock <= min_stock_level và > 0)
- Hết hàng (current_stock = 0)
- Data source: `SELECT CASE WHEN current_stock > min_stock_level THEN 'Đủ hàng' WHEN current_stock > 0 THEN 'Sắp hết' ELSE 'Hết hàng' END as stock_status, COUNT(*) FROM ingredient WHERE shop_id = ? AND deleted_at IS NULL GROUP BY stock_status`

**Pie Chart 2: Phân bổ nguyên liệu theo đơn vị tính**
- kg
- l (lít)
- pcs (cái)
- Các đơn vị khác
- Data source: `SELECT unit, COUNT(*) FROM ingredient WHERE shop_id = ? AND deleted_at IS NULL GROUP BY unit`

**Metrics Cards (Optional):**
- Tổng số nguyên liệu
- Số nguyên liệu đủ hàng
- Số nguyên liệu sắp hết
- Số nguyên liệu hết hàng
- Tổng giá trị tồn kho

**Use Case:** UC-ING-003 - Xem chi tiết nguyên liệu

**Main Success Scenario:**
1. User click vào nguyên liệu trong danh sách
2. Hệ thống hiển thị chi tiết:
   - Thông tin nguyên liệu
   - Tồn kho hiện tại
   - Lịch sử nhập/xuất
   - Sản phẩm sử dụng nguyên liệu này

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Kho"
- **Then:** Hiển thị danh sách nguyên liệu với Statistics Section (2 Pie Charts)

#### 9.3. Update Ingredient
**Use Case:** UC-ING-004 - Cập nhật nguyên liệu

**Main Success Scenario:**
1. Owner chọn nguyên liệu cần sửa
2. Owner click "Sửa"
3. Hệ thống hiển thị form với thông tin hiện tại
4. Owner chỉnh sửa
5. Owner click "Lưu"
6. Hệ thống validate và cập nhật
7. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Sửa thông tin nguyên liệu và click "Lưu"
- **Then:** Nguyên liệu được cập nhật thành công

#### 9.4. Delete Ingredient
**Use Case:** UC-ING-005 - Xóa nguyên liệu

**Main Success Scenario:**
1. Owner chọn nguyên liệu cần xóa
2. Owner click "Xóa"
3. Hệ thống hiển thị dialog xác nhận
4. Hệ thống kiểm tra nguyên liệu có trong công thức sản phẩm không
5. Nếu không có trong công thức:
   - Owner xác nhận xóa
   - Hệ thống thực hiện soft delete
   - Hệ thống hiển thị thông báo "Xóa thành công"
6. Nếu có trong công thức:
   - Hệ thống hiển thị cảnh báo "Không thể xóa nguyên liệu đang được sử dụng trong công thức sản phẩm"
   - Đề xuất xóa hoặc cập nhật công thức trước

**Business Rules:**
- BR-DI1.1: Không thể xóa nguyên liệu đang được sử dụng trong công thức
- BR-DI1.2: Sử dụng soft delete

**Exception Flows:**
- E1: Nguyên liệu có trong công thức → Không cho xóa

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa nguyên liệu không có trong công thức
- **Then:** Nguyên liệu được xóa thành công

---

### 10. InventoryTransaction (Giao dịch kho)

#### 10.1. Create InventoryTransaction
**Use Case:** UC-INV-001 - Nhập kho

**Main Success Scenario:**
1. Owner/Manager truy cập "Quản lý Kho" → "Nhập kho"
2. Owner click "Tạo phiếu nhập kho"
3. Hệ thống hiển thị form nhập kho
4. Owner nhập:
   - Nhà cung cấp
   - Ngày nhập
   - Ghi chú
5. Owner thêm nguyên liệu:
   - Chọn nguyên liệu
   - Nhập số lượng (> 0, <= 999,999)
   - Nhập giá nhập (>= 0)
   - Nhập ngày hết hạn (nếu có)
6. Owner lặp lại bước 5 cho các nguyên liệu khác
7. Owner click "Lưu phiếu nhập"
8. Hệ thống validate
9. Hệ thống tạo phiếu nhập kho
10. Hệ thống cập nhật số lượng tồn kho
11. Hệ thống hiển thị thông báo "Nhập kho thành công"

**Business Rules:**
- BR-VR6.2: Số lượng nhập phải > 0 và <= 999,999
- BR-VR6.3: Giá nhập phải >= 0
- BR-BL5.1: Tự động cập nhật tồn kho sau khi nhập

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Tạo phiếu nhập kho với nguyên liệu hợp lệ và click "Lưu phiếu nhập"
- **Then:** Phiếu nhập được tạo và tồn kho được cập nhật

**Use Case:** UC-INV-002 - Xuất kho

**Main Success Scenario:**
1. Owner click "Xuất kho"
2. Hệ thống hiển thị form xuất kho
3. Owner nhập:
   - Lý do xuất kho (Sử dụng, Hỏng, Mất, etc.)
   - Ngày xuất
   - Ghi chú
4. Owner thêm nguyên liệu:
   - Chọn nguyên liệu
   - Nhập số lượng xuất (> 0, <= Tồn kho hiện có)
5. Owner click "Lưu phiếu xuất"
6. Hệ thống kiểm tra tồn kho đủ không
7. Hệ thống tạo phiếu xuất
8. Hệ thống trừ số lượng tồn kho
9. Hệ thống hiển thị thông báo "Xuất kho thành công"

**Business Rules:**
- BR-VR6.4: Số lượng xuất phải > 0 và <= Tồn kho hiện có
- BR-BL5.4: Không cho phép xuất quá tồn kho

**Exception Flows:**
- E1: Số lượng xuất > Tồn kho → Hiển thị lỗi "Số lượng xuất không được vượt quá tồn kho"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Tạo phiếu xuất kho với số lượng <= tồn kho và click "Lưu phiếu xuất"
- **Then:** Phiếu xuất được tạo và tồn kho được trừ

#### 10.2. Read InventoryTransaction
**Use Case:** UC-INV-003 - Xem danh sách giao dịch kho

**Main Success Scenario:**
1. User truy cập "Quản lý Kho" → "Lịch sử giao dịch"
2. Hệ thống hiển thị danh sách giao dịch với Statistics Section

**Statistics Section (BẮT BUỘC):**

**Pie Chart 1: Phân bổ giao dịch theo loại**
- In (Nhập kho)
- Out (Xuất kho)
- Auto Deduct (Tự động trừ từ bán hàng)
- Data source: `SELECT transaction_type, COUNT(*) FROM inventory_transaction WHERE shop_id = ? GROUP BY transaction_type`

**Pie Chart 2: Phân bổ giao dịch theo lý do (cho xuất kho)**
- Sử dụng
- Hỏng
- Mất
- Kiểm kê
- Sử dụng cho đơn hàng (auto_deduct)
- Data source: `SELECT reason, COUNT(*) FROM inventory_transaction WHERE shop_id = ? AND transaction_type = 'out' GROUP BY reason`

**Metrics Cards (Optional):**
- Tổng số giao dịch tháng này
- Tổng giá trị nhập kho tháng này
- Tổng giá trị xuất kho tháng này

**Use Case:** UC-INV-004 - Xem chi tiết giao dịch

**Main Success Scenario:**
1. User click vào giao dịch trong danh sách
2. Hệ thống hiển thị chi tiết:
   - Thông tin giao dịch
   - Nguyên liệu
   - Số lượng
   - Giá trị
   - Lý do

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Kho" → "Lịch sử giao dịch"
- **Then:** Hiển thị danh sách giao dịch với Statistics Section (2 Pie Charts)

#### 10.3. Update InventoryTransaction
**Use Case:** UC-INV-005 - Cập nhật giao dịch kho

**Note:** Giao dịch kho thường không thể sửa sau khi đã tạo để đảm bảo tính toàn vẹn dữ liệu. Nếu cần điều chỉnh, phải tạo giao dịch đối ứng.

**Exception Case:**
- Chỉ Owner/Manager có thể điều chỉnh giao dịch với lý do và audit log (trong trường hợp đặc biệt)

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Điều chỉnh giao dịch với lý do (nếu được phép)
- **Then:** Giao dịch được cập nhật và ghi audit log

#### 10.4. Delete InventoryTransaction
**Use Case:** UC-INV-006 - Xóa giao dịch kho

**Note:** Giao dịch kho thường không thể xóa để đảm bảo tính toàn vẹn dữ liệu. Nếu cần hủy, phải tạo giao dịch đối ứng.

**Exception Case:**
- Chỉ Owner có thể xóa giao dịch với lý do và audit log (trong trường hợp đặc biệt)

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa giao dịch với lý do (nếu được phép)
- **Then:** Giao dịch được xóa và ghi audit log

---

## 📊 Tổng kết Statistics Section Requirements

### Danh sách màn hình danh sách cần Statistics Section:

1. ✅ **Category List** - 2 Pie Charts (Trạng thái, Số lượng sản phẩm)
2. ✅ **Product List** - 2 Pie Charts (Trạng thái, Danh mục)
3. ✅ **Area List** - 2 Pie Charts (Trạng thái, Số lượng bàn)
4. ✅ **Table List** - 2 Pie Charts (Trạng thái, Khu vực)
5. ✅ **Employee List** - 2 Pie Charts (Trạng thái, Vị trí/Role)
6. ✅ **Order List** - 2 Pie Charts (Trạng thái, Loại đơn)
7. ✅ **Payment List** - 2 Pie Charts (Phương thức, Trạng thái)
8. ✅ **Ingredient List** - 2 Pie Charts (Trạng thái tồn kho, Đơn vị tính)
9. ✅ **InventoryTransaction List** - 2 Pie Charts (Loại giao dịch, Lý do)

### Nguyên tắc thiết kế Statistics Section:

1. **Vị trí:** Luôn ở phía trên cùng của page, trước phần danh sách
2. **Layout:** Grid responsive (2-3 columns desktop, 1 column mobile)
3. **Pie Charts:** Tối thiểu 2 charts, có thể thêm nếu cần
4. **Metrics Cards:** Optional, nhưng nên có cho các metrics quan trọng
5. **Data Source:** Dữ liệu real-time từ database
6. **Performance:** Cache dữ liệu thống kê nếu cần (tối đa 5 phút)

---

## ✅ Checklist CRUD Operations

### Entities đã có đầy đủ CRUD:

- ✅ Shop (Quán)
- ✅ Category (Danh mục)
- ✅ Product (Sản phẩm)
- ✅ Area (Khu vực)
- ✅ Table (Bàn)
- ✅ Employee (Nhân viên)
- ✅ Order (Đơn hàng)
- ✅ Payment (Thanh toán)
- ✅ Ingredient (Nguyên liệu)
- ✅ InventoryTransaction (Giao dịch kho)

### Entities cần bổ sung (nếu có):

- TableReservation (Đặt bàn) - Có thể xem như một phần của Table management
- ProductOptionGroup & ProductOption - Có thể xem như một phần của Product management
- ProductImage - Có thể xem như một phần của Product management
- ProductIngredient - Có thể xem như một phần của Product/Ingredient management
- EmployeePermission - Có thể xem như một phần của Employee management
- AuditLog - Chỉ Read (không có Create/Update/Delete)

---

**Document Version:** 1.1  
**Last Updated:** 2025-12-10  
**Next Review:** 2025-12-17

