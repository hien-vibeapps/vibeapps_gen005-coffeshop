# Security Vulnerabilities List - Coffee Shop Management System

**Date:** 2025-01-12  
**Total Vulnerabilities:** 17  
**Critical:** 4  
**High:** 6  
**Medium:** 4  
**Low:** 3

---

## Critical Severity Vulnerabilities

### VULN-001: No Authentication/Authorization on All Endpoints
- **Severity:** 🔴 CRITICAL
- **CVSS Score:** 10.0 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H)
- **Location:** All controllers in `services/coffee-shop-api/src/presentation/modules/`
- **Description:** Complete absence of authentication and authorization. All 51 API endpoints are publicly accessible without any authentication or authorization checks.
- **Affected Endpoints:**
  - ProductController: 10 endpoints
  - OrderController: 7 endpoints
  - CategoryController: 5 endpoints
  - EmployeeController: 7 endpoints
  - PaymentController: 4 endpoints
  - InventoryController: 8 endpoints
  - ReportController: 3 endpoints
  - TableController: 5 endpoints
  - ShopController: 2 endpoints
- **Impact:**
  - Complete system compromise
  - Unauthorized access to all data
  - Data theft, modification, deletion
  - Financial fraud (payment manipulation)
  - Employee data exposure
  - Inventory manipulation
- **Proof of Concept:**
  ```bash
  # Access any endpoint without authentication
  curl http://localhost:9001/api/v1/products
  curl http://localhost:9001/api/v1/orders
  curl http://localhost:9001/api/v1/payments
  curl -X DELETE http://localhost:9001/api/v1/products/123
  curl -X POST http://localhost:9001/api/v1/payments -d '{"order_id":"...","amount":0}'
  ```
- **Remediation:**
  ```typescript
  // Add authentication guard to all controllers
  @Controller('products')
  @UseGuards(JwtAuthGuard)
  export class ProductController {
    // ...
  }
  
  // Add role-based authorization
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  async createProduct(@Body() createDto: CreateProductDto) {
    // ...
  }
  ```
- **Priority:** P0 - Immediate

---

### VULN-002: SQL Injection in Sort Parameter (Widespread)
- **Severity:** 🔴 CRITICAL
- **CVSS Score:** 9.8 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Location:** Multiple services using `sort` parameter
- **Description:** User-controlled `sort` parameter is directly interpolated into SQL queries without validation, allowing SQL injection attacks.
- **Vulnerable Services:**
  - ProductService (line 53-54)
  - CategoryService (line 27-28)
  - OrderService (line 93-94)
  - TableService (lines 40-41, 103-104, 335-336)
  - InventoryService (line 38-39)
  - PaymentService (line 46-47)
  - EmployeeService (line 46-47)
- **Vulnerable Code:**
  ```typescript
  if (sort) {
    queryBuilder.orderBy(`product.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
  }
  ```
- **Impact:**
  - Database compromise
  - Data theft (passwords, sensitive data)
  - Data deletion
  - Privilege escalation
  - Complete database control
- **Proof of Concept:**
  ```bash
  # SQL Injection via sort parameter
  GET /api/v1/products?sort=name; DROP TABLE products;--
  GET /api/v1/orders?sort=created_at UNION SELECT password FROM users--
  GET /api/v1/payments?sort=amount; DELETE FROM payments WHERE 1=1--
  GET /api/v1/employees?sort=email; UPDATE employees SET role='admin' WHERE id='123'--
  ```
- **Remediation:**
  ```typescript
  // Whitelist allowed sort columns
  const ALLOWED_PRODUCT_SORT_COLUMNS = ['name', 'price', 'created_at', 'display_order', 'status'];
  const ALLOWED_ORDER_SORT_COLUMNS = ['created_at', 'total_amount', 'status', 'order_type'];
  const ALLOWED_PAYMENT_SORT_COLUMNS = ['created_at', 'amount', 'payment_method'];
  
  // Validate before using
  if (sort && ALLOWED_PRODUCT_SORT_COLUMNS.includes(sort)) {
    queryBuilder.orderBy(`product.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
  } else {
    queryBuilder.orderBy('product.display_order', 'ASC');
  }
  
  // Or use enum validation in DTO
  @IsOptional()
  @IsEnum(['name', 'price', 'created_at', 'display_order'])
  sort?: string;
  ```
- **Priority:** P0 - Immediate

---

### VULN-003: Missing Security Headers
- **Severity:** 🔴 CRITICAL
- **CVSS Score:** 7.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:L/A:N)
- **Location:** `services/coffee-shop-api/src/main.ts`
- **Description:** No security headers configured. Missing X-Content-Type-Options, X-Frame-Options, CSP, HSTS, etc.
- **Missing Headers:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Content-Security-Policy`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Impact:**
  - XSS attacks
  - Clickjacking
  - MIME sniffing attacks
  - Man-in-the-middle attacks
- **Remediation:**
  ```typescript
  import helmet from 'helmet';
  
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
  }));
  ```
- **Priority:** P0 - Immediate

---

### VULN-004: File Upload Security Vulnerabilities
- **Severity:** 🔴 CRITICAL
- **CVSS Score:** 8.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- **Location:** `services/coffee-shop-api/src/presentation/modules/product/product.controller.ts:92-113`
- **Description:** File upload endpoint has multiple critical security issues:
  - No file type validation
  - No file size limits
  - No file content scanning
  - No authentication required
  - Uses `file.filename` directly without sanitization
  - Path traversal vulnerability possible
- **Vulnerable Code:**
  ```typescript
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductImage(
    @Param('id') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/products/${file.filename}` : '';
    // No validation!
  }
  ```
- **Impact:**
  - Malicious file uploads (executables, scripts)
  - Path traversal attacks (`../../../etc/passwd`)
  - Server-side code execution
  - Storage exhaustion
  - XSS via malicious image files
- **Proof of Concept:**
  ```bash
  # Upload malicious file
  curl -X POST http://localhost:9001/api/v1/products/123/images \
    -F "image=@malicious.php"
  
  # Path traversal
  curl -X POST http://localhost:9001/api/v1/products/123/images \
    -F "image=@../../../../etc/passwd"
  
  # Large file (DoS)
  dd if=/dev/zero of=large.bin bs=1M count=1000
  curl -X POST http://localhost:9001/api/v1/products/123/images \
    -F "image=@large.bin"
  ```
- **Remediation:**
  ```typescript
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { existsSync, mkdirSync } from 'fs';
  
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const UPLOAD_DIR = './uploads/products';
  
  // Ensure upload directory exists
  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  
  @Post(':id/images')
  @UseGuards(JwtAuthGuard) // Require authentication
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: UPLOAD_DIR,
      filename: (req, file, cb) => {
        // Generate unique filename to prevent conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        // Sanitize extension
        const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext.toLowerCase()) 
          ? ext.toLowerCase() 
          : '.jpg';
        cb(null, `product-${uniqueSuffix}${safeExt}`);
      },
    }),
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
    fileFilter: (req, file, cb) => {
      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only images are allowed.'), false);
      }
      cb(null, true);
    },
  }))
  async uploadProductImage(
    @Param('id') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Additional validation: check file content (magic bytes)
    // Scan for malware (if service available)
    // Store in secure location (S3, etc.)
  }
  ```
- **Priority:** P0 - Immediate

---

## High Severity Vulnerabilities

### VULN-005: JWT Token Stored in localStorage
- **Severity:** 🟠 HIGH
- **CVSS Score:** 7.2 (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:L/A:N)
- **Location:** `apps/admin-panel/src/lib/api-client.ts:17`
- **Description:** JWT tokens stored in localStorage are vulnerable to XSS attacks.
- **Vulnerable Code:**
  ```typescript
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  ```
- **Impact:**
  - Session hijacking if XSS vulnerability exists
  - Token theft
  - Unauthorized access
- **Remediation:**
  - Use httpOnly cookies instead of localStorage
  - Implement CSRF tokens
  - Add SameSite cookie attribute
  - Store tokens in memory (if possible)
- **Priority:** P1 - High

---

### VULN-006: No Rate Limiting
- **Severity:** 🟠 HIGH
- **CVSS Score:** 7.0 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H)
- **Location:** All API endpoints
- **Description:** No rate limiting implemented on any endpoints.
- **Impact:**
  - Brute force attacks
  - DDoS attacks
  - API abuse
  - Resource exhaustion
- **Remediation:**
  ```typescript
  import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
  
  @Module({
    imports: [
      ThrottlerModule.forRoot({
        ttl: 60,
        limit: 10,
      }),
    ],
  })
  
  @Controller('products')
  @UseGuards(ThrottlerGuard)
  export class ProductController {
    // ...
  }
  ```
- **Priority:** P1 - High

---

### VULN-007: Swagger UI Exposed Without Authentication
- **Severity:** 🟠 HIGH
- **CVSS Score:** 6.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)
- **Location:** `services/coffee-shop-api/src/main.ts:45-52`
- **Description:** Swagger UI accessible at `/api/docs` without authentication, exposing API structure.
- **Impact:**
  - Information disclosure
  - API endpoint discovery
  - Attack surface mapping
- **Remediation:**
  ```typescript
  // Protect Swagger UI
  app.use('/api/docs', (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      // Require authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }
    next();
  });
  
  // Or disable in production
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api/docs', app, document);
  }
  ```
- **Priority:** P1 - High

---

### VULN-008: No CSRF Protection
- **Severity:** 🟠 HIGH
- **CVSS Score:** 7.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H)
- **Location:** All POST/PUT/DELETE endpoints
- **Description:** No CSRF tokens or SameSite cookie protection.
- **Impact:**
  - Cross-site request forgery attacks
  - Unauthorized actions on behalf of users
  - Data manipulation
- **Remediation:**
  ```typescript
  import * as csurf from 'csurf';
  
  app.use(csurf());
  
  // Or use SameSite cookies
  app.use(cookieParser());
  app.use(session({
    cookie: {
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    },
  }));
  ```
- **Priority:** P1 - High

---

### VULN-009: Error Messages Leak Information
- **Severity:** 🟠 HIGH
- **CVSS Score:** 6.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)
- **Location:** `services/coffee-shop-api/src/common/filters/http-exception.filter.ts:37`
- **Description:** Error messages may contain sensitive information like valid UUIDs, stack traces, database errors.
- **Vulnerable Code:**
  ```typescript
  response.status(status).json({
    success: false,
    message: typeof message === 'string' ? message : (message as any).message,
    errors: typeof message === 'object' && 'errors' in message ? (message as any).errors : undefined,
  });
  ```
- **Impact:**
  - Information disclosure
  - Attack surface mapping
  - Valid ID enumeration
- **Remediation:**
  ```typescript
  response.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : (typeof message === 'string' ? message : (message as any).message),
    errors: process.env.NODE_ENV === 'production' 
      ? undefined 
      : (typeof message === 'object' && 'errors' in message ? (message as any).errors : undefined),
  });
  ```
- **Priority:** P1 - High

---

### VULN-010: No Security Logging
- **Severity:** 🟠 HIGH
- **CVSS Score:** 6.0 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:L)
- **Location:** All endpoints
- **Description:** No security event logging (failed auth attempts, authorization failures, suspicious activities).
- **Impact:**
  - Attacks go undetected
  - No audit trail
  - Cannot investigate security incidents
- **Remediation:**
  ```typescript
  // Log security events
  logger.warn('Failed authentication attempt', {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    endpoint: req.path,
    timestamp: new Date(),
  });
  
  logger.error('Authorization failure', {
    userId: req.user?.id,
    endpoint: req.path,
    requiredRole: requiredRole,
    timestamp: new Date(),
  });
  ```
- **Priority:** P1 - High

---

## Medium Severity Vulnerabilities

### VULN-011: CORS Misconfiguration
- **Severity:** 🟡 MEDIUM
- **CVSS Score:** 5.3 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N)
- **Location:** `services/coffee-shop-api/src/main.ts:12-21`
- **Description:** CORS allows multiple origins and defaults to localhost if env var not set.
- **Impact:**
  - Potential CORS-based attacks
  - Unauthorized cross-origin requests
- **Remediation:**
  ```typescript
  app.enableCors({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  ```
- **Priority:** P2 - Medium

---

### VULN-012: Database Synchronize Enabled
- **Severity:** 🟡 MEDIUM
- **CVSS Score:** 5.3 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:L)
- **Location:** `services/coffee-shop-api/src/app.module.ts:62`
- **Description:** Database synchronize enabled in non-production, could cause data loss.
- **Impact:**
  - Accidental data loss
  - Schema changes without control
- **Remediation:**
  ```typescript
  synchronize: false, // Always use migrations
  ```
- **Priority:** P2 - Medium

---

### VULN-013: Default Database Credentials
- **Severity:** 🟡 MEDIUM
- **CVSS Score:** 5.3 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N)
- **Location:** `services/coffee-shop-api/src/app.module.ts:38-42`
- **Description:** Default credentials hardcoded as fallback.
- **Impact:**
  - Insecure defaults if env vars not set
  - Potential unauthorized database access
- **Remediation:**
  ```typescript
  // Fail if required env vars not set
  if (!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
    throw new Error('Database credentials must be set via environment variables');
  }
  ```
- **Priority:** P2 - Medium

---

### VULN-014: No Dependency Vulnerability Scanning
- **Severity:** 🟡 MEDIUM
- **CVSS Score:** 5.3 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N)
- **Location:** `services/coffee-shop-api/package.json`
- **Description:** No evidence of dependency vulnerability scanning.
- **Impact:**
  - Vulnerable dependencies may remain unpatched
  - Known vulnerabilities in dependencies
- **Remediation:**
  - Implement automated dependency scanning (Snyk, Dependabot)
  - Regular `npm audit` checks
  - Pin dependency versions
- **Priority:** P2 - Medium

---

## Low Severity Vulnerabilities

### VULN-015: No HTTPS Enforcement
- **Severity:** 🟢 LOW
- **CVSS Score:** 4.3 (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N)
- **Location:** `services/coffee-shop-api/src/main.ts`
- **Description:** No HTTPS redirect or HSTS headers configured.
- **Impact:**
  - Man-in-the-middle attacks
  - Credential interception
- **Remediation:**
  ```typescript
  // Add HSTS header via helmet
  app.use(helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));
  ```
- **Priority:** P3 - Low

---

### VULN-016: No Password Policy
- **Severity:** 🟢 LOW
- **CVSS Score:** 3.1 (CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:N/A:N)
- **Location:** Authentication module (not implemented)
- **Description:** No password requirements defined.
- **Impact:**
  - Weak passwords if authentication implemented
- **Remediation:**
  ```typescript
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
  ```
- **Priority:** P3 - Low

---

### VULN-017: No Content Security Policy
- **Severity:** 🟢 LOW
- **CVSS Score:** 4.3 (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N)
- **Location:** `services/coffee-shop-api/src/main.ts`
- **Description:** No Content-Security-Policy header configured.
- **Impact:**
  - XSS attacks more likely to succeed
- **Remediation:**
  ```typescript
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
  ```
- **Priority:** P3 - Low

---

## Summary

### By Severity
- **Critical:** 4 vulnerabilities
- **High:** 6 vulnerabilities
- **Medium:** 4 vulnerabilities
- **Low:** 3 vulnerabilities

### By Category
- **Authentication/Authorization:** 1 critical
- **Injection:** 1 critical
- **Security Misconfiguration:** 2 critical, 3 high, 2 medium
- **Cryptographic Failures:** 1 high
- **Logging/Monitoring:** 1 high
- **Other:** 1 medium, 3 low

### Remediation Timeline
- **Week 1 (P0):** Fix all 4 critical vulnerabilities
- **Week 2 (P1):** Fix all 6 high severity vulnerabilities
- **Week 3-4 (P2-P3):** Fix medium and low severity vulnerabilities

---

**Report Generated:** 2025-01-12  
**Next Review:** After critical fixes implemented

