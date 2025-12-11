# Epic: Quản lý quán Coffee Shop

## Tổng quan Epic

### Mô tả
Epic này cung cấp hệ thống quản lý toàn diện cho quán Coffee Shop, bao gồm quản lý menu, đơn hàng, bàn/chỗ ngồi, khách hàng, nhân viên, kho hàng và báo cáo. Hệ thống giúp chủ quán tối ưu hóa hoạt động kinh doanh, nâng cao trải nghiệm khách hàng và tăng doanh thu.

### Mục tiêu kinh doanh
1. **Tối ưu hóa quy trình vận hành**: Giảm thời gian xử lý đơn hàng, tăng hiệu quả phục vụ
2. **Nâng cao trải nghiệm khách hàng**: Hỗ trợ đặt bàn online, loyalty program, thanh toán nhanh chóng
3. **Tăng doanh thu**: Quản lý bán hàng hiệu quả, báo cáo phân tích để đưa ra quyết định kinh doanh
4. **Quản lý tài nguyên**: Theo dõi kho hàng, nguyên liệu, nhân sự để tránh lãng phí

### Phạm vi
- Quản lý menu và giá cả
- Xử lý đơn hàng tại quán và takeaway
- Quản lý bàn/chỗ ngồi và đặt chỗ trước
- Quản lý thông tin khách hàng và chương trình khách hàng thân thiết
- Quản lý nhân viên và phân ca làm việc
- Quản lý kho và nguyên liệu
- Hệ thống thanh toán đa dạng
- Báo cáo và phân tích kinh doanh

---

## Danh sách Features

### 1. Quản lý Thông tin Quán (Priority: Critical)

#### Mô tả
Hệ thống cho phép quản lý thông tin cơ bản và cấu hình hệ thống của quán cà phê.

#### User Stories

**US-0.1: Quản lý thông tin cơ bản quán**
- **As a** chủ quán/quản lý
- **I want** cập nhật thông tin cơ bản của quán (tên, địa chỉ, liên hệ, logo, giờ mở cửa)
- **So that** khách hàng có thể tìm thấy và liên hệ với quán dễ dàng

**Acceptance Criteria:**
- [ ] Có thể cập nhật tên quán (3-100 ký tự, unique)
- [ ] Có thể cập nhật địa chỉ quán
- [ ] Có thể cập nhật số điện thoại (format hợp lệ, unique)
- [ ] Có thể cập nhật email (format hợp lệ, unique)
- [ ] Có thể upload logo quán (JPG/PNG/GIF, tối đa 5MB)
- [ ] Có thể cấu hình giờ mở cửa/đóng cửa (giờ đóng > giờ mở)
- [ ] Có thể thêm mô tả quán
- [ ] Có thể thêm website và social media links
- [ ] Hệ thống validate tất cả thông tin trước khi lưu
- [ ] Hiển thị preview logo trước khi lưu

---

**US-0.2: Cấu hình hệ thống**
- **As a** chủ quán/quản lý
- **I want** cấu hình các thông số hệ thống (tiền tệ, ngôn ngữ, thuế, phí dịch vụ)
- **So that** hệ thống hoạt động phù hợp với quy định và thói quen của quán

**Acceptance Criteria:**
- [ ] Có thể chọn đơn vị tiền tệ (VND, USD, etc.)
- [ ] Có thể chọn ngôn ngữ hiển thị (Tiếng Việt, Tiếng Anh)
- [ ] Có thể cấu hình múi giờ
- [ ] Có thể cấu hình format ngày tháng
- [ ] Có thể bật/tắt và cấu hình thuế VAT (mặc định 10%)
- [ ] Có thể bật/tắt và cấu hình phí dịch vụ (mặc định 0% hoặc 5%)
- [ ] Có thể cấu hình máy in hóa đơn
- [ ] Tất cả cấu hình có giá trị mặc định hợp lý
- [ ] Có thể reset về cấu hình mặc định

---

### 2. Quản lý Menu (Priority: Critical)

#### Mô tả
Hệ thống cho phép quản lý menu đồ uống, món ăn với thông tin chi tiết về giá, mô tả, hình ảnh, và trạng thái có sẵn.

#### User Stories

**US-1.1: Quản lý danh mục menu**
- **As a** chủ quán/quản lý
- **I want** tạo và quản lý các danh mục menu (đồ uống nóng, đồ uống lạnh, bánh ngọt, món ăn nhẹ)
- **So that** khách hàng có thể dễ dàng tìm kiếm và chọn món

**Acceptance Criteria:**
- [ ] Có thể tạo, chỉnh sửa, xóa danh mục menu
- [ ] Tên danh mục: bắt buộc, 2-50 ký tự, unique trong cùng cấp
- [ ] Có thể sắp xếp thứ tự hiển thị danh mục (drag & drop)
- [ ] Mỗi danh mục có: tên, mô tả, icon/hình ảnh đại diện (tùy chọn)
- [ ] Có thể kích hoạt/vô hiệu hóa danh mục (Active/Inactive)
- [ ] Không thể xóa danh mục nếu còn sản phẩm trong danh mục đó

---

**US-1.2: Quản lý món ăn/đồ uống**
- **As a** chủ quán/quản lý
- **I want** thêm, chỉnh sửa, xóa các món ăn/đồ uống trong menu với đầy đủ thông tin
- **So that** menu luôn được cập nhật chính xác và hấp dẫn khách hàng

**Acceptance Criteria:**
- [ ] Có thể thêm sản phẩm mới với các thông tin: tên (2-100 ký tự, unique trong danh mục), mô tả, giá bán (> 0, <= 99,999,999 VNĐ), hình ảnh (tối đa 5 ảnh, mỗi ảnh <= 10MB), danh mục (bắt buộc), trạng thái (Có sẵn/Hết hàng/Tạm ngừng), thời gian chế biến ước tính (0-120 phút)
- [ ] Có thể chỉnh sửa tất cả thông tin của sản phẩm
- [ ] Không thể xóa sản phẩm nếu đã có trong đơn hàng (chỉ có thể chuyển sang "Tạm ngừng" hoặc "Hết hàng")
- [ ] Hỗ trợ upload nhiều hình ảnh cho mỗi sản phẩm (JPG/PNG/GIF)
- [ ] Có thể thiết lập tùy chọn sản phẩm (Option Groups): Size, Topping, Milk type, etc.
- [ ] Mỗi tùy chọn có thể có giá bổ sung (có thể âm nếu giảm giá)
- [ ] Có thể đánh dấu món là "Bán chạy", "Mới", "Đặc biệt"
- [ ] Sản phẩm "Hết hàng" hoặc "Tạm ngừng" không hiển thị trong menu và không thể thêm vào đơn hàng mới

---

**US-1.3: Quản lý giá cả**
- **As a** chủ quán/quản lý
- **I want** thay đổi giá món ăn/đồ uống và theo dõi lịch sử thay đổi giá
- **So that** tôi có thể điều chỉnh giá phù hợp với thị trường và quản lý lợi nhuận

**Acceptance Criteria:**
- [ ] Có thể cập nhật giá cho từng sản phẩm (giá > 0, <= 99,999,999 VNĐ)
- [ ] Hệ thống lưu lịch sử thay đổi giá (ngày, giờ, giá cũ, giá mới, người thay đổi)
- [ ] Có thể đặt giá khuyến mãi theo thời gian (ngày/giờ cụ thể) - tính năng nâng cao
- [ ] Cảnh báo khi giá thay đổi đột ngột (quá 20%) - yêu cầu xác nhận
- [ ] Nếu có đơn hàng chưa thanh toán với giá cũ, cảnh báo khi thay đổi giá

---

**US-1.4: Hiển thị menu cho khách hàng**
- **As a** khách hàng
- **I want** xem menu với đầy đủ thông tin món ăn, giá cả, hình ảnh
- **So that** tôi có thể dễ dàng chọn món và biết giá trước khi đặt

**Acceptance Criteria:**
- [ ] Menu hiển thị đầy đủ danh mục và món ăn
- [ ] Mỗi món hiển thị: tên, mô tả, giá, hình ảnh, trạng thái có sẵn
- [ ] Có thể lọc món theo danh mục
- [ ] Có thể tìm kiếm món theo tên
- [ ] Menu tự động ẩn các món không còn sẵn
- [ ] Giao diện menu đẹp, dễ sử dụng trên mobile và desktop

---

### 3. Quản lý Đơn hàng (Priority: Critical)

#### Mô tả
Hệ thống xử lý đơn hàng tại quán (dine-in), takeaway và delivery, từ khi tạo đơn đến khi thanh toán.

#### User Stories

**US-2.1: Tạo đơn hàng mới**
- **As a** nhân viên phục vụ
- **I want** tạo đơn hàng mới nhanh chóng với các món đã chọn
- **So that** tôi có thể phục vụ khách hàng kịp thời và chính xác

**Acceptance Criteria:**
- [ ] Có thể tạo đơn hàng mới từ menu (chỉ sản phẩm có sẵn)
- [ ] Có thể thêm nhiều sản phẩm vào một đơn (ít nhất 1 sản phẩm với số lượng > 0)
- [ ] Có thể chọn size/options/topping cho từng sản phẩm (nếu có)
- [ ] Có thể chỉnh sửa số lượng (1-999), xóa sản phẩm trong đơn (trước khi thanh toán)
- [ ] Có thể chọn loại đơn: dine-in (gắn với bàn - bàn phải Available hoặc Reserved), takeaway, delivery
- [ ] Đơn takeaway/delivery: yêu cầu thông tin khách hàng (tên hoặc SĐT), delivery cần địa chỉ (>= 10 ký tự)
- [ ] Hiển thị tổng tiền tạm tính tự động cập nhật (bao gồm VAT và phí dịch vụ nếu có)
- [ ] Có thể thêm ghi chú đặc biệt cho đơn hoặc từng món
- [ ] Đơn hàng được đánh số thứ tự tự động
- [ ] Khi tạo đơn cho bàn, bàn tự động chuyển từ "Available" → "Occupied" hoặc "Reserved" → "Occupied"
- [ ] Một bàn chỉ có thể có tối đa 1 đơn hàng chưa thanh toán tại một thời điểm

---

**US-2.2: Quản lý trạng thái đơn hàng**
- **As a** nhân viên/nhà bếp
- **I want** cập nhật trạng thái đơn hàng (đang chế biến, đã xong, đã giao)
- **So that** mọi người biết được tiến độ của đơn và phục vụ khách đúng thời gian

**Acceptance Criteria:**
- [ ] Đơn hàng có các trạng thái: Pending (Đang chờ), Preparing (Đang chế biến), Ready (Sẵn sàng), Served (Đã phục vụ), Paid (Đã thanh toán), Cancelled (Đã hủy)
- [ ] Chuyển đổi trạng thái theo thứ tự: Pending → Preparing → Ready → Served → Paid (hoặc bất kỳ → Cancelled)
- [ ] Owner/Manager có thể chuyển trạng thái bất kỳ (ngoại lệ)
- [ ] Thời gian cập nhật trạng thái được ghi nhận (audit log)
- [ ] Barista nhận được thông báo khi có đơn mới (Pending) với sản phẩm cần chế biến
- [ ] Waiter nhận thông báo khi đơn chuyển "Ready"
- [ ] Hệ thống tính thời gian xử lý đơn (từ lúc tạo đến lúc hoàn thành)
- [ ] Đơn hàng "Paid" không thể sửa/xóa (trừ khi có quyền đặc biệt)

---

**US-2.3: Xem danh sách đơn hàng**
- **As a** quản lý/nhân viên
- **I want** xem danh sách tất cả đơn hàng theo thời gian, trạng thái, bàn
- **So that** tôi có thể theo dõi và quản lý đơn hàng hiệu quả

**Acceptance Criteria:**
- [ ] Hiển thị danh sách đơn hàng với thông tin: số đơn, thời gian, bàn (nếu dine-in), tổng tiền, trạng thái
- [ ] Có thể lọc đơn theo: ngày, trạng thái, nhân viên, bàn, loại đơn
- [ ] Có thể sắp xếp đơn theo thời gian, tổng tiền
- [ ] Đơn hàng đang xử lý được highlight hoặc ưu tiên hiển thị
- [ ] Có thể xem chi tiết đơn hàng (danh sách món, ghi chú, lịch sử cập nhật)

---

**US-2.4: Hủy đơn hàng**
- **As a** nhân viên/quản lý
- **I want** hủy đơn hàng với lý do
- **So that** hệ thống ghi nhận chính xác và quản lý tồn kho đúng

**Acceptance Criteria:**
- [ ] Có thể hủy đơn ở trạng thái "Pending" hoặc "Preparing" (Waiter/Manager)
- [ ] Đơn "Ready" hoặc "Served" chỉ có thể hủy bởi Manager với lý do bắt buộc
- [ ] Đơn "Paid" không thể hủy (chỉ có thể tạo đơn hoàn tiền)
- [ ] Bắt buộc nhập lý do hủy
- [ ] Đơn đã hủy không được tính vào doanh thu
- [ ] Nguyên liệu từ đơn hủy được cộng lại vào tồn kho (nếu đã trừ tự động)
- [ ] Quản lý được thông báo khi có đơn bị hủy
- [ ] Lưu lịch sử hủy đơn để phân tích (audit log)

---

### 4. Quản lý Bàn và Khu vực (Priority: High)

#### Mô tả
Hệ thống quản lý khu vực và bàn trong quán, hỗ trợ đặt bàn trước và theo dõi tình trạng sử dụng bàn.

#### User Stories

**US-3.1: Quản lý khu vực**
- **As a** chủ quán/quản lý
- **I want** tạo và quản lý các khu vực trong quán (Tầng 1, Tầng 2, Sân vườn, etc.)
- **So that** tôi có thể tổ chức không gian quán một cách có hệ thống

**Acceptance Criteria:**
- [ ] Có thể tạo, chỉnh sửa, xóa khu vực
- [ ] Mỗi khu vực có: tên (2-50 ký tự, unique), mô tả
- [ ] Có thể upload sơ đồ khu vực (tùy chọn)
- [ ] Hiển thị danh sách khu vực với số lượng bàn trong mỗi khu vực
- [ ] Không thể xóa khu vực nếu còn bàn trong khu vực đó

---

**US-3.2: Quản lý bàn**
- **As a** chủ quán/quản lý
- **I want** tạo và quản lý danh sách bàn trong quán với thông tin vị trí, sức chứa
- **So that** tôi có thể tổ chức và theo dõi không gian phục vụ

**Acceptance Criteria:**
- [ ] Có thể thêm, chỉnh sửa, xóa bàn
- [ ] Mỗi bàn có: số bàn/tên bàn (1-20 ký tự, unique trong khu vực), khu vực (bắt buộc), số chỗ ngồi (1-50)
- [ ] Có thể thêm ghi chú đặc biệt cho bàn
- [ ] Có thể vô hiệu hóa bàn tạm thời (Maintenance)
- [ ] Hiển thị sơ đồ bàn trên giao diện với trạng thái trực quan
- [ ] Không thể xóa bàn nếu đã có đơn hàng (soft delete)

---

**US-3.3: Quản lý trạng thái bàn**
- **As a** nhân viên phục vụ
- **I want** xem và cập nhật trạng thái bàn (trống, đang sử dụng, đã đặt trước, cần dọn dẹp)
- **So that** tôi biết bàn nào đang trống và có thể sắp xếp khách ngồi phù hợp

**Acceptance Criteria:**
- [ ] Bàn có các trạng thái: Available (Trống), Occupied (Đang sử dụng), Reserved (Đã đặt trước), Maintenance (Tạm ngưng)
- [ ] Trạng thái bàn tự động cập nhật: Available → Occupied khi tạo đơn, Occupied → Available khi thanh toán
- [ ] Trạng thái bàn tự động cập nhật: Available → Reserved khi đặt bàn, Reserved → Occupied khi tạo đơn từ đặt bàn
- [ ] Có thể chuyển đổi trạng thái bàn thủ công (chỉ Manager)
- [ ] Hiển thị trực quan trạng thái bàn trên sơ đồ (màu sắc khác nhau)
- [ ] Hiển thị thời gian bàn đã sử dụng
- [ ] Một bàn chỉ có thể có tối đa 1 đơn hàng chưa thanh toán tại một thời điểm

---

**US-3.4: Đặt bàn trước**
- **As a** khách hàng
- **I want** đặt chỗ trước qua ứng dụng/website
- **So that** tôi chắc chắn có chỗ ngồi khi đến quán

**Acceptance Criteria:**
- [ ] Khách hàng/nhân viên có thể tạo đặt bàn với: tên khách hàng (bắt buộc), số điện thoại (bắt buộc), thời gian đặt (bắt buộc, trong tương lai hoặc hiện tại, không quá 30 ngày), số lượng người, chọn bàn (tùy chọn), ghi chú
- [ ] Hệ thống hiển thị các bàn trống phù hợp với số người (số người <= số chỗ ngồi)
- [ ] Hệ thống tự động gợi ý bàn phù hợp nếu không chọn bàn cụ thể
- [ ] Một bàn không thể được đặt trùng thời gian với đặt bàn khác
- [ ] Bàn chuyển sang trạng thái "Reserved" khi đặt bàn
- [ ] Xác nhận đặt bàn qua SMS/Email (nếu có)
- [ ] Tự động hủy đặt bàn nếu khách không đến sau 15 phút (có thể cấu hình)
- [ ] Khách hàng/nhân viên có thể hủy đặt bàn

---

**US-3.5: Quản lý đặt bàn**
- **As a** nhân viên/quản lý
- **I want** xem danh sách đặt chỗ, xác nhận và xử lý đặt chỗ
- **So that** tôi có thể chuẩn bị bàn và phục vụ khách đúng thời gian

**Acceptance Criteria:**
- [ ] Hiển thị danh sách đặt bàn theo ngày, giờ với filter và sort
- [ ] Có thể xác nhận, hủy đặt bàn
- [ ] Có thể chỉnh sửa thông tin đặt bàn (giờ, bàn, số người) - chỉnh sửa phải kiểm tra bàn mới có trống không
- [ ] Đánh dấu khách đã đến/quá giờ không đến
- [ ] Tự động giải phóng bàn nếu khách không đến sau 15 phút (có thể cấu hình)
- [ ] Khi khách đến, có thể tạo đơn hàng từ đặt bàn (bàn chuyển Reserved → Occupied)
- [ ] Thống kê tỷ lệ đến/không đến

---

### 5. Quản lý Khách hàng (Priority: High)

#### Mô tả
Hệ thống quản lý thông tin khách hàng, lịch sử giao dịch và chương trình khách hàng thân thiết.

#### User Stories

**US-4.1: Đăng ký tài khoản khách hàng**
- **As a** khách hàng
- **I want** đăng ký tài khoản trên ứng dụng/website
- **So that** tôi có thể tích điểm, nhận ưu đãi và quản lý đơn hàng của mình

**Acceptance Criteria:**
- [ ] Khách hàng có thể đăng ký bằng số điện thoại/email
- [ ] Xác thực OTP qua SMS/Email
- [ ] Có thể đăng nhập bằng số điện thoại/email + mật khẩu
- [ ] Khách hàng có thể cập nhật thông tin cá nhân (tên, địa chỉ, ngày sinh)
- [ ] Hỗ trợ đăng nhập bằng social login (Google, Facebook)

---

**US-4.2: Quản lý thông tin khách hàng**
- **As a** quản lý/nhân viên
- **I want** xem và quản lý thông tin khách hàng trong hệ thống
- **So that** tôi có thể phục vụ khách hàng tốt hơn và phân tích hành vi mua hàng

**Acceptance Criteria:**
- [ ] Xem danh sách khách hàng với thông tin: tên, SĐT, email, tổng số đơn, tổng chi tiêu
- [ ] Xem chi tiết khách hàng: thông tin cá nhân, lịch sử đơn hàng, điểm tích lũy
- [ ] Có thể tìm kiếm khách hàng theo tên, SĐT
- [ ] Có thể chỉnh sửa thông tin khách hàng (quyền quản lý)
- [ ] Phân loại khách hàng: Thường, VIP, Thân thiết

---

**US-4.3: Chương trình tích điểm và ưu đãi**
- **As a** khách hàng
- **I want** tích điểm khi mua hàng và đổi điểm lấy ưu đãi
- **So that** tôi được hưởng lợi ích từ việc quay lại mua hàng

**Acceptance Criteria:**
- [ ] Tự động tích điểm khi thanh toán đơn hàng (ví dụ: 1 điểm = 1.000đ)
- [ ] Hiển thị số điểm hiện có trên tài khoản
- [ ] Xem lịch sử tích điểm và sử dụng điểm
- [ ] Có thể đổi điểm lấy voucher/giảm giá
- [ ] Có thể tích điểm nhanh bằng mã QR hoặc số điện thoại
- [ ] Thông báo khi đạt mốc điểm (đạt hạng VIP, có voucher mới)

---

**US-4.4: Quản lý voucher/khuyến mãi**
- **As a** chủ quán/quản lý
- **I want** tạo và quản lý các chương trình khuyến mãi, voucher
- **So that** tôi có thể thu hút khách hàng và tăng doanh số

**Acceptance Criteria:**
- [ ] Có thể tạo voucher với: loại (giảm %, giảm số tiền cố định, tặng món), giá trị, số lượng, thời hạn
- [ ] Có thể tạo mã voucher hoặc tự động phát hành
- [ ] Khách hàng có thể áp dụng voucher khi thanh toán
- [ ] Hệ thống kiểm tra voucher hợp lệ (chưa hết hạn, chưa hết số lượng)
- [ ] Theo dõi số lượng voucher đã sử dụng
- [ ] Có thể tạo khuyến mãi theo thời gian (giờ vàng, ngày đặc biệt)

---

### 6. Quản lý Nhân viên (Priority: Medium)

#### Mô tả
Hệ thống quản lý thông tin nhân viên, phân quyền, phân ca làm việc và theo dõi hiệu suất.

#### User Stories

**US-5.1: Quản lý tài khoản nhân viên**
- **As a** chủ quán/quản lý
- **I want** tạo và quản lý tài khoản nhân viên với phân quyền phù hợp
- **So that** mỗi nhân viên chỉ truy cập được các chức năng cần thiết

**Acceptance Criteria:**
- [ ] Có thể thêm nhân viên mới với thông tin: tên, SĐT, email, vị trí, ca làm việc
- [ ] Phân quyền: Quản lý, Nhân viên phục vụ, Nhân viên bếp, Thu ngân, Xem báo cáo
- [ ] Mỗi nhân viên có tài khoản đăng nhập riêng
- [ ] Có thể kích hoạt/vô hiệu hóa tài khoản nhân viên
- [ ] Nhân viên có thể đổi mật khẩu
- [ ] Quản lý có thể reset mật khẩu cho nhân viên

---

**US-5.2: Phân ca làm việc**
- **As a** quản lý
- **I want** tạo lịch làm việc và phân ca cho nhân viên
- **So that** quán luôn có đủ nhân lực phục vụ khách hàng

**Acceptance Criteria:**
- [ ] Có thể tạo ca làm việc: Sáng, Chiều, Tối, Full day
- [ ] Gán nhân viên vào ca làm việc theo ngày/tuần/tháng
- [ ] Hiển thị lịch làm việc của từng nhân viên
- [ ] Cảnh báo khi thiếu nhân viên trong ca
- [ ] Nhân viên có thể xem lịch làm việc của mình
- [ ] Hỗ trợ đổi ca giữa nhân viên (có xác nhận quản lý)

---

**US-5.3: Chấm công**
- **As a** nhân viên/quản lý
- **I want** chấm công vào/ra ca làm việc
- **So that** hệ thống theo dõi chính xác thời gian làm việc để tính lương

**Acceptance Criteria:**
- [ ] Nhân viên có thể check-in/check-out bằng tài khoản
- [ ] Ghi nhận thời gian vào/ra chính xác
- [ ] Cảnh báo nếu check-in muộn hoặc check-out sớm
- [ ] Quản lý có thể chỉnh sửa chấm công (nếu có lý do)
- [ ] Xem báo cáo chấm công theo nhân viên, ca, tháng
- [ ] Tính tổng giờ làm việc tự động

---

### 7. Quản lý Kho hàng (Priority: Medium)

#### Mô tả
Hệ thống quản lý tồn kho nguyên liệu, hàng hóa, cảnh báo hết hàng và theo dõi nhập/xuất.

#### User Stories

**US-6.1: Quản lý nguyên liệu**
- **As a** quản lý
- **I want** quản lý danh sách nguyên liệu/hàng hóa trong kho
- **So that** tôi biết được lượng tồn kho và đặt hàng kịp thời

**Acceptance Criteria:**
- [ ] Có thể thêm, chỉnh sửa, xóa nguyên liệu
- [ ] Tên nguyên liệu: bắt buộc, 2-100 ký tự, unique trong quán
- [ ] Mỗi nguyên liệu có: tên, đơn vị tính (kg, lít, gói...), giá nhập (>= 0, <= 99,999,999 VNĐ), nhà cung cấp, số lượng tồn kho, mức tồn kho tối thiểu (>= 0), ngày hết hạn (nếu có)
- [ ] Thiết lập mức tồn kho tối thiểu (cảnh báo khi sắp hết)
- [ ] Theo dõi số lượng tồn kho hiện tại
- [ ] Phân loại nguyên liệu theo nhóm (cà phê, sữa, bánh...)

---

**US-6.2: Nhập kho**
- **As a** quản lý
- **I want** ghi nhận nhập kho nguyên liệu mới
- **So that** tồn kho được cập nhật chính xác

**Acceptance Criteria:**
- [ ] Tạo phiếu nhập kho với: nhà cung cấp, ngày nhập, ghi chú, danh sách nguyên liệu (nguyên liệu, số lượng > 0 và <= 999,999, giá nhập >= 0, ngày hết hạn nếu có)
- [ ] Số lượng nhập: > 0 và <= 999,999
- [ ] Giá nhập: >= 0 và <= 99,999,999 VNĐ
- [ ] Tự động cập nhật số lượng tồn kho sau khi nhập
- [ ] Lưu lịch sử nhập kho để tra cứu (audit log)
- [ ] Có thể xem chi tiết phiếu nhập kho
- [ ] Có thể import từ file Excel (tính năng nâng cao)

---

**US-6.3: Xuất kho và tự động trừ tồn**
- **As a** hệ thống/quản lý
- **I want** tự động trừ nguyên liệu khi có đơn hàng hoặc ghi nhận xuất kho thủ công
- **So that** tồn kho luôn chính xác và quản lý có thể kiểm soát chi phí

**Acceptance Criteria:**
- [ ] Khi đơn hàng được thanh toán (Paid), tự động trừ nguyên liệu theo công thức sản phẩm
- [ ] Công thức: Mỗi sản phẩm có thể liên kết với nguyên liệu và số lượng cần thiết
- [ ] Có thể ghi nhận xuất kho thủ công với: lý do xuất (Sử dụng, Hỏng, Mất, Kiểm kê), ngày xuất, ghi chú, danh sách nguyên liệu (nguyên liệu, số lượng xuất)
- [ ] Số lượng xuất: > 0 và <= Tồn kho hiện có
- [ ] Không cho phép xuất quá tồn kho
- [ ] Tự động tạo phiếu xuất kho khi trừ kho từ đơn hàng (lý do: "Sử dụng cho đơn hàng")
- [ ] Cảnh báo khi nguyên liệu không đủ để làm món (nếu có cấu hình)
- [ ] Hiển thị lịch sử xuất kho (audit log)
- [ ] Tính giá vốn của món dựa trên nguyên liệu sử dụng

---

**US-6.4: Cảnh báo tồn kho thấp**
- **As a** quản lý
- **I want** nhận cảnh báo khi tồn kho nguyên liệu xuống dưới mức tối thiểu
- **So that** tôi có thể đặt hàng kịp thời, tránh hết hàng

**Acceptance Criteria:**
- [ ] Tự động cảnh báo khi tồn kho <= mức tối thiểu
- [ ] Hiển thị danh sách nguyên liệu cần đặt hàng
- [ ] Cảnh báo qua thông báo trong hệ thống và email
- [ ] Có thể xem báo cáo tồn kho theo thời gian

---

### 8. Thanh toán (Priority: Critical)

#### Mô tả
Hệ thống thanh toán đa dạng phương thức, xử lý hóa đơn và tích hợp các cổng thanh toán.

#### User Stories

**US-7.1: Thanh toán đơn hàng**
- **As a** nhân viên thu ngân/khách hàng
- **I want** thanh toán đơn hàng bằng nhiều phương thức khác nhau
- **So that** khách hàng có thể thanh toán tiện lợi và quán thu tiền chính xác

**Acceptance Criteria:**
- [ ] Chỉ có thể thanh toán đơn hàng có trạng thái "Served" hoặc "Ready"
- [ ] Hỗ trợ thanh toán: Tiền mặt (Cash), Thẻ (Card), Chuyển khoản (Bank Transfer), Ví điện tử (E-wallet)
- [ ] Tính tổng tiền: Subtotal + VAT + Phí dịch vụ (theo cấu hình)
- [ ] Nếu tiền mặt: nhập số tiền khách đưa (phải >= Tổng tiền), tự động tính tiền thừa
- [ ] Có thể thanh toán bằng nhiều phương thức (ví dụ: 50% tiền mặt + 50% thẻ)
- [ ] Có thể áp dụng voucher/giảm giá khi thanh toán (nếu có)
- [ ] Có thể tích điểm cho khách hàng (nếu có tài khoản và được cấu hình)
- [ ] Sau khi thanh toán thành công: đơn hàng chuyển "Paid", bàn chuyển "Available", ghi nhận doanh thu
- [ ] Tự động in hóa đơn sau khi thanh toán (có thể bỏ qua)
- [ ] Gửi hóa đơn điện tử qua Email/SMS cho khách (nếu có)
- [ ] Hỗ trợ thanh toán một phần (nếu được cấu hình): số tiền thanh toán < Tổng tiền, đơn vẫn ở "Served"
- [ ] Có thể in lại hóa đơn bất kỳ lúc nào sau khi thanh toán

---

**US-7.2: Tạo và quản lý hóa đơn**
- **As a** hệ thống
- **I want** tự động tạo hóa đơn VAT và hóa đơn thường
- **So that** đáp ứng yêu cầu pháp lý và khách hàng có chứng từ hợp lệ

**Acceptance Criteria:**
- [ ] Tự động tạo hóa đơn sau khi thanh toán thành công
- [ ] Hóa đơn có đầy đủ thông tin: số hóa đơn (tự động), ngày giờ, thông tin quán (tên, địa chỉ, SĐT), danh sách sản phẩm (tên, số lượng, giá, tổng), Subtotal, VAT (nếu có), Phí dịch vụ (nếu có), Tổng cộng, Phương thức thanh toán
- [ ] Hỗ trợ in hóa đơn nhiều liên (nếu có cấu hình)
- [ ] Có thể xem lại, in lại hóa đơn đã phát hành
- [ ] Hỗ trợ xuất hóa đơn điện tử (hợp pháp theo quy định) - tính năng nâng cao
- [ ] Lưu trữ hóa đơn để tra cứu (audit log)
- [ ] Hóa đơn chỉ có thể in sau khi thanh toán thành công

---

**US-7.3: Hoàn tiền**
- **As a** quản lý
- **I want** xử lý hoàn tiền cho đơn hàng đã thanh toán
- **So that** khách hàng được hoàn tiền đúng trong trường hợp cần thiết

**Acceptance Criteria:**
- [ ] Chỉ Manager có quyền tạo phiếu hoàn tiền cho đơn đã thanh toán (Paid)
- [ ] Bắt buộc nhập lý do hoàn tiền
- [ ] Hoàn tiền theo phương thức thanh toán ban đầu (tiền mặt hoàn tiền mặt, thẻ hoàn thẻ)
- [ ] Cập nhật lại điểm tích lũy (trừ điểm đã cộng nếu có)
- [ ] Cập nhật lại doanh thu (trừ số tiền đã hoàn)
- [ ] Có quyền phê duyệt hoàn tiền (chỉ Manager/Owner)
- [ ] Ghi nhận lịch sử hoàn tiền (audit log)
- [ ] Có thể hoàn tiền một phần hoặc toàn bộ

---

### 9. Báo cáo và Thống kê (Priority: High)

#### Mô tả
Hệ thống báo cáo và phân tích doanh thu, sản phẩm bán chạy, khách hàng để hỗ trợ ra quyết định kinh doanh.

#### User Stories

**US-8.1: Báo cáo doanh thu**
- **As a** chủ quán/quản lý
- **I want** xem báo cáo doanh thu theo ngày, tuần, tháng, năm
- **So that** tôi nắm được tình hình kinh doanh và đưa ra quyết định điều chỉnh

**Acceptance Criteria:**
- [ ] Báo cáo doanh thu theo: ngày, tuần, tháng, năm, khoảng thời gian tùy chọn
- [ ] Hiển thị: Tổng doanh thu, Số đơn hàng, Giá trị đơn trung bình, Tỷ lệ tăng/giảm
- [ ] So sánh doanh thu giữa các kỳ (tuần này vs tuần trước, tháng này vs tháng trước)
- [ ] Báo cáo doanh thu theo phương thức thanh toán
- [ ] Báo cáo doanh thu theo ca làm việc (sáng, chiều, tối)
- [ ] Xuất báo cáo ra file Excel/PDF

---

**US-8.2: Báo cáo sản phẩm bán chạy**
- **As a** chủ quán/quản lý
- **I want** xem báo cáo món ăn/đồ uống bán chạy nhất
- **So that** tôi biết món nào được ưa chuộng và tối ưu menu, tồn kho

**Acceptance Criteria:**
- [ ] Top món bán chạy theo: số lượng, doanh thu
- [ ] Báo cáo theo ngày, tuần, tháng, năm
- [ ] Hiển thị: tên món, số lượng bán, doanh thu, tỷ trọng
- [ ] Biểu đồ trực quan hóa dữ liệu
- [ ] Món bán ít nhất (để xem xét loại bỏ hoặc cải thiện)

---

**US-8.3: Báo cáo khách hàng**
- **As a** chủ quán/quản lý
- **I want** xem báo cáo về khách hàng và hành vi mua hàng
- **So that** tôi hiểu được khách hàng và xây dựng chiến lược marketing phù hợp

**Acceptance Criteria:**
- [ ] Số lượng khách hàng mới, khách hàng quay lại
- [ ] Top khách hàng chi tiêu nhiều nhất
- [ ] Tần suất ghé thăm của khách hàng
- [ ] Phân tích khung giờ đông khách
- [ ] Khách hàng VIP (theo tiêu chí: chi tiêu, số lần ghé thăm)

---

**US-8.4: Báo cáo tồn kho và chi phí**
- **As a** chủ quán/quản lý
- **I want** xem báo cáo tồn kho, chi phí nguyên liệu và lợi nhuận
- **So that** tôi kiểm soát được chi phí và tối ưu lợi nhuận

**Acceptance Criteria:**
- [ ] Báo cáo tồn kho hiện tại, giá trị tồn kho
- [ ] Chi phí nguyên liệu theo thời gian
- [ ] Tính lợi nhuận gộp (Doanh thu - Giá vốn)
- [ ] Tỷ lệ lợi nhuận theo món, theo danh mục
- [ ] Nguyên liệu sử dụng nhiều nhất
- [ ] Xuất báo cáo chi phí

---

**US-8.5: Dashboard tổng quan**
- **As a** chủ quán/quản lý
- **I want** xem dashboard tổng quan với các chỉ số kinh doanh quan trọng
- **So that** tôi nắm nhanh tình hình kinh doanh trong ngày/tuần/tháng

**Acceptance Criteria:**
- [ ] Hiển thị các chỉ số: Doanh thu hôm nay, Số đơn hôm nay, Khách hàng hôm nay, Bàn đang sử dụng
- [ ] Biểu đồ doanh thu 7 ngày gần nhất
- [ ] Top 5 món bán chạy hôm nay
- [ ] Cảnh báo tồn kho thấp
- [ ] So sánh với kỳ trước (tăng/giảm %)
- [ ] Có thể tùy chỉnh dashboard (chọn các widget hiển thị)

---

## Ưu tiên Features

1. **Critical Priority**: Quản lý Thông tin Quán, Quản lý Menu, Quản lý Đơn hàng, Thanh toán
2. **High Priority**: Quản lý Bàn và Khu vực, Quản lý Khách hàng, Báo cáo và Thống kê
3. **Medium Priority**: Quản lý Nhân viên, Quản lý Kho hàng

## Phụ thuộc giữa các Features

- **Tất cả features** phụ thuộc vào **Quản lý Thông tin Quán** (cần cấu hình hệ thống trước)
- **Quản lý Đơn hàng** phụ thuộc vào **Quản lý Menu** (cần có menu để tạo đơn)
- **Thanh toán** phụ thuộc vào **Quản lý Đơn hàng** (cần có đơn để thanh toán)
- **Quản lý Đơn hàng** (dine-in) phụ thuộc vào **Quản lý Bàn và Khu vực** (cần gán đơn vào bàn)
- **Quản lý Khách hàng** (tích điểm) phụ thuộc vào **Thanh toán** (tích điểm khi thanh toán)
- **Quản lý Kho hàng** (tự động trừ tồn) phụ thuộc vào **Quản lý Đơn hàng** và **Thanh toán** (trừ tồn khi thanh toán)
- **Báo cáo và Thống kê** phụ thuộc vào các features khác (cần có dữ liệu từ đơn hàng, khách hàng, kho)

## Lưu ý triển khai

1. **Phase 1 (MVP)**: Quản lý Thông tin Quán, Quản lý Menu, Quản lý Đơn hàng cơ bản, Thanh toán tiền mặt
2. **Phase 2**: Quản lý Bàn và Khu vực, Quản lý Khách hàng, Báo cáo cơ bản
3. **Phase 3**: Quản lý Nhân viên, Quản lý Kho hàng, Báo cáo nâng cao, Thanh toán điện tử

