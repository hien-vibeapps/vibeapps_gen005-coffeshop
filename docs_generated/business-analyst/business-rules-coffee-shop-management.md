# Business Rules - Coffee Shop Management

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Author:** Business Analyst Team  
**Status:** In Progress

---

## 📋 Tổng Quan

Tài liệu này định nghĩa tất cả các **Business Rules** (Quy tắc nghiệp vụ) cho module **Coffee Shop Management**. Các quy tắc này phải được tuân thủ nghiêm ngặt trong quá trình phát triển và vận hành hệ thống.

---

## 🎯 Phân loại Business Rules

Business Rules được phân loại theo các nhóm:
1. **Validation Rules** - Quy tắc kiểm tra dữ liệu
2. **Business Logic Rules** - Quy tắc logic nghiệp vụ
3. **Authorization Rules** - Quy tắc phân quyền
4. **Workflow Rules** - Quy tắc quy trình
5. **Financial Rules** - Quy tắc tài chính
6. **Inventory Rules** - Quy tắc quản lý kho
7. **Data Integrity Rules** - Quy tắc toàn vẹn dữ liệu

---

## 1. VALIDATION RULES

### VR1: Validation Thông tin Quán

**BR-VR1.1: Tên quán**
- **Rule:** Tên quán là bắt buộc, tối thiểu 3 ký tự, tối đa 100 ký tự
- **Priority:** High
- **Error Message:** "Tên quán phải từ 3-100 ký tự"

**BR-VR1.2: Email quán**
- **Rule:** Email phải đúng format và unique trong hệ thống
- **Priority:** High
- **Error Message:** "Email không hợp lệ" hoặc "Email đã được sử dụng"

**BR-VR1.3: Số điện thoại**
- **Rule:** Số điện thoại phải đúng format (10-11 chữ số, bắt đầu bằng 0 hoặc +84)
- **Priority:** High
- **Error Message:** "Số điện thoại không hợp lệ"

**BR-VR1.4: Giờ mở cửa/đóng cửa**
- **Rule:** Giờ đóng cửa phải sau giờ mở cửa
- **Priority:** Medium
- **Error Message:** "Giờ đóng cửa phải sau giờ mở cửa"

**BR-VR1.5: Logo quán**
- **Rule:** File ảnh phải là JPG, PNG hoặc GIF, tối đa 5MB
- **Priority:** Medium
- **Error Message:** "File ảnh không hợp lệ. Vui lòng chọn file JPG/PNG/GIF, tối đa 5MB"

---

### VR2: Validation Menu và Sản phẩm

**BR-VR2.1: Tên danh mục**
- **Rule:** Tên danh mục là bắt buộc, tối thiểu 2 ký tự, tối đa 50 ký tự, unique trong cùng cấp
- **Priority:** High
- **Error Message:** "Tên danh mục phải từ 2-50 ký tự và không trùng lặp"

**BR-VR2.2: Tên sản phẩm**
- **Rule:** Tên sản phẩm là bắt buộc, tối thiểu 2 ký tự, tối đa 100 ký tự, unique trong cùng danh mục
- **Priority:** High
- **Error Message:** "Tên sản phẩm phải từ 2-100 ký tự và không trùng lặp trong danh mục"

**BR-VR2.3: Giá sản phẩm**
- **Rule:** Giá sản phẩm phải > 0, tối đa 99,999,999 VNĐ
- **Priority:** High
- **Error Message:** "Giá sản phẩm phải lớn hơn 0 và nhỏ hơn 100,000,000 VNĐ"

**BR-VR2.4: Thời gian chế biến**
- **Rule:** Thời gian chế biến ước tính phải >= 0 phút, <= 120 phút
- **Priority:** Medium
- **Error Message:** "Thời gian chế biến phải từ 0-120 phút"

**BR-VR2.5: Ảnh sản phẩm**
- **Rule:** File ảnh phải là JPG, PNG hoặc GIF, tối đa 10MB mỗi ảnh, tối đa 5 ảnh mỗi sản phẩm
- **Priority:** Medium
- **Error Message:** "Mỗi sản phẩm tối đa 5 ảnh, mỗi ảnh tối đa 10MB"

**BR-VR2.6: Tùy chọn sản phẩm**
- **Rule:** Tên tùy chọn là bắt buộc, tối thiểu 1 ký tự, tối đa 50 ký tự
- **Priority:** High
- **Error Message:** "Tên tùy chọn phải từ 1-50 ký tự"

**BR-VR2.7: Giá tùy chọn**
- **Rule:** Giá tùy chọn có thể >= 0 (âm nếu là giảm giá), tối đa 9,999,999 VNĐ
- **Priority:** Medium
- **Error Message:** "Giá tùy chọn phải trong khoảng -9,999,999 đến 9,999,999 VNĐ"

---

### VR3: Validation Đơn hàng

**BR-VR3.1: Đơn hàng phải có ít nhất 1 sản phẩm**
- **Rule:** Khi tạo đơn hàng, phải có ít nhất 1 sản phẩm với số lượng > 0
- **Priority:** High
- **Error Message:** "Đơn hàng phải có ít nhất một sản phẩm"

**BR-VR3.2: Số lượng sản phẩm**
- **Rule:** Số lượng sản phẩm trong đơn phải > 0 và <= 999
- **Priority:** High
- **Error Message:** "Số lượng phải từ 1-999"

**BR-VR3.3: Đơn hàng takeaway/delivery**
- **Rule:** Đơn takeaway/delivery phải có thông tin khách hàng (tên hoặc SĐT)
- **Priority:** Medium
- **Error Message:** "Vui lòng nhập tên hoặc số điện thoại khách hàng"

**BR-VR3.4: Địa chỉ giao hàng**
- **Rule:** Đơn delivery phải có địa chỉ giao hàng, tối thiểu 10 ký tự
- **Priority:** High
- **Error Message:** "Địa chỉ giao hàng phải có ít nhất 10 ký tự"

---

### VR4: Validation Bàn và Khu vực

**BR-VR4.1: Tên khu vực**
- **Rule:** Tên khu vực là bắt buộc, tối thiểu 2 ký tự, tối đa 50 ký tự, unique trong quán
- **Priority:** High
- **Error Message:** "Tên khu vực phải từ 2-50 ký tự và không trùng lặp"

**BR-VR4.2: Số bàn**
- **Rule:** Số/Tên bàn là bắt buộc, tối thiểu 1 ký tự, tối đa 20 ký tự, unique trong cùng khu vực
- **Priority:** High
- **Error Message:** "Số bàn phải từ 1-20 ký tự và không trùng lặp trong khu vực"

**BR-VR4.3: Số chỗ ngồi**
- **Rule:** Số chỗ ngồi phải > 0 và <= 50
- **Priority:** Medium
- **Error Message:** "Số chỗ ngồi phải từ 1-50"

**BR-VR4.4: Đặt bàn**
- **Rule:** Thời gian đặt bàn phải trong tương lai hoặc hiện tại, không được quá 30 ngày
- **Priority:** Medium
- **Error Message:** "Thời gian đặt bàn không hợp lệ"

**BR-VR4.5: Số lượng người đặt bàn**
- **Rule:** Số lượng người đặt bàn phải <= Số chỗ ngồi của bàn
- **Priority:** High
- **Error Message:** "Số lượng người không được vượt quá số chỗ ngồi của bàn"

---

### VR5: Validation Nhân viên

**BR-VR5.1: Email nhân viên**
- **Rule:** Email nhân viên phải đúng format và unique trong hệ thống
- **Priority:** High
- **Error Message:** "Email không hợp lệ hoặc đã được sử dụng"

**BR-VR5.2: Số điện thoại nhân viên**
- **Rule:** Số điện thoại phải đúng format và unique trong hệ thống
- **Priority:** High
- **Error Message:** "Số điện thoại không hợp lệ hoặc đã được sử dụng"

**BR-VR5.3: Role nhân viên**
- **Rule:** Role phải là một trong: Owner, Manager, Shift Manager, Waiter, Cashier, Barista
- **Priority:** High
- **Error Message:** "Vị trí công việc không hợp lệ"

---

### VR6: Validation Kho hàng

**BR-VR6.1: Tên nguyên liệu**
- **Rule:** Tên nguyên liệu là bắt buộc, tối thiểu 2 ký tự, tối đa 100 ký tự, unique trong quán
- **Priority:** High
- **Error Message:** "Tên nguyên liệu phải từ 2-100 ký tự và không trùng lặp"

**BR-VR6.2: Số lượng nhập**
- **Rule:** Số lượng nhập kho phải > 0 và <= 999,999
- **Priority:** High
- **Error Message:** "Số lượng nhập phải từ 1-999,999"

**BR-VR6.3: Giá nhập**
- **Rule:** Giá nhập phải >= 0 và <= 99,999,999 VNĐ
- **Priority:** High
- **Error Message:** "Giá nhập không hợp lệ"

**BR-VR6.4: Số lượng xuất**
- **Rule:** Số lượng xuất kho phải > 0 và <= Tồn kho hiện có
- **Priority:** High
- **Error Message:** "Số lượng xuất không được vượt quá tồn kho hiện có"

**BR-VR6.5: Mức tồn kho tối thiểu**
- **Rule:** Mức tồn kho tối thiểu phải >= 0
- **Priority:** Medium
- **Error Message:** "Mức tồn kho tối thiểu phải >= 0"

---

## 2. BUSINESS LOGIC RULES

### BL1: Quy tắc Quản lý Đơn hàng

**BR-BL1.1: Trạng thái đơn hàng - Chuyển đổi hợp lệ**
- **Rule:** Đơn hàng chỉ có thể chuyển trạng thái theo thứ tự:
  - Pending → Preparing → Ready → Served → Paid
  - Hoặc bất kỳ trạng thái nào → Cancelled
  - Không thể chuyển ngược lại (trừ khi có quyền đặc biệt)
- **Priority:** High
- **Exception:** Owner/Manager có thể chuyển trạng thái bất kỳ

**BR-BL1.2: Đơn hàng đã thanh toán không thể sửa**
- **Rule:** Đơn hàng có trạng thái "Paid" không thể:
  - Thêm/sửa/xóa sản phẩm
  - Thay đổi trạng thái (trừ khi có quyền đặc biệt)
  - Hủy đơn hàng
- **Priority:** High
- **Exception:** Owner/Manager có thể điều chỉnh với lý do và audit log

**BR-BL1.3: Hủy đơn hàng**
- **Rule:** 
  - Đơn hàng "Pending" hoặc "Preparing" có thể hủy bởi Waiter/Manager
  - Đơn hàng "Ready" hoặc "Served" chỉ có thể hủy bởi Manager với lý do bắt buộc
  - Đơn hàng "Paid" không thể hủy (chỉ có thể tạo đơn hoàn tiền)
- **Priority:** High

**BR-BL1.4: Tự động cập nhật bàn khi tạo đơn**
- **Rule:** Khi tạo đơn hàng cho bàn, bàn tự động chuyển từ "Available" → "Occupied"
- **Priority:** High

**BR-BL1.5: Tự động giải phóng bàn khi thanh toán**
- **Rule:** Khi đơn hàng được thanh toán, bàn tự động chuyển từ "Occupied" → "Available"
- **Priority:** High

**BR-BL1.6: Một bàn chỉ có một đơn hàng chưa thanh toán**
- **Rule:** Một bàn chỉ có thể có tối đa 1 đơn hàng với trạng thái chưa "Paid" tại một thời điểm
- **Priority:** High
- **Exception:** Có thể merge đơn hàng hoặc tạo đơn mới (hủy đơn cũ)

**BR-BL1.7: Tính tổng tiền đơn hàng**
- **Rule:** Tổng tiền đơn hàng = Sum(Sản phẩm giá × Số lượng) + Sum(Tùy chọn giá) + Thuế VAT + Phí dịch vụ
- **Priority:** High
- **Formula:** 
  ```
  Subtotal = Σ(ProductPrice × Quantity + OptionPrice)
  VAT = Subtotal × VATRate (nếu có)
  ServiceFee = Subtotal × ServiceFeeRate (nếu có)
  Total = Subtotal + VAT + ServiceFee
  ```

**BR-BL1.8: Thời gian chế biến ước tính**
- **Rule:** Thời gian chế biến ước tính của đơn = Max(Thời gian chế biến của các sản phẩm trong đơn)
- **Priority:** Medium

---

### BL2: Quy tắc Quản lý Bàn

**BR-BL2.1: Đặt bàn trùng thời gian**
- **Rule:** Một bàn không thể được đặt trùng thời gian với đặt bàn khác
- **Priority:** High
- **Exception:** Có thể đặt bàn cho thời gian sau khi đặt bàn hiện tại kết thúc

**BR-BL2.2: Tự động hủy đặt bàn**
- **Rule:** Đặt bàn tự động hủy nếu khách không đến sau 15 phút kể từ thời gian đặt
- **Priority:** Medium
- **Configurable:** Có thể cấu hình thời gian chờ

**BR-BL2.3: Chuyển đổi trạng thái bàn**
- **Rule:** Trạng thái bàn chỉ có thể chuyển:
  - Available ↔ Occupied (khi tạo/thanh toán đơn)
  - Available ↔ Reserved (khi đặt bàn)
  - Bất kỳ → Maintenance (chỉ Manager)
  - Maintenance → Available (chỉ Manager)
- **Priority:** High

---

### BL3: Quy tắc Quản lý Menu

**BR-BL3.1: Xóa danh mục có sản phẩm**
- **Rule:** Không thể xóa danh mục nếu còn sản phẩm trong danh mục đó
- **Priority:** High
- **Alternative:** Phải xóa hoặc chuyển tất cả sản phẩm sang danh mục khác trước

**BR-BL3.2: Xóa sản phẩm có trong đơn hàng**
- **Rule:** Không thể xóa sản phẩm nếu đã có trong đơn hàng (dù đã thanh toán hay chưa)
- **Priority:** High
- **Alternative:** Chuyển trạng thái sang "Tạm ngừng" hoặc "Hết hàng"

**BR-BL3.3: Sản phẩm hết hàng**
- **Rule:** Sản phẩm có trạng thái "Hết hàng" không thể thêm vào đơn hàng mới
- **Priority:** High
- **Exception:** Có thể thêm vào đơn hàng đã tồn tại (nếu đã có trước khi hết hàng)

**BR-BL3.4: Tạm ngừng sản phẩm**
- **Rule:** Sản phẩm "Tạm ngừng" không hiển thị trong menu và không thể thêm vào đơn hàng mới
- **Priority:** High

---

### BL4: Quy tắc Thanh toán

**BR-BL4.1: Thanh toán tiền mặt**
- **Rule:** 
  - Số tiền khách đưa phải >= Tổng tiền đơn hàng
  - Tiền thừa = Số tiền khách đưa - Tổng tiền
  - Nếu số tiền < Tổng tiền, không cho phép thanh toán
- **Priority:** High

**BR-BL4.2: Thanh toán một phần**
- **Rule:** 
  - Chỉ cho phép thanh toán một phần nếu được cấu hình
  - Số tiền thanh toán một phần phải < Tổng tiền
  - Đơn hàng vẫn ở trạng thái "Served" cho đến khi thanh toán đủ
- **Priority:** Medium
- **Configurable:** Có thể bật/tắt tính năng này

**BR-BL4.3: Phương thức thanh toán**
- **Rule:** Mỗi đơn hàng có thể thanh toán bằng nhiều phương thức (ví dụ: 50% tiền mặt + 50% thẻ)
- **Priority:** Medium

**BR-BL4.4: In hóa đơn**
- **Rule:** 
  - Hóa đơn chỉ có thể in sau khi thanh toán thành công
  - Có thể in lại hóa đơn bất kỳ lúc nào sau khi thanh toán
  - Hóa đơn phải có đầy đủ thông tin: Tên quán, Địa chỉ, SĐT, Mã đơn, Ngày giờ, Danh sách sản phẩm, Tổng tiền, Phương thức thanh toán
- **Priority:** High

---

### BL5: Quy tắc Quản lý Kho

**BR-BL5.1: Tự động trừ kho khi bán hàng**
- **Rule:** Khi đơn hàng được thanh toán, tự động trừ số lượng nguyên liệu theo công thức sản phẩm
- **Priority:** High
- **Formula:** 
  ```
  For each Product in Order:
    For each Ingredient in Product.Recipe:
      Inventory[Ingredient].Quantity -= Product.Quantity × Recipe.Quantity
  ```

**BR-BL5.2: Cảnh báo hết hàng**
- **Rule:** 
  - Khi tồn kho <= Mức tồn kho tối thiểu, hiển thị cảnh báo
  - Cảnh báo hiển thị trên Dashboard và gửi thông báo cho Manager
- **Priority:** High

**BR-BL5.3: Xuất kho tự động**
- **Rule:** Khi trừ kho tự động (từ bán hàng), tạo phiếu xuất kho tự động với lý do "Sử dụng cho đơn hàng"
- **Priority:** Medium

**BR-BL5.4: Không cho phép xuất quá tồn kho**
- **Rule:** Không thể xuất kho nếu số lượng xuất > Tồn kho hiện có
- **Priority:** High

**BR-BL5.5: Nguyên liệu hết hạn**
- **Rule:** 
  - Hệ thống cảnh báo nguyên liệu sắp hết hạn (7 ngày trước)
  - Không cho phép sử dụng nguyên liệu đã hết hạn (nếu có cấu hình)
- **Priority:** Medium
- **Configurable:** Có thể bật/tắt kiểm tra hết hạn

---

## 3. AUTHORIZATION RULES

### AR1: Phân quyền theo Role

**BR-AR1.1: Owner/Manager - Toàn quyền**
- **Rule:** Owner/Manager có quyền truy cập tất cả chức năng
- **Permissions:**
  - Quản lý thông tin quán
  - Quản lý menu và sản phẩm
  - Quản lý nhân viên và phân quyền
  - Quản lý khu vực và bàn
  - Quản lý đơn hàng (tất cả thao tác)
  - Thanh toán
  - Quản lý kho
  - Xem tất cả báo cáo
  - Cấu hình hệ thống
- **Priority:** High

**BR-AR1.2: Shift Manager**
- **Rule:** Shift Manager có quyền quản lý trong ca làm việc
- **Permissions:**
  - Quản lý đơn hàng
  - Thanh toán
  - Quản lý bàn
  - Xem báo cáo ca làm việc
  - Quản lý nhân viên trong ca
- **Restrictions:**
  - Không thể sửa menu
  - Không thể quản lý nhân viên (thêm/sửa/xóa)
  - Không thể xem báo cáo tài chính tổng thể
- **Priority:** High

**BR-AR1.3: Waiter**
- **Rule:** Waiter có quyền phục vụ khách hàng
- **Permissions:**
  - Tạo đơn hàng
  - Cập nhật đơn hàng (trước khi thanh toán)
  - Quản lý trạng thái bàn
  - Đặt bàn
  - Xem menu
- **Restrictions:**
  - Không thể thanh toán
  - Không thể xem báo cáo
  - Không thể sửa/xóa đơn hàng đã thanh toán
- **Priority:** High

**BR-AR1.4: Cashier**
- **Rule:** Cashier có quyền xử lý thanh toán
- **Permissions:**
  - Xem đơn hàng
  - Thanh toán đơn hàng
  - In hóa đơn
  - Xem menu
- **Restrictions:**
  - Không thể tạo/sửa đơn hàng
  - Không thể xem báo cáo
- **Priority:** High

**BR-AR1.5: Barista**
- **Rule:** Barista có quyền xử lý đơn hàng chế biến
- **Permissions:**
  - Xem đơn hàng cần chế biến
  - Cập nhật trạng thái đơn hàng (Preparing → Ready)
  - Xem menu và công thức
- **Restrictions:**
  - Không thể tạo đơn hàng
  - Không thể thanh toán
  - Không thể xem báo cáo
- **Priority:** High

---

### AR2: Quy tắc Phân quyền Chi tiết

**BR-AR2.1: Quyền sửa đơn hàng**
- **Rule:** 
  - Waiter có thể sửa đơn hàng do chính mình tạo (trước khi thanh toán)
  - Manager có thể sửa mọi đơn hàng
  - Cashier không thể sửa đơn hàng
- **Priority:** High

**BR-AR2.2: Quyền hủy đơn hàng**
- **Rule:** 
  - Waiter chỉ có thể hủy đơn hàng "Pending"
  - Manager có thể hủy mọi đơn hàng (trừ "Paid")
- **Priority:** High

**BR-AR2.3: Quyền xem báo cáo**
- **Rule:** 
  - Owner/Manager: Xem tất cả báo cáo
  - Shift Manager: Chỉ xem báo cáo ca làm việc
  - Waiter/Cashier/Barista: Không có quyền xem báo cáo
- **Priority:** High

**BR-AR2.4: Quyền quản lý menu**
- **Rule:** Chỉ Owner/Manager có quyền thêm/sửa/xóa menu và sản phẩm
- **Priority:** High

**BR-AR2.5: Quyền quản lý nhân viên**
- **Rule:** Chỉ Owner/Manager có quyền thêm/sửa/xóa nhân viên và phân quyền
- **Priority:** High

---

## 4. WORKFLOW RULES

### WF1: Quy trình Xử lý Đơn hàng

**BR-WF1.1: Luồng xử lý đơn hàng chuẩn**
- **Rule:** Đơn hàng phải đi qua các bước:
  1. Tạo đơn (Waiter) → Pending
  2. Bắt đầu chế biến (Barista) → Preparing
  3. Hoàn thành chế biến (Barista) → Ready
  4. Phục vụ (Waiter) → Served
  5. Thanh toán (Cashier) → Paid
- **Priority:** High
- **Exception:** Có thể bỏ qua bước nếu sản phẩm không cần chế biến

**BR-WF1.2: Thông báo tự động**
- **Rule:** 
  - Khi đơn hàng chuyển "Ready", tự động thông báo cho Waiter
  - Khi đơn hàng mới được tạo, tự động thông báo cho Barista (nếu có sản phẩm cần chế biến)
- **Priority:** Medium

**BR-WF1.3: Ưu tiên đơn hàng**
- **Rule:** Đơn hàng được sắp xếp theo:
  1. Thời gian tạo (cũ nhất trước)
  2. Trạng thái (Pending → Preparing → Ready)
- **Priority:** Medium

---

### WF2: Quy trình Quản lý Bàn

**BR-WF2.1: Quy trình đặt bàn**
- **Rule:**
  1. Khách đặt bàn → Bàn chuyển "Reserved"
  2. Khách đến → Tạo đơn hàng → Bàn chuyển "Occupied"
  3. Thanh toán → Bàn chuyển "Available"
- **Priority:** High

**BR-WF2.2: Quy trình bàn không có đặt trước**
- **Rule:**
  1. Khách đến → Tạo đơn hàng → Bàn chuyển "Available" → "Occupied"
  2. Thanh toán → Bàn chuyển "Occupied" → "Available"
- **Priority:** High

---

## 5. FINANCIAL RULES

### FR1: Quy tắc Tính toán Tài chính

**BR-FR1.1: Tính thuế VAT**
- **Rule:** 
  - Thuế VAT được tính trên Subtotal (trước phí dịch vụ)
  - VAT = Subtotal × VATRate
  - VATRate có thể cấu hình (mặc định 10%)
- **Priority:** High
- **Configurable:** Có thể bật/tắt VAT, thay đổi VATRate

**BR-FR1.2: Tính phí dịch vụ**
- **Rule:** 
  - Phí dịch vụ được tính trên Subtotal (sau VAT)
  - ServiceFee = Subtotal × ServiceFeeRate
  - ServiceFeeRate có thể cấu hình (mặc định 0% hoặc 5%)
- **Priority:** Medium
- **Configurable:** Có thể bật/tắt phí dịch vụ, thay đổi ServiceFeeRate

**BR-FR1.3: Làm tròn số tiền**
- **Rule:** Tổng tiền được làm tròn đến hàng nghìn (1000 VNĐ)
- **Priority:** Medium
- **Formula:** Total = Round(Total / 1000) × 1000

**BR-FR1.4: Ghi nhận doanh thu**
- **Rule:** Doanh thu chỉ được ghi nhận khi đơn hàng có trạng thái "Paid"
- **Priority:** High

**BR-FR1.5: Đơn hàng hủy**
- **Rule:** Đơn hàng hủy không được tính vào doanh thu
- **Priority:** High

---

### FR2: Quy tắc Báo cáo Tài chính

**BR-FR2.1: Báo cáo doanh thu**
- **Rule:** Báo cáo doanh thu chỉ tính các đơn hàng đã thanh toán (Paid)
- **Priority:** High

**BR-FR2.2: Báo cáo theo thời gian**
- **Rule:** 
  - Báo cáo có thể xem theo: Ngày, Tuần, Tháng, Năm, Tùy chọn
  - Dữ liệu được nhóm theo khoảng thời gian
- **Priority:** High

**BR-FR2.3: So sánh kỳ**
- **Rule:** Có thể so sánh doanh thu với kỳ trước (cùng khoảng thời gian)
- **Priority:** Medium

---

## 6. INVENTORY RULES

### IR1: Quy tắc Quản lý Tồn kho

**BR-IR1.1: Công thức sản phẩm**
- **Rule:** Mỗi sản phẩm có thể có công thức (recipe) định nghĩa nguyên liệu và số lượng cần thiết
- **Priority:** High

**BR-IR1.2: Tự động trừ kho**
- **Rule:** Khi đơn hàng được thanh toán, tự động trừ kho theo công thức
- **Priority:** High

**BR-IR1.3: Cảnh báo hết hàng**
- **Rule:** 
  - Khi tồn kho <= Mức tồn kho tối thiểu, hiển thị cảnh báo
  - Cảnh báo được gửi đến Manager
- **Priority:** High

**BR-IR1.4: Không cho phép bán khi hết nguyên liệu**
- **Rule:** Nếu sản phẩm cần nguyên liệu đã hết, không cho phép thêm vào đơn hàng mới
- **Priority:** Medium
- **Configurable:** Có thể bật/tắt kiểm tra này

**BR-IR1.5: FIFO (First In First Out)**
- **Rule:** Khi xuất kho, ưu tiên xuất nguyên liệu nhập trước (nếu có tracking ngày nhập)
- **Priority:** Low
- **Note:** Có thể implement trong phase 2

---

## 7. DATA INTEGRITY RULES

### DI1: Quy tắc Toàn vẹn Dữ liệu

**BR-DI1.1: Không xóa dữ liệu đã sử dụng**
- **Rule:** 
  - Không thể xóa sản phẩm đã có trong đơn hàng
  - Không thể xóa danh mục có sản phẩm
  - Không thể xóa nhân viên đã tạo đơn hàng
  - Không thể xóa bàn đã có đơn hàng
- **Priority:** High
- **Alternative:** Chuyển trạng thái sang "Inactive" hoặc "Deleted" (soft delete)

**BR-DI1.2: Soft Delete**
- **Rule:** Tất cả các entity quan trọng sử dụng soft delete (đánh dấu xóa, không xóa thật)
- **Priority:** High

**BR-DI1.3: Audit Log**
- **Rule:** 
  - Ghi log tất cả các thao tác quan trọng:
    - Tạo/sửa/xóa đơn hàng
    - Thanh toán
    - Thay đổi giá sản phẩm
    - Thay đổi quyền nhân viên
    - Nhập/xuất kho
- **Priority:** High
- **Fields:** User, Action, Entity, Timestamp, Old Value, New Value

**BR-DI1.4: Foreign Key Constraints**
- **Rule:** 
  - Đơn hàng phải thuộc về một bàn (hoặc takeaway/delivery)
  - Chi tiết đơn hàng phải thuộc về một đơn hàng và một sản phẩm
  - Bàn phải thuộc về một khu vực
  - Sản phẩm phải thuộc về một danh mục
- **Priority:** High

**BR-DI1.5: Unique Constraints**
- **Rule:** 
  - Email nhân viên phải unique
  - Số điện thoại nhân viên phải unique
  - Tên danh mục phải unique trong cùng cấp
  - Tên sản phẩm phải unique trong cùng danh mục
  - Số bàn phải unique trong cùng khu vực
- **Priority:** High

---

## 8. CONFIGURATION RULES

### CR1: Quy tắc Cấu hình Hệ thống

**BR-CR1.1: Cấu hình có thể thay đổi**
- **Rule:** Các cấu hình sau có thể thay đổi bởi Owner/Manager:
  - VAT Rate
  - Service Fee Rate
  - Đơn vị tiền tệ
  - Format ngày tháng
  - Múi giờ
  - Thời gian tự động hủy đặt bàn
  - Mức tồn kho tối thiểu
- **Priority:** Medium

**BR-CR1.2: Cấu hình mặc định**
- **Rule:** Hệ thống có các giá trị mặc định cho tất cả cấu hình
- **Priority:** Medium

---

## 9. EXCEPTION HANDLING RULES

### EH1: Quy tắc Xử lý Ngoại lệ

**BR-EH1.1: Mất kết nối mạng**
- **Rule:** 
  - Hệ thống lưu dữ liệu tạm (local storage)
  - Khi có kết nối lại, tự động sync
  - Hiển thị thông báo cho user
- **Priority:** High

**BR-EH1.2: Lỗi thanh toán**
- **Rule:** 
  - Nếu thanh toán thất bại, đơn hàng vẫn ở trạng thái "Served"
  - User có thể thử lại thanh toán
  - Ghi log lỗi
- **Priority:** High

**BR-EH1.3: Lỗi in hóa đơn**
- **Rule:** 
  - Nếu in hóa đơn thất bại, vẫn lưu giao dịch thanh toán
  - User có thể in lại sau
  - Hiển thị cảnh báo
- **Priority:** Medium

**BR-EH1.4: Dữ liệu không đồng bộ**
- **Rule:** 
  - Hệ thống kiểm tra và cảnh báo nếu có dữ liệu không đồng bộ
  - Cung cấp chức năng đồng bộ lại
- **Priority:** Medium

---

## 10. PERFORMANCE RULES

### PR1: Quy tắc Hiệu năng

**BR-PR1.1: Thời gian phản hồi**
- **Rule:** 
  - API response time < 500ms cho 95% requests
  - Page load time < 2 giây
- **Priority:** High

**BR-PR1.2: Caching**
- **Rule:** 
  - Menu được cache để tăng tốc độ load
  - Cache được invalidate khi menu thay đổi
- **Priority:** Medium

**BR-PR1.3: Pagination**
- **Rule:** 
  - Danh sách đơn hàng, sản phẩm, nhân viên phải có pagination
  - Mặc định 20 items per page
- **Priority:** Medium

---

## 📊 Business Rules Matrix

| Rule ID | Category | Priority | Status | Notes |
|---------|----------|----------|--------|-------|
| BR-VR1.1 | Validation | High | Active | |
| BR-VR2.1 | Validation | High | Active | |
| BR-BL1.1 | Business Logic | High | Active | |
| BR-AR1.1 | Authorization | High | Active | |
| BR-WF1.1 | Workflow | High | Active | |
| BR-FR1.1 | Financial | High | Active | |
| BR-IR1.1 | Inventory | High | Active | |
| BR-DI1.1 | Data Integrity | High | Active | |

---

## 🔄 Business Rules Dependencies

```
Validation Rules → Business Logic Rules
Business Logic Rules → Workflow Rules
Authorization Rules → All Rules (enforcement)
Financial Rules → Business Logic Rules (calculation)
Inventory Rules → Business Logic Rules (auto deduction)
Data Integrity Rules → All Rules (constraints)
```

---

## ✅ Testing Business Rules

Tất cả Business Rules phải được test:
1. **Unit Tests:** Test từng rule riêng lẻ
2. **Integration Tests:** Test rules tương tác với nhau
3. **E2E Tests:** Test rules trong workflow thực tế
4. **Regression Tests:** Đảm bảo rules không bị break khi có thay đổi

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Next Review:** 2025-12-17

