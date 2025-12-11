# Tổng hợp Epic và Features - vibeapps Platform

> Tài liệu này tổng hợp tất cả các Epic và Features của hệ thống vibeapps Platform, được quản lý bởi Product Owner.

---

## Danh sách Epic

### Epic 1: Quản lý quán Coffee Shop

**Trạng thái**: Đang phát triển  
**Priority**: High  
**Mô tả ngắn**: Hệ thống quản lý toàn diện cho quán Coffee Shop, bao gồm quản lý thông tin quán, menu, đơn hàng, bàn/khu vực, khách hàng, nhân viên, kho hàng, thanh toán và báo cáo.

**Chi tiết**: [epic-quan-ly-quan-coffee-shop.md](./epic-quan-ly-quan-coffee-shop.md)

---

## Tổng hợp Features theo Epic

### Epic 1: Quản lý quán Coffee Shop

#### Critical Priority Features

1. **Quản lý Thông tin Quán**
   - Quản lý thông tin cơ bản quán
   - Cấu hình hệ thống

2. **Quản lý Menu**
   - Quản lý danh mục menu
   - Quản lý sản phẩm/món ăn/đồ uống
   - Quản lý giá cả
   - Quản lý tùy chọn sản phẩm
   - Hiển thị menu cho khách hàng

3. **Quản lý Đơn hàng**
   - Tạo đơn hàng mới (dine-in, takeaway, delivery)
   - Quản lý trạng thái đơn hàng
   - Xem danh sách đơn hàng
   - Hủy đơn hàng

4. **Thanh toán**
   - Thanh toán đơn hàng (đa phương thức)
   - Tạo và quản lý hóa đơn
   - Hoàn tiền

#### High Priority Features

5. **Quản lý Bàn và Khu vực**
   - Quản lý khu vực
   - Quản lý bàn
   - Quản lý trạng thái bàn
   - Đặt bàn trước
   - Quản lý đặt bàn

6. **Quản lý Khách hàng**
   - Đăng ký tài khoản khách hàng
   - Quản lý thông tin khách hàng
   - Chương trình tích điểm và ưu đãi
   - Quản lý voucher/khuyến mãi

7. **Báo cáo và Thống kê**
   - Báo cáo doanh thu
   - Báo cáo sản phẩm bán chạy
   - Báo cáo khách hàng
   - Báo cáo tồn kho và chi phí
   - Dashboard tổng quan

#### Medium Priority Features

8. **Quản lý Nhân viên**
   - Quản lý tài khoản nhân viên
   - Phân ca làm việc
   - Chấm công

9. **Quản lý Kho hàng**
   - Quản lý nguyên liệu
   - Nhập kho
   - Xuất kho và tự động trừ tồn
   - Cảnh báo tồn kho thấp

---

## Tổng hợp User Stories

### Epic 1: Quản lý quán Coffee Shop

Tổng số User Stories: **34**

#### Quản lý Thông tin Quán (2 stories)
- US-0.1: Quản lý thông tin cơ bản quán
- US-0.2: Cấu hình hệ thống

#### Quản lý Menu (4 stories)
- US-1.1: Quản lý danh mục menu
- US-1.2: Quản lý món ăn/đồ uống
- US-1.3: Quản lý giá cả
- US-1.4: Hiển thị menu cho khách hàng

#### Quản lý Đơn hàng (4 stories)
- US-2.1: Tạo đơn hàng mới
- US-2.2: Quản lý trạng thái đơn hàng
- US-2.3: Xem danh sách đơn hàng
- US-2.4: Hủy đơn hàng

#### Quản lý Bàn và Khu vực (5 stories)
- US-3.1: Quản lý khu vực
- US-3.2: Quản lý bàn
- US-3.3: Quản lý trạng thái bàn
- US-3.4: Đặt bàn trước
- US-3.5: Quản lý đặt bàn

#### Quản lý Khách hàng (4 stories)
- US-4.1: Đăng ký tài khoản khách hàng
- US-4.2: Quản lý thông tin khách hàng
- US-4.3: Chương trình tích điểm và ưu đãi
- US-4.4: Quản lý voucher/khuyến mãi

#### Quản lý Nhân viên (3 stories)
- US-5.1: Quản lý tài khoản nhân viên
- US-5.2: Phân ca làm việc
- US-5.3: Chấm công

#### Quản lý Kho hàng (4 stories)
- US-6.1: Quản lý nguyên liệu
- US-6.2: Nhập kho
- US-6.3: Xuất kho và tự động trừ tồn
- US-6.4: Cảnh báo tồn kho thấp

#### Thanh toán (3 stories)
- US-7.1: Thanh toán đơn hàng
- US-7.2: Tạo và quản lý hóa đơn
- US-7.3: Hoàn tiền

#### Báo cáo và Thống kê (5 stories)
- US-8.1: Báo cáo doanh thu
- US-8.2: Báo cáo sản phẩm bán chạy
- US-8.3: Báo cáo khách hàng
- US-8.4: Báo cáo tồn kho và chi phí
- US-8.5: Dashboard tổng quan

---

## Roadmap Triển khai

### Phase 1: MVP (Minimum Viable Product)
**Mục tiêu**: Đưa ra thị trường sản phẩm cơ bản nhất để bắt đầu phục vụ khách hàng

**Features**:
- Quản lý Thông tin Quán (đầy đủ)
- Quản lý Menu (đầy đủ)
- Quản lý Đơn hàng (cơ bản: tạo đơn, cập nhật trạng thái)
- Thanh toán (tiền mặt, thẻ)

**Timeline**: 8-10 tuần

---

### Phase 2: Enhanced Experience
**Mục tiêu**: Nâng cao trải nghiệm khách hàng và tối ưu vận hành

**Features**:
- Quản lý Bàn và Khu vực (đầy đủ)
- Quản lý Khách hàng (đầy đủ)
- Báo cáo và Thống kê (cơ bản)

**Timeline**: 6-8 tuần

---

### Phase 3: Advanced Management
**Mục tiêu**: Hoàn thiện hệ thống quản lý với tính năng nâng cao

**Features**:
- Quản lý Nhân viên (đầy đủ)
- Quản lý Kho hàng (đầy đủ)
- Báo cáo và Thống kê (nâng cao)
- Thanh toán (tích hợp cổng thanh toán điện tử)

**Timeline**: 8-10 tuần

---

## Metrics và KPIs

### Business Metrics
- **Doanh thu**: Tổng doanh thu từ các đơn hàng
- **Số đơn hàng**: Tổng số đơn hàng được tạo và hoàn thành
- **Giá trị đơn trung bình**: Tổng doanh thu / Số đơn hàng
- **Tỷ lệ hoàn thành đơn**: Số đơn đã hoàn thành / Tổng số đơn

### User Metrics
- **Số lượng khách hàng**: Tổng số khách hàng đã đăng ký
- **Khách hàng hoạt động**: Số khách hàng có giao dịch trong kỳ
- **Tần suất ghé thăm**: Số lần trung bình khách hàng quay lại
- **Tỷ lệ giữ chân khách hàng**: Số khách quay lại / Tổng số khách

### Operational Metrics
- **Thời gian xử lý đơn**: Thời gian từ khi tạo đơn đến khi hoàn thành
- **Tỷ lệ sử dụng bàn**: Số giờ bàn được sử dụng / Tổng số giờ mở cửa
- **Mức tồn kho**: Giá trị tồn kho trung bình
- **Tỷ lệ chính xác tồn kho**: (Tồn kho thực tế / Tồn kho hệ thống) × 100%

---

## Phụ thuộc giữa các Features

### Critical Dependencies
1. **Tất cả features** → **Quản lý Thông tin Quán** (cần cấu hình hệ thống trước)
2. **Quản lý Đơn hàng** → **Quản lý Menu** (cần có menu để tạo đơn)
3. **Thanh toán** → **Quản lý Đơn hàng** (cần có đơn để thanh toán)
4. **Báo cáo và Thống kê** → **Quản lý Đơn hàng**, **Thanh toán** (cần có dữ liệu giao dịch)

### Important Dependencies
5. **Quản lý Đơn hàng (dine-in)** → **Quản lý Bàn và Khu vực** (cần gán đơn vào bàn)
6. **Quản lý Khách hàng (tích điểm)** → **Thanh toán** (tích điểm khi thanh toán)
7. **Quản lý Kho hàng (tự động trừ tồn)** → **Quản lý Đơn hàng**, **Thanh toán** (trừ tồn khi thanh toán)
8. **Báo cáo tồn kho** → **Quản lý Kho hàng** (cần dữ liệu kho để báo cáo)

---

## Ghi chú

- Tài liệu này được cập nhật định kỳ bởi Product Owner
- Các Epic và Features có thể được điều chỉnh dựa trên feedback từ stakeholders và khách hàng
- Priority có thể thay đổi theo tình hình kinh doanh và roadmap
- Chi tiết từng Epic được lưu trong file riêng: `epic-[tên-epic].md`

---

**Ngày cập nhật cuối**: 10/12/2025  
**Product Owner**: vibeapps Platform Team  
**Version**: 1.0

