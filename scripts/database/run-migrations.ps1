# PowerShell script to run database migrations
# This script runs TypeORM migrations using ts-node

param(
    [string]$Action = "run"  # run, revert, status
)

# Load environment variables from .env file
if (Test-Path ".\.env") {
    Get-Content ".\.env" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Check if .env file exists
if (-not (Test-Path ".\.env")) {
    Write-Host "⚠️  Warning: .env file not found. Using default values." -ForegroundColor Yellow
}

# Database connection variables
$DB_HOST = $env:DB_HOST
$DB_PORT = $env:DB_PORT
$DB_NAME = $env:DB_NAME
$DB_USERNAME = $env:DB_USERNAME
$DB_PASSWORD = $env:DB_PASSWORD

# Check if database connection variables are set
if (-not $DB_HOST -or -not $DB_NAME -or -not $DB_USERNAME) {
    Write-Host "❌ Error: Database connection variables not set in .env file" -ForegroundColor Red
    Write-Host "Required variables: DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD" -ForegroundColor Yellow
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Database Migration Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: $DB_NAME" -ForegroundColor White
Write-Host "Host: $DB_HOST" -ForegroundColor White
Write-Host "Port: $DB_PORT" -ForegroundColor White
Write-Host "Username: $DB_USERNAME" -ForegroundColor White
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js is not installed" -ForegroundColor Red
    exit 1
}

# Check if TypeScript is installed
try {
    $tsVersion = npx tsc --version
    Write-Host "✅ TypeScript is available" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: TypeScript compiler not found. Installing..." -ForegroundColor Yellow
    npm install -g typescript ts-node
}

# Check if pg (PostgreSQL client) is installed
try {
    $pgCheck = npm list pg 2>&1
    if ($pgCheck -match "empty") {
        Write-Host "⚠️  Warning: pg package not found. Installing..." -ForegroundColor Yellow
        npm install pg
    }
} catch {
    Write-Host "⚠️  Warning: Could not check pg package. Installing..." -ForegroundColor Yellow
    npm install pg
}

# Check if typeorm is installed
try {
    $typeormCheck = npm list typeorm 2>&1
    if ($typeormCheck -match "empty") {
        Write-Host "⚠️  Warning: typeorm package not found. Installing..." -ForegroundColor Yellow
        npm install typeorm
    }
} catch {
    Write-Host "⚠️  Warning: Could not check typeorm package. Installing..." -ForegroundColor Yellow
    npm install typeorm
}

Write-Host ""
Write-Host "🔄 Running migrations..." -ForegroundColor Cyan

# Run migrations using ts-node
try {
    npx ts-node scripts/database/run-migrations.ts
    Write-Host ""
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ Error running migrations" -ForegroundColor Red
    exit 1
}

