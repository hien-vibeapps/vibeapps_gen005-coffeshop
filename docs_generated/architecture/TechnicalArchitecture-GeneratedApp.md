# Technical Architecture - Generated Application

## 📋 Tổng Quan

Tài liệu này mô tả kiến trúc kỹ thuật cho **ứng dụng được generate bởi vibeapps Platform** - các ứng dụng mà khách hàng nhận được sau khi sử dụng vibeapps để tạo ứng dụng của họ.

**Related Documents:**
- [Technical Architecture - Platform](./TechnicalArchitecture-Platform.md) - Kiến trúc của vibeapps Platform
- [Business Rules](../business-analyst/business-rules-vibeapps-platform.md)

**Document Version:** 1.0  
**Last Updated:** 2025-01-21  
**Author:** AI Builder Platform Team

---

## 🎯 Architecture Overview

Mỗi ứng dụng được generate bởi vibeapps sẽ có kiến trúc như sau:

```
┌─────────────────────────────────────────────────────────────────────┐
│              Generated Application Architecture                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Frontend (Next.js - MVVM Pattern)                     │  │
│  │  - Model Layer                                                │  │
│  │  - View Layer                                                 │  │
│  │  - ViewModel Layer                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              API Gateway / Load Balancer                      │  │
│  │  - Request Routing                                            │  │
│  │  - Rate Limiting                                              │  │
│  │  - SSL Termination                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Backend API (NestJS - Clean Architecture)            │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────┐    │  │
│  │  │  Domain Layer                                        │    │  │
│  │  └─────────────────────────────────────────────────────┘    │  │
│  │  ┌─────────────────────────────────────────────────────┐    │  │
│  │  │  Application Layer                                   │    │  │
│  │  └─────────────────────────────────────────────────────┘    │  │
│  │  ┌─────────────────────────────────────────────────────┐    │  │
│  │  │  Infrastructure Layer                                │    │  │
│  │  └─────────────────────────────────────────────────────┘    │  │
│  │  ┌─────────────────────────────────────────────────────┐    │  │
│  │  │  Presentation Layer                                  │    │  │
│  │  └─────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Database (PostgreSQL)                             │  │
│  │  - Application Data                                           │  │
│  │  - Migrations                                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         vibeapps Integration Layer                           │  │
│  │  - Optimization API                                           │  │
│  │  - Monitoring Integration                                     │  │
│  │  - Update Mechanism                                           │  │
│  │  - Analytics Collection                                       │  │
│  │  - Code Quality & Security (SAST/DAST)                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         vibeapps Platform (External)                         │  │
│  │  - Optimization Service                                       │  │
│  │  - Monitoring Service                                        │  │
│  │  - Update Service                                            │  │
│  │  - Code Quality Service (SAST/DAST)                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Components

### 1. Frontend (Next.js - MVVM Pattern)

Frontend tuân thủ **MVVM (Model-View-ViewModel)** pattern với 3 layers:

#### Model Layer
- **Data Models:** TypeScript interfaces cho business entities
- **API Clients:** TanStack React Query hooks
- **State Management:** Zustand stores
- **Business Logic:** Validators, formatters, utilities

**Example Structure:**
```
src/
  models/
    product.model.ts
    order.model.ts
    user.model.ts
  api/
    clients/
      product.api.ts
      order.api.ts
    queries/
      use-products.query.ts
      use-orders.query.ts
    mutations/
      use-create-order.mutation.ts
  store/
    cart.store.ts
    auth.store.ts
  utils/
    validators.ts
    formatters.ts
```

#### View Layer
- **Components:** React components (presentational)
- **Pages:** Next.js app router pages
- **UI Components:** Reusable UI components
- **Layouts:** Page layouts

**Example Structure:**
```
src/
  components/
    ui/
      button.tsx
      input.tsx
      card.tsx
    features/
      products/
        product-list.tsx
        product-card.tsx
        product-detail.tsx
      orders/
        order-form.tsx
        order-list.tsx
  app/
    (routes)/
      products/
        page.tsx
        [id]/
          page.tsx
      orders/
        page.tsx
  layouts/
    main-layout.tsx
```

#### ViewModel Layer
- **ViewModels:** Presentation logic và state management cho views
- **Data Binding:** Two-way data binding giữa View và Model
- **Data Transformation:** Transform Model data for View consumption
- **Computed Properties:** Derived state từ Model data
- **Business Logic:** View-specific business logic
- **Event Handling:** Handle user interactions
- **State Management:** Reactive state containers

**Example Structure:**
```
src/
  view-models/
    product-list.view-model.ts
    product-detail.view-model.ts
    order-form.view-model.ts
    cart.view-model.ts
  hooks/
    use-product-list.view-model.ts
    use-product-detail.view-model.ts
    use-order-form.view-model.ts
```

**Example ViewModel:**
```typescript
// src/view-models/product-list.view-model.ts
import { makeAutoObservable, runInAction } from 'mobx';
import { productApi } from '@/api/clients/product.api';
import { router } from '@/lib/router';

export class ProductListViewModel {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  filters: ProductFilters = {};
  searchQuery = '';

  constructor() {
    makeAutoObservable(this);
  }

  // Computed properties
  get filteredProducts() {
    return this.products.filter(product => {
      const matchesSearch = !this.searchQuery || 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = !this.filters.category || 
        product.category === this.filters.category;
      return matchesSearch && matchesCategory;
    });
  }

  get productCount() {
    return this.products.length;
  }

  // Actions
  async loadProducts() {
    this.loading = true;
    this.error = null;
    try {
      const data = await productApi.getProducts(this.filters);
      runInAction(() => {
        this.products = data;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
        this.loading = false;
      });
    }
  }

  setFilters(filters: ProductFilters) {
    this.filters = filters;
    this.loadProducts();
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  handleProductClick(productId: string) {
    router.push(`/products/${productId}`);
  }

  async addToCart(productId: string, quantity: number) {
    try {
      await productApi.addToCart(productId, quantity);
      // Update cart state if needed
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
    }
  }
}

// React Hook for using ViewModel
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

export function useProductListViewModel() {
  const [viewModel] = useState(() => new ProductListViewModel());
  
  useEffect(() => {
    viewModel.loadProducts();
  }, [viewModel]);

  return viewModel;
}
```

**Using ViewModel in View:**
```typescript
// src/app/products/page.tsx
'use client';

import { observer } from 'mobx-react-lite';
import { useProductListViewModel } from '@/view-models/use-product-list.view-model';
import { ProductCard } from '@/components/features/products/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ProductsPage = observer(() => {
  const vm = useProductListViewModel();

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search products..."
          value={vm.searchQuery}
          onChange={(e) => vm.setSearchQuery(e.target.value)}
        />
        <Button onClick={() => vm.loadProducts()}>
          Refresh
        </Button>
      </div>

      {vm.loading && <div>Loading...</div>}
      {vm.error && <div className="text-red-500">{vm.error}</div>}

      <div className="grid grid-cols-3 gap-4">
        {vm.filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => vm.handleProductClick(product.id)}
            onAddToCart={(quantity) => vm.addToCart(product.id, quantity)}
          />
        ))}
      </div>

      <div>Total: {vm.productCount} products</div>
    </div>
  );
});

export default ProductsPage;
```

#### MVVM Flow
1. **User interacts with View** → Event triggered
2. **View calls ViewModel** → ViewModel handles event
3. **ViewModel calls Model** → Fetch/update data via API
4. **Model updates state** → State change in Zustand store (if global) hoặc ViewModel state
5. **ViewModel updates reactive state** → Observable state changes
6. **View observes ViewModel** → View automatically re-renders với updated data

**Data Flow Diagram:**
```
User Action (View)
    ↓
ViewModel (handles event, business logic)
    ↓
Model (API call, data access)
    ↓
ViewModel (transforms data, updates reactive state)
    ↓
View (automatically re-renders via data binding)
```

**Key Characteristics:**
- **Two-way Data Binding:** View ↔ ViewModel (automatic synchronization)
- **Separation of Concerns:** View chỉ hiển thị, ViewModel chứa logic
- **Reactive Updates:** ViewModel state changes trigger View updates
- **Testability:** ViewModel có thể test độc lập không cần View

---

### 2. Backend API (NestJS - Clean Architecture)

#### Domain Layer
- **Entities:** Core business objects (Product, Order, User, etc.)
- **Value Objects:** Immutable objects
- **Domain Services:** Business logic
- **Domain Events:** Business events
- **Repository Interfaces:** Abstract data access

**Example:**
```
src/
  domain/
    entities/
      product.entity.ts
      order.entity.ts
    value-objects/
      money.vo.ts
      address.vo.ts
    services/
      pricing.service.ts
    events/
      order-created.event.ts
    repositories/
      product.repository.interface.ts
      order.repository.interface.ts
```

#### Application Layer
- **Use Cases:** Application-specific business logic
- **Application Services:** Orchestrate use cases
- **DTOs:** Data Transfer Objects
- **Command/Query Handlers:** CQRS pattern

**Example:**
```
src/
  application/
    use-cases/
      create-order/
        create-order.use-case.ts
        create-order.dto.ts
      get-products/
        get-products.use-case.ts
        get-products.dto.ts
    services/
      order-application.service.ts
```

#### Infrastructure Layer
- **Repositories:** TypeORM implementations
- **External Services:** Third-party integrations
- **Message Brokers:** Event publishing
- **File Storage:** S3, Azure Blob

**Example:**
```
src/
  infrastructure/
    persistence/
      typeorm/
        repositories/
          product.repository.ts
          order.repository.ts
        entities/
          product.entity.ts
          order.entity.ts
    external/
      payment/
        stripe.service.ts
        paypal.service.ts
      email/
        sendgrid.service.ts
    messaging/
      event-bus.service.ts
```

#### Presentation Layer
- **Controllers:** HTTP request handlers
- **DTOs:** Request/Response DTOs
- **Guards:** Authentication/Authorization
- **Interceptors:** Logging, transformation
- **Filters:** Exception filters

**Example:**
```
src/
  presentation/
    controllers/
      product.controller.ts
      order.controller.ts
    dto/
      create-order.request.dto.ts
      order.response.dto.ts
    guards/
      jwt-auth.guard.ts
    interceptors/
      logging.interceptor.ts
    filters/
      http-exception.filter.ts
```

---

### 3. Database (PostgreSQL)

#### Schema Structure
- **Tables:** Generated based on business requirements
- **Relationships:** Foreign keys, indexes
- **Migrations:** TypeORM migrations
- **Seed Data:** Initial data if needed

#### Example Schema (E-commerce):
```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## 🔗 vibeapps Integration Layer

### Purpose
Cho phép vibeapps Platform tiếp tục optimize và monitor ứng dụng đã được generate.

### Integration Components

#### 1. Optimization API
**Purpose:** Cho phép vibeapps analyze và suggest optimizations

**Endpoints:**
- `POST /vibeapps/optimize/analyze` - Analyze application performance
- `POST /vibeapps/optimize/suggest` - Get optimization suggestions
- `POST /vibeapps/optimize/apply` - Apply optimizations (with approval)

**Example Implementation:**
```typescript
// src/infrastructure/external/vibeapps/optimization.service.ts
@Injectable()
export class vibeappsOptimizationService {
  constructor(
    private httpService: HttpService,
    @Inject('vibeapps_API_KEY') private apiKey: string,
  ) {}

  async analyzePerformance(metrics: PerformanceMetrics) {
    return this.httpService.post(
      'https://api.vibeapps.com/v1/optimize/analyze',
      metrics,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Application-ID': process.env.vibeapps_APP_ID,
        },
      },
    );
  }

  async getSuggestions(analysisId: string) {
    return this.httpService.get(
      `https://api.vibeapps.com/v1/optimize/suggest/${analysisId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      },
    );
  }
}
```

#### 2. Monitoring Integration
**Purpose:** Send application metrics và logs to vibeapps Platform

**Metrics Collected:**
- API response times
- Error rates
- Database query performance
- Resource utilization (CPU, Memory)
- User activity metrics

**Example Implementation:**
```typescript
// src/infrastructure/monitoring/vibeapps-monitor.service.ts
@Injectable()
export class vibeappsMonitorService {
  constructor(
    private httpService: HttpService,
    @Inject('vibeapps_API_KEY') private apiKey: string,
  ) {}

  @Cron('*/5 * * * *') // Every 5 minutes
  async sendMetrics() {
    const metrics = await this.collectMetrics();
    
    await this.httpService.post(
      'https://api.vibeapps.com/v1/monitoring/metrics',
      {
        applicationId: process.env.vibeapps_APP_ID,
        timestamp: new Date().toISOString(),
        metrics,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      },
    );
  }

  private async collectMetrics() {
    // Collect application metrics
    return {
      apiResponseTime: await this.getAverageResponseTime(),
      errorRate: await this.getErrorRate(),
      databaseQueries: await this.getDatabaseMetrics(),
      resourceUsage: await this.getResourceUsage(),
    };
  }
}
```

#### 3. Update Mechanism
**Purpose:** Receive và apply updates từ vibeapps Platform

**Update Types:**
- Security patches
- Performance optimizations
- Bug fixes
- Feature enhancements

**Example Implementation:**
```typescript
// src/infrastructure/updates/vibeapps-update.service.ts
@Injectable()
export class vibeappsUpdateService {
  constructor(
    private httpService: HttpService,
    @Inject('vibeapps_API_KEY') private apiKey: string,
  ) {}

  @Cron('0 2 * * *') // Daily at 2 AM
  async checkForUpdates() {
    const updates = await this.httpService.get(
      'https://api.vibeapps.com/v1/updates/available',
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        params: {
          applicationId: process.env.vibeapps_APP_ID,
          currentVersion: process.env.APP_VERSION,
        },
      },
    );

    if (updates.data.available) {
      await this.notifyAdmin(updates.data);
    }
  }

  async applyUpdate(updateId: string) {
    // Download và apply update
    const update = await this.downloadUpdate(updateId);
    await this.applyUpdateFiles(update);
    await this.runMigrations(update.migrations);
    await this.restartApplication();
  }
}
```

#### 4. Analytics Collection
**Purpose:** Send usage analytics to vibeapps Platform

**Analytics Collected:**
- User actions
- Feature usage
- Performance metrics
- Business metrics (orders, revenue, etc.)

**Example Implementation:**
```typescript
// src/infrastructure/analytics/vibeapps-analytics.service.ts
@Injectable()
export class vibeappsAnalyticsService {
  constructor(
    private httpService: HttpService,
    @Inject('vibeapps_API_KEY') private apiKey: string,
  ) {}

  async trackEvent(event: AnalyticsEvent) {
    // Send to vibeapps Platform
    await this.httpService.post(
      'https://api.vibeapps.com/v1/analytics/events',
      {
        applicationId: process.env.vibeapps_APP_ID,
        event,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      },
    );
  }
}
```

#### 5. Code Quality & Security Integration
**Purpose:** Integrate với vibeapps Platform để perform SAST/DAST scanning và code quality checks

**Features:**
- **SAST Integration:** Send code to vibeapps for static analysis
- **DAST Integration:** Request dynamic security testing
- **Quality Reports:** Receive quality và security reports
- **Automated Fixes:** Receive suggested fixes từ vibeapps

**Example Implementation:**
```typescript
// src/infrastructure/quality/vibeapps-quality.service.ts
@Injectable()
export class vibeappsQualityService {
  constructor(
    private httpService: HttpService,
    @Inject('vibeapps_API_KEY') private apiKey: string,
  ) {}

  async requestSASTScan(codeBase: string) {
    return this.httpService.post(
      'https://api.vibeapps.com/v1/quality/sast/scan',
      {
        applicationId: process.env.vibeapps_APP_ID,
        codeBase,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      },
    );
  }

  async requestDASTScan(deploymentUrl: string) {
    return this.httpService.post(
      'https://api.vibeapps.com/v1/quality/dast/scan',
      {
        applicationId: process.env.vibeapps_APP_ID,
        deploymentUrl,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      },
    );
  }

  async getQualityReport(reportId: string) {
    return this.httpService.get(
      `https://api.vibeapps.com/v1/quality/reports/${reportId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      },
    );
  }
}
```

---

## 🐳 Deployment Architecture

### Development Environment (Docker Compose)

Môi trường Development hiện tại sử dụng **Docker Compose** để chạy toàn bộ ứng dụng.

**Port Configuration:**
- **Frontend:** Port `9000`
- **Backend Services:** Ports `9001-9009` (theo thứ tự: Backend API = 9001, các services khác = 9002-9009)
- **Database:** Port mặc định PostgreSQL (5432) hoặc theo cấu hình trong `.env`

**Database Configuration:**
- Database connection string được cấu hình trong file `.env`
- Tất cả các biến môi trường database được load từ `.env` file

**Example Docker Compose:**
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "9000:9000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:9001
      - NODE_ENV=development
    env_file:
      - .env
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "9001:9001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - vibeapps_API_KEY=${vibeapps_API_KEY}
      - vibeapps_APP_ID=${vibeapps_APP_ID}
      - NODE_ENV=development
    env_file:
      - .env
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    env_file:
      - .env

volumes:
  postgres-data:
```

**Example .env file:**
```env
# Database Configuration
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
POSTGRES_DB=appdb
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432

# vibeapps Configuration
vibeapps_API_KEY=your-api-key
vibeapps_APP_ID=your-app-id
vibeapps_API_URL=https://api.vibeapps.com

# Application Configuration
NODE_ENV=development
```

---

### Production Environment (Kubernetes - Future)

Môi trường Production sẽ sử dụng **Kubernetes** khi tích hợp đầy đủ với CI/CD pipeline.

**Port Configuration:**
- **Frontend:** Port `9000`
- **Backend Services:** Ports `9001-9009` (theo thứ tự: Backend API = 9001, các services khác = 9002-9009)

#### Frontend Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: generated-app-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: generated-app-frontend
  template:
    metadata:
      labels:
        app: generated-app-frontend
    spec:
      containers:
      - name: frontend
        image: generated-app/frontend:latest
        ports:
        - containerPort: 9000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "https://api.generated-app.com"
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

#### Backend Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: generated-app-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: generated-app-backend
  template:
    metadata:
      labels:
        app: generated-app-backend
    spec:
      containers:
      - name: backend
        image: generated-app/backend:latest
        ports:
        - containerPort: 9001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: url
        - name: vibeapps_API_KEY
          valueFrom:
            secretKeyRef:
              name: vibeapps-secret
              key: api-key
        - name: vibeapps_APP_ID
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: vibeapps-app-id
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "200m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

**Note:** Kubernetes deployment sẽ được triển khai khi hệ thống CI/CD đầy đủ được tích hợp.

---

## 🔒 Security

### Authentication & Authorization
- **JWT Tokens:** For API authentication
- **Role-Based Access Control (RBAC):** User roles và permissions
- **API Keys:** For vibeapps integration

### Data Protection
- **Encryption:** Data at rest và in transit
- **Input Validation:** All inputs validated
- **SQL Injection Prevention:** Parameterized queries
- **XSS Prevention:** Content Security Policy

### Secrets Management
- **Environment Variables:** For configuration
- **Kubernetes Secrets:** For sensitive data
- **API Keys:** Stored securely, rotated regularly

---

## 📊 Monitoring

### Application Monitoring
- **Health Checks:** `/health` endpoint
- **Metrics:** Prometheus metrics
- **Logging:** Structured logging (Winston)
- **Error Tracking:** Sentry integration

### vibeapps Monitoring Integration
- **Performance Metrics:** Sent to vibeapps Platform
- **Error Reports:** Automatic error reporting
- **Usage Analytics:** User behavior tracking
- **Business Metrics:** Custom business metrics

---

## 🔄 Update & Maintenance

### Update Process
1. **Check for Updates:** Daily check với vibeapps Platform
2. **Download Updates:** Secure download
3. **Review Updates:** Admin approval required
4. **Apply Updates:** Automated hoặc manual
5. **Verify:** Health checks after update
6. **Rollback:** Automatic if health check fails

### Maintenance Windows
- **Scheduled Maintenance:** Off-peak hours
- **Zero-Downtime Updates:** Blue-green deployment
- **Database Migrations:** Backward compatible migrations

---

## 📈 Scalability

### Horizontal Scaling
- **Stateless Services:** Frontend và Backend are stateless
- **Auto-scaling:** Based on CPU/Memory metrics
- **Load Balancing:** Kubernetes Service + Ingress

### Database Scaling
- **Read Replicas:** For read-heavy workloads
- **Connection Pooling:** Optimize database connections
- **Query Optimization:** Indexes, query optimization

---

## ✅ Code Quality & Security Testing

### Code Quality Assurance

#### Static Code Analysis
- **ESLint:** JavaScript/TypeScript linting với custom rules
- **Prettier:** Code formatting và consistency
- **TypeScript Strict Mode:** Type safety enforcement
- **SonarQube:** Code quality analysis (nếu integrated với vibeapps)
- **Code Climate:** Automated code review

**Quality Gates:**
- Code coverage: Minimum 70%
- Code duplication: Maximum 3%
- Maintainability rating: A
- Reliability rating: A
- Security rating: A

**Example CI/CD Integration:**
```yaml
# .github/workflows/code-quality.yml
name: Code Quality

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run ESLint
        run: npm run lint
      - name: Run Prettier check
        run: npm run format:check
      - name: TypeScript check
        run: npm run type-check
      - name: Run tests
        run: npm run test:coverage
```

---

### SAST (Static Application Security Testing)

#### Tools & Integration
- **Snyk:** Dependency và code vulnerability scanning
- **GitHub Dependabot:** Dependency vulnerability alerts
- **Semgrep:** Pattern-based security scanning
- **SonarQube Security:** Security vulnerability detection (nếu available)

**SAST Pipeline:**
```
Code Commit
    ↓
SAST Scan (Snyk + Dependabot)
    ↓
Vulnerability Detection
    ↓
Security Report Generation
    ↓
Block if Critical/High vulnerabilities
    ↓
Developer Notification
```

**Example SAST Configuration:**
```yaml
# .github/workflows/sast.yml
name: SAST Security Scan

on: [push, pull_request]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Snyk SAST
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      # Dependency Scanning
      - name: Snyk Dependency Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: test --all-projects
      
      # Semgrep Security Scan
      - name: Semgrep Security Scan
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/typescript
            p/javascript
```

**SAST Coverage:**
- **OWASP Top 10:** All vulnerabilities covered
- **CWE Top 25:** Common Weakness Enumeration
- **Dependency Vulnerabilities:** All dependencies scanned
- **Secret Detection:** API keys, passwords, tokens
- **Insecure Configurations:** Security misconfigurations

---

### DAST (Dynamic Application Security Testing)

#### Tools & Integration
- **OWASP ZAP:** Automated security testing
- **Nessus:** Vulnerability scanning (nếu available)
- **Nmap:** Network security scanning

**DAST Pipeline:**
```
Application Deployed (Staging)
    ↓
DAST Scan (OWASP ZAP)
    ↓
Runtime Vulnerability Detection
    ↓
Security Report Generation
    ↓
Block if Critical/High vulnerabilities
    ↓
Security Team Notification
```

**Example DAST Configuration:**
```yaml
# .github/workflows/dast.yml
name: DAST Security Scan

on:
  workflow_dispatch:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM

jobs:
  dast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # OWASP ZAP Baseline Scan
      - name: OWASP ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'https://staging.generated-app.com'
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a'
      
      # Generate Security Report
      - name: Generate Security Report
        run: |
          zap-cli report -o zap-report.html -f html
          zap-cli report -o zap-report.json -f json
      
      # Upload Security Report
      - name: Upload Security Report
        uses: actions/upload-artifact@v3
        with:
          name: zap-security-report
          path: zap-report.*
      
      # Fail if high/critical vulnerabilities found
      - name: Check for High/Critical Vulnerabilities
        run: |
          if grep -q "High\|Critical" zap-report.json; then
            echo "High or Critical vulnerabilities found!"
            exit 1
          fi
```

**DAST Coverage:**
- **OWASP Top 10:** Runtime testing
- **API Security:** REST API endpoint testing
- **Authentication/Authorization:** Access control testing
- **Session Management:** Session security testing
- **Input Validation:** Injection attack testing

**DAST Schedule:**
- **Automated:** Daily scans on staging environment
- **On-Demand:** Manual triggers for production
- **Pre-Deployment:** Required before production deployment

---

### Security Testing Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Code Commit                                                 │
│      ↓                                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Code Quality Checks                                  │  │
│  │  - ESLint                                             │  │
│  │  - Prettier                                           │  │
│  │  - TypeScript Check                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│      ↓                                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SAST (Static Application Security Testing)           │  │
│  │  - Snyk Code Scan                                     │  │
│  │  - Dependency Scanning                                │  │
│  │  - Secret Detection                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│      ↓                                                       │
│  Build & Test                                               │
│      ↓                                                       │
│  Deploy to Staging                                          │
│      ↓                                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  DAST (Dynamic Application Security Testing)          │  │
│  │  - OWASP ZAP Scan                                     │  │
│  │  - Runtime Vulnerability Detection                    │  │
│  └──────────────────────────────────────────────────────┘  │
│      ↓                                                       │
│  Security Approval                                          │
│      ↓                                                       │
│  Deploy to Production                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Best Practices

### Code Quality
- **TypeScript Strict Mode:** Enabled
- **ESLint + Prettier:** Code formatting
- **Unit Tests:** Minimum 70% coverage
- **Integration Tests:** Critical flows
- **Code Review:** Required before merge
- **Quality Gates:** Enforce quality standards

### Performance
- **Caching:** Redis for frequently accessed data
- **CDN:** For static assets
- **Database Indexing:** Proper indexes
- **API Optimization:** Pagination, filtering

### Security
- **Regular Updates:** Security patches
- **Dependency Scanning:** Regular vulnerability scans (Snyk, Dependabot)
- **SAST Scanning:** Static security analysis
- **DAST Scanning:** Dynamic security testing
- **Access Control:** Principle of least privilege
- **Audit Logging:** All sensitive operations logged
- **Security Headers:** CSP, HSTS, X-Frame-Options

---

## 🔗 Integration với vibeapps Platform

### Required Configuration
```env
# .env file
vibeapps_API_KEY=your-api-key
vibeapps_APP_ID=your-app-id
vibeapps_API_URL=https://api.vibeapps.com
vibeapps_ENABLE_OPTIMIZATION=true
vibeapps_ENABLE_MONITORING=true
vibeapps_ENABLE_UPDATES=true
vibeapps_ENABLE_ANALYTICS=true
```

### Integration Flow
1. **Application Generated:** vibeapps creates application
2. **Integration Setup:** vibeapps configures integration
3. **API Key Provided:** Secure API key for communication
4. **Monitoring Started:** Automatic metrics collection
5. **Optimization Available:** vibeapps can suggest optimizations
6. **Updates Available:** Receive updates from vibeapps

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-21  
**Author:** AI Builder Platform Team

