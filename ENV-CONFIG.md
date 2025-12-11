# Environment Configuration

## File .env

Tạo file `.env` ở root directory với các biến môi trường sau:

```env
# Database Configuration
DB_HOST=
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
# SSL Configuration (set to 'true' or '1' to enable SSL)
DB_SSL=true
# SSL Certificate validation (set to 'false' to allow self-signed certificates)
DB_SSL_REJECT_UNAUTHORIZED=false


# Backend API Configuration
BACKEND_PORT=9001
NODE_ENV=production

# Frontend Configuration
FRONTEND_PORT=9000
FRONTEND_URL=http://localhost:9000
NEXT_PUBLIC_API_URL=http://localhost:9001/api/v1
```

## Ports

- **Frontend**: 9000 (configurable via `FRONTEND_PORT`)
- **Backend API**: 9001 (configurable via `BACKEND_PORT`)

## Lưu ý

1. Tất cả ports được đọc từ file `.env`
2. Docker Compose sẽ tự động load các biến từ `.env`
3. Nếu không có `.env`, sẽ dùng default values trong docker-compose.yml
4. Để thay đổi ports, chỉ cần sửa trong file `.env` và restart containers
