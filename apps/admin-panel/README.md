# Coffee Shop Management - Admin Panel

Frontend application cho hệ thống quản lý quán Coffee Shop, được xây dựng với Next.js 14, TypeScript, và Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Cấu trúc dự án

```
apps/admin-panel/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Dashboard layout group
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── menu/           # Menu management
│   │   │   ├── orders/         # Order management
│   │   │   ├── tables/          # Table management
│   │   │   ├── employees/       # Employee management
│   │   │   ├── inventory/      # Inventory management
│   │   │   ├── reports/        # Reports
│   │   │   └── settings/       # Settings
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── api/                    # API services
│   │   ├── shop.api.ts         # Shop API (internal data)
│   │   ├── category.api.ts     # Category API (internal data)
│   │   ├── product.api.ts      # Product API (internal data)
│   │   ├── order.api.ts        # Order API (internal data)
│   │   ├── table.api.ts        # Table API (internal data)
│   │   ├── employee.api.ts     # Employee API (internal data)
│   │   ├── payment.api.ts       # Payment API (internal data)
│   │   ├── inventory.api.ts     # Inventory API (internal data)
│   │   ├── report.api.ts        # Report API (internal data)
│   │   └── mock/               # Mock services (CHỈ cho external services)
│   │       ├── payment.mock.ts  # Payment gateway mocks
│   │       └── oauth.mock.ts    # OAuth provider mocks
│   ├── components/              # React components
│   │   ├── ui/                 # UI components (shadcn/ui)
│   │   ├── layout/             # Layout components
│   │   └── providers.tsx       # React Query provider
│   ├── lib/                    # Utilities
│   │   ├── api-client.ts       # Axios client setup
│   │   └── utils.ts            # Helper functions
│   └── types/                  # TypeScript types
│       └── api/                # API contract types
│           └── index.ts        # All API types
```

## 🔑 Quan trọng: Phân biệt Internal Data vs External Services

### Internal Data (Dữ liệu trong hệ thống)
- **KHÔNG dùng Mock Data** cho các dữ liệu internal (users, products, orders, categories, etc.)
- **TẤT CẢ dữ liệu internal** phải được lấy từ database thông qua backend API
- Tất cả API services trong `/src/api/*.api.ts` đều gọi backend API thật
- Sử dụng TanStack React Query để quản lý data fetching và caching

### External Services (Services bên ngoài hệ thống)
- **CHỈ dùng Mock Data/Services** cho các integration với services bên ngoài:
  - OAuth providers (Google, GitHub, Microsoft) - `/src/api/mock/oauth.mock.ts`
  - Payment gateways (Stripe, PayPal, VNPay, MOMO) - `/src/api/mock/payment.mock.ts`
  - Email services, SMS services, etc.

## 🛠️ Setup

1. **Install dependencies:**
```bash
cd apps/admin-panel
npm install
```

2. **Setup environment variables:**
Tạo file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. **Run development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm start
```

## 📝 API Contracts

Tất cả API contracts được định nghĩa trong `/src/types/api/index.ts`. Các interfaces này sẽ được backend developer implement.

### Example API Types:
- `Shop`, `Category`, `Product`, `Order`, `Table`, `Employee`, etc.
- `CreateXxxRequest`, `UpdateXxxRequest` cho các operations
- `PaginatedResponse<T>` cho paginated lists
- `ApiResponse<T>` cho API responses

## 🎨 UI Components

UI components được xây dựng dựa trên shadcn/ui và Radix UI:
- Button, Card, Input, Label
- Dialog, Table, Badge
- Skeleton (loading states)
- Và nhiều components khác...

## 📊 Features

### ✅ Đã implement:
- [x] Project setup và configuration
- [x] API contracts (TypeScript interfaces)
- [x] API services cho internal data (gọi backend API)
- [x] Mock services cho external services (Payment, OAuth)
- [x] UI components library
- [x] Dashboard page
- [x] Menu management page
- [x] Order management pages (List, Detail)

### 🚧 Cần implement tiếp:
- [ ] Table management pages
- [ ] Employee management pages
- [ ] Inventory management pages
- [ ] Reports pages với charts
- [ ] Settings page
- [ ] Form components cho Create/Update
- [ ] Authentication flow
- [ ] Error handling và validation

## 🔄 Data Flow

1. **User Action** → Component
2. **Component** → React Query Hook
3. **React Query Hook** → API Service (`/src/api/*.api.ts`)
4. **API Service** → Backend API (hoặc Mock Service cho external)
5. **Response** → React Query Cache → Component Update

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### API không kết nối được
- Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`
- Đảm bảo backend API đang chạy
- Kiểm tra CORS settings trên backend

### TypeScript errors
- Chạy `npm run type-check` để kiểm tra types
- Đảm bảo tất cả dependencies đã được install

## 📄 License

Internal use only - Coffee Shop Management System

