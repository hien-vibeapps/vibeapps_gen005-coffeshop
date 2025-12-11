# Backend API Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY services/coffee-shop-api/package*.json ./services/coffee-shop-api/

# Install dependencies
WORKDIR /app/services/coffee-shop-api
RUN npm install

# Build the application
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/services/coffee-shop-api/node_modules ./services/coffee-shop-api/node_modules

# Copy source code
COPY tsconfig.json ./
COPY services/coffee-shop-api ./services/coffee-shop-api

# Build the application
WORKDIR /app/services/coffee-shop-api
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/services/coffee-shop-api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/services/coffee-shop-api/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/services/coffee-shop-api/node_modules ./node_modules

USER nestjs

EXPOSE 9001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9001/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

CMD ["node", "dist/main.js"]

