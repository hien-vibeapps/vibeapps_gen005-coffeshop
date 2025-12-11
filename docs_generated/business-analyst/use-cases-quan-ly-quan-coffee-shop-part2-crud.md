# Use Cases - Quản lý quán Coffee Shop
## Part 2: CRUD Operations Use Cases

**Document Version:** 1.1  
**Last Updated:** 2025-12-10  
**Author:** Business Analyst Team  
**Status:** In Progress

---

## 📋 Tổng Quan

Tài liệu này bổ sung các Use Cases chi tiết cho **CRUD Operations** của tất cả các entities trong hệ thống Quản lý quán Coffee Shop.

**Lưu ý:** Đây là phần bổ sung cho file `use-cases-quan-ly-quan-coffee-shop.md`. Tài liệu này tập trung vào các Use Cases CRUD còn thiếu.

---

## 🎯 Use Cases CRUD Operations

### 1. Shop (Quán) - CRUD Operations

#### UC-SHOP-001: Tạo mới thông tin quán
**Actor:** Owner  
**Preconditions:** Chưa có quán nào trong hệ thống (hoặc có quyền tạo quán mới)  
**Postconditions:** Quán mới được tạo trong hệ thống

**Main Success Scenario:**
1. Owner truy cập trang "Cài đặt quán"
2. Hệ thống hiển thị form tạo quán
3. Owner nhập thông tin: tên quán, địa chỉ, SĐT, email, logo, giờ mở cửa/đóng cửa
4. Owner click "Lưu"
5. Hệ thống validate dữ liệu
6. Hệ thống tạo quán mới
7. Hệ thống hiển thị thông báo "Tạo quán thành công"

**Alternative Flows:**
- **A1:** Upload logo → Validate file → Preview → Lưu

**Exception Flows:**
- **E1:** Email đã tồn tại → Hiển thị lỗi "Email đã được sử dụng"
- **E2:** Tên quán đã tồn tại → Hiển thị lỗi "Tên quán đã được sử dụng"
- **E3:** Logo không hợp lệ → Hiển thị lỗi "File ảnh không hợp lệ"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Nhập đầy đủ thông tin hợp lệ và click "Lưu"
- **Then:** Quán được tạo thành công và hiển thị trong hệ thống

#### UC-SHOP-002: Xem thông tin quán
**Actor:** User (đã đăng nhập)  
**Preconditions:** Đã có quán trong hệ thống  
**Postconditions:** Hiển thị thông tin quán

**Main Success Scenario:**
1. User truy cập trang "Thông tin quán"
2. Hệ thống hiển thị thông tin quán hiện tại

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập trang thông tin quán
- **Then:** Hiển thị đầy đủ thông tin quán

#### UC-SHOP-003: Cập nhật thông tin quán
**Actor:** Owner  
**Preconditions:** Đã có quán trong hệ thống  
**Postconditions:** Thông tin quán được cập nhật

**Main Success Scenario:**
1. Owner truy cập trang "Cài đặt quán"
2. Hệ thống hiển thị form với thông tin hiện tại
3. Owner chỉnh sửa thông tin
4. Owner click "Lưu"
5. Hệ thống validate và cập nhật
6. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập và có quán
- **When:** Chỉnh sửa thông tin và click "Lưu"
- **Then:** Thông tin quán được cập nhật thành công

#### UC-SHOP-004: Xóa quán
**Actor:** Owner  
**Preconditions:** Đã có quán trong hệ thống  
**Postconditions:** Quán được đánh dấu xóa (soft delete)

**Main Success Scenario:**
1. Owner truy cập trang "Cài đặt quán"
2. Owner click "Xóa quán"
3. Hệ thống hiển thị dialog xác nhận với cảnh báo
4. Owner nhập mật khẩu xác nhận
5. Owner click "Xác nhận xóa"
6. Hệ thống kiểm tra dependencies
7. Hệ thống thực hiện soft delete
8. Hệ thống hiển thị thông báo "Xóa quán thành công"

**Exception Flows:**
- **E1:** Còn dependencies → Hiển thị cảnh báo và không cho xóa
- **E2:** Mật khẩu sai → Hiển thị lỗi "Mật khẩu không đúng"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xác nhận xóa quán với mật khẩu đúng và không có dependencies
- **Then:** Quán được đánh dấu xóa (soft delete)

---

### 2. Category (Danh mục) - CRUD Operations

#### UC-CAT-001: Tạo danh mục mới
**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager  
**Postconditions:** Danh mục mới được tạo

**Main Success Scenario:**
1. Owner truy cập "Quản lý Menu"
2. Owner click "Thêm danh mục"
3. Hệ thống hiển thị form tạo danh mục
4. Owner nhập: tên danh mục, mô tả, upload ảnh, thứ tự hiển thị
5. Owner click "Lưu"
6. Hệ thống validate và tạo danh mục
7. Hệ thống hiển thị danh mục mới trong danh sách

**Exception Flows:**
- **E1:** Tên danh mục trùng → Hiển thị lỗi "Tên danh mục đã tồn tại"

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập tên danh mục hợp lệ và click "Lưu"
- **Then:** Danh mục được tạo và hiển thị trong menu

#### UC-CAT-002: Xem danh sách danh mục
**Actor:** User (đã đăng nhập)  
**Preconditions:** User đã đăng nhập  
**Postconditions:** Hiển thị danh sách danh mục với Statistics Section

**Main Success Scenario:**
1. User truy cập "Quản lý Menu"
2. Hệ thống hiển thị danh sách danh mục với Statistics Section

**Statistics Section Requirements:**
- **Pie Chart 1:** Phân bổ danh mục theo trạng thái (Active/Inactive)
- **Pie Chart 2:** Phân bổ danh mục theo số lượng sản phẩm (0, 1-10, 11-50, >50)
- **Metrics Cards:** Tổng số danh mục, Số danh mục đang hoạt động

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Menu"
- **Then:** Hiển thị danh sách danh mục với Statistics Section (2 Pie Charts)

#### UC-CAT-003: Xem chi tiết danh mục
**Actor:** User (đã đăng nhập)  
**Preconditions:** Có danh mục trong hệ thống  
**Postconditions:** Hiển thị chi tiết danh mục

**Main Success Scenario:**
1. User click vào danh mục trong danh sách
2. Hệ thống hiển thị chi tiết: thông tin danh mục, danh sách sản phẩm, số lượng sản phẩm

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Click vào danh mục
- **Then:** Hiển thị chi tiết danh mục và danh sách sản phẩm

#### UC-CAT-004: Cập nhật danh mục
**Actor:** Owner/Manager  
**Preconditions:** Có danh mục trong hệ thống  
**Postconditions:** Danh mục được cập nhật

**Main Success Scenario:**
1. Owner chọn danh mục cần sửa
2. Owner click "Sửa"
3. Hệ thống hiển thị form với thông tin hiện tại
4. Owner chỉnh sửa
5. Owner click "Lưu"
6. Hệ thống validate và cập nhật
7. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Sửa thông tin danh mục và click "Lưu"
- **Then:** Danh mục được cập nhật thành công

#### UC-CAT-005: Xóa danh mục
**Actor:** Owner/Manager  
**Preconditions:** Có danh mục trong hệ thống  
**Postconditions:** Danh mục được đánh dấu xóa (soft delete) hoặc không cho xóa

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

**Exception Flows:**
- **E1:** Danh mục có sản phẩm → Không cho xóa, đề xuất chuyển sản phẩm

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa danh mục không có sản phẩm
- **Then:** Danh mục được xóa thành công

---

### 3. Product (Sản phẩm) - CRUD Operations

#### UC-PROD-001: Tạo sản phẩm mới
**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager, đã có danh mục  
**Postconditions:** Sản phẩm mới được tạo

**Main Success Scenario:**
1. Owner truy cập "Quản lý Menu"
2. Owner chọn danh mục
3. Owner click "Thêm sản phẩm"
4. Hệ thống hiển thị form tạo sản phẩm
5. Owner nhập: tên, mô tả, giá, upload ảnh, thời gian chế biến, trạng thái
6. Owner cấu hình tùy chọn (nếu có)
7. Owner click "Lưu"
8. Hệ thống validate và tạo sản phẩm
9. Hệ thống hiển thị sản phẩm mới trong menu

**Exception Flows:**
- **E1:** Tên sản phẩm trùng trong danh mục → Hiển thị lỗi "Tên sản phẩm đã tồn tại"
- **E2:** Giá <= 0 → Hiển thị lỗi "Giá sản phẩm phải lớn hơn 0"
- **E3:** File ảnh không hợp lệ → Hiển thị lỗi "File ảnh không hợp lệ"

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập đầy đủ thông tin sản phẩm hợp lệ và click "Lưu"
- **Then:** Sản phẩm được tạo và hiển thị trong menu

#### UC-PROD-002: Xem danh sách sản phẩm
**Actor:** User (đã đăng nhập)  
**Preconditions:** User đã đăng nhập  
**Postconditions:** Hiển thị danh sách sản phẩm với Statistics Section

**Main Success Scenario:**
1. User truy cập "Quản lý Menu" → "Sản phẩm"
2. Hệ thống hiển thị danh sách sản phẩm với Statistics Section

**Statistics Section Requirements:**
- **Pie Chart 1:** Phân bổ sản phẩm theo trạng thái (Available/Out of Stock/Suspended)
- **Pie Chart 2:** Phân bổ sản phẩm theo danh mục
- **Metrics Cards:** Tổng số sản phẩm, Số sản phẩm có sẵn, Số sản phẩm hết hàng

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Menu" → "Sản phẩm"
- **Then:** Hiển thị danh sách sản phẩm với Statistics Section (2 Pie Charts)

#### UC-PROD-003: Xem chi tiết sản phẩm
**Actor:** User (đã đăng nhập)  
**Preconditions:** Có sản phẩm trong hệ thống  
**Postconditions:** Hiển thị chi tiết sản phẩm

**Main Success Scenario:**
1. User click vào sản phẩm trong danh sách
2. Hệ thống hiển thị chi tiết: thông tin sản phẩm, ảnh, tùy chọn, công thức nguyên liệu

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Click vào sản phẩm
- **Then:** Hiển thị chi tiết sản phẩm đầy đủ

#### UC-PROD-004: Cập nhật sản phẩm
**Actor:** Owner/Manager  
**Preconditions:** Có sản phẩm trong hệ thống  
**Postconditions:** Sản phẩm được cập nhật

**Main Success Scenario:**
1. Owner chọn sản phẩm cần sửa
2. Owner click "Sửa"
3. Hệ thống hiển thị form với thông tin hiện tại
4. Owner chỉnh sửa
5. Owner click "Lưu"
6. Hệ thống validate và cập nhật
7. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Alternative Flows:**
- **A1:** Thay đổi giá → Cảnh báo nếu có đơn hàng chưa thanh toán

**Exception Flows:**
- **E1:** Sản phẩm đang có trong đơn hàng chưa thanh toán → Cảnh báo khi thay đổi giá

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Sửa thông tin sản phẩm và click "Lưu"
- **Then:** Sản phẩm được cập nhật thành công

#### UC-PROD-005: Xóa sản phẩm
**Actor:** Owner/Manager  
**Preconditions:** Có sản phẩm trong hệ thống  
**Postconditions:** Sản phẩm được đánh dấu xóa (soft delete) hoặc không cho xóa

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

**Exception Flows:**
- **E1:** Sản phẩm có trong đơn hàng → Không cho xóa, đề xuất tạm ngừng

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa sản phẩm không có trong đơn hàng
- **Then:** Sản phẩm được xóa thành công

---

### 4. Area (Khu vực) - CRUD Operations

#### UC-AREA-001: Tạo khu vực mới
**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager  
**Postconditions:** Khu vực mới được tạo

**Main Success Scenario:**
1. Owner truy cập "Quản lý Khu vực & Bàn"
2. Owner click "Thêm khu vực"
3. Hệ thống hiển thị form
4. Owner nhập: tên khu vực, mô tả, upload sơ đồ
5. Owner click "Lưu"
6. Hệ thống validate và tạo khu vực
7. Hệ thống hiển thị khu vực mới trong danh sách

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập tên khu vực hợp lệ và click "Lưu"
- **Then:** Khu vực được tạo và hiển thị trong danh sách

#### UC-AREA-002: Xem danh sách khu vực
**Actor:** User (đã đăng nhập)  
**Preconditions:** User đã đăng nhập  
**Postconditions:** Hiển thị danh sách khu vực với Statistics Section

**Main Success Scenario:**
1. User truy cập "Quản lý Khu vực & Bàn"
2. Hệ thống hiển thị danh sách khu vực với Statistics Section

**Statistics Section Requirements:**
- **Pie Chart 1:** Phân bổ khu vực theo trạng thái (Active/Inactive)
- **Pie Chart 2:** Phân bổ khu vực theo số lượng bàn (0, 1-5, 6-10, >10)
- **Metrics Cards:** Tổng số khu vực, Số khu vực đang hoạt động, Tổng số bàn

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Khu vực & Bàn"
- **Then:** Hiển thị danh sách khu vực với Statistics Section (2 Pie Charts)

#### UC-AREA-003: Xem chi tiết khu vực
**Actor:** User (đã đăng nhập)  
**Preconditions:** Có khu vực trong hệ thống  
**Postconditions:** Hiển thị chi tiết khu vực

**Main Success Scenario:**
1. User click vào khu vực trong danh sách
2. Hệ thống hiển thị chi tiết: thông tin khu vực, danh sách bàn, sơ đồ

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Click vào khu vực
- **Then:** Hiển thị chi tiết khu vực và danh sách bàn

#### UC-AREA-004: Cập nhật khu vực
**Actor:** Owner/Manager  
**Preconditions:** Có khu vực trong hệ thống  
**Postconditions:** Khu vực được cập nhật

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

#### UC-AREA-005: Xóa khu vực
**Actor:** Owner/Manager  
**Preconditions:** Có khu vực trong hệ thống  
**Postconditions:** Khu vực được đánh dấu xóa (soft delete) hoặc không cho xóa

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

**Exception Flows:**
- **E1:** Khu vực có bàn → Không cho xóa

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa khu vực không có bàn
- **Then:** Khu vực được xóa thành công

---

### 5. Table (Bàn) - CRUD Operations

#### UC-TABLE-001: Tạo bàn mới
**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager, đã có khu vực  
**Postconditions:** Bàn mới được tạo

**Main Success Scenario:**
1. Owner truy cập "Quản lý Khu vực & Bàn"
2. Owner chọn khu vực
3. Owner click "Thêm bàn"
4. Hệ thống hiển thị form
5. Owner nhập: số bàn/tên bàn, khu vực, số chỗ ngồi, ghi chú
6. Owner click "Lưu"
7. Hệ thống validate và tạo bàn
8. Hệ thống hiển thị bàn mới trong sơ đồ

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập thông tin bàn hợp lệ và click "Lưu"
- **Then:** Bàn được tạo và hiển thị trong sơ đồ

#### UC-TABLE-002: Xem danh sách bàn
**Actor:** User (đã đăng nhập)  
**Preconditions:** User đã đăng nhập  
**Postconditions:** Hiển thị danh sách bàn với Statistics Section

**Main Success Scenario:**
1. User truy cập "Quản lý Khu vực & Bàn" → "Bàn"
2. Hệ thống hiển thị danh sách bàn với Statistics Section

**Statistics Section Requirements:**
- **Pie Chart 1:** Phân bổ bàn theo trạng thái (Available/Occupied/Reserved/Maintenance)
- **Pie Chart 2:** Phân bổ bàn theo khu vực
- **Metrics Cards:** Tổng số bàn, Số bàn trống, Số bàn đang sử dụng, Số bàn đã đặt trước

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Khu vực & Bàn" → "Bàn"
- **Then:** Hiển thị danh sách bàn với Statistics Section (2 Pie Charts)

#### UC-TABLE-003: Xem chi tiết bàn
**Actor:** User (đã đăng nhập)  
**Preconditions:** Có bàn trong hệ thống  
**Postconditions:** Hiển thị chi tiết bàn

**Main Success Scenario:**
1. User click vào bàn trong danh sách hoặc sơ đồ
2. Hệ thống hiển thị chi tiết: thông tin bàn, trạng thái, đơn hàng hiện tại, lịch sử đặt bàn

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Click vào bàn
- **Then:** Hiển thị chi tiết bàn đầy đủ

#### UC-TABLE-004: Cập nhật bàn
**Actor:** Owner/Manager  
**Preconditions:** Có bàn trong hệ thống  
**Postconditions:** Bàn được cập nhật

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

#### UC-TABLE-005: Xóa bàn
**Actor:** Owner/Manager  
**Preconditions:** Có bàn trong hệ thống  
**Postconditions:** Bàn được đánh dấu xóa (soft delete) hoặc không cho xóa

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

**Exception Flows:**
- **E1:** Bàn có đơn hàng → Không cho xóa

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa bàn không có đơn hàng
- **Then:** Bàn được xóa thành công

---

### 6. Employee (Nhân viên) - CRUD Operations

#### UC-EMP-001: Tạo nhân viên mới
**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager  
**Postconditions:** Nhân viên mới được tạo và nhận email mật khẩu tạm

**Main Success Scenario:**
1. Owner truy cập "Quản lý Nhân viên"
2. Owner click "Thêm nhân viên"
3. Hệ thống hiển thị form đăng ký
4. Owner nhập: họ tên, email, SĐT, vị trí, upload ảnh, ngày bắt đầu
5. Owner phân quyền cho nhân viên
6. Owner click "Tạo tài khoản"
7. Hệ thống tạo tài khoản và gửi email mật khẩu tạm
8. Hệ thống hiển thị thông báo "Tạo tài khoản thành công"

**Exception Flows:**
- **E1:** Email đã tồn tại → Hiển thị lỗi "Email đã được sử dụng"
- **E2:** Email không hợp lệ → Hiển thị lỗi "Email không hợp lệ"
- **E3:** Gửi email thất bại → Vẫn tạo tài khoản, hiển thị cảnh báo

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập đầy đủ thông tin nhân viên hợp lệ và click "Tạo tài khoản"
- **Then:** Nhân viên được tạo và nhận email mật khẩu tạm

#### UC-EMP-002: Xem danh sách nhân viên
**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager  
**Postconditions:** Hiển thị danh sách nhân viên với Statistics Section

**Main Success Scenario:**
1. Owner truy cập "Quản lý Nhân viên"
2. Hệ thống hiển thị danh sách nhân viên với Statistics Section

**Statistics Section Requirements:**
- **Pie Chart 1:** Phân bổ nhân viên theo trạng thái (Active/Inactive)
- **Pie Chart 2:** Phân bổ nhân viên theo vị trí (Owner/Manager/Shift Manager/Waiter/Cashier/Barista)
- **Metrics Cards:** Tổng số nhân viên, Số nhân viên đang làm việc, Nhân viên mới trong tháng

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Truy cập "Quản lý Nhân viên"
- **Then:** Hiển thị danh sách nhân viên với Statistics Section (2 Pie Charts)

#### UC-EMP-003: Xem chi tiết nhân viên
**Actor:** Owner/Manager  
**Preconditions:** Có nhân viên trong hệ thống  
**Postconditions:** Hiển thị chi tiết nhân viên

**Main Success Scenario:**
1. Owner click vào nhân viên trong danh sách
2. Hệ thống hiển thị chi tiết: thông tin cá nhân, vị trí và quyền, lịch sử làm việc, số đơn hàng đã xử lý, lịch sử chấm công

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Click vào nhân viên
- **Then:** Hiển thị chi tiết nhân viên đầy đủ

#### UC-EMP-004: Cập nhật nhân viên
**Actor:** Owner/Manager  
**Preconditions:** Có nhân viên trong hệ thống  
**Postconditions:** Nhân viên được cập nhật

**Main Success Scenario:**
1. Owner chọn nhân viên cần sửa
2. Owner click "Sửa"
3. Hệ thống hiển thị form với thông tin hiện tại
4. Owner chỉnh sửa
5. Owner cập nhật quyền (nếu cần)
6. Owner click "Lưu"
7. Hệ thống validate và cập nhật
8. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Sửa thông tin nhân viên và click "Lưu"
- **Then:** Nhân viên được cập nhật thành công

#### UC-EMP-005: Xóa nhân viên
**Actor:** Owner/Manager  
**Preconditions:** Có nhân viên trong hệ thống  
**Postconditions:** Nhân viên được đánh dấu xóa (soft delete) hoặc không cho xóa

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

**Exception Flows:**
- **E1:** Nhân viên có đơn hàng → Không cho xóa, đề xuất inactive

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa nhân viên không có đơn hàng
- **Then:** Nhân viên được xóa thành công

---

### 7. Order (Đơn hàng) - CRUD Operations

#### UC-ORDER-001: Tạo đơn hàng mới
**Actor:** Waiter, Shift Manager  
**Preconditions:** User đã đăng nhập, có bàn trống hoặc đã đặt  
**Postconditions:** Đơn hàng mới được tạo với trạng thái "Pending"

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

**Acceptance Criteria:**
- **Given:** Waiter đã đăng nhập và có bàn trống
- **When:** Tạo đơn hàng với ít nhất 1 sản phẩm và click "Lưu đơn hàng"
- **Then:** Đơn hàng được tạo với trạng thái "Pending" và bàn chuyển sang "Occupied"

#### UC-ORDER-002: Xem danh sách đơn hàng
**Actor:** User (đã đăng nhập)  
**Preconditions:** User đã đăng nhập  
**Postconditions:** Hiển thị danh sách đơn hàng với Statistics Section

**Main Success Scenario:**
1. User truy cập "Quản lý Đơn hàng"
2. Hệ thống hiển thị danh sách đơn hàng với Statistics Section

**Statistics Section Requirements:**
- **Pie Chart 1:** Phân bổ đơn hàng theo trạng thái (Pending/Preparing/Ready/Served/Paid/Cancelled)
- **Pie Chart 2:** Phân bổ đơn hàng theo loại (Dine-in/Takeaway/Delivery)
- **Metrics Cards:** Tổng số đơn hàng hôm nay, Tổng doanh thu hôm nay, Đơn hàng đang xử lý, Đơn hàng chờ thanh toán

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Đơn hàng"
- **Then:** Hiển thị danh sách đơn hàng với Statistics Section (2 Pie Charts)

#### UC-ORDER-003: Xem chi tiết đơn hàng
**Actor:** User (đã đăng nhập)  
**Preconditions:** Có đơn hàng trong hệ thống  
**Postconditions:** Hiển thị chi tiết đơn hàng

**Main Success Scenario:**
1. User click vào đơn hàng trong danh sách
2. Hệ thống hiển thị chi tiết: thông tin đơn hàng, danh sách sản phẩm, tổng tiền, trạng thái và lịch sử cập nhật, thông tin thanh toán

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Click vào đơn hàng
- **Then:** Hiển thị chi tiết đơn hàng đầy đủ

#### UC-ORDER-004: Cập nhật đơn hàng
**Actor:** Waiter, Shift Manager  
**Preconditions:** Có đơn hàng chưa thanh toán trong hệ thống  
**Postconditions:** Đơn hàng được cập nhật

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

**Exception Flows:**
- **E1:** Đơn hàng đã thanh toán → Không cho sửa

**Acceptance Criteria:**
- **Given:** Waiter đã đăng nhập
- **When:** Sửa đơn hàng chưa thanh toán và click "Lưu"
- **Then:** Đơn hàng được cập nhật thành công

#### UC-ORDER-005: Hủy đơn hàng
**Actor:** Waiter, Shift Manager, Manager  
**Preconditions:** Có đơn hàng trong hệ thống  
**Postconditions:** Đơn hàng chuyển sang trạng thái "Cancelled"

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

**Exception Flows:**
- **E1:** Đơn hàng đã thanh toán → Không cho hủy

**Acceptance Criteria:**
- **Given:** Waiter/Manager đã đăng nhập
- **When:** Hủy đơn hàng "Pending" với lý do
- **Then:** Đơn hàng chuyển sang trạng thái "Cancelled"

---

### 8. Payment (Thanh toán) - CRUD Operations

#### UC-PAY-001: Thanh toán đơn hàng
**Actor:** Cashier, Shift Manager  
**Preconditions:** Đơn hàng có trạng thái "Served" hoặc "Ready"  
**Postconditions:** Đơn hàng chuyển sang trạng thái "Paid", bàn chuyển "Available"

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

**Acceptance Criteria:**
- **Given:** Cashier đã đăng nhập và có đơn hàng "Served"
- **When:** Thanh toán đơn hàng với số tiền đủ và click "Xác nhận thanh toán"
- **Then:** Đơn hàng chuyển sang "Paid", bàn chuyển "Available", và hóa đơn được in

#### UC-PAY-002: Xem danh sách thanh toán
**Actor:** User (đã đăng nhập)  
**Preconditions:** User đã đăng nhập  
**Postconditions:** Hiển thị danh sách thanh toán với Statistics Section

**Main Success Scenario:**
1. User truy cập "Quản lý Thanh toán"
2. Hệ thống hiển thị danh sách thanh toán với Statistics Section

**Statistics Section Requirements:**
- **Pie Chart 1:** Phân bổ thanh toán theo phương thức (Cash/Card/Bank Transfer/E-wallet)
- **Pie Chart 2:** Phân bổ thanh toán theo trạng thái (Paid/Partial)
- **Metrics Cards:** Tổng số giao dịch hôm nay, Tổng số tiền thanh toán hôm nay

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Thanh toán"
- **Then:** Hiển thị danh sách thanh toán với Statistics Section (2 Pie Charts)

#### UC-PAY-003: Xem chi tiết thanh toán
**Actor:** User (đã đăng nhập)  
**Preconditions:** Có thanh toán trong hệ thống  
**Postconditions:** Hiển thị chi tiết thanh toán

**Main Success Scenario:**
1. User click vào thanh toán trong danh sách
2. Hệ thống hiển thị chi tiết: thông tin giao dịch, thông tin đơn hàng, phương thức thanh toán, hóa đơn

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Click vào thanh toán
- **Then:** Hiển thị chi tiết thanh toán đầy đủ

#### UC-PAY-004: Cập nhật thanh toán
**Actor:** Owner/Manager (chỉ trong trường hợp đặc biệt)  
**Preconditions:** Có thanh toán trong hệ thống  
**Postconditions:** Thanh toán được điều chỉnh với audit log

**Note:** Thanh toán thường không thể sửa sau khi đã tạo. Chỉ Owner/Manager có thể điều chỉnh với lý do và audit log.

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Điều chỉnh thanh toán với lý do
- **Then:** Thanh toán được cập nhật và ghi audit log

#### UC-PAY-005: Hoàn tiền
**Actor:** Manager  
**Preconditions:** Có thanh toán đã hoàn thành trong hệ thống  
**Postconditions:** Giao dịch hoàn tiền được tạo, doanh thu được cập nhật lại

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

**Acceptance Criteria:**
- **Given:** Manager đã đăng nhập
- **When:** Hoàn tiền với lý do và phương thức
- **Then:** Giao dịch hoàn tiền được tạo và doanh thu được cập nhật lại

---

### 9. Ingredient (Nguyên liệu) - CRUD Operations

#### UC-ING-001: Tạo nguyên liệu mới
**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager  
**Postconditions:** Nguyên liệu mới được tạo

**Main Success Scenario:**
1. Owner truy cập "Quản lý Kho"
2. Owner click "Thêm nguyên liệu"
3. Hệ thống hiển thị form
4. Owner nhập: tên nguyên liệu, đơn vị tính, giá nhập, nhà cung cấp, mức tồn kho tối thiểu
5. Owner click "Lưu"
6. Hệ thống validate và tạo nguyên liệu
7. Hệ thống hiển thị nguyên liệu mới trong danh sách

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Nhập thông tin nguyên liệu hợp lệ và click "Lưu"
- **Then:** Nguyên liệu được tạo và hiển thị trong danh sách

#### UC-ING-002: Xem danh sách nguyên liệu
**Actor:** User (đã đăng nhập)  
**Preconditions:** User đã đăng nhập  
**Postconditions:** Hiển thị danh sách nguyên liệu với Statistics Section

**Main Success Scenario:**
1. User truy cập "Quản lý Kho"
2. Hệ thống hiển thị danh sách nguyên liệu với Statistics Section

**Statistics Section Requirements:**
- **Pie Chart 1:** Phân bổ nguyên liệu theo trạng thái tồn kho (Đủ hàng/Sắp hết/Hết hàng)
- **Pie Chart 2:** Phân bổ nguyên liệu theo đơn vị tính (kg/l/pcs/khác)
- **Metrics Cards:** Tổng số nguyên liệu, Số nguyên liệu đủ hàng, Số nguyên liệu sắp hết, Số nguyên liệu hết hàng, Tổng giá trị tồn kho

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Kho"
- **Then:** Hiển thị danh sách nguyên liệu với Statistics Section (2 Pie Charts)

#### UC-ING-003: Xem chi tiết nguyên liệu
**Actor:** User (đã đăng nhập)  
**Preconditions:** Có nguyên liệu trong hệ thống  
**Postconditions:** Hiển thị chi tiết nguyên liệu

**Main Success Scenario:**
1. User click vào nguyên liệu trong danh sách
2. Hệ thống hiển thị chi tiết: thông tin nguyên liệu, tồn kho hiện tại, lịch sử nhập/xuất, sản phẩm sử dụng nguyên liệu này

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Click vào nguyên liệu
- **Then:** Hiển thị chi tiết nguyên liệu đầy đủ

#### UC-ING-004: Cập nhật nguyên liệu
**Actor:** Owner/Manager  
**Preconditions:** Có nguyên liệu trong hệ thống  
**Postconditions:** Nguyên liệu được cập nhật

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

#### UC-ING-005: Xóa nguyên liệu
**Actor:** Owner/Manager  
**Preconditions:** Có nguyên liệu trong hệ thống  
**Postconditions:** Nguyên liệu được đánh dấu xóa (soft delete) hoặc không cho xóa

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

**Exception Flows:**
- **E1:** Nguyên liệu có trong công thức → Không cho xóa

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa nguyên liệu không có trong công thức
- **Then:** Nguyên liệu được xóa thành công

---

### 10. InventoryTransaction (Giao dịch kho) - CRUD Operations

#### UC-INV-001: Nhập kho
**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager  
**Postconditions:** Phiếu nhập kho được tạo, tồn kho được cập nhật

**Main Success Scenario:**
1. Owner truy cập "Quản lý Kho" → "Nhập kho"
2. Owner click "Tạo phiếu nhập kho"
3. Hệ thống hiển thị form nhập kho
4. Owner nhập: nhà cung cấp, ngày nhập, ghi chú
5. Owner thêm nguyên liệu: chọn nguyên liệu, nhập số lượng, giá nhập, ngày hết hạn
6. Owner lặp lại bước 5 cho các nguyên liệu khác
7. Owner click "Lưu phiếu nhập"
8. Hệ thống validate
9. Hệ thống tạo phiếu nhập kho
10. Hệ thống cập nhật số lượng tồn kho
11. Hệ thống hiển thị thông báo "Nhập kho thành công"

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Tạo phiếu nhập kho với nguyên liệu hợp lệ và click "Lưu phiếu nhập"
- **Then:** Phiếu nhập được tạo và tồn kho được cập nhật

#### UC-INV-002: Xuất kho
**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager  
**Postconditions:** Phiếu xuất kho được tạo, tồn kho được trừ

**Main Success Scenario:**
1. Owner click "Xuất kho"
2. Hệ thống hiển thị form xuất kho
3. Owner nhập: lý do xuất kho, ngày xuất, ghi chú
4. Owner thêm nguyên liệu: chọn nguyên liệu, nhập số lượng xuất
5. Owner click "Lưu phiếu xuất"
6. Hệ thống kiểm tra tồn kho đủ không
7. Hệ thống tạo phiếu xuất
8. Hệ thống trừ số lượng tồn kho
9. Hệ thống hiển thị thông báo "Xuất kho thành công"

**Exception Flows:**
- **E1:** Số lượng xuất > Tồn kho → Hiển thị lỗi "Số lượng xuất không được vượt quá tồn kho"

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Tạo phiếu xuất kho với số lượng <= tồn kho và click "Lưu phiếu xuất"
- **Then:** Phiếu xuất được tạo và tồn kho được trừ

#### UC-INV-003: Xem danh sách giao dịch kho
**Actor:** User (đã đăng nhập)  
**Preconditions:** User đã đăng nhập  
**Postconditions:** Hiển thị danh sách giao dịch với Statistics Section

**Main Success Scenario:**
1. User truy cập "Quản lý Kho" → "Lịch sử giao dịch"
2. Hệ thống hiển thị danh sách giao dịch với Statistics Section

**Statistics Section Requirements:**
- **Pie Chart 1:** Phân bổ giao dịch theo loại (In/Out/Auto Deduct)
- **Pie Chart 2:** Phân bổ giao dịch theo lý do (cho xuất kho)
- **Metrics Cards:** Tổng số giao dịch tháng này, Tổng giá trị nhập kho, Tổng giá trị xuất kho

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Truy cập "Quản lý Kho" → "Lịch sử giao dịch"
- **Then:** Hiển thị danh sách giao dịch với Statistics Section (2 Pie Charts)

#### UC-INV-004: Xem chi tiết giao dịch
**Actor:** User (đã đăng nhập)  
**Preconditions:** Có giao dịch trong hệ thống  
**Postconditions:** Hiển thị chi tiết giao dịch

**Main Success Scenario:**
1. User click vào giao dịch trong danh sách
2. Hệ thống hiển thị chi tiết: thông tin giao dịch, nguyên liệu, số lượng, giá trị, lý do

**Acceptance Criteria:**
- **Given:** User đã đăng nhập
- **When:** Click vào giao dịch
- **Then:** Hiển thị chi tiết giao dịch đầy đủ

#### UC-INV-005: Cập nhật giao dịch kho
**Actor:** Owner/Manager (chỉ trong trường hợp đặc biệt)  
**Preconditions:** Có giao dịch trong hệ thống  
**Postconditions:** Giao dịch được điều chỉnh với audit log

**Note:** Giao dịch kho thường không thể sửa sau khi đã tạo để đảm bảo tính toàn vẹn dữ liệu. Chỉ Owner/Manager có thể điều chỉnh với lý do và audit log.

**Acceptance Criteria:**
- **Given:** Owner/Manager đã đăng nhập
- **When:** Điều chỉnh giao dịch với lý do (nếu được phép)
- **Then:** Giao dịch được cập nhật và ghi audit log

#### UC-INV-006: Xóa giao dịch kho
**Actor:** Owner (chỉ trong trường hợp đặc biệt)  
**Preconditions:** Có giao dịch trong hệ thống  
**Postconditions:** Giao dịch được xóa với audit log

**Note:** Giao dịch kho thường không thể xóa để đảm bảo tính toàn vẹn dữ liệu. Chỉ Owner có thể xóa với lý do và audit log.

**Acceptance Criteria:**
- **Given:** Owner đã đăng nhập
- **When:** Xóa giao dịch với lý do (nếu được phép)
- **Then:** Giao dịch được xóa và ghi audit log

---

## 📊 Tổng kết Use Cases CRUD

### Checklist Use Cases CRUD Operations:

- ✅ **Shop (Quán)** - 4 Use Cases (Create, Read, Update, Delete)
- ✅ **Category (Danh mục)** - 5 Use Cases (Create, Read List, Read Detail, Update, Delete)
- ✅ **Product (Sản phẩm)** - 5 Use Cases (Create, Read List, Read Detail, Update, Delete)
- ✅ **Area (Khu vực)** - 5 Use Cases (Create, Read List, Read Detail, Update, Delete)
- ✅ **Table (Bàn)** - 5 Use Cases (Create, Read List, Read Detail, Update, Delete)
- ✅ **Employee (Nhân viên)** - 5 Use Cases (Create, Read List, Read Detail, Update, Delete)
- ✅ **Order (Đơn hàng)** - 5 Use Cases (Create, Read List, Read Detail, Update, Cancel)
- ✅ **Payment (Thanh toán)** - 5 Use Cases (Create, Read List, Read Detail, Update, Refund)
- ✅ **Ingredient (Nguyên liệu)** - 5 Use Cases (Create, Read List, Read Detail, Update, Delete)
- ✅ **InventoryTransaction (Giao dịch kho)** - 6 Use Cases (Create In, Create Out, Read List, Read Detail, Update, Delete)

### Tổng số Use Cases CRUD: 50 Use Cases

---

**Document Version:** 1.1  
**Last Updated:** 2025-12-10  
**Next Review:** 2025-12-17

