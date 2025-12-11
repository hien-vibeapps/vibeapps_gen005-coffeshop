# Script tự động cài đặt dependencies và chạy Playwright tests
# Usage: .\tests\run-tests.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Playwright Test Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Kiểm tra xem có đang ở đúng thư mục không
$currentDir = Get-Location
$testsDir = Join-Path $currentDir "tests"

if (-not (Test-Path $testsDir)) {
    Write-Host "❌ Không tìm thấy thư mục tests/" -ForegroundColor Red
    exit 1
}

# Bước 1: Kiểm tra và cài đặt dependencies
Write-Host "`n[Bước 1/3] Kiểm tra dependencies..." -ForegroundColor Yellow

# Kiểm tra package.json ở root
$rootPackageJson = Join-Path $currentDir "package.json"
$testsPackageJson = Join-Path $testsDir "package.json"

$needsInstall = $false

# Kiểm tra @playwright/test trong package.json
if (Test-Path $rootPackageJson) {
    $packageContent = Get-Content $rootPackageJson -Raw
    if ($packageContent -notmatch "@playwright/test") {
        Write-Host "  → @playwright/test chưa được cài đặt trong root package.json" -ForegroundColor Yellow
        $needsInstall = $true
    }
} else {
    Write-Host "  → Không tìm thấy package.json ở root" -ForegroundColor Yellow
    $needsInstall = $true
}

# Kiểm tra node_modules
$playwrightModule = Join-Path $currentDir "node_modules" "@playwright" "test"
if (-not (Test-Path $playwrightModule)) {
    Write-Host "  → @playwright/test chưa được cài đặt trong node_modules" -ForegroundColor Yellow
    $needsInstall = $true
}

if ($needsInstall) {
    Write-Host "  → Đang cài đặt @playwright/test..." -ForegroundColor Yellow
    Set-Location $currentDir
    npm install -D @playwright/test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Lỗi khi cài đặt @playwright/test" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ Đã cài đặt @playwright/test" -ForegroundColor Green
} else {
    Write-Host "  ✓ Dependencies đã được cài đặt" -ForegroundColor Green
}

# Bước 2: Cài đặt browsers
Write-Host "`n[Bước 2/3] Kiểm tra Playwright browsers..." -ForegroundColor Yellow
$playwrightExec = Join-Path $currentDir "node_modules" ".bin" "playwright"
if (Test-Path $playwrightExec) {
    Write-Host "  → Đang kiểm tra/cài đặt browsers..." -ForegroundColor Yellow
    Set-Location $currentDir
    & $playwrightExec install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ⚠️  Có thể cần cài đặt browsers thủ công: npx playwright install" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ Browsers đã sẵn sàng" -ForegroundColor Green
    }
} else {
    Write-Host "  → Đang cài đặt browsers..." -ForegroundColor Yellow
    Set-Location $currentDir
    npx playwright install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ⚠️  Có thể cần cài đặt browsers thủ công: npx playwright install" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ Browsers đã sẵn sàng" -ForegroundColor Green
    }
}

# Bước 3: Chạy tests
Write-Host "`n[Bước 3/3] Chạy Playwright tests..." -ForegroundColor Yellow
Set-Location $testsDir

# Tạo thư mục reports nếu chưa có
$reportsDir = Join-Path $testsDir "reports"
if (-not (Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir -Force | Out-Null
}

Write-Host "  → Đang chạy tests với HTML, JSON, và JUnit reporters..." -ForegroundColor Yellow
npx playwright test --reporter=html,json,junit

$testExitCode = $LASTEXITCODE

# Hiển thị kết quả
Write-Host "`n========================================" -ForegroundColor Cyan
if ($testExitCode -eq 0) {
    Write-Host "✓ Tests đã chạy thành công!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Một số tests đã fail. Vui lòng kiểm tra report." -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n📊 Test Reports:" -ForegroundColor Cyan
Write-Host "  - HTML Report: tests/reports/html-report/index.html" -ForegroundColor White
Write-Host "  - JSON Report: tests/reports/test-results.json" -ForegroundColor White
Write-Host "  - JUnit Report: tests/reports/junit.xml" -ForegroundColor White

Write-Host "`n💡 Để xem HTML report, mở file: tests/reports/html-report/index.html" -ForegroundColor Cyan

Set-Location $currentDir
exit $testExitCode

