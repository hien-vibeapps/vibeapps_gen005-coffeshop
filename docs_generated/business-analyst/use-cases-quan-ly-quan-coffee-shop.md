# Use Cases - Quản lý quán Coffee Shop

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Author:** Business Analyst Team  
**Status:** In Progress

---

## 📋 Tổng Quan

Tài liệu này mô tả chi tiết các Use Cases cho tính năng **Quản lý quán Coffee Shop**, bao gồm các scenarios (happy path, alternative flows, error cases).

---

## 🎯 Use Case Diagram (Text-based)

```
┌─────────────────────────────────────────────────────────────┐
│                    Coffee Shop Management                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Owner/Manager                                               │
│    ├── UC1: Quản lý thông tin quán                           │
│    ├── UC2: Quản lý menu và sản phẩm                         │
│    ├── UC3: Quản lý nhân viên                                │
│    ├── UC4: Quản lý khu vực và bàn                          │
│    ├── UC5: Quản lý kho hàng                                 │
│    └── UC6: Xem báo cáo và thống kê                         │
│                                                              │
│  Shift Manager                                               │
│    ├── UC7: Quản lý ca làm việc                              │
│    ├── UC8: Xem báo cáo ca                                   │
│    └── UC9: Quản lý đơn hàng                                 │
│                                                              │
│  Waiter                                                      │
│    ├── UC10: Tạo đơn hàng                                    │
│    ├── UC11: Cập nhật đơn hàng                               │
│    └── UC12: Quản lý trạng thái bàn                          │
│                                                              │
│  Cashier                                                     │
│    ├── UC13: Thanh toán đơn hàng                             │
│    └── UC14: In hóa đơn                                      │
│                                                              │
│  Barista                                                     │
│    ├── UC15: Xem đơn hàng cần chế biến                       │
│    └── UC16: Cập nhật trạng thái đơn hàng                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Chi tiết Use Cases

### UC1: Quản lý Thông tin Quán

**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager  
**Postconditions:** Thông tin quán được cập nhật

#### Main Success Scenario (Happy Path)

1. Owner/Manager truy cập trang "Cài đặt quán"
2. Hệ thống hiển thị form thông tin quán hiện tại
3. Owner/Manager chỉnh sửa thông tin:
   - Tên quán
   - Địa chỉ
   - Số điện thoại
   - Email
   - Logo quán
   - Giờ mở cửa/đóng cửa
   - Mô tả
4. Owner/Manager click "Lưu"
5. Hệ thống validate dữ liệu
6. Hệ thống lưu thông tin
7. Hệ thống hiển thị thông báo "Cập nhật thành công"

#### Alternative Flows

**A1: Upload logo**
- 3a. Owner/Manager click "Chọn ảnh" để upload logo
- 3b. Hệ thống hiển thị dialog chọn file
- 3c. Owner/Manager chọn file ảnh
- 3d. Hệ thống validate file (format, size)
- 3e. Hệ thống hiển thị preview ảnh
- 3f. Quay lại bước 4

**A2: Validation error**
- 5a. Hệ thống phát hiện dữ liệu không hợp lệ
- 5b. Hệ thống hiển thị thông báo lỗi cụ thể
- 5c. Owner/Manager sửa lỗi
- 5d. Quay lại bước 4

**A3: Upload logo thất bại**
- 3d. File không hợp lệ (quá lớn, sai format)
- 3d1. Hệ thống hiển thị thông báo lỗi
- 3d2. Owner/Manager chọn file khác hoặc hủy
- 3d3. Quay lại bước 3a hoặc tiếp tục

#### Exception Flows

**E1: Mất kết nối**
- 6a. Mất kết nối mạng khi đang lưu
- 6b. Hệ thống hiển thị thông báo "Lỗi kết nối"
- 6c. Hệ thống lưu dữ liệu tạm (local storage)
- 6d. Khi có kết nối lại, tự động sync

**E2: Quyền truy cập**
- 1a. User không có quyền Owner/Manager
- 1b. Hệ thống hiển thị thông báo "Không có quyền truy cập"
- 1c. Use case kết thúc

---

### UC2: Quản lý Menu và Sản phẩm

**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager  
**Postconditions:** Menu và sản phẩm được cập nhật

#### UC2.1: Tạo Danh mục Mới

**Main Success Scenario:**
1. Owner/Manager truy cập "Quản lý Menu"
2. Hệ thống hiển thị danh sách danh mục hiện có
3. Owner/Manager click "Thêm danh mục"
4. Hệ thống hiển thị form tạo danh mục
5. Owner/Manager nhập thông tin:
   - Tên danh mục (bắt buộc)
   - Mô tả (tùy chọn)
   - Upload ảnh (tùy chọn)
   - Thứ tự hiển thị
6. Owner/Manager click "Lưu"
7. Hệ thống validate và lưu danh mục
8. Hệ thống hiển thị danh mục mới trong danh sách

**Alternative Flows:**
- **A1:** Sắp xếp thứ tự bằng drag & drop
- **A2:** Upload nhiều ảnh
- **A3:** Kích hoạt/tạm ngưng danh mục

**Exception Flows:**
- **E1:** Tên danh mục trùng
- **E2:** Ảnh quá lớn hoặc sai format

#### UC2.2: Tạo Sản phẩm Mới

**Main Success Scenario:**
1. Owner/Manager chọn danh mục
2. Owner/Manager click "Thêm sản phẩm"
3. Hệ thống hiển thị form tạo sản phẩm
4. Owner/Manager nhập thông tin:
   - Tên sản phẩm (bắt buộc)
   - Mô tả
   - Giá bán (bắt buộc)
   - Danh mục (bắt buộc)
   - Upload ảnh
   - Thời gian chế biến ước tính
   - Trạng thái (Có sẵn/Hết hàng/Tạm ngừng)
5. Owner/Manager cấu hình tùy chọn (nếu có):
   - Tạo nhóm tùy chọn (Size, Topping, etc.)
   - Thêm các tùy chọn trong nhóm
   - Đặt giá cho từng tùy chọn
6. Owner/Manager click "Lưu"
7. Hệ thống validate và lưu sản phẩm
8. Hệ thống hiển thị sản phẩm mới trong menu

**Alternative Flows:**
- **A1:** Copy sản phẩm tương tự để tạo nhanh
- **A2:** Import sản phẩm từ file Excel
- **A3:** Tạo sản phẩm combo (nhiều sản phẩm)

**Exception Flows:**
- **E1:** Giá bán <= 0
- **E2:** Tên sản phẩm trùng trong cùng danh mục
- **E3:** File ảnh không hợp lệ

#### UC2.3: Cập nhật Sản phẩm

**Main Success Scenario:**
1. Owner/Manager chọn sản phẩm cần sửa
2. Owner/Manager click "Sửa"
3. Hệ thống hiển thị form với thông tin hiện tại
4. Owner/Manager chỉnh sửa thông tin
5. Owner/Manager click "Lưu"
6. Hệ thống validate và cập nhật
7. Hệ thống hiển thị thông báo "Cập nhật thành công"

**Alternative Flows:**
- **A1:** Thay đổi giá sản phẩm (có cảnh báo nếu có đơn hàng đang xử lý)
- **A2:** Thay đổi trạng thái (Có sẵn → Hết hàng)

**Exception Flows:**
- **E1:** Sản phẩm đang có trong đơn hàng chưa thanh toán
- **E2:** Dữ liệu không hợp lệ

#### UC2.4: Xóa Sản phẩm

**Main Success Scenario:**
1. Owner/Manager chọn sản phẩm cần xóa
2. Owner/Manager click "Xóa"
3. Hệ thống hiển thị dialog xác nhận
4. Owner/Manager xác nhận xóa
5. Hệ thống kiểm tra sản phẩm có đang được sử dụng không
6. Hệ thống xóa sản phẩm
7. Hệ thống hiển thị thông báo "Xóa thành công"

**Alternative Flows:**
- **A1:** Sản phẩm có trong đơn hàng cũ → Chuyển sang "Tạm ngừng" thay vì xóa

**Exception Flows:**
- **E1:** Sản phẩm đang có trong đơn hàng chưa thanh toán → Không cho xóa, đề xuất tạm ngừng

---

### UC3: Quản lý Nhân viên

**Actor:** Owner/Manager  
**Preconditions:** User đã đăng nhập với quyền Owner/Manager

#### UC3.1: Thêm Nhân viên Mới

**Main Success Scenario:**
1. Owner/Manager truy cập "Quản lý Nhân viên"
2. Owner/Manager click "Thêm nhân viên"
3. Hệ thống hiển thị form đăng ký
4. Owner/Manager nhập thông tin:
   - Họ tên (bắt buộc)
   - Email (bắt buộc, unique)
   - Số điện thoại (bắt buộc)
   - Vị trí công việc (Role) (bắt buộc)
   - Upload ảnh đại diện
   - Ngày bắt đầu làm việc
5. Owner/Manager phân quyền cho nhân viên
6. Owner/Manager click "Tạo tài khoản"
7. Hệ thống tạo tài khoản và gửi email mật khẩu tạm
8. Hệ thống hiển thị thông báo "Tạo tài khoản thành công"

**Alternative Flows:**
- **A1:** Import nhân viên từ file Excel
- **A2:** Copy quyền từ nhân viên khác

**Exception Flows:**
- **E1:** Email đã tồn tại
- **E2:** Email không hợp lệ
- **E3:** Gửi email thất bại

#### UC3.2: Phân quyền Nhân viên

**Main Success Scenario:**
1. Owner/Manager chọn nhân viên
2. Owner/Manager click "Phân quyền"
3. Hệ thống hiển thị danh sách quyền theo role
4. Owner/Manager chọn/bỏ chọn các quyền:
   - Quản lý menu
   - Tạo đơn hàng
   - Thanh toán
   - Xem báo cáo
   - Quản lý kho
   - Quản lý nhân viên
5. Owner/Manager click "Lưu"
6. Hệ thống cập nhật quyền
7. Hệ thống hiển thị thông báo "Cập nhật quyền thành công"

**Alternative Flows:**
- **A1:** Chọn role template (Waiter, Cashier, etc.) → Tự động áp dụng quyền mặc định

**Exception Flows:**
- **E1:** Không thể thu hồi quyền của chính mình (nếu là Owner)

---

### UC4: Quản lý Khu vực và Bàn

**Actor:** Owner/Manager, Shift Manager  
**Preconditions:** User đã đăng nhập

#### UC4.1: Tạo Khu vực Mới

**Main Success Scenario:**
1. User truy cập "Quản lý Khu vực & Bàn"
2. User click "Thêm khu vực"
3. Hệ thống hiển thị form
4. User nhập:
   - Tên khu vực (bắt buộc)
   - Mô tả
5. User click "Lưu"
6. Hệ thống tạo khu vực mới
7. Khu vực hiển thị trong danh sách

#### UC4.2: Tạo Bàn Mới

**Main Success Scenario:**
1. User chọn khu vực
2. User click "Thêm bàn"
3. Hệ thống hiển thị form
4. User nhập:
   - Số bàn/Tên bàn (bắt buộc)
   - Khu vực (bắt buộc)
   - Số chỗ ngồi
   - Ghi chú
5. User click "Lưu"
6. Hệ thống tạo bàn mới
7. Bàn hiển thị trong sơ đồ khu vực

**Alternative Flows:**
- **A1:** Tạo nhiều bàn cùng lúc (Bàn 1-10)
- **A2:** Sắp xếp bàn bằng drag & drop trong sơ đồ

#### UC4.3: Đặt Bàn Trước

**Main Success Scenario:**
1. User (Waiter/Manager) click "Đặt bàn"
2. Hệ thống hiển thị form đặt bàn
3. User nhập:
   - Tên khách hàng (bắt buộc)
   - Số điện thoại (bắt buộc)
   - Thời gian đặt (bắt buộc)
   - Số lượng người
   - Chọn bàn (nếu có)
   - Ghi chú
4. User click "Xác nhận đặt"
5. Hệ thống kiểm tra bàn có trống không
6. Hệ thống tạo đặt bàn
7. Bàn chuyển sang trạng thái "Reserved"
8. Hệ thống gửi SMS/Email xác nhận (nếu có)

**Alternative Flows:**
- **A1:** Không chọn bàn cụ thể → Hệ thống tự động gợi ý bàn phù hợp
- **A2:** Đặt bàn cho thời gian trong tương lai

**Exception Flows:**
- **E1:** Bàn đã được đặt trong khoảng thời gian đó
- **E2:** Bàn đang được sử dụng
- **E3:** Số lượng người vượt quá sức chứa bàn

---

### UC5: Tạo Đơn hàng

**Actor:** Waiter, Shift Manager  
**Preconditions:** User đã đăng nhập, có bàn trống hoặc đã đặt

#### Main Success Scenario

1. Waiter truy cập "Quản lý Đơn hàng"
2. Waiter click "Tạo đơn hàng mới"
3. Hệ thống hiển thị form tạo đơn
4. Waiter chọn bàn (hoặc chọn "Takeaway"/"Delivery")
5. Hệ thống hiển thị menu
6. Waiter chọn sản phẩm từ menu
7. Hệ thống hiển thị dialog chọn tùy chọn (nếu có)
8. Waiter chọn tùy chọn (Size, Topping, etc.)
9. Waiter nhập số lượng
10. Waiter thêm ghi chú đặc biệt (nếu có)
11. Waiter click "Thêm vào đơn"
12. Hệ thống thêm sản phẩm vào đơn
13. Hệ thống cập nhật tổng tiền
14. Waiter lặp lại bước 6-13 cho các sản phẩm khác
15. Waiter click "Lưu đơn hàng"
16. Hệ thống validate đơn hàng
17. Hệ thống tạo đơn hàng với trạng thái "Pending"
18. Bàn chuyển sang trạng thái "Occupied"
19. Hệ thống gửi đơn hàng đến Barista (nếu có sản phẩm cần chế biến)
20. Hệ thống hiển thị thông báo "Tạo đơn hàng thành công"

#### Alternative Flows

**A1: Tạo đơn từ đặt bàn**
- 3a. Waiter chọn bàn đã đặt trước
- 3b. Hệ thống hiển thị thông tin đặt bàn
- 3c. Waiter click "Tạo đơn từ đặt bàn"
- 3d. Quay lại bước 4

**A2: Tạo đơn takeaway**
- 4a. Waiter chọn "Takeaway"
- 4b. Hệ thống không yêu cầu chọn bàn
- 4c. Waiter nhập thông tin khách hàng (tên, SĐT) - tùy chọn
- 4d. Quay lại bước 5

**A3: Tạo đơn delivery**
- 4a. Waiter chọn "Delivery"
- 4b. Hệ thống yêu cầu nhập địa chỉ giao hàng
- 4c. Waiter nhập địa chỉ
- 4d. Hệ thống tính phí giao hàng
- 4e. Quay lại bước 5

**A4: Sửa sản phẩm trong đơn**
- 13a. Waiter click vào sản phẩm trong đơn
- 13b. Hệ thống hiển thị dialog sửa
- 13c. Waiter sửa số lượng, tùy chọn, ghi chú
- 13d. Waiter click "Cập nhật"
- 13e. Hệ thống cập nhật đơn
- 13f. Quay lại bước 13

**A5: Xóa sản phẩm khỏi đơn**
- 13a. Waiter click "Xóa" trên sản phẩm
- 13b. Hệ thống xác nhận xóa
- 13c. Waiter xác nhận
- 13d. Hệ thống xóa sản phẩm và cập nhật tổng tiền
- 13e. Quay lại bước 13

#### Exception Flows

**E1: Bàn đã có đơn hàng chưa thanh toán**
- 4a. Waiter chọn bàn đang có đơn hàng
- 4b. Hệ thống hiển thị cảnh báo "Bàn này đang có đơn hàng chưa thanh toán"
- 4c. Waiter chọn "Xem đơn hàng" hoặc "Tạo đơn mới" (merge)
- 4d. Nếu merge: Quay lại bước 6 với đơn hàng hiện có

**E2: Sản phẩm hết hàng**
- 6a. Waiter chọn sản phẩm đang "Hết hàng"
- 6b. Hệ thống hiển thị cảnh báo "Sản phẩm hiện không có sẵn"
- 6c. Waiter chọn sản phẩm khác hoặc hủy

**E3: Đơn hàng trống**
- 15a. Waiter click "Lưu đơn hàng" nhưng chưa có sản phẩm nào
- 15b. Hệ thống hiển thị lỗi "Vui lòng thêm ít nhất một sản phẩm"
- 15c. Quay lại bước 6

**E4: Mất kết nối**
- 17a. Mất kết nối khi đang lưu
- 17b. Hệ thống lưu đơn hàng tạm (local storage)
- 17c. Khi có kết nối lại, tự động sync

---

### UC6: Cập nhật Trạng thái Đơn hàng

**Actor:** Barista, Waiter, Shift Manager  
**Preconditions:** Có đơn hàng đang xử lý

#### Main Success Scenario

1. Barista truy cập "Đơn hàng cần chế biến"
2. Hệ thống hiển thị danh sách đơn hàng với trạng thái "Pending"
3. Barista chọn đơn hàng
4. Barista click "Bắt đầu chế biến"
5. Hệ thống cập nhật trạng thái đơn hàng thành "Preparing"
6. Barista hoàn thành chế biến
7. Barista click "Hoàn thành"
8. Hệ thống cập nhật trạng thái thành "Ready"
9. Hệ thống thông báo cho Waiter

#### Alternative Flows

**A1: Cập nhật từng sản phẩm**
- 4a. Barista cập nhật trạng thái từng sản phẩm trong đơn
- 4b. Khi tất cả sản phẩm "Ready", đơn hàng tự động chuyển "Ready"

**A2: Waiter phục vụ**
- 8a. Waiter nhận đơn hàng "Ready"
- 8b. Waiter click "Đã phục vụ"
- 8c. Hệ thống cập nhật trạng thái "Served"

**A3: Hủy đơn hàng**
- 3a. User click "Hủy đơn hàng"
- 3b. Hệ thống yêu cầu nhập lý do hủy
- 3c. User nhập lý do
- 3d. Hệ thống cập nhật trạng thái "Cancelled"
- 3e. Nếu đã chế biến một phần, cảnh báo

#### Exception Flows

**E1: Đơn hàng đã thanh toán**
- 4a. User cố gắng cập nhật đơn hàng đã "Paid"
- 4b. Hệ thống hiển thị lỗi "Không thể cập nhật đơn hàng đã thanh toán"

---

### UC7: Thanh toán Đơn hàng

**Actor:** Cashier, Shift Manager  
**Preconditions:** Đơn hàng có trạng thái "Served" hoặc "Ready"

#### Main Success Scenario

1. Cashier truy cập "Thanh toán"
2. Cashier chọn đơn hàng cần thanh toán
3. Hệ thống hiển thị chi tiết đơn hàng:
   - Danh sách sản phẩm
   - Tổng tiền sản phẩm
   - Thuế VAT (nếu có)
   - Phí dịch vụ (nếu có)
   - Tổng cộng
4. Cashier chọn phương thức thanh toán:
   - Tiền mặt
   - Thẻ
   - Chuyển khoản
   - Ví điện tử
5. Nếu tiền mặt:
   - Cashier nhập số tiền khách đưa
   - Hệ thống tính tiền thừa
6. Cashier click "Xác nhận thanh toán"
7. Hệ thống validate:
   - Số tiền >= Tổng cộng (nếu tiền mặt)
   - Đơn hàng chưa được thanh toán
8. Hệ thống tạo giao dịch thanh toán
9. Hệ thống cập nhật trạng thái đơn hàng thành "Paid"
10. Bàn chuyển sang trạng thái "Available"
11. Hệ thống cập nhật doanh thu
12. Hệ thống hiển thị dialog in hóa đơn
13. Cashier click "In hóa đơn"
14. Hệ thống in hóa đơn
15. Hệ thống hiển thị thông báo "Thanh toán thành công"

#### Alternative Flows

**A1: Thanh toán một phần**
- 4a. Cashier chọn "Thanh toán một phần"
- 4b. Cashier nhập số tiền thanh toán
- 4c. Hệ thống lưu số tiền còn lại
- 4d. Đơn hàng vẫn ở trạng thái "Served" (chưa "Paid")
- 4e. Có thể thanh toán tiếp sau

**A2: Áp dụng khuyến mãi**
- 3a. Cashier click "Áp dụng khuyến mãi"
- 3b. Hệ thống hiển thị danh sách khuyến mãi khả dụng
- 3c. Cashier chọn khuyến mãi
- 3d. Hệ thống tính lại tổng tiền
- 3e. Quay lại bước 3

**A3: Không in hóa đơn**
- 13a. Cashier click "Bỏ qua" hoặc đóng dialog
- 13b. Hệ thống không in hóa đơn
- 13c. Quay lại bước 15

**A4: In lại hóa đơn**
- 15a. Cashier click "In lại hóa đơn" từ lịch sử
- 15b. Hệ thống in hóa đơn của đơn hàng đã thanh toán

#### Exception Flows

**E1: Số tiền không đủ (tiền mặt)**
- 5a. Số tiền khách đưa < Tổng cộng
- 5b. Hệ thống hiển thị cảnh báo "Số tiền không đủ"
- 5c. Cashier nhập lại số tiền

**E2: Đơn hàng đã thanh toán**
- 2a. Cashier chọn đơn hàng đã "Paid"
- 2b. Hệ thống hiển thị cảnh báo "Đơn hàng đã được thanh toán"
- 2c. Cashier chọn đơn hàng khác

**E3: Lỗi in hóa đơn**
- 14a. Máy in không hoạt động
- 14b. Hệ thống hiển thị lỗi "Không thể in hóa đơn"
- 14c. Hệ thống vẫn lưu giao dịch thanh toán
- 14d. Cashier có thể in lại sau

---

### UC8: Quản lý Kho hàng

**Actor:** Owner/Manager, Shift Manager  
**Preconditions:** User đã đăng nhập với quyền quản lý kho

#### UC8.1: Nhập Kho

**Main Success Scenario:**
1. User truy cập "Quản lý Kho"
2. User click "Nhập kho"
3. Hệ thống hiển thị form nhập kho
4. User nhập thông tin:
   - Nhà cung cấp
   - Ngày nhập
   - Ghi chú
5. User thêm nguyên liệu:
   - Chọn nguyên liệu
   - Nhập số lượng
   - Nhập giá nhập
   - Nhập ngày hết hạn (nếu có)
6. User lặp lại bước 5 cho các nguyên liệu khác
7. User click "Lưu phiếu nhập"
8. Hệ thống validate
9. Hệ thống tạo phiếu nhập kho
10. Hệ thống cập nhật số lượng tồn kho
11. Hệ thống hiển thị thông báo "Nhập kho thành công"

**Alternative Flows:**
- **A1:** Import từ file Excel
- **A2:** Copy từ phiếu nhập trước

**Exception Flows:**
- **E1:** Số lượng <= 0
- **E2:** Giá nhập <= 0
- **E3:** Nguyên liệu không tồn tại

#### UC8.2: Xuất Kho

**Main Success Scenario:**
1. User click "Xuất kho"
2. Hệ thống hiển thị form xuất kho
3. User nhập:
   - Lý do xuất kho (Sử dụng, Hỏng, Mất, etc.)
   - Ngày xuất
   - Ghi chú
4. User thêm nguyên liệu:
   - Chọn nguyên liệu
   - Nhập số lượng xuất
5. User click "Lưu phiếu xuất"
6. Hệ thống kiểm tra tồn kho đủ không
7. Hệ thống tạo phiếu xuất
8. Hệ thống trừ số lượng tồn kho
9. Hệ thống hiển thị thông báo "Xuất kho thành công"

**Exception Flows:**
- **E1:** Số lượng xuất > Tồn kho hiện có
- **E2:** Nguyên liệu không tồn tại

#### UC8.3: Cảnh báo Hết hàng

**Main Success Scenario:**
1. Hệ thống tự động kiểm tra tồn kho
2. Hệ thống phát hiện nguyên liệu <= Mức tồn kho tối thiểu
3. Hệ thống hiển thị cảnh báo trên Dashboard
4. Hệ thống gửi thông báo cho Owner/Manager
5. User xem danh sách nguyên liệu cần nhập

---

### UC9: Xem Báo cáo và Thống kê

**Actor:** Owner/Manager, Shift Manager  
**Preconditions:** User đã đăng nhập với quyền xem báo cáo

#### UC9.1: Báo cáo Doanh thu

**Main Success Scenario:**
1. User truy cập "Báo cáo"
2. User chọn "Báo cáo Doanh thu"
3. User chọn khoảng thời gian (Hôm nay, Tuần này, Tháng này, Tùy chọn)
4. User chọn các filter:
   - Khu vực
   - Nhân viên
   - Phương thức thanh toán
5. User click "Xem báo cáo"
6. Hệ thống hiển thị:
   - Tổng doanh thu
   - Số đơn hàng
   - Đơn hàng trung bình
   - Biểu đồ doanh thu theo thời gian
   - Bảng chi tiết
7. User có thể export Excel/PDF

**Alternative Flows:**
- **A1:** So sánh với kỳ trước
- **A2:** Xem theo giờ trong ngày
- **A3:** Xem top sản phẩm bán chạy

#### UC9.2: Báo cáo Bán hàng

**Main Success Scenario:**
1. User chọn "Báo cáo Bán hàng"
2. User chọn khoảng thời gian và filter
3. User click "Xem báo cáo"
4. Hệ thống hiển thị:
   - Top sản phẩm bán chạy
   - Sản phẩm bán ít
   - Doanh thu theo danh mục
   - Biểu đồ phân tích
5. User có thể export

#### UC9.3: Báo cáo Kho hàng

**Main Success Scenario:**
1. User chọn "Báo cáo Kho hàng"
2. Hệ thống hiển thị:
   - Tồn kho hiện tại
   - Giá trị tồn kho
   - Nguyên liệu sắp hết
   - Lịch sử nhập xuất
3. User có thể export

---

## 🔄 Use Case Relationships

### Includes
- UC5 (Tạo đơn hàng) **includes** UC4.3 (Chọn bàn)
- UC7 (Thanh toán) **includes** UC5 (Xem đơn hàng)

### Extends
- UC7 (Thanh toán) **extends** UC6 (Cập nhật trạng thái) với điều kiện: Đơn hàng phải "Served"

### Generalization
- UC2.1, UC2.2, UC2.3, UC2.4 **generalize** UC2 (Quản lý Menu)

---

## 📊 Activity Diagrams

### Activity: Tạo và Xử lý Đơn hàng

```
[Start] → [Chọn bàn] → [Chọn sản phẩm] → [Chọn tùy chọn]
    ↓
[Thêm vào đơn] → [Cập nhật tổng tiền] → {Còn sản phẩm?}
    ↓ Yes                                    ↓ No
[Chọn sản phẩm] ←───────────────────────────┘
    ↓
[Lưu đơn hàng] → [Gửi đến Barista] → [Barista chế biến]
    ↓
[Barista hoàn thành] → [Waiter phục vụ] → [Cashier thanh toán]
    ↓
[In hóa đơn] → [Cập nhật bàn] → [End]
```

---

## ✅ Acceptance Criteria Summary

Tất cả các Use Cases phải đáp ứng:

1. **Functional Completeness:** Tất cả các bước trong Main Success Scenario hoàn thành
2. **Error Handling:** Tất cả Exception Flows được xử lý đúng
3. **User Experience:** Giao diện rõ ràng, dễ sử dụng
4. **Performance:** Thời gian phản hồi < 2 giây
5. **Data Integrity:** Dữ liệu được validate và lưu chính xác
6. **Security:** Kiểm tra quyền truy cập cho mọi thao tác

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Next Review:** 2025-12-17

