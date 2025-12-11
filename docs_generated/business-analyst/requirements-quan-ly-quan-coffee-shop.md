# Business Requirements Document - Quản lý quán Coffee Shop

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Author:** Business Analyst Team  
**Status:** In Progress

---

## 📋 Tổng Quan

Tài liệu này mô tả chi tiết các yêu cầu nghiệp vụ cho tính năng **Quản lý quán Coffee Shop** trong hệ thống vibeapps Platform.

### Mục đích
Hệ thống quản lý quán Coffee Shop cho phép chủ quán và nhân viên quản lý toàn bộ hoạt động của quán cà phê, bao gồm:
- Quản lý thông tin quán
- Quản lý menu và sản phẩm
- Quản lý đơn hàng
- Quản lý bàn và khu vực
- Quản lý nhân viên
- Báo cáo và thống kê

### Phạm vi
- **In Scope:**
  - Quản lý thông tin cơ bản của quán
  - Quản lý menu và danh mục sản phẩm
  - Quản lý đơn hàng (tạo, cập nhật, hủy)
  - Quản lý bàn và khu vực phục vụ
  - Quản lý nhân viên và phân quyền
  - Báo cáo doanh thu và thống kê
  - Quản lý kho hàng (tồn kho nguyên liệu)

- **Out of Scope:**
  - Hệ thống thanh toán trực tuyến (tích hợp bên thứ 3)
  - Quản lý marketing và khuyến mãi (sẽ có module riêng)
  - Quản lý khách hàng thành viên (sẽ có module riêng)
  - Quản lý nhà cung cấp (sẽ có module riêng)

---

## 👥 Stakeholders

### Primary Users
1. **Chủ quán (Owner/Manager)**
   - Quản lý toàn bộ hoạt động quán
   - Xem báo cáo và thống kê
   - Quản lý nhân viên và phân quyền
   - Cấu hình hệ thống

2. **Quản lý ca (Shift Manager)**
   - Quản lý đơn hàng trong ca làm việc
   - Quản lý bàn và khu vực
   - Xem báo cáo ca làm việc

3. **Nhân viên phục vụ (Waiter/Server)**
   - Tạo và quản lý đơn hàng
   - Cập nhật trạng thái bàn
   - Xem menu và giá

4. **Nhân viên thu ngân (Cashier)**
   - Xử lý thanh toán đơn hàng
   - In hóa đơn
   - Quản lý giao dịch

5. **Nhân viên barista (Barista)**
   - Xem đơn hàng cần chế biến
   - Cập nhật trạng thái đơn hàng
   - Quản lý nguyên liệu sử dụng

### Secondary Users
- **Khách hàng** (nếu có ứng dụng đặt hàng)
- **Kế toán** (xem báo cáo tài chính)

---

## 🎯 Business Objectives

1. **Tăng hiệu quả vận hành**
   - Giảm thời gian xử lý đơn hàng
   - Tối ưu quản lý bàn và khu vực
   - Tự động hóa các quy trình nghiệp vụ

2. **Cải thiện trải nghiệm khách hàng**
   - Xử lý đơn hàng nhanh chóng
   - Quản lý bàn hiệu quả
   - Menu rõ ràng, dễ tìm

3. **Tăng doanh thu**
   - Theo dõi doanh thu theo thời gian thực
   - Phân tích xu hướng bán hàng
   - Tối ưu menu và giá cả

4. **Quản lý tài chính**
   - Theo dõi chi phí và doanh thu
   - Quản lý kho hàng
   - Báo cáo tài chính chính xác

---

## 📊 Functional Requirements

### FR1: Quản lý Thông tin Quán

#### FR1.1: Thông tin cơ bản
- **Mô tả:** Hệ thống cho phép quản lý thông tin cơ bản của quán cà phê
- **Yêu cầu:**
  - Tên quán
  - Địa chỉ
  - Số điện thoại
  - Email
  - Logo quán
  - Giờ mở cửa/đóng cửa
  - Mô tả quán
  - Website/Social media links

#### FR1.2: Cấu hình hệ thống
- **Mô tả:** Cấu hình các thông số hệ thống
- **Yêu cầu:**
  - Đơn vị tiền tệ
  - Ngôn ngữ hiển thị
  - Múi giờ
  - Format ngày tháng
  - Cấu hình in hóa đơn
  - Cấu hình thuế VAT
  - Cấu hình phí dịch vụ

### FR2: Quản lý Menu và Sản phẩm

#### FR2.1: Quản lý danh mục
- **Mô tả:** Quản lý các danh mục sản phẩm (Đồ uống, Đồ ăn, Bánh ngọt, etc.)
- **Yêu cầu:**
  - Tạo, sửa, xóa danh mục
  - Sắp xếp thứ tự hiển thị
  - Upload ảnh danh mục
  - Mô tả danh mục
  - Trạng thái hoạt động (Active/Inactive)

#### FR2.2: Quản lý sản phẩm
- **Mô tả:** Quản lý các sản phẩm trong menu
- **Yêu cầu:**
  - Tên sản phẩm
  - Mô tả
  - Giá bán
  - Ảnh sản phẩm (nhiều ảnh)
  - Danh mục
  - Trạng thái (Có sẵn/Hết hàng/Tạm ngừng)
  - Thời gian chế biến ước tính
  - Ghi chú đặc biệt
  - Tùy chọn (Size, Topping, etc.)
  - Giá theo size/tùy chọn
  - Calorie (tùy chọn)
  - Allergen information (tùy chọn)

#### FR2.3: Quản lý tùy chọn sản phẩm
- **Mô tả:** Quản lý các tùy chọn cho sản phẩm (Size, Topping, Milk type, etc.)
- **Yêu cầu:**
  - Tạo nhóm tùy chọn (Option Group)
  - Tạo các tùy chọn trong nhóm
  - Giá bổ sung cho từng tùy chọn
  - Bắt buộc/Tùy chọn
  - Số lượng tối đa có thể chọn

### FR3: Quản lý Đơn hàng

#### FR3.1: Tạo đơn hàng
- **Mô tả:** Tạo đơn hàng mới từ menu
- **Yêu cầu:**
  - Chọn bàn/khu vực
  - Chọn sản phẩm từ menu
  - Chọn tùy chọn (nếu có)
  - Nhập số lượng
  - Thêm ghi chú đặc biệt
  - Xem tổng tiền
  - Lưu đơn hàng

#### FR3.2: Quản lý đơn hàng
- **Mô tả:** Quản lý trạng thái và cập nhật đơn hàng
- **Yêu cầu:**
  - Xem danh sách đơn hàng
  - Lọc theo trạng thái, bàn, nhân viên, thời gian
  - Cập nhật trạng thái đơn hàng:
    - Đang chờ (Pending)
    - Đang chế biến (Preparing)
    - Sẵn sàng (Ready)
    - Đã phục vụ (Served)
    - Đã thanh toán (Paid)
    - Đã hủy (Cancelled)
  - Thêm/sửa/xóa sản phẩm trong đơn
  - Cập nhật số lượng
  - Thêm ghi chú
  - Hủy đơn hàng (với lý do)

#### FR3.3: Thanh toán đơn hàng
- **Mô tả:** Xử lý thanh toán cho đơn hàng
- **Yêu cầu:**
  - Xem chi tiết đơn hàng
  - Tính tổng tiền (bao gồm thuế, phí dịch vụ)
  - Chọn phương thức thanh toán:
    - Tiền mặt (Cash)
    - Thẻ (Card)
    - Chuyển khoản (Bank Transfer)
    - Ví điện tử (E-wallet)
  - Nhập số tiền khách đưa (nếu tiền mặt)
  - Tính tiền thừa
  - In hóa đơn
  - Lưu giao dịch

#### FR3.4: Quản lý đơn hàng takeaway/delivery
- **Mô tả:** Quản lý đơn hàng mang đi/giao hàng
- **Yêu cầu:**
  - Tạo đơn takeaway
  - Tạo đơn delivery (nếu có)
  - Thông tin khách hàng (tên, SĐT)
  - Địa chỉ giao hàng (nếu delivery)
  - Thời gian nhận hàng ước tính
  - Phí giao hàng (nếu có)

### FR4: Quản lý Bàn và Khu vực

#### FR4.1: Quản lý khu vực
- **Mô tả:** Quản lý các khu vực trong quán (Tầng 1, Tầng 2, Sân vườn, etc.)
- **Yêu cầu:**
  - Tạo, sửa, xóa khu vực
  - Tên khu vực
  - Mô tả
  - Sơ đồ khu vực (tùy chọn)

#### FR4.2: Quản lý bàn
- **Mô tả:** Quản lý các bàn trong quán
- **Yêu cầu:**
  - Tạo, sửa, xóa bàn
  - Số bàn/Tên bàn
  - Khu vực
  - Số chỗ ngồi
  - Trạng thái bàn:
    - Trống (Available)
    - Đang sử dụng (Occupied)
    - Đã đặt trước (Reserved)
    - Tạm ngóng (Maintenance)
  - Ghi chú đặc biệt

#### FR4.3: Quản lý đặt bàn
- **Mô tả:** Quản lý đặt bàn trước
- **Yêu cầu:**
  - Tạo đặt bàn
  - Thông tin khách hàng
  - Thời gian đặt
  - Số lượng người
  - Ghi chú đặc biệt
  - Xác nhận đặt bàn
  - Hủy đặt bàn

### FR5: Quản lý Nhân viên

#### FR5.1: Quản lý thông tin nhân viên
- **Mô tả:** Quản lý thông tin nhân viên
- **Yêu cầu:**
  - Tên, email, SĐT
  - Vị trí công việc (Role)
  - Ảnh đại diện
  - Ngày bắt đầu làm việc
  - Trạng thái (Active/Inactive)

#### FR5.2: Phân quyền
- **Mô tả:** Quản lý quyền truy cập của nhân viên
- **Yêu cầu:**
  - Các role:
    - Owner/Manager: Toàn quyền
    - Shift Manager: Quản lý ca, xem báo cáo
    - Waiter: Tạo đơn, quản lý bàn
    - Cashier: Thanh toán, in hóa đơn
    - Barista: Xem đơn, cập nhật trạng thái
  - Phân quyền chi tiết cho từng chức năng
  - Quản lý ca làm việc

#### FR5.3: Chấm công
- **Mô tả:** Quản lý chấm công nhân viên
- **Yêu cầu:**
  - Check-in/Check-out
  - Ghi nhận giờ làm việc
  - Xem lịch sử chấm công
  - Báo cáo giờ làm việc

### FR6: Quản lý Kho hàng

#### FR6.1: Quản lý nguyên liệu
- **Mô tả:** Quản lý nguyên liệu trong kho
- **Yêu cầu:**
  - Tên nguyên liệu
  - Đơn vị tính
  - Số lượng tồn kho
  - Mức tồn kho tối thiểu
  - Giá nhập
  - Nhà cung cấp
  - Ngày hết hạn (nếu có)

#### FR6.2: Nhập/Xuất kho
- **Mô tả:** Quản lý nhập xuất kho
- **Yêu cầu:**
  - Tạo phiếu nhập kho
  - Tạo phiếu xuất kho
  - Cập nhật số lượng tồn kho
  - Lịch sử nhập xuất
  - Cảnh báo hết hàng

#### FR6.3: Liên kết nguyên liệu với sản phẩm
- **Mô tả:** Định nghĩa công thức sản phẩm
- **Yêu cầu:**
  - Liên kết sản phẩm với nguyên liệu
  - Số lượng nguyên liệu cần cho mỗi sản phẩm
  - Tự động trừ kho khi bán hàng

### FR7: Báo cáo và Thống kê

#### FR7.1: Báo cáo doanh thu
- **Mô tả:** Báo cáo doanh thu theo thời gian
- **Yêu cầu:**
  - Doanh thu theo ngày/tuần/tháng/năm
  - So sánh doanh thu các kỳ
  - Doanh thu theo khu vực/bàn
  - Doanh thu theo nhân viên
  - Doanh thu theo sản phẩm/danh mục
  - Biểu đồ trực quan

#### FR7.2: Báo cáo bán hàng
- **Mô tả:** Phân tích bán hàng
- **Yêu cầu:**
  - Top sản phẩm bán chạy
  - Sản phẩm bán ít
  - Xu hướng bán hàng
  - Giờ cao điểm
  - Phân tích theo danh mục

#### FR7.3: Báo cáo kho hàng
- **Mô tả:** Báo cáo tình trạng kho
- **Yêu cầu:**
  - Tồn kho hiện tại
  - Nguyên liệu sắp hết
  - Giá trị tồn kho
  - Lịch sử nhập xuất

#### FR7.4: Báo cáo nhân viên
- **Mô tả:** Báo cáo hiệu suất nhân viên
- **Yêu cầu:**
  - Số đơn hàng xử lý
  - Doanh thu theo nhân viên
  - Giờ làm việc
  - Đánh giá hiệu suất

---

## 🔒 Non-Functional Requirements

### NFR1: Performance
- Thời gian phản hồi API: < 500ms cho 95% requests
- Thời gian load trang: < 2 giây
- Hỗ trợ đồng thời ít nhất 50 users
- Database query optimization

### NFR2: Security
- Authentication và Authorization
- Mã hóa dữ liệu nhạy cảm
- Audit log cho các thao tác quan trọng
- Bảo vệ chống SQL Injection, XSS
- HTTPS cho tất cả communications

### NFR3: Usability
- Giao diện thân thiện, dễ sử dụng
- Responsive design (mobile, tablet, desktop)
- Hỗ trợ đa ngôn ngữ (tiếng Việt, tiếng Anh)
- Keyboard shortcuts cho các thao tác thường dùng
- Offline mode cơ bản (nếu có)

### NFR4: Reliability
- Uptime: 99.5%
- Backup dữ liệu hàng ngày
- Recovery time: < 1 giờ
- Data validation và error handling

### NFR5: Scalability
- Hỗ trợ mở rộng số lượng quán
- Hỗ trợ multi-tenant (nếu cần)
- Database có thể scale

### NFR6: Compatibility
- Hỗ trợ các trình duyệt: Chrome, Firefox, Safari, Edge (phiên bản mới nhất)
- Hỗ trợ mobile browsers
- Tương thích với các thiết bị in hóa đơn phổ biến

---

## 📐 Data Requirements

### Core Entities
1. **Shop (Quán)**
   - Thông tin cơ bản quán
   - Cấu hình hệ thống

2. **Category (Danh mục)**
   - Danh mục sản phẩm

3. **Product (Sản phẩm)**
   - Thông tin sản phẩm
   - Giá, hình ảnh, mô tả

4. **ProductOption (Tùy chọn sản phẩm)**
   - Các tùy chọn (Size, Topping, etc.)

5. **Area (Khu vực)**
   - Khu vực trong quán

6. **Table (Bàn)**
   - Thông tin bàn

7. **Order (Đơn hàng)**
   - Đơn hàng

8. **OrderItem (Chi tiết đơn hàng)**
   - Sản phẩm trong đơn

9. **Payment (Thanh toán)**
   - Giao dịch thanh toán

10. **Employee (Nhân viên)**
    - Thông tin nhân viên

11. **Ingredient (Nguyên liệu)**
    - Nguyên liệu trong kho

12. **InventoryTransaction (Giao dịch kho)**
    - Nhập/xuất kho

13. **Report (Báo cáo)**
    - Các loại báo cáo

### Relationships
- Shop → Categories → Products
- Product → ProductOptions
- Shop → Areas → Tables
- Table → Orders
- Order → OrderItems → Product
- Order → Payment
- Shop → Employees
- Product → Ingredients (Recipe)
- Shop → InventoryTransactions → Ingredients

---

## 🎨 User Interface Requirements

### UI1: Dashboard
- Tổng quan doanh thu hôm nay
- Số đơn hàng
- Trạng thái bàn
- Đơn hàng đang chờ xử lý
- Cảnh báo kho hàng

### UI2: Menu Management
- Danh sách danh mục và sản phẩm dạng tree
- Form tạo/sửa sản phẩm
- Upload ảnh
- Drag & drop để sắp xếp

### UI3: Order Management
- Danh sách đơn hàng với filter
- Form tạo đơn hàng
- Chi tiết đơn hàng
- Thanh toán

### UI4: Table Management
- Sơ đồ bàn (floor plan)
- Trạng thái bàn trực quan
- Quản lý đặt bàn

### UI5: Reports
- Dashboard báo cáo
- Biểu đồ và bảng dữ liệu
- Export Excel/PDF

---

## 🔄 Integration Requirements

### INT1: Payment Gateway
- Tích hợp cổng thanh toán (nếu cần)
- Hỗ trợ các phương thức thanh toán

### INT2: Printer Integration
- In hóa đơn tự động
- Hỗ trợ các loại máy in phổ biến

### INT3: Accounting System
- Export dữ liệu cho hệ thống kế toán
- Format chuẩn (Excel, CSV)

---

## ✅ Acceptance Criteria

### AC1: Quản lý Menu
- **Given:** User là Owner/Manager
- **When:** Tạo sản phẩm mới với đầy đủ thông tin
- **Then:** Sản phẩm được lưu và hiển thị trong menu

### AC2: Tạo Đơn hàng
- **Given:** User là Waiter và có bàn trống
- **When:** Tạo đơn hàng với sản phẩm từ menu
- **Then:** Đơn hàng được tạo với trạng thái "Pending" và bàn chuyển sang "Occupied"

### AC3: Thanh toán
- **Given:** Đơn hàng đã được phục vụ
- **When:** Cashier thực hiện thanh toán
- **Then:** Đơn hàng chuyển sang trạng thái "Paid", bàn chuyển sang "Available", và hóa đơn được in

---

## 📝 Assumptions

1. Quán có kết nối internet ổn định
2. Nhân viên được đào tạo sử dụng hệ thống
3. Có thiết bị in hóa đơn
4. Hệ thống hỗ trợ tiếng Việt là chính

## 🚫 Constraints

1. Không tích hợp với hệ thống POS hardware (sẽ có phase 2)
2. Không hỗ trợ multi-currency trong phase 1
3. Không có ứng dụng mobile riêng trong phase 1 (chỉ web responsive)

---

## 📚 Related Documents

- [Use Cases - Quản lý quán Coffee Shop](./use-cases-quan-ly-quan-coffee-shop.md)
- [Business Rules - Coffee Shop Management](./business-rules-coffee-shop-management.md)
- [Technical Architecture](../architecture/TechnicalArchitecture-GeneratedApp.md)

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Next Review:** 2025-12-17

