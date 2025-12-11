# Script to orchestrate end-to-end feature development workflow
# Usage: 
#   .\orchestrate-feature.ps1 -FeatureName "cham-cong" -Description "Tính năng chấm công cho nhân viên"
#   .\orchestrate-feature.ps1 -FeatureName "cham-cong" -StartFromRole "frontend-developer"
#   .\orchestrate-feature.ps1 -FeatureName "cham-cong" -StartFromStep 4
#   .\orchestrate-feature.ps1 -FeatureName "cham-cong" -StartFromStep 2 -EndAtStep 4
#   .\orchestrate-feature.ps1 -FeatureName "cham-cong" -StartFromRole "business-analyst" -EndAtRole "backend-developer"
#   .\orchestrate-feature.ps1 -TestOnly
#   .\orchestrate-feature.ps1 -StartFromRole automation-tester -EndAtRole automation-tester
#
# Keyboard Shortcuts (while script is running):
#   Ctrl+Alt+F : Skip current step
#   Ctrl+Alt+U : Go back to previous step
#   Ctrl+Alt+C : Cancel/Stop workflow
#
# Features:
# - Automatically generates prompts for each step
# - Copies prompts to clipboard for easy pasting into Cursor AI
# - Creates prompt files for reference
# - Tracks progress and creates workflow summary
# - Capture Agent output (clipboard, log files, terminal output) instead of monitoring file changes
# - Can start from any step or role
# - Can end at any step or role
# - Keyboard shortcuts for workflow control
# - Test-only mode: Run tests for entire platform without requiring FeatureName

param(
    [Parameter(Mandatory=$false)]
    [string]$FeatureName = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipSteps,
    
    [Parameter(Mandatory=$false)]
    [string[]]$SkipStepNumbers = @(),
    
    [Parameter(Mandatory=$false)]
    [int]$StartFromStep = 1,
    
    [Parameter(Mandatory=$false)]
    [string]$StartFromRole = "",
    
    [Parameter(Mandatory=$false)]
    [int]$EndAtStep = 0,
    
    [Parameter(Mandatory=$false)]
    [string]$EndAtRole = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$TestOnly
)

# Get script directory and project root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# Project root is parent of docs_generated directory
$projectRoot = Split-Path -Parent $scriptDir
# Determine docs folder name (docs_generated)
$docsFolderName = Split-Path -Leaf $scriptDir

# Handle TestOnly mode - if TestOnly is set, automatically set to run only automation-tester step
if ($TestOnly) {
    if ([string]::IsNullOrWhiteSpace($FeatureName)) {
        $FeatureName = "platform-tests"
        $Description = "Run all platform tests"
    }
    if ([string]::IsNullOrWhiteSpace($StartFromRole) -and $StartFromStep -eq 1) {
        $StartFromRole = "automation-tester"
    }
    if ([string]::IsNullOrWhiteSpace($EndAtRole) -and $EndAtStep -eq 0) {
        $EndAtRole = "automation-tester"
    }
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  TEST-ONLY MODE ENABLED" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  → Chế độ: Chỉ chạy tests cho toàn bộ platform" -ForegroundColor Yellow
    Write-Host "  → FeatureName: $FeatureName (auto-generated)" -ForegroundColor Gray
    Write-Host ""
}

# Validate FeatureName - only required if not in TestOnly mode and not starting from automation-tester
if ([string]::IsNullOrWhiteSpace($FeatureName) -and -not $TestOnly) {
    # Check if starting from automation-tester or self-healing role
    $isStartingFromTester = $false
    if ($StartFromRole -eq "automation-tester" -or $StartFromRole -eq "self-healing") {
        $isStartingFromTester = $true
    } elseif ($StartFromStep -ge 7) {
        # Step 7 is automation-tester, Step 8 is self-healing
        $isStartingFromTester = $true
    }
    
    if (-not $isStartingFromTester) {
        Write-Host ""
        Write-Host "⚠️  Lỗi: FeatureName là bắt buộc trừ khi:" -ForegroundColor Red
        Write-Host "   1. Sử dụng -TestOnly switch" -ForegroundColor Yellow
        Write-Host "   2. Hoặc bắt đầu từ automation-tester role/step" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Ví dụ:" -ForegroundColor Cyan
        Write-Host "  .\orchestrate-feature.ps1 -TestOnly" -ForegroundColor Gray
        Write-Host "  .\orchestrate-feature.ps1 -StartFromRole automation-tester" -ForegroundColor Gray
        Write-Host ""
        exit 1
    } else {
        # Auto-generate FeatureName for test-only runs
        $FeatureName = "platform-tests"
        $Description = "Run all platform tests"
        Write-Host ""
        Write-Host "  → FeatureName không được cung cấp, tự động set: '$FeatureName'" -ForegroundColor Yellow
        Write-Host ""
    }
}

# Workflow steps - Thứ tự mới: product-owner => business-analyst => database-engineer => frontend-developer => backend-developer => devops => automation-tester => self-healing => security-tester
$workflow = @(
    @{ 
        Role = "product-owner"; 
        Step = 1; 
        Name = "Product Owner - Define Epic/Features";
        Description = "Xác định epic/feature, tạo user stories và acceptance criteria";
        OutputDir = Join-Path $scriptDir "product-owner";
        OutputFiles = @("epic-*.md", "epics-and-features.md");
        CanSkip = $true;
        SkipCheckFunction = "Check-IfFeatureExistsInEpic"
    },
    @{ 
        Role = "business-analyst"; 
        Step = 2; 
        Name = "Business Analyst - Analyze Requirements";
        Description = "Phân tích requirements, tạo use cases và business rules";
        OutputDir = Join-Path $scriptDir "business-analyst";
        OutputFiles = @("use-cases-*.md", "business-rules-*.md");
        CanSkip = $true;
        SkipCheckFunction = "Check-IfBusinessAnalystComplete"
    },
    @{ 
        Role = "database-engineer"; 
        Step = 3; 
        Name = "Database Engineer - Design Schema";
        Description = "Thiết kế database schema và tạo migration scripts";
        OutputDir = Join-Path $scriptDir "database-engineer";
        OutputFiles = @("schema-*.md", "**/migrations/*.ts");
        CanSkip = $true;
        SkipCheckFunction = "Check-IfDatabaseComplete"
    },
    @{ 
        Role = "frontend-developer"; 
        Step = 4; 
        Name = "Frontend Developer - Implement UI";
        Description = "Implement frontend (Next.js), tạo mock data services và định nghĩa API contracts";
        OutputDir = "";
        OutputFiles = @("apps/admin-panel/**/*.tsx", "apps/admin-panel/**/*.ts");
        CanSkip = $false;
        SkipCheckFunction = $null
    },
    @{ 
        Role = "backend-developer"; 
        Step = 5; 
        Name = "Backend Developer - Implement APIs";
        Description = "Implement backend (NestJS) theo API contracts từ Frontend Developer";
        OutputDir = "";
        OutputFiles = @("services/**/*.ts");
        CanSkip = $false;
        SkipCheckFunction = $null
    },
    @{ 
        Role = "devops"; 
        Step = 6; 
        Name = "DevOps - Deploy";
        Description = "Check Docker configs và docker compose up";
        OutputDir = "";
        OutputFiles = @("deployment-*.md", "docker-compose.yml", "**/Dockerfile");
        CanSkip = $false;
        SkipCheckFunction = $null;
        CanRollback = $true;
        RollbackToStep = 5
    },
    @{ 
        Role = "automation-tester"; 
        Step = 7; 
        Name = "Automation Tester - Write Tests";
        Description = "Viết Playwright E2E tests và chạy test reports";
        OutputDir = "tests";
        OutputFiles = @("e2e/*.e2e-spec.ts", "reports/*.html");
        CanSkip = $false;
        SkipCheckFunction = $null;
        CanRollback = $true;
        RollbackToStep = 5
    },
    @{ 
        Role = "self-healing"; 
        Step = 8; 
        Name = "Self-Healing - Fix Bugs";
        Description = "Phân tích test results, tạo bug fix plan và tự động fix bugs";
        OutputDir = Join-Path $scriptDir "self-healing";
        OutputFiles = @("bug-analysis-*.md", "bug-fix-plan-*.md", "fixed-bugs-*.md");
        CanSkip = $false;
        SkipCheckFunction = $null;
        CanRollback = $true;
        RollbackToStep = 5
    },
    @{ 
        Role = "security-tester"; 
        Step = 9; 
        Name = "Security Tester - Security Audit";
        Description = "Security audit và kiểm tra OWASP Top 10";
        OutputDir = Join-Path $scriptDir "security-tester";
        OutputFiles = @("security-audit-*.md");
        CanSkip = $false;
        SkipCheckFunction = $null
    }
)

# Create workflows directory if not exists
$workflowsDir = Join-Path $scriptDir "workflows"
if (-not (Test-Path $workflowsDir)) {
    New-Item -ItemType Directory -Path $workflowsDir -Force | Out-Null
    Write-Host "Created directory: $workflowsDir" -ForegroundColor Green
}

# Create workflow summary file
$summaryFileName = if ([string]::IsNullOrWhiteSpace($FeatureName)) { "platform-tests" } else { $FeatureName }
$summaryFile = "$workflowsDir/$summaryFileName-workflow-summary.md"
$startTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$summaryContent = "# Workflow Summary: $summaryFileName`n`n"
if (-not [string]::IsNullOrWhiteSpace($FeatureName)) {
    $summaryContent += "**Feature**: $FeatureName`n"
}
$summaryContent += "**Description**: $Description`n"
if ($TestOnly) {
    $summaryContent += "**Mode**: Test-Only (Platform Tests)`n"
}
$summaryContent += "**Started**: $startTime`n"
$summaryContent += "**Status**: In Progress`n`n"

# Add workflow range information
if ($actualStartStep -gt 1 -or $actualEndStep -lt $workflow.Count) {
    $summaryContent += "**Workflow Range**: Step $actualStartStep → Step $actualEndStep`n"
    if ($StartFromRole) {
        $summaryContent += "**Start Role**: $StartFromRole`n"
    }
    if ($EndAtRole) {
        $summaryContent += "**End Role**: $EndAtRole`n"
    }
    $summaryContent += "`n"
}

$summaryContent += "## Overview`n`n"
$summaryContent += "Workflow này thực hiện quy trình phát triển tính năng `"$FeatureName`" từ Step $actualStartStep đến Step $actualEndStep qua các role agents.`n`n"
$summaryContent += "## Workflow Steps`n`n"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($TestOnly) {
    Write-Host "  Running Platform Tests" -ForegroundColor Cyan
} else {
    Write-Host "  Orchestrating Feature: $FeatureName" -ForegroundColor Cyan
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
if ($Description) {
    Write-Host "Description: $Description" -ForegroundColor Gray
    Write-Host ""
}
if ($TestOnly) {
    Write-Host "Mode: Test-Only (Chỉ chạy automation tests cho toàn bộ platform)" -ForegroundColor Yellow
    Write-Host ""
}

# Determine starting step
$actualStartStep = if ($StartFromStep -gt 0) { $StartFromStep } else { 1 }
if ($StartFromRole) {
    # Find step by role name
    $roleStep = $workflow | Where-Object { $_.Role -eq $StartFromRole } | Select-Object -First 1
    if ($roleStep) {
        $actualStartStep = $roleStep.Step
        Write-Host "Starting from role: $StartFromRole (Step $actualStartStep)" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "⚠️  Không tìm thấy role '$StartFromRole', sẽ bắt đầu từ step $actualStartStep" -ForegroundColor Yellow
        Write-Host ""
    }
} elseif ($actualStartStep -gt 1) {
    Write-Host "Starting from step: $actualStartStep" -ForegroundColor Cyan
    Write-Host ""
}

# Determine ending step
$actualEndStep = if ($EndAtStep -gt 0) { $EndAtStep } else { $workflow.Count }
if ($EndAtRole) {
    # Find step by role name
    $roleStep = $workflow | Where-Object { $_.Role -eq $EndAtRole } | Select-Object -First 1
    if ($roleStep) {
        $actualEndStep = $roleStep.Step
        Write-Host "Ending at role: $EndAtRole (Step $actualEndStep)" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "⚠️  Không tìm thấy role '$EndAtRole', sẽ kết thúc ở step $actualEndStep" -ForegroundColor Yellow
        Write-Host ""
    }
} elseif ($EndAtStep -gt 0) {
    Write-Host "Ending at step: $actualEndStep" -ForegroundColor Cyan
    Write-Host ""
}

# Validate start and end steps
if ($actualStartStep -gt $actualEndStep) {
    Write-Host "⚠️  Lỗi: Start step ($actualStartStep) không thể lớn hơn End step ($actualEndStep)" -ForegroundColor Red
    Write-Host "  → Script sẽ kết thúc" -ForegroundColor Red
    exit 1
}

if ($actualStartStep -gt 0 -and $actualEndStep -gt 0) {
    Write-Host "Workflow range: Step $actualStartStep → Step $actualEndStep" -ForegroundColor Cyan
    Write-Host ""
}

# Global variables for keyboard shortcuts control
$script:skipCurrentStep = $false
$script:goBackToPreviousStep = $false
$script:cancelWorkflow = $false
$script:currentStepNumber = 0
$script:bugFailureThreshold = 0.3
$script:pendingBugReport = $null
$script:lastKeyCheck = @{
    Skip = $false
    Back = $false
    Cancel = $false
}

# Add Windows API for keyboard state checking (only on Windows)
if ($IsWindows -or $env:OS -like "*Windows*") {
    Add-Type @"
using System;
using System.Runtime.InteropServices;
public class KeyboardHook {
    [DllImport("user32.dll")]
    public static extern short GetAsyncKeyState(int vKey);
    
    public const int VK_CONTROL = 0x11;
    public const int VK_MENU = 0x12;  // Alt key
    public const int VK_F = 0x46;
    public const int VK_U = 0x55;
    public const int VK_C = 0x43;
}
"@
}

# Function to display keyboard shortcuts help
function Show-KeyboardShortcuts {
    Write-Host ""
    Write-Host "  ========================================" -ForegroundColor Cyan
    Write-Host "  KEYBOARD SHORTCUTS" -ForegroundColor Cyan
    Write-Host "  ========================================" -ForegroundColor Cyan
    Write-Host "  Ctrl+Alt+F : Skip current step" -ForegroundColor Yellow
    Write-Host "  Ctrl+Alt+U : Go back to previous step" -ForegroundColor Yellow
    Write-Host "  Ctrl+Alt+C : Cancel/Stop workflow" -ForegroundColor Yellow
    Write-Host "  ========================================" -ForegroundColor Cyan
    Write-Host ""
}

# Show keyboard shortcuts
Show-KeyboardShortcuts

# Try to focus PowerShell window to ensure keyboard shortcuts work
Write-Host "  → Đang cố gắng focus terminal window để keyboard shortcuts hoạt động..." -ForegroundColor Cyan
$focused = Focus-PowerShellWindow
if ($focused) {
    Write-Host "  ✓ Terminal window đã được focus" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Không thể tự động focus terminal window" -ForegroundColor Yellow
    Write-Host "  → Vui lòng click vào terminal window để focus thủ công" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "⚠️  QUAN TRỌNG: Để keyboard shortcuts hoạt động:" -ForegroundColor Yellow
Write-Host "   1. ✅ Terminal/PowerShell window PHẢI được FOCUS (click vào terminal window)" -ForegroundColor Yellow
Write-Host "      → Con trỏ chuột có thể ở bất kỳ đâu, nhưng TERMINAL WINDOW phải được FOCUS" -ForegroundColor Cyan
Write-Host "      → Cách kiểm tra: Title bar của terminal window phải có màu sáng (active)" -ForegroundColor Cyan
Write-Host "   2. ✅ Không chạy trong VS Code/Cursor integrated terminal (dùng standalone PowerShell)" -ForegroundColor Yellow
Write-Host "      → Mở PowerShell riêng (Windows PowerShell hoặc PowerShell 7)" -ForegroundColor Cyan
Write-Host "      → Chạy script từ terminal đó" -ForegroundColor Cyan
Write-Host "   3. ✅ Nếu không hoạt động, thử chạy PowerShell as Administrator" -ForegroundColor Yellow
Write-Host "   4. ⚠️  Keyboard shortcuts KHÔNG hoạt động khi màn hình bị LOCKED!" -ForegroundColor Red
Write-Host "      → Script vẫn chạy (monitor files, etc.) nhưng không thể detect keyboard" -ForegroundColor Red
Write-Host "      → Phải unlock màn hình để sử dụng keyboard shortcuts" -ForegroundColor Red
Write-Host ""
Write-Host "💡 CÁCH SỬ DỤNG KEYBOARD SHORTCUTS:" -ForegroundColor Cyan
Write-Host "   - Đảm bảo terminal window đang FOCUS (click vào terminal)" -ForegroundColor Gray
Write-Host "   - Nhấn và giữ Ctrl+Alt, sau đó nhấn F/U/C" -ForegroundColor Gray
Write-Host "   - Script sẽ check keyboard shortcuts thường xuyên trong workflow" -ForegroundColor Gray
Write-Host "   - Nếu không hoạt động, thử click vào terminal window rồi nhấn lại" -ForegroundColor Gray
Write-Host ""

$completedSteps = @()
$previousStepNumber = 0

# Function to check keyboard shortcuts (with debouncing to avoid multiple triggers)
function Test-KeyboardShortcuts {
    # Only work on Windows
    if (-not ($IsWindows -or $env:OS -like "*Windows*")) {
        return $null
    }
    
    # Note: This function will NOT work when screen is locked
    # GetAsyncKeyState cannot detect keys when Windows is locked
    # IMPORTANT: Terminal/PowerShell window MUST be FOCUSED for this to work
    
    try {
        $ctrlPressed = ([KeyboardHook]::GetAsyncKeyState([KeyboardHook]::VK_CONTROL) -band 0x8000) -ne 0
        $altPressed = ([KeyboardHook]::GetAsyncKeyState([KeyboardHook]::VK_MENU) -band 0x8000) -ne 0
        
        if ($ctrlPressed -and $altPressed) {
            # Check for F key (Skip) - only trigger once per key press
            $fPressed = ([KeyboardHook]::GetAsyncKeyState([KeyboardHook]::VK_F) -band 0x8000) -ne 0
            if ($fPressed -and -not $script:lastKeyCheck.Skip) {
                $script:lastKeyCheck.Skip = $true
                Start-Sleep -Milliseconds 300  # Debounce - increased for reliability
                return "Skip"
            } elseif (-not $fPressed) {
                $script:lastKeyCheck.Skip = $false
            }
            
            # Check for U key (Back) - only trigger once per key press
            $uPressed = ([KeyboardHook]::GetAsyncKeyState([KeyboardHook]::VK_U) -band 0x8000) -ne 0
            if ($uPressed -and -not $script:lastKeyCheck.Back) {
                $script:lastKeyCheck.Back = $true
                Start-Sleep -Milliseconds 300  # Debounce - increased for reliability
                return "Back"
            } elseif (-not $uPressed) {
                $script:lastKeyCheck.Back = $false
            }
            
            # Check for C key (Cancel) - only trigger once per key press
            $cPressed = ([KeyboardHook]::GetAsyncKeyState([KeyboardHook]::VK_C) -band 0x8000) -ne 0
            if ($cPressed -and -not $script:lastKeyCheck.Cancel) {
                $script:lastKeyCheck.Cancel = $true
                Start-Sleep -Milliseconds 300  # Debounce - increased for reliability
                return "Cancel"
            } elseif (-not $cPressed) {
                $script:lastKeyCheck.Cancel = $false
            }
        } else {
            # Reset all key states when Ctrl+Alt is released
            $script:lastKeyCheck.Skip = $false
            $script:lastKeyCheck.Back = $false
            $script:lastKeyCheck.Cancel = $false
        }
    } catch {
        # Silently fail if keyboard detection fails
        return $null
    }
    
    return $null
}

# Helper function to check keyboard shortcuts with retry and focus check
function Test-KeyboardShortcutsWithRetry {
    param([int]$MaxRetries = 3)
    
    for ($i = 0; $i -lt $MaxRetries; $i++) {
        $result = Test-KeyboardShortcuts
        if ($result) {
            return $result
        }
        # Small delay between retries
        Start-Sleep -Milliseconds 50
    }
    return $null
}

# Function to try to focus PowerShell window (if possible)
function Focus-PowerShellWindow {
    if (-not ($IsWindows -or $env:OS -like "*Windows*")) {
        return $false
    }
    
    try {
        $currentProcess = Get-Process -Id $PID
        if ($currentProcess -and $currentProcess.MainWindowHandle -ne [IntPtr]::Zero) {
            Add-Type @"
                using System;
                using System.Runtime.InteropServices;
                public class Win32 {
                    [DllImport("user32.dll")]
                    public static extern bool SetForegroundWindow(IntPtr hWnd);
                    [DllImport("user32.dll")]
                    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
                    public static int SW_RESTORE = 9;
                    [DllImport("user32.dll")]
                    public static extern bool IsIconic(IntPtr hWnd);
                }
"@
            
            if ([Win32]::IsIconic($currentProcess.MainWindowHandle)) {
                [Win32]::ShowWindow($currentProcess.MainWindowHandle, [Win32]::SW_RESTORE)
                Start-Sleep -Milliseconds 200
            }
            [Win32]::SetForegroundWindow($currentProcess.MainWindowHandle)
            return $true
        }
    } catch {
        # Silently fail
    }
    return $false
}

# Function to check if feature already exists in epic with "In Progress" status
function Check-IfFeatureExistsInEpic {
    param([string]$FeatureName)
    
    Write-Host "  → Đang kiểm tra xem feature '$FeatureName' đã có trong epic chưa..." -ForegroundColor Cyan
    
    # Create search patterns for different feature name variations
    # Example: "cham-cong" -> ["cham-cong", "chấm công", "cham cong", "attendance", "Attendance Management"]
    $searchPatterns = @()
    
    # Add original feature name
    $searchPatterns += $FeatureName
    
    # Add variations: replace hyphens with spaces, convert to Vietnamese
    $searchPatterns += $FeatureName.Replace("-", " ")
    $searchPatterns += $FeatureName.Replace("-", "-").ToLower()
    
    # Common mappings for feature names
    $nameMappings = @{
        "cham-cong" = @("chấm công", "Attendance Management", "attendance", "attendance management")
    }
    
    # Add mapped names if available
    if ($nameMappings.ContainsKey($FeatureName)) {
        $searchPatterns += $nameMappings[$FeatureName]
    }
    
    # Also try to extract English name from common patterns
    # "cham-cong" might be "attendance" or "attendance-management"
    if ($FeatureName -match "cham-cong|cham_cong") {
        $searchPatterns += "attendance"
        $searchPatterns += "Attendance Management"
        $searchPatterns += "attendance-management"
    }
    
    # Search for feature in epic files
    $epicFiles = Get-ChildItem -Path (Join-Path $scriptDir "product-owner") -Filter "epic-*.md" -ErrorAction SilentlyContinue
    
    foreach ($epicFile in $epicFiles) {
        $content = Get-Content -Path $epicFile.FullName -Raw -ErrorAction SilentlyContinue
        if ($content) {
            # Try each search pattern
            foreach ($pattern in $searchPatterns) {
                # Escape special regex characters but keep case-insensitive matching
                $escapedPattern = [regex]::Escape($pattern)
                
                # Look for feature name in the content (case-insensitive)
                if ($content -match "(?i)$escapedPattern") {
                    Write-Host "  → Tìm thấy pattern '$pattern' trong file $($epicFile.Name)" -ForegroundColor Gray
                    
                    # Now check if there's "In Progress" status near this pattern
                    # Look for "In Progress" within 100 lines of where we found the pattern
                    $lines = $content -split "`n"
                    $patternLineIndex = -1
                    
                    # Find the line where pattern appears
                    for ($i = 0; $i -lt $lines.Count; $i++) {
                        if ($lines[$i] -match "(?i)$escapedPattern") {
                            $patternLineIndex = $i
                            break
                        }
                    }
                    
                    if ($patternLineIndex -ge 0) {
                        # Check lines around the pattern (within 50 lines before and after)
                        $startLine = [Math]::Max(0, $patternLineIndex - 50)
                        $endLine = [Math]::Min($lines.Count - 1, $patternLineIndex + 50)
                        
                        $sectionContent = $lines[$startLine..$endLine] -join "`n"
                        
                        # Check if this section has "In Progress" status
                        if ($sectionContent -match "(?i)Status.*In Progress|In Progress|\*\*?Status\*\*?\s*:\s*In Progress") {
                            Write-Host "  → ✓ Tìm thấy feature '$pattern' trong epic với status 'In Progress'" -ForegroundColor Green
                            Write-Host "  → File: $($epicFile.Name)" -ForegroundColor Gray
                            return $true
                        }
                    }
                }
            }
        }
    }
    
    Write-Host "  → Không tìm thấy feature '$FeatureName' với status 'In Progress' trong epic" -ForegroundColor Yellow
    Write-Host "  → Đã tìm kiếm với các pattern: $($searchPatterns -join ', ')" -ForegroundColor DarkGray
    return $false
}

# Function to check if Business Analyst documentation is complete
function Check-IfBusinessAnalystComplete {
    param([string]$FeatureName)
    
    Write-Host "  → Đang kiểm tra xem Business Analyst đã hoàn thành đầy đủ chưa..." -ForegroundColor Cyan
    
    # Create search patterns for different feature name variations
    $searchPatterns = @()
    $searchPatterns += $FeatureName
    $searchPatterns += $FeatureName.Replace("-", " ")
    $searchPatterns += $FeatureName.Replace("-", "-").ToLower()
    
    # Common mappings
    if ($FeatureName -match "cham-cong|cham_cong") {
        $searchPatterns += "attendance"
        $searchPatterns += "Attendance Management"
        $searchPatterns += "attendance-management"
        $searchPatterns += "chấm công"
    }
    
    $hasUseCases = $false
    $hasBusinessRules = $false
    
    # Check for use-cases file - try multiple patterns
    $useCasesFiles = Get-ChildItem -Path (Join-Path $scriptDir "business-analyst") -Filter "use-cases-*.md" -ErrorAction SilentlyContinue
    foreach ($file in $useCasesFiles) {
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content) {
            # Check filename first
            $fileNameMatch = $false
            foreach ($pattern in $searchPatterns) {
                if ($file.Name -like "*$pattern*" -or $file.Name -match "(?i)$([regex]::Escape($pattern))") {
                    $fileNameMatch = $true
                    break
                }
            }
            
            # Check content
            $contentMatch = $false
            foreach ($pattern in $searchPatterns) {
                $escapedPattern = [regex]::Escape($pattern)
                if ($content -match "(?i)$escapedPattern") {
                    $contentMatch = $true
                    break
                }
            }
            
            if ($fileNameMatch -or $contentMatch) {
                $hasUseCases = $true
                Write-Host "  → ✓ Tìm thấy use-cases: $($file.Name)" -ForegroundColor Green
                break
            }
        }
    }
    
    # Check for business-rules file - can be in general HR file or specific file
    $businessRulesFiles = Get-ChildItem -Path (Join-Path $scriptDir "business-analyst") -Filter "business-rules-*.md" -ErrorAction SilentlyContinue
    foreach ($file in $businessRulesFiles) {
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content) {
            # Check if file contains our feature (even if filename doesn't match)
            $contentMatch = $false
            foreach ($pattern in $searchPatterns) {
                $escapedPattern = [regex]::Escape($pattern)
                # Look for feature name in content, especially in section headers
                if ($content -match "(?i)$escapedPattern|Attendance Management|BR-ATT-|BR-HR-006") {
                    $contentMatch = $true
                    break
                }
            }
            
            # Also check filename
            $fileNameMatch = $false
            foreach ($pattern in $searchPatterns) {
                if ($file.Name -like "*$pattern*" -or $file.Name -match "(?i)$([regex]::Escape($pattern))") {
                    $fileNameMatch = $true
                    break
                }
            }
            
            if ($fileNameMatch -or $contentMatch) {
                $hasBusinessRules = $true
                Write-Host "  → ✓ Tìm thấy business-rules: $($file.Name)" -ForegroundColor Green
                break
            }
        }
    }
    
    # Consider complete if has use-cases and business-rules
    if ($hasUseCases -and $hasBusinessRules) {
        Write-Host "  → ✓ Business Analyst documentation đã đầy đủ (use-cases + business-rules)" -ForegroundColor Green
        return $true
    }
    
    Write-Host "  → Business Analyst documentation chưa đầy đủ:" -ForegroundColor Yellow
    if (-not $hasUseCases) { Write-Host "    - Thiếu use-cases" -ForegroundColor Yellow }
    if (-not $hasBusinessRules) { Write-Host "    - Thiếu business-rules" -ForegroundColor Yellow }
    Write-Host "  → Đã tìm kiếm với các pattern: $($searchPatterns -join ', ')" -ForegroundColor DarkGray
    return $false
}

# Function to check if Database Engineer documentation is complete
function Check-IfDatabaseComplete {
    param([string]$FeatureName)
    
    Write-Host "  → Đang kiểm tra xem Database Engineer đã thiết kế đầy đủ chưa..." -ForegroundColor Cyan
    
    $hasSchema = $false
    
    # Check for schema file
    $schemaFiles = Get-ChildItem -Path (Join-Path $scriptDir "database-engineer") -Filter "schema-*.md" -ErrorAction SilentlyContinue
    foreach ($file in $schemaFiles) {
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -and ($content -match [regex]::Escape($FeatureName) -or $file.Name -like "*$FeatureName*")) {
            # Check if schema file has actual table definitions (not just placeholder)
            if ($content -match "(?i)CREATE TABLE|CREATE TABLE IF NOT EXISTS|@Entity|class.*Entity") {
                $hasSchema = $true
                Write-Host "  → ✓ Tìm thấy schema file với table definitions: $($file.Name)" -ForegroundColor Green
                break
            }
        }
    }
    
    # Also check Database-Architecture.md for feature references
    $dbArchFile = Join-Path $scriptDir "database-engineer/Database-Architecture.md"
    if (Test-Path $dbArchFile) {
        $content = Get-Content -Path $dbArchFile -Raw -ErrorAction SilentlyContinue
        if ($content -and ($content -match [regex]::Escape($FeatureName))) {
            Write-Host "  → ✓ Tìm thấy reference trong Database-Architecture.md" -ForegroundColor Green
            $hasSchema = $true
        }
    }
    
    if ($hasSchema) {
        Write-Host "  → ✓ Database schema đã được thiết kế đầy đủ" -ForegroundColor Green
        return $true
    }
    
    Write-Host "  → Database schema chưa được thiết kế đầy đủ" -ForegroundColor Yellow
    return $false
}

# Function to open new agent tab in Cursor
function Open-NewAgentTab {
    # Add required assemblies
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    
    Write-Host "  → Đang mở agent tab mới trong Cursor..." -ForegroundColor Cyan
    
    # Try multiple methods to find Cursor process
    $cursorProcess = $null
    $maxRetries = 3
    
    for ($retry = 1; $retry -le $maxRetries; $retry++) {
        Write-Host "  → Đang tìm Cursor process (lần thử $retry/$maxRetries)..." -ForegroundColor Gray
        
        # Method 1: Try exact process name "Cursor"
        try {
            $cursorProcess = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue | 
                Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero } | 
                Select-Object -First 1
        } catch {}
        
        # Method 2: Try case-insensitive process name
        if (-not $cursorProcess) {
            try {
                $cursorProcess = Get-Process | Where-Object { 
                    $_.ProcessName -eq "Cursor" -or 
                    $_.ProcessName -like "*cursor*"
                } | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero } | 
                Select-Object -First 1
            } catch {}
        }
        
        # Method 3: Try by MainWindowTitle
        if (-not $cursorProcess) {
            try {
                $cursorProcess = Get-Process | Where-Object { 
                    $_.MainWindowTitle -like "*Cursor*" -or 
                    $_.MainWindowTitle -like "*cursor*"
                } | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero } | 
                Select-Object -First 1
            } catch {}
        }
        
        # Method 4: Try by executable path
        if (-not $cursorProcess) {
            try {
                $cursorProcess = Get-Process | Where-Object { 
                    ($_.Path -and ($_.Path -like "*Cursor*" -or $_.Path -like "*cursor*")) -or
                    ($null -eq $_.Path -and $_.ProcessName -like "*cursor*")
                } | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero } | 
                Select-Object -First 1
            } catch {}
        }
        
        if ($cursorProcess -and $cursorProcess.MainWindowHandle -ne [IntPtr]::Zero) {
            Write-Host "  → ✓ Đã tìm thấy Cursor process: $($cursorProcess.ProcessName) (PID: $($cursorProcess.Id))" -ForegroundColor Green
            break
        }
        
        if ($retry -lt $maxRetries) {
            Write-Host "  → Không tìm thấy, đợi 1 giây rồi thử lại..." -ForegroundColor Yellow
            Start-Sleep -Seconds 1
        }
    }
    
    if (-not $cursorProcess -or $cursorProcess.MainWindowHandle -eq [IntPtr]::Zero) {
        Write-Host "  ⚠️  Không tìm thấy Cursor window sau $maxRetries lần thử" -ForegroundColor Yellow
        Write-Host "  → Vui lòng đảm bảo Cursor đang mở và có window visible" -ForegroundColor Yellow
        Write-Host "  → Hoặc bạn có thể click vào Cursor window và script sẽ tiếp tục" -ForegroundColor Yellow
        
        # Give user a chance to manually focus Cursor
        Write-Host "  → Đang đợi 3 giây để bạn có thể click vào Cursor..." -ForegroundColor Cyan
        Start-Sleep -Seconds 3
        
        # Try one more time after user might have focused
        try {
            $cursorProcess = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue | 
                Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero } | 
                Select-Object -First 1
        } catch {}
        
        if (-not $cursorProcess -or $cursorProcess.MainWindowHandle -eq [IntPtr]::Zero) {
            return $false
        }
    }
    
    # Focus Cursor window
    try {
        Write-Host "  → Đang focus vào Cursor window..." -ForegroundColor Gray
        # Use Windows API to bring window to front
        Add-Type @"
            using System;
            using System.Runtime.InteropServices;
            public class Win32 {
                [DllImport("user32.dll")]
                public static extern bool SetForegroundWindow(IntPtr hWnd);
                [DllImport("user32.dll")]
                public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
                public static int SW_RESTORE = 9;
                [DllImport("user32.dll")]
                public static extern bool IsIconic(IntPtr hWnd);
            }
"@
        
        # Restore if minimized
        if ([Win32]::IsIconic($cursorProcess.MainWindowHandle)) {
            [Win32]::ShowWindow($cursorProcess.MainWindowHandle, [Win32]::SW_RESTORE)
            Start-Sleep -Milliseconds 300
        }
        
        [Win32]::SetForegroundWindow($cursorProcess.MainWindowHandle)
        Start-Sleep -Milliseconds 500
        Write-Host "  → ✓ Đã focus vào Cursor window" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Không thể focus window tự động: $_" -ForegroundColor Yellow
        Write-Host "  → Vui lòng click vào Cursor window thủ công" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
    
    # Wait a moment for window to be ready
    Start-Sleep -Milliseconds 500
    
    # Open new agent tab - Try Ctrl+Shift+L (new chat)
    Write-Host "  → Đang mở agent tab mới (Ctrl+Shift+L)..." -ForegroundColor Gray
    try {
        [System.Windows.Forms.SendKeys]::SendWait("^+l")
        Start-Sleep -Milliseconds 1000
        Write-Host "  ✓ Agent tab mới đã được mở!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  ⚠️  Lỗi khi gửi keyboard shortcut: $_" -ForegroundColor Yellow
        Write-Host "  → Vui lòng mở agent tab thủ công (Ctrl+Shift+L)" -ForegroundColor Yellow
        return $false
    }
}

# Function to send text to Cursor AI automatically
function Send-TextToCursor {
    param([string]$Text)
    
    # Add required assemblies
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    
    # Copy to clipboard first
    $Text | Set-Clipboard
    
    Write-Host "  → Đang gửi prompt đến Cursor AI..." -ForegroundColor Cyan
    
    # Wait a moment for agent tab to be ready
    Start-Sleep -Milliseconds 500
    
    # Paste the prompt (Ctrl+V)
    Write-Host "  → Đang paste prompt..." -ForegroundColor Gray
    [System.Windows.Forms.SendKeys]::SendWait("^v")
    Start-Sleep -Milliseconds 500
    
    # Send Enter to submit
    Write-Host "  → Đang gửi prompt (Enter)..." -ForegroundColor Gray
    [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
    Start-Sleep -Milliseconds 300
    
    Write-Host "  ✓ Prompt đã được gửi đến Cursor AI!" -ForegroundColor Green
}

# Function to automatically accept changes in Cursor AI
# This helps workflow continue automatically when "Skip or Accept", "Undo, Keep, Review", or "Undo All, Keep All, Review" prompts appear
function Accept-CursorChanges {
    param(
        [switch]$KeepAll,  # If true, select "Keep All" for "Undo All, Keep All, Review" prompt
        [switch]$Keep      # If true, select "Keep" for "Undo, Keep, Review" prompt
    )
    
    if (-not ($IsWindows -or $env:OS -like "*Windows*")) {
        return $false
    }
    
    try {
        Add-Type -AssemblyName System.Windows.Forms
        
        # Try to find Cursor window and focus it
        $cursorProcess = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue | 
            Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero } | 
            Select-Object -First 1
        
        if ($cursorProcess -and $cursorProcess.MainWindowHandle -ne [IntPtr]::Zero) {
            # Focus Cursor window
            Add-Type @"
                using System;
                using System.Runtime.InteropServices;
                public class Win32 {
                    [DllImport("user32.dll")]
                    public static extern bool SetForegroundWindow(IntPtr hWnd);
                    [DllImport("user32.dll")]
                    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
                    public static int SW_RESTORE = 9;
                    [DllImport("user32.dll")]
                    public static extern bool IsIconic(IntPtr hWnd);
                }
"@
            # Restore if minimized
            if ([Win32]::IsIconic($cursorProcess.MainWindowHandle)) {
                [Win32]::ShowWindow($cursorProcess.MainWindowHandle, [Win32]::SW_RESTORE)
                Start-Sleep -Milliseconds 300
            }
            [Win32]::SetForegroundWindow($cursorProcess.MainWindowHandle)
            Start-Sleep -Milliseconds 500  # Wait longer for window to be ready
            
            if ($KeepAll) {
                # Handle "Undo All, Keep All, Review" prompt
                # Try multiple methods to select "Keep All"
                # Method 1: Arrow keys (Right arrow to move to "Keep All")
                [System.Windows.Forms.SendKeys]::SendWait("{RIGHT}")
                Start-Sleep -Milliseconds 150
                [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
                Start-Sleep -Milliseconds 200
                
                # Method 2: Tab navigation (fallback)
                [System.Windows.Forms.SendKeys]::SendWait("{TAB}")
                Start-Sleep -Milliseconds 100
                [System.Windows.Forms.SendKeys]::SendWait("{TAB}")
                Start-Sleep -Milliseconds 100
                [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
                Start-Sleep -Milliseconds 200
                
                # Method 3: Try Ctrl+Enter (common shortcut for accept)
                [System.Windows.Forms.SendKeys]::SendWait("^{ENTER}")
                Start-Sleep -Milliseconds 200
                
                Write-Host "  → ✓ Đã thử chọn 'Keep All' (multiple methods)" -ForegroundColor DarkGray
            } elseif ($Keep) {
                # Handle "Undo, Keep, Review" prompt
                # Method 1: Arrow keys (Right arrow to move to "Keep")
                [System.Windows.Forms.SendKeys]::SendWait("{RIGHT}")
                Start-Sleep -Milliseconds 150
                [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
                Start-Sleep -Milliseconds 200
                
                # Method 2: Tab navigation
                [System.Windows.Forms.SendKeys]::SendWait("{TAB}")
                Start-Sleep -Milliseconds 100
                [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
                Start-Sleep -Milliseconds 200
                
                Write-Host "  → ✓ Đã thử chọn 'Keep' (multiple methods)" -ForegroundColor DarkGray
            } else {
                # Handle "Skip or Accept" prompt - try multiple methods
                # Method 1: Direct Enter (most common)
                [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
                Start-Sleep -Milliseconds 200
                
                # Method 2: Tab to Accept button then Enter
                [System.Windows.Forms.SendKeys]::SendWait("{TAB}")
                Start-Sleep -Milliseconds 100
                [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
                Start-Sleep -Milliseconds 200
                
                # Method 3: Arrow Right then Enter (if Accept is on the right)
                [System.Windows.Forms.SendKeys]::SendWait("{RIGHT}")
                Start-Sleep -Milliseconds 100
                [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
                Start-Sleep -Milliseconds 200
                
                # Method 4: Try Ctrl+Enter
                [System.Windows.Forms.SendKeys]::SendWait("^{ENTER}")
                Start-Sleep -Milliseconds 200
                
                Write-Host "  → ✓ Đã thử accept changes (multiple methods)" -ForegroundColor DarkGray
            }
            
            return $true
        }
    } catch {
        # Silently fail if cannot accept
        return $false
    }
    
    return $false
}

# Function to read .gitignore and create ignore patterns
function Get-GitIgnorePatterns {
    $gitIgnoreFile = ".gitignore"
    $ignorePatterns = @()
    
    if (Test-Path $gitIgnoreFile) {
        $gitIgnoreContent = Get-Content -Path $gitIgnoreFile -ErrorAction SilentlyContinue
        foreach ($line in $gitIgnoreContent) {
            # Skip comments and empty lines
            $line = $line.Trim()
            if ($line -and -not $line.StartsWith("#")) {
                # Convert gitignore pattern to regex pattern
                # Remove leading slash if present
                $pattern = $line
                if ($pattern.StartsWith("/")) {
                    $pattern = $pattern.Substring(1)
                }
                # Escape special regex characters except * and ?
                $pattern = $pattern -replace '([\[\](){}^$+])', '\$1'
                # Convert * to .* (but not **)
                $pattern = $pattern -replace '(?<!\*)\*(?!\*)', '.*'
                # Convert ? to .
                $pattern = $pattern -replace '\?', '.'
                # Handle ** (match any number of directories)
                $pattern = $pattern -replace '\*\*', '.*'
                
                # Add anchor if pattern doesn't start with wildcard
                if (-not $pattern.StartsWith(".*") -and -not $pattern.StartsWith(".")) {
                    $pattern = "^" + $pattern
                }
                
                $ignorePatterns += $pattern
            }
        }
    }
    
    # Add common ignore patterns (as fallback)
    $commonPatterns = @(
        "^\.git",
        "^node_modules",
        "^\.next",
        "^dist",
        "^build",
        "^\.cache",
        "^coverage",
        "^\.nyc_output",
        "^tests/reports",
        "^tests/test-results",
        "^tests/playwright-report",
        "\.log$",
        "\.pid$"
    )
    
    foreach ($pattern in $commonPatterns) {
        if ($ignorePatterns -notcontains $pattern) {
            $ignorePatterns += $pattern
        }
    }
    
    return $ignorePatterns
}

# Function to check if file should be ignored based on .gitignore patterns
function Test-ShouldIgnoreFile {
    param(
        [string]$FilePath,
        [string[]]$IgnorePatterns
    )
    
    # Get relative path from repo root
    $repoRoot = (Get-Location).Path
    $relativePath = $FilePath.Replace($repoRoot, "").TrimStart("\").Replace("\", "/")
    
    foreach ($pattern in $IgnorePatterns) {
        if ($relativePath -match $pattern) {
            return $true
        }
    }
    
    return $false
}

# Function to detect if Agent is actively working (checking multiple indicators)
function Test-AgentIsActive {
    param(
        [string]$OutputDir,
        [datetime]$StartTime,
        [datetime]$LastOutputTime
    )
    
    $currentTime = Get-Date
    $isActive = $false
    $activityReasons = @()
    
    # Method 1: Check clipboard changes more frequently (every 2-3 seconds indicates typing)
    try {
        $currentClipboard = Get-Clipboard -ErrorAction SilentlyContinue
        if ($currentClipboard -and $currentClipboard.Length -gt 10) {
            # If clipboard changed recently (within last 5 seconds), Agent might be copying code
            $isActive = $true
            $activityReasons += "Clipboard activity detected"
        }
    } catch {
        # Ignore clipboard errors
    }
    
    # Method 2: Check for very recent file modifications (within last 5 seconds = active generation)
    if ($OutputDir -and (Test-Path $OutputDir)) {
        $veryRecentFiles = Get-ChildItem -Path $OutputDir -Recurse -File -ErrorAction SilentlyContinue | 
            Where-Object { 
                $timeSinceMod = ($currentTime - $_.LastWriteTime).TotalSeconds
                ($_.LastWriteTime -gt $StartTime -or $_.CreationTime -gt $StartTime) -and
                $timeSinceMod -lt 5  # Modified within last 5 seconds = very active
            }
        
        if ($veryRecentFiles -and $veryRecentFiles.Count -gt 0) {
            $isActive = $true
            $activityReasons += "Very recent file modifications ($($veryRecentFiles.Count) files)"
        }
    }
    
    # Method 3: Check for Cursor process CPU usage (if high, Agent is working)
    try {
        $cursorProcess = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($cursorProcess) {
            $cpuUsage = $cursorProcess.CPU
            # If CPU usage is significant, Agent might be processing
            # Note: This is a simple check, CPU might be high for other reasons
            if ($cpuUsage -gt 0) {
                # Additional check: if files are being modified AND CPU is active
                if ($OutputDir -and (Test-Path $OutputDir)) {
                    $recentFiles = Get-ChildItem -Path $OutputDir -Recurse -File -ErrorAction SilentlyContinue | 
                        Where-Object { 
                            $timeSinceMod = ($currentTime - $_.LastWriteTime).TotalSeconds
                            $timeSinceMod -lt 10  # Modified within last 10 seconds
                        }
                    if ($recentFiles -and $recentFiles.Count -gt 0) {
                        $isActive = $true
                        $activityReasons += "Cursor process active with file changes"
                    }
                }
            }
        }
    } catch {
        # Ignore process check errors
    }
    
    # Method 4: Check for log files being actively written (within last 3 seconds)
    $repoRoot = (Get-Location).Path
    $logFilePatterns = @("*.log", "*output*.txt", "*agent*.log", "*cursor*.log")
    foreach ($pattern in $logFilePatterns) {
        $logFiles = Get-ChildItem -Path $repoRoot -Recurse -Filter $pattern -ErrorAction SilentlyContinue | 
            Where-Object { 
                $timeSinceMod = ($currentTime - $_.LastWriteTime).TotalSeconds
                $_.LastWriteTime -gt $StartTime -and
                $timeSinceMod -lt 3  # Modified within last 3 seconds = very active
            } | 
            Select-Object -First 3
        
        if ($logFiles -and $logFiles.Count -gt 0) {
            $isActive = $true
            $activityReasons += "Active log file writes ($($logFiles.Count) files)"
            break
        }
    }
    
    return @{
        IsActive = $isActive
        Reasons = $activityReasons
    }
}

# Function to capture Agent output and detect AI completion
# Logic mới: Capture output của Agent (clipboard, log files, terminal output) thay vì monitor file changes
function Wait-ForAICompletion {
    param(
        [string]$OutputDir,
        [string[]]$ExpectedFiles,
        [int]$MaxWaitMinutes = 15,
        [int]$CheckIntervalSeconds = 10
    )

    $requiredStablePeriods = 10  # 10 lần check liên tiếp không có output mới để đảm bảo AI đã hoàn thành (tổng ~120 giây)
    
    Write-Host "  → Đang capture Agent output để detect khi AI hoàn thành..." -ForegroundColor Cyan
    Write-Host "  → Monitor: Clipboard changes, log files, file system activity, terminal output" -ForegroundColor Gray
    Write-Host "  → Max Wait Time: $MaxWaitMinutes phút" -ForegroundColor Gray
    Write-Host "  → Check Interval: $CheckIntervalSeconds giây" -ForegroundColor Gray
    Write-Host "  → Điều kiện hoàn thành: $requiredStablePeriods lần liên tiếp không có output mới và không có file generation" -ForegroundColor Gray
    Write-Host "  → Auto Accept: Tự động accept/keep changes mỗi $autoAcceptInterval giây (xử lý 'Skip or Accept', 'Keep', và 'Keep All' prompts)" -ForegroundColor Green
    Write-Host "  → File Activity Detection: Monitor file generation trong output directories để biết khi Cursor đang tạo files" -ForegroundColor Green
    Write-Host "  → Lưu ý: Script sẽ capture output từ clipboard, log files, file system activity và terminal để detect khi Agent hoàn thành" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  💡 Keyboard shortcuts đang được monitor:" -ForegroundColor Cyan
    Write-Host "     - Ctrl+Alt+F: Skip step" -ForegroundColor Gray
    Write-Host "     - Ctrl+Alt+U: Go back" -ForegroundColor Gray
    Write-Host "     - Ctrl+Alt+C: Cancel workflow" -ForegroundColor Gray
    Write-Host ""
    
    $startTime = Get-Date
    $lastClipboardContent = ""
    $lastOutputTime = $startTime
    $lastAcceptTime = $startTime
    $stablePeriods = 0
    $capturedOutputs = @()
    $outputLogFile = Join-Path $workflowsDir "agent-output-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
    $autoAcceptInterval = 15  # Auto accept every 15 seconds to handle "Skip or Accept" prompts
    
    # Get initial clipboard content
    try {
        $lastClipboardContent = Get-Clipboard -ErrorAction SilentlyContinue
    } catch {
        $lastClipboardContent = ""
    }
    
    Write-Host "  → Đã khởi tạo output capture. Log file: $outputLogFile" -ForegroundColor DarkGray
    Write-Host ""
    
    # Create output log file
    "=== Agent Output Capture Started at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" | Out-File -FilePath $outputLogFile -Encoding UTF8
    
    while ($true) {
        $currentTime = Get-Date
        $elapsed = $currentTime - $startTime
        $secondsElapsed = [math]::Round($elapsed.TotalSeconds, 0)
        
        # Show status every 30 seconds
        $showStatus = ($secondsElapsed % 30 -eq 0) -or ($secondsElapsed -lt 5)
        
        if ($showStatus) {
            $timeSinceLastOutput = ($currentTime - $lastOutputTime).TotalSeconds
            Write-Host "  → Đang capture output... (Đã đợi: $secondsElapsed s | Lần cuối có output: $([math]::Round($timeSinceLastOutput, 0))s trước | Stable: $stablePeriods/$requiredStablePeriods)" -ForegroundColor DarkGray
            Write-Host "     💡 Keyboard shortcuts: Ctrl+Alt+F (skip), Ctrl+Alt+U (back), Ctrl+Alt+C (cancel)" -ForegroundColor DarkGray
        }
        
        $hasNewOutput = $false
        
        # Method 1: Check clipboard changes
        try {
            $currentClipboard = Get-Clipboard -ErrorAction SilentlyContinue
            if ($currentClipboard -and $currentClipboard -ne $lastClipboardContent -and $currentClipboard.Length -gt 10) {
                # Clipboard changed and has meaningful content (more than 10 chars)
                $hasNewOutput = $true
                $lastOutputTime = $currentTime
                $lastClipboardContent = $currentClipboard
                $capturedOutputs += "Clipboard: $($currentClipboard.Substring(0, [Math]::Min(200, $currentClipboard.Length)))..."
                "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Clipboard changed: $($currentClipboard.Substring(0, [Math]::Min(500, $currentClipboard.Length)))" | Out-File -FilePath $outputLogFile -Append -Encoding UTF8
                Write-Host "  → ✓ Phát hiện clipboard thay đổi (length: $($currentClipboard.Length) chars)" -ForegroundColor Green
            }
        } catch {
            # Silently ignore clipboard errors
        }
        
        # Method 2: Check for log files in common locations
        # IMPORTANT: Exclude script's own log file and workflows directory to avoid infinite loop
        $logFilePatterns = @(
            "*.log",
            "*output*.txt",
            "*agent*.log",
            "*cursor*.log"
        )
        
        $repoRoot = (Get-Location).Path
        $outputLogFileName = Split-Path -Leaf $outputLogFile
        $workflowsDirRelative = $workflowsDir.Replace($repoRoot, "").TrimStart("\").Replace("\", "/")
        
        foreach ($pattern in $logFilePatterns) {
            $logFiles = Get-ChildItem -Path $repoRoot -Recurse -Filter $pattern -ErrorAction SilentlyContinue | 
                Where-Object { 
                    $_.LastWriteTime -gt $startTime -and
                    $_.Length -gt 0 -and
                    # Exclude script's own log file
                    $_.Name -ne $outputLogFileName -and
                    # Exclude all files in workflows directory (orchestrator's own files)
                    -not ($_.FullName.Replace($repoRoot, "").TrimStart("\").Replace("\", "/") -like "$workflowsDirRelative/*")
                } | 
                Sort-Object LastWriteTime -Descending | 
                Select-Object -First 5
            
            foreach ($logFile in $logFiles) {
                $timeSinceModification = ($currentTime - $logFile.LastWriteTime).TotalSeconds
                if ($timeSinceModification -lt 60) {  # Modified within last minute
                    $hasNewOutput = $true
                    $lastOutputTime = $currentTime
                    $relativePath = $logFile.FullName.Replace($repoRoot, "").TrimStart("\")
                    $capturedOutputs += "Log file: $relativePath (modified $([math]::Round($timeSinceModification, 0))s ago)"
                    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Log file updated: $relativePath" | Out-File -FilePath $outputLogFile -Append -Encoding UTF8
                    Write-Host "  → ✓ Phát hiện log file mới/cập nhật: $relativePath" -ForegroundColor Green
                }
            }
        }
        
        # Method 3: Monitor file system activity in output directories
        # This detects when Cursor is actively generating/modifying files
        if ($OutputDir -and (Test-Path $OutputDir)) {
            $recentFiles = Get-ChildItem -Path $OutputDir -Recurse -File -ErrorAction SilentlyContinue | 
                Where-Object { 
                    $_.LastWriteTime -gt $startTime -or $_.CreationTime -gt $startTime
                }
            
            if ($recentFiles) {
                # Check if any files were modified very recently (within last 30 seconds)
                # This indicates active file generation
                $veryRecentFiles = $recentFiles | Where-Object {
                    $timeSinceMod = ($currentTime - $_.LastWriteTime).TotalSeconds
                    $timeSinceMod -lt 30  # Modified within last 30 seconds
                }
                
                if ($veryRecentFiles) {
                    $hasNewOutput = $true
                    $lastOutputTime = $currentTime
                    $fileCount = $veryRecentFiles.Count
                    $latestFile = ($veryRecentFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1)
                    $relativePath = $latestFile.FullName.Replace($repoRoot, "").TrimStart("\")
                    $capturedOutputs += "File activity: $fileCount files being generated/modified (latest: $relativePath)"
                    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Active file generation detected: $fileCount files in $OutputDir" | Out-File -FilePath $outputLogFile -Append -Encoding UTF8
                    Write-Host "  → ✓ Phát hiện Cursor đang generate files: $fileCount files (latest: $relativePath)" -ForegroundColor Green
                } elseif ($recentFiles) {
                    # Files were created/modified but not very recently
                    # Still count as output but with lower priority
                    $hasNewOutput = $true
                    $lastOutputTime = $currentTime
                    $fileCount = $recentFiles.Count
                    $latestFile = ($recentFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1)
                    $timeSinceMod = ($currentTime - $latestFile.LastWriteTime).TotalSeconds
                    $relativePath = $latestFile.FullName.Replace($repoRoot, "").TrimStart("\")
                    $capturedOutputs += "File activity: $fileCount files created/modified (latest: $relativePath, $([math]::Round($timeSinceMod, 0))s ago)"
                    Write-Host "  → ✓ Phát hiện files đã được tạo/sửa: $fileCount files (latest: $relativePath, $([math]::Round($timeSinceMod, 0))s ago)" -ForegroundColor DarkGreen
                }
            }
        }
        
        # Method 4: Check if expected files exist (as fallback)
        if ($ExpectedFiles -and $ExpectedFiles.Count -gt 0) {
            $searchPath = if ($OutputDir -and (Test-Path $OutputDir)) { $OutputDir } else { $repoRoot }
            foreach ($pattern in $ExpectedFiles) {
                $found = Get-ChildItem -Path $searchPath -Recurse -File -ErrorAction SilentlyContinue | 
                    Where-Object { 
                        $_.LastWriteTime -gt $startTime -and
                        ($_.Name -like $pattern -or $_.FullName -like "*$pattern*")
                    } | 
                    Select-Object -First 1
                
                if ($found) {
                    $timeSinceModification = ($currentTime - $found.LastWriteTime).TotalSeconds
                    if ($timeSinceModification -lt 60) {
                        $hasNewOutput = $true
                        $lastOutputTime = $currentTime
                        $relativePath = $found.FullName.Replace($repoRoot, "").TrimStart("\")
                        $capturedOutputs += "Expected file: $relativePath"
                        "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Expected file created/updated: $relativePath" | Out-File -FilePath $outputLogFile -Append -Encoding UTF8
                        Write-Host "  → ✓ Phát hiện expected file: $relativePath" -ForegroundColor Green
                    }
                }
            }
        }
        
        # Check Agent activity first (for auto-accept interval adjustment)
        # Quick check before full activity check
        $isAgentActiveQuick = $false
        if ($OutputDir -and (Test-Path $OutputDir)) {
            $quickRecentFiles = Get-ChildItem -Path $OutputDir -Recurse -File -ErrorAction SilentlyContinue | 
                Where-Object { 
                    $timeSinceMod = ($currentTime - $_.LastWriteTime).TotalSeconds
                    $timeSinceMod -lt 5  # Very recent = active
                }
            $isAgentActiveQuick = ($quickRecentFiles -and $quickRecentFiles.Count -gt 0)
        }
        
        # Auto-accept changes in Cursor periodically to handle "Skip or Accept", "Keep", and "Keep All" prompts
        # Adjust interval based on Agent activity: more frequent when Agent is active
        $acceptInterval = if ($isAgentActiveQuick -or $hasNewOutput) { 5 } else { $autoAcceptInterval }  # 5 seconds when active, 15 seconds when idle
        $timeSinceLastAccept = ($currentTime - $lastAcceptTime).TotalSeconds
        
        if ($timeSinceLastAccept -ge $acceptInterval) {
            # Try to accept changes - try all methods multiple times for better reliability
            $maxAttempts = 3
            $accepted = $false
            
            for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
                # Try in order: regular accept, Keep, Keep All
                $accepted = Accept-CursorChanges
                if (-not $accepted) {
                    $accepted = Accept-CursorChanges -Keep
                }
                if (-not $accepted) {
                    $accepted = Accept-CursorChanges -KeepAll
                }
                
                if ($accepted) {
                    Write-Host "  → ✓ Tự động accept/keep changes trong Cursor (attempt $attempt/$maxAttempts)" -ForegroundColor DarkGray
                    break
                }
                
                # Wait a bit between attempts
                if ($attempt -lt $maxAttempts) {
                    Start-Sleep -Milliseconds 500
                }
            }
            
            $lastAcceptTime = $currentTime
        }
        
        # Also auto-accept when new output is detected (Agent just finished something)
        if ($hasNewOutput) {
            Start-Sleep -Milliseconds 1000  # Wait longer for prompts to appear
            # Try multiple times with all methods
            $maxAttempts = 5  # More attempts when output detected
            $accepted = $false
            
            for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
                # Try in order: regular accept, Keep, Keep All
                $accepted = Accept-CursorChanges
                if (-not $accepted) {
                    $accepted = Accept-CursorChanges -Keep
                }
                if (-not $accepted) {
                    $accepted = Accept-CursorChanges -KeepAll
                }
                
                if ($accepted) {
                    Write-Host "  → ✓ Tự động accept/keep changes sau khi detect output mới (attempt $attempt/$maxAttempts)" -ForegroundColor DarkGray
                    break
                }
                
                # Wait between attempts
                if ($attempt -lt $maxAttempts) {
                    Start-Sleep -Milliseconds 800
                }
            }
            
            $lastAcceptTime = $currentTime
        }
        
        # Check if we have stable periods (no new output)
        # Also verify no active file generation is happening AND Agent is not actively working
        $hasActiveFileGeneration = $false
        if ($OutputDir -and (Test-Path $OutputDir)) {
            $veryRecentFiles = Get-ChildItem -Path $OutputDir -Recurse -File -ErrorAction SilentlyContinue | 
                Where-Object { 
                    $timeSinceMod = ($currentTime - $_.LastWriteTime).TotalSeconds
                    ($_.LastWriteTime -gt $startTime -or $_.CreationTime -gt $startTime) -and
                    $timeSinceMod -lt 30  # Files modified within last 30 seconds = active generation
                }
            $hasActiveFileGeneration = ($veryRecentFiles -and $veryRecentFiles.Count -gt 0)
        }
        
        # Use new function to check if Agent is actively working (more comprehensive check)
        $agentActivity = Test-AgentIsActive -OutputDir $OutputDir -StartTime $startTime -LastOutputTime $lastOutputTime
        $isAgentActive = $agentActivity.IsActive
        
        if ($hasNewOutput -or $hasActiveFileGeneration -or $isAgentActive) {
            $stablePeriods = 0
            if ($hasActiveFileGeneration) {
                Write-Host "  → ⏳ Cursor đang generate files, chờ thêm..." -ForegroundColor DarkYellow
            }
            if ($isAgentActive -and $agentActivity.Reasons.Count -gt 0) {
                $reasons = $agentActivity.Reasons -join ", "
                Write-Host "  → ⏳ Agent đang active: $reasons" -ForegroundColor DarkYellow
            }
        } else {
            $timeSinceLastOutput = ($currentTime - $lastOutputTime).TotalSeconds
            if ($timeSinceLastOutput -gt ($CheckIntervalSeconds * 2)) {
                # No output for at least 2 check intervals AND no active file generation
                $stablePeriods++
                if ($stablePeriods -ge $requiredStablePeriods) {
                    $totalWaitSeconds = (2 + $requiredStablePeriods) * $CheckIntervalSeconds
                    Write-Host ""
                    Write-Host "  ✓ Không có output mới và không có file generation trong $totalWaitSeconds giây ($requiredStablePeriods lần check với interval $CheckIntervalSeconds giây), AI đã hoàn thành!" -ForegroundColor Green
                    if ($capturedOutputs.Count -gt 0) {
                        Write-Host "  → Tổng số output đã capture: $($capturedOutputs.Count)" -ForegroundColor Gray
                        Write-Host "  → Output log file: $outputLogFile" -ForegroundColor Gray
                    }
                    # Final accept attempts before completion (try all options)
                    Accept-CursorChanges | Out-Null
                    Start-Sleep -Milliseconds 200
                    Accept-CursorChanges -Keep | Out-Null
                    Start-Sleep -Milliseconds 200
                    Accept-CursorChanges -KeepAll | Out-Null
                    "=== Agent Output Capture Completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" | Out-File -FilePath $outputLogFile -Append -Encoding UTF8
                    return $true
                }
            }
        }
        
        # Check keyboard shortcuts
        $keyboardCheckInterval = 2
        $remainingWait = $CheckIntervalSeconds
        
        while ($remainingWait -gt 0) {
            $keyboardAction = Test-KeyboardShortcutsWithRetry -MaxRetries 1
            if ($keyboardAction) {
                switch ($keyboardAction) {
                    "Skip" {
                        Write-Host ""
                        Write-Host "  ⚠️  Keyboard shortcut detected: Ctrl+Alt+F (Skip)" -ForegroundColor Yellow
                        $script:skipCurrentStep = $true
                        return $false
                    }
                    "Back" {
                        Write-Host ""
                        Write-Host "  ⚠️  Keyboard shortcut detected: Ctrl+Alt+U (Back)" -ForegroundColor Yellow
                        $script:goBackToPreviousStep = $true
                        return $false
                    }
                    "Cancel" {
                        Write-Host ""
                        Write-Host "  ⚠️  Keyboard shortcut detected: Ctrl+Alt+C (Cancel)" -ForegroundColor Red
                        $script:cancelWorkflow = $true
                        return $false
                    }
                }
            }
            
            $sleepTime = [Math]::Min($keyboardCheckInterval, $remainingWait)
            Start-Sleep -Seconds $sleepTime
            $remainingWait -= $sleepTime
        }
        
        # Check max wait time
        if ($elapsed.TotalMinutes -ge $MaxWaitMinutes) {
            Write-Host ""
            Write-Host "  ⚠️  Đã đợi $MaxWaitMinutes phút, tiếp tục workflow..." -ForegroundColor Yellow
            if ($capturedOutputs.Count -gt 0) {
                Write-Host "  → Tổng số output đã capture: $($capturedOutputs.Count)" -ForegroundColor Gray
                Write-Host "  → Output log file: $outputLogFile" -ForegroundColor Gray
            }
            "=== Agent Output Capture Timeout at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ===" | Out-File -FilePath $outputLogFile -Append -Encoding UTF8
            return $true
        }
    }
    
    return $false
}

function Clear-PlaywrightArtifacts {
    param(
        [string]$TestsRoot
    )

    if (-not (Test-Path $TestsRoot)) {
        return
    }

    $pathsToClear = @(
        "reports",
        "test-results",
        "playwright-report",
        "blob-report"
    )

    foreach ($relativePath in $pathsToClear) {
        $targetPath = Join-Path $TestsRoot $relativePath
        if (Test-Path $targetPath) {
            try {
                Remove-Item -Path $targetPath -Recurse -Force -ErrorAction Stop
                Write-Host "  → Cleared previous Playwright artifacts: $relativePath" -ForegroundColor DarkGray
            } catch {
                Write-Host "  ⚠️  Unable to delete $($relativePath): $_" -ForegroundColor Yellow
            }
        }
    }
}

function Get-PlaywrightTestsFromSuite {
    param(
        $Suite,
        [string[]]$ParentTitles = @()
    )

    $results = @()
    $titleParts = if ([string]::IsNullOrWhiteSpace($Suite.title)) { $ParentTitles } else { $ParentTitles + $Suite.title }

    if ($Suite.specs) {
        foreach ($spec in $Suite.specs) {
            $specTitle = ($titleParts + $spec.title) -join " › "
            if (-not $spec.tests) {
                continue
            }
            foreach ($test in $spec.tests) {
                $errorMessages = @()
                if ($test.results) {
                    foreach ($result in $test.results) {
                        if ($result.error -and $result.error.message) {
                            $errorMessages += $result.error.message
                        }
                        if ($result.errors) {
                            foreach ($err in $result.errors) {
                                if ($err.message) {
                                    $errorMessages += $err.message
                                }
                            }
                        }
                    }
                }

                $results += [pscustomobject]@{
                    Title   = $specTitle
                    Project = $test.projectName
                    Status  = $test.status
                    File    = $spec.file
                    Error   = ($errorMessages -join "`n")
                }
            }
        }
    }

    if ($Suite.suites) {
        foreach ($childSuite in $Suite.suites) {
            $results += Get-PlaywrightTestsFromSuite -Suite $childSuite -ParentTitles $titleParts
        }
    }

    return $results
}

function Test-PlaywrightResults {
    param(
        [string]$TestsRoot,
        [double]$FailureThreshold = 0.3
    )

    $reportPath = Join-Path $TestsRoot "reports/test-results.json"
    if (-not (Test-Path $reportPath)) {
        return [pscustomobject]@{
            HasReport      = $false
            Message        = "test-results.json not found"
            ShouldRollback = $false
        }
    }

    try {
        $json = Get-Content -Path $reportPath -Raw | ConvertFrom-Json
    } catch {
        return [pscustomobject]@{
            HasReport      = $false
            Message        = "Unable to parse test-results.json"
            ShouldRollback = $false
        }
    }

    $tests = @()
    foreach ($suite in $json.suites) {
        $tests += Get-PlaywrightTestsFromSuite -Suite $suite
    }

    if ($tests.Count -eq 0) {
        return [pscustomobject]@{
            HasReport      = $false
            Message        = "No tests found in report"
            ShouldRollback = $false
        }
    }

    $failedTests = $tests | Where-Object { $_.Status -ne 'expected' -and $_.Status -ne 'skipped' }
    $failureRatio = $failedTests.Count / $tests.Count

    return [pscustomobject]@{
        HasReport       = $true
        Total           = $tests.Count
        Failed          = $failedTests.Count
        FailureRatio    = [math]::Round($failureRatio, 2)
        ShouldRollback  = ($failureRatio -ge $FailureThreshold)
        FailedTests     = $failedTests
        ReportPath      = $reportPath
        FailureThreshold = $FailureThreshold
    }
}


foreach ($step in $workflow) {
    # IMPORTANT: Check keyboard shortcuts at the start of each workflow iteration
    # This ensures shortcuts work even when not in Wait-ForAICompletion
    $keyboardAction = Test-KeyboardShortcutsWithRetry -MaxRetries 2
    if ($keyboardAction) {
        switch ($keyboardAction) {
            "Cancel" {
                Write-Host ""
                Write-Host "  ⚠️  Keyboard shortcut detected: Ctrl+Alt+C (Cancel)" -ForegroundColor Red
                $script:cancelWorkflow = $true
            }
            "Skip" {
                Write-Host ""
                Write-Host "  ⚠️  Keyboard shortcut detected: Ctrl+Alt+F (Skip)" -ForegroundColor Yellow
                $script:skipCurrentStep = $true
            }
            "Back" {
                Write-Host ""
                Write-Host "  ⚠️  Keyboard shortcut detected: Ctrl+Alt+U (Back)" -ForegroundColor Yellow
                $script:goBackToPreviousStep = $true
            }
        }
    }
    
    # Check for cancel workflow
    if ($script:cancelWorkflow) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  WORKFLOW CANCELLED BY USER" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        $summaryContent += "`n## Workflow Status`n`n"
        $summaryContent += "**Status**: ⚠️ Cancelled by user (Ctrl+Alt+C)`n"
        $summaryContent += "**Last Step**: Step $script:currentStepNumber`n`n"
        break
    }
    
    # Check for go back to previous step
    if ($script:goBackToPreviousStep) {
        if ($previousStepNumber -gt 0 -and $previousStepNumber -ge $actualStartStep) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Yellow
            Write-Host "  GOING BACK TO PREVIOUS STEP" -ForegroundColor Yellow
            Write-Host "========================================" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "  → Quay lại Step $previousStepNumber" -ForegroundColor Cyan
            Write-Host ""
            
            # Find the previous step in workflow
            $previousStepIndex = -1
            for ($i = 0; $i -lt $workflow.Count; $i++) {
                if ($workflow[$i].Step -eq $previousStepNumber) {
                    $previousStepIndex = $i
                    break
                }
            }
            
            if ($previousStepIndex -ge 0) {
                # Reset workflow to start from previous step
                $workflow = $workflow[$previousStepIndex..($workflow.Count - 1)]
                $script:goBackToPreviousStep = $false
                $script:skipCurrentStep = $false
                continue
            }
        } else {
            Write-Host ""
            Write-Host "  ⚠️  Không thể quay lại step trước đó (đã ở step đầu tiên hoặc ngoài range)" -ForegroundColor Yellow
            Write-Host ""
            $script:goBackToPreviousStep = $false
        }
    }
    
    # Check for skip current step
    if ($script:skipCurrentStep) {
        Write-Host ""
        Write-Host "  ⏭️  Step $stepNum skipped by keyboard shortcut (Ctrl+Alt+F)" -ForegroundColor Yellow
        Write-Host ""
        $summaryContent += "`n### Step $stepNum : $stepName`n`n"
        $summaryContent += "- **Role**: $stepRole`n"
        $summaryContent += "- **Status**: ⏭️ Skipped (keyboard shortcut)`n"
        $summaryContent += "- **Description**: $stepDesc`n"
        $summaryContent += "- **Output**: N/A`n`n"
        $script:skipCurrentStep = $false
        continue
    }
    
    $stepNum = $step.Step
    $stepName = $step.Name
    $stepRole = $step.Role
    $stepDesc = $step.Description
    $script:currentStepNumber = $stepNum
    
    # Skip steps before starting step
    if ($stepNum -lt $actualStartStep) {
        Write-Host "[Step $stepNum] $stepName" -ForegroundColor DarkGray
        Write-Host "  ⏭️  SKIPPED (before start step $actualStartStep)" -ForegroundColor DarkGray
        Write-Host ""
        
        $summaryContent += "`n### Step $stepNum : $stepName`n`n"
        $summaryContent += "- **Role**: $stepRole`n"
        $summaryContent += "- **Status**: ⏭️ Skipped (before start step)`n"
        $summaryContent += "- **Description**: $stepDesc`n"
        $summaryContent += "- **Output**: N/A`n`n"
        continue
    }
    
    # Skip steps after ending step
    if ($stepNum -gt $actualEndStep) {
        Write-Host "[Step $stepNum] $stepName" -ForegroundColor DarkGray
        Write-Host "  ⏭️  SKIPPED (after end step $actualEndStep)" -ForegroundColor DarkGray
        Write-Host ""
        
        $summaryContent += "`n### Step $stepNum : $stepName`n`n"
        $summaryContent += "- **Role**: $stepRole`n"
        $summaryContent += "- **Status**: ⏭️ Skipped (after end step)`n"
        $summaryContent += "- **Description**: $stepDesc`n"
        $summaryContent += "- **Output**: N/A`n`n"
        continue
    }
    
    # Check if this step should be skipped manually
    if ($SkipStepNumbers -contains $stepNum.ToString()) {
        Write-Host "[Step $stepNum] $stepName" -ForegroundColor DarkGray
        Write-Host "  ⏭️  SKIPPED (manual)" -ForegroundColor DarkGray
        Write-Host ""
        
        $summaryContent += "`n### Step $stepNum : $stepName`n`n"
        $summaryContent += "- **Role**: $stepRole`n"
        $summaryContent += "- **Status**: ⏭️ Skipped (manual)`n"
        $summaryContent += "- **Description**: $stepDesc`n"
        $summaryContent += "- **Output**: N/A`n`n"
        continue
    }
    
    # Check if step can be skipped automatically
    $shouldSkip = $false
    $skipReason = ""
    if ($step.CanSkip -and $step.SkipCheckFunction) {
        # Skip check functions if FeatureName is empty (test-only mode)
        if ([string]::IsNullOrWhiteSpace($FeatureName) -or $TestOnly) {
            Write-Host "[Step $stepNum] $stepName" -ForegroundColor Yellow
            Write-Host "  → Skip check functions không áp dụng trong test-only mode" -ForegroundColor Gray
            Write-Host ""
        } else {
            Write-Host "[Step $stepNum] $stepName" -ForegroundColor Yellow
            Write-Host "  → Đang kiểm tra xem có thể skip step này không..." -ForegroundColor Cyan
            
            switch ($step.SkipCheckFunction) {
                "Check-IfFeatureExistsInEpic" {
                    $shouldSkip = Check-IfFeatureExistsInEpic -FeatureName $FeatureName
                    if ($shouldSkip) {
                        $skipReason = "Feature đã có trong epic với status 'In Progress'"
                    }
                }
                "Check-IfBusinessAnalystComplete" {
                    $shouldSkip = Check-IfBusinessAnalystComplete -FeatureName $FeatureName
                    if ($shouldSkip) {
                        $skipReason = "Business Analyst documentation đã đầy đủ"
                    }
                }
                "Check-IfDatabaseComplete" {
                    $shouldSkip = Check-IfDatabaseComplete -FeatureName $FeatureName
                    if ($shouldSkip) {
                        $skipReason = "Database schema đã được thiết kế đầy đủ"
                    }
                }
            }
        }
        
        if ($shouldSkip) {
            Write-Host "  ⏭️  SKIPPED: $skipReason" -ForegroundColor Green
            Write-Host ""
            
            $summaryContent += "`n### Step $stepNum : $stepName`n`n"
            $summaryContent += "- **Role**: $stepRole`n"
            $summaryContent += "- **Status**: ⏭️ Skipped (auto)`n"
            $summaryContent += "- **Reason**: $skipReason`n"
            $summaryContent += "- **Description**: $stepDesc`n"
            $summaryContent += "- **Output**: N/A`n`n"
            continue
        } else {
            Write-Host "  → Không thể skip, tiếp tục thực hiện step..." -ForegroundColor Yellow
            Write-Host ""
        }
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  [LOG] Bắt đầu Step ${stepNum}: $stepName" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "[Step $stepNum] $stepName" -ForegroundColor Yellow
    Write-Host "  Description: $stepDesc" -ForegroundColor Gray
    Write-Host "  Switching to role: $stepRole" -ForegroundColor Gray
    Write-Host "  💡 Keyboard shortcuts available: Ctrl+Alt+F (skip), Ctrl+Alt+U (back), Ctrl+Alt+C (cancel)" -ForegroundColor DarkGray
    Write-Host ""
    
    # Switch role
    try {
        $switchRoleScript = Join-Path $scriptDir "switch-role.ps1"
        & $switchRoleScript $stepRole | Out-Null
        Write-Host "  ✓ Role switched successfully" -ForegroundColor Green

        if ($stepRole -eq "automation-tester") {
            $testsRootPath = Join-Path $projectRoot "tests"
            Write-Host "  → Preparing clean Playwright workspace..." -ForegroundColor Cyan
            Clear-PlaywrightArtifacts -TestsRoot $testsRootPath
        }
        
        # Create self-healing output directory if not exists
        if ($stepRole -eq "self-healing") {
            $selfHealingDir = Join-Path $scriptDir "self-healing"
            if (-not (Test-Path $selfHealingDir)) {
                New-Item -ItemType Directory -Path $selfHealingDir -Force | Out-Null
                Write-Host "  → Created self-healing output directory: $selfHealingDir" -ForegroundColor Green
            }
        }
        
        # Check keyboard shortcuts after role switch
        $keyboardAction = Test-KeyboardShortcutsWithRetry -MaxRetries 2
        if ($keyboardAction) {
            switch ($keyboardAction) {
                "Cancel" {
                    Write-Host ""
                    Write-Host "  ⚠️  Keyboard shortcut detected: Ctrl+Alt+C (Cancel)" -ForegroundColor Red
                    $script:cancelWorkflow = $true
                    break
                }
                "Skip" {
                    Write-Host ""
                    Write-Host "  ⚠️  Keyboard shortcut detected: Ctrl+Alt+F (Skip)" -ForegroundColor Yellow
                    $script:skipCurrentStep = $true
                    break
                }
                "Back" {
                    Write-Host ""
                    Write-Host "  ⚠️  Keyboard shortcut detected: Ctrl+Alt+U (Back)" -ForegroundColor Yellow
                    $script:goBackToPreviousStep = $true
                    break
                }
            }
        }
        
        # Check if workflow was cancelled or step should be skipped
        if ($script:cancelWorkflow -or $script:skipCurrentStep -or $script:goBackToPreviousStep) {
            continue
        }
    }
    catch {
        Write-Host "  ✗ Error switching role: $_" -ForegroundColor Red
        $errorMsg = $_.ToString()
        $summaryContent += "`n### Step $stepNum : $stepName`n`n"
        $summaryContent += "- **Role**: $stepRole`n"
        $summaryContent += "- **Status**: ❌ Error`n"
        $summaryContent += "- **Error**: $errorMsg`n`n"
        continue
    }
    
    # Add to summary
    $stepStartTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $summaryContent += "`n### Step $stepNum : $stepName`n`n"
    $summaryContent += "- **Role**: $stepRole`n"
    $summaryContent += "- **Status**: ⏳ In Progress`n"
    $summaryContent += "- **Description**: $stepDesc`n"
    $summaryContent += "- **Output Directory**: $($step.OutputDir)`n"
    $summaryContent += "- **Expected Output Files**: $($step.OutputFiles -join ', ')`n"
    $summaryContent += "- **Started**: $stepStartTime`n"
    $summaryContent += "- **Completed**: TBD`n"
    $summaryContent += "- **Notes**: `n`n"
    
    # Generate prompt for AI
    if ($TestOnly -or [string]::IsNullOrWhiteSpace($FeatureName)) {
        if ($stepRole -eq "automation-tester") {
            $promptText = "Với vai trò $stepRole, hãy chạy tất cả tests cho toàn bộ platform và tạo test reports. Kiểm tra tất cả các features đã được implement."
        } else {
            $promptText = "Với vai trò $stepRole, hãy thực hiện: $stepDesc"
        }
    } else {
        $promptText = "Với vai trò $stepRole, hãy thực hiện: $stepDesc cho tính năng $FeatureName"
    }
    
    # IMPORTANT: Add instruction to complete ALL todos, not just one task
    $promptText += "`n`n**QUAN TRỌNG:**"
    $promptText += "`n- Nếu bạn tạo todo list, hãy thực hiện TẤT CẢ các tasks trong todo list đó, không chỉ dừng lại sau 1 task."
    $promptText += "`n- Tiếp tục thực hiện từng task một cho đến khi hoàn thành TẤT CẢ todos trong step này."
    $promptText += "`n- Chỉ chuyển sang step tiếp theo khi đã hoàn thành TẤT CẢ công việc trong step hiện tại."
    $promptText += "`n- Nếu có nhiều files cần tạo/sửa, hãy tạo/sửa TẤT CẢ, không chỉ 1 file rồi dừng lại."
    
    # Pass bug report to self-healing (preferred) or backend-developer (fallback)
    if ($script:pendingBugReport) {
        $failurePercent = "{0:P0}" -f $script:pendingBugReport.FailureRatio
        $thresholdPercent = "{0:P0}" -f $script:bugFailureThreshold
        
        if ($stepRole -eq "self-healing") {
            $promptText += "`n`n**BUG REPORT TỪ AUTOMATION TESTER:**"
            $promptText += "`nCác bài kiểm thử tự động gần nhất thất bại $failurePercent (ngưỡng $thresholdPercent)."
            $promptText += "`n`n**NHIỆM VỤ CỦA BẠN:**"
            $promptText += "`n1. Đọc và phân tích test results từ tests/reports/test-results.json"
            $promptText += "`n2. Đọc HTML report từ tests/reports/html-report/index.html (nếu cần)"
            $promptText += "`n3. Hiểu context: Đọc architecture document, business rules, use cases"
            $promptText += "`n4. Phân tích từng failed test để xác định root cause"
            $promptText += "`n5. Tạo bug fix plan (to-dos list) với priority"
            $promptText += "`n6. Tự động fix bugs (cả đơn giản và phức tạp)"
            $promptText += "`n7. Verify fixes bằng cách chạy lại tests"
            $promptText += "`n8. Chỉ chuyển giao bugs cho backend-developer nếu không thể tự fix"
            $promptText += "`n`n**FAILED TESTS:**"
            $failedSamples = $script:pendingBugReport.FailedTests | Select-Object -First 15
            foreach ($failed in $failedSamples) {
                $errorSnippet = if ([string]::IsNullOrWhiteSpace($failed.Error)) { "Xem chi tiết trong reports/test-results.json" } else { ($failed.Error -split "`n")[0] }
                $promptText += "`n- [$($failed.Project)] $($failed.Title)`n  File: $($failed.File)`n  Error: $errorSnippet"
            }
            $promptText += "`n`n**REPORT PATHS:**"
            $promptText += "`n- JSON Report: tests/reports/test-results.json"
            $promptText += "`n- HTML Report: tests/reports/html-report/index.html"
            $promptText += "`n`n**LƯU Ý:**"
            $promptText += "`n- Tự động fix tối đa bugs có thể trước khi chuyển giao"
            $promptText += "`n- Đọc business rules và use cases để đảm bảo fix đúng requirements"
            $promptText += "`n- Verify mỗi fix bằng cách chạy lại test tương ứng"
        } elseif ($stepRole -eq "backend-developer") {
            # Fallback: Only pass to backend-developer if self-healing couldn't fix
            $promptText += "`n`n**BUG REPORT (từ Self-Healing - không thể tự fix):**"
            $promptText += "`nCác bài kiểm thử tự động gần nhất thất bại $failurePercent (ngưỡng $thresholdPercent)."
            $promptText += "`nSelf-healing đã cố gắng fix nhưng không thể tự xử lý. Vui lòng xử lý các bug sau:"
            $failedSamples = $script:pendingBugReport.FailedTests | Select-Object -First 8
            foreach ($failed in $failedSamples) {
                $errorSnippet = if ([string]::IsNullOrWhiteSpace($failed.Error)) { "Xem chi tiết trong reports/test-results.json" } else { ($failed.Error -split "`n")[0] }
                $promptText += "`n- [$($failed.Project)] $($failed.Title)`n  Lỗi: $errorSnippet"
            }
            $promptText += "`n`nPaths tham chiếu report: tests/reports/test-results.json, tests/reports/html-report/index.html"
        }
    }

    # Create prompt file for easy access
    $promptFileName = if ([string]::IsNullOrWhiteSpace($FeatureName)) { "platform-tests" } else { $FeatureName }
    $promptFile = "$workflowsDir/$promptFileName-step$stepNum-prompt.txt"
    $promptText | Out-File -FilePath $promptFile -Encoding UTF8 -NoNewline
    
    Write-Host ""
    Write-Host "  ========================================" -ForegroundColor Cyan
    Write-Host "  PROMPT CHO CURSOR AI:" -ForegroundColor Cyan
    Write-Host "  ========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  $promptText" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  ========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Auto-send prompt to Cursor AI with new agent tab
    if ($IsWindows -or $env:OS -like "*Windows*") {
        Write-Host "  → Đang tự động mở agent tab mới và gửi prompt..." -ForegroundColor Cyan
        Write-Host "  → Vui lòng đảm bảo Cursor AI đang mở" -ForegroundColor Yellow
        Write-Host "  → Script sẽ đợi 3 giây để bạn chuẩn bị..." -ForegroundColor Yellow
        Write-Host ""
        
        $countdown = 3
        while ($countdown -gt 0) {
            # Check keyboard shortcuts during countdown
            $keyboardAction = Test-KeyboardShortcuts
            if ($keyboardAction) {
                switch ($keyboardAction) {
                    "Cancel" {
                        Write-Host ""
                        Write-Host "  ⚠️  Workflow cancelled by user (Ctrl+Alt+C)" -ForegroundColor Red
                        $script:cancelWorkflow = $true
                        break
                    }
                    "Skip" {
                        Write-Host ""
                        Write-Host "  ⏭️  Step skipped by user (Ctrl+Alt+F)" -ForegroundColor Yellow
                        $script:skipCurrentStep = $true
                        break
                    }
                }
                if ($script:cancelWorkflow -or $script:skipCurrentStep) {
                    break
                }
            }
            
            Write-Host "  → Bắt đầu sau $countdown giây... (Ctrl+Alt+C: cancel, Ctrl+Alt+F: skip)" -ForegroundColor DarkGray
            Start-Sleep -Seconds 1
            $countdown--
        }
        
        # Check again after countdown
        if ($script:cancelWorkflow) {
            break
        }
        if ($script:skipCurrentStep) {
            continue
        }
        
        try {
            # Step 1: Open new agent tab first (to avoid full context)
            Write-Host ""
            Write-Host "  [LOG] Bắt đầu quy trình tự động cho Step $stepNum..." -ForegroundColor Cyan
            Write-Host "  [Bước 1/3] Mở agent tab mới..." -ForegroundColor Cyan
            $tabOpened = Open-NewAgentTab
            if (-not $tabOpened) {
                Write-Host "  ⚠️  Không thể mở agent tab tự động, tiếp tục với clipboard..." -ForegroundColor Yellow
                $promptText | Set-Clipboard
                Write-Host "  ✓ Prompt đã được copy vào clipboard (Ctrl+V để paste)" -ForegroundColor Green
            } else {
                # Step 2: Send prompt to the new tab
                Write-Host ""
                Write-Host "  [Bước 2/3] Gửi prompt đến agent tab mới..." -ForegroundColor Cyan
                Send-TextToCursor -Text $promptText
                Write-Host ""
                Write-Host "  → Prompt đã được gửi tự động!" -ForegroundColor Green
                Write-Host "  → Prompt file: $promptFile" -ForegroundColor Gray
            }
            
            Write-Host ""
            Write-Host "  [Bước 3/3] Đang capture Agent output để detect khi AI hoàn thành..." -ForegroundColor Cyan
            Write-Host ""
            
            # Step 3: Monitor file changes and auto-detect completion
            $outputDir = $step.OutputDir
            $expectedFiles = $step.OutputFiles
            
            # If outputDir is empty, try to infer from role
            if ([string]::IsNullOrWhiteSpace($outputDir)) {
                switch ($stepRole) {
                    "frontend-developer" {
                        $outputDir = "apps/admin-panel"
                    }
                    "backend-developer" {
                        $outputDir = "services"
                    }
                    default {
                        $outputDir = "docs"
                    }
                }
            }
            
            $completionDetected = Wait-ForAICompletion -OutputDir $outputDir -ExpectedFiles $expectedFiles -MaxWaitMinutes 15 -CheckIntervalSeconds 10
            
            # Check for keyboard shortcuts after waiting
            if ($script:cancelWorkflow) {
                Write-Host ""
                Write-Host "  ⚠️  Workflow cancelled by user (Ctrl+Alt+C)" -ForegroundColor Red
                break
            }
            
            if ($script:skipCurrentStep) {
                Write-Host ""
                Write-Host "  ⏭️  Step $stepNum skipped by keyboard shortcut (Ctrl+Alt+F)" -ForegroundColor Yellow
                $summaryContent = $summaryContent -replace "Status: ⏳ In Progress", "Status: ⏭️ Skipped (keyboard shortcut)"
                continue
            }
            
            if ($script:goBackToPreviousStep) {
                Write-Host ""
                Write-Host "  ← Going back to previous step (Ctrl+Alt+U)" -ForegroundColor Yellow
                # Will be handled at the start of next loop iteration
                continue
            }
            
            if ($completionDetected) {
                Write-Host ""
                Write-Host "  ✓ AI đã hoàn thành! Tự động chuyển sang step tiếp theo..." -ForegroundColor Green
                Write-Host "  → Đang chuẩn bị chuyển sang step tiếp theo trong workflow..." -ForegroundColor Cyan
                Write-Host ""
            } else {
                Write-Host ""
                Write-Host "  ⚠️  Không detect được completion tự động, nhưng vẫn tiếp tục..." -ForegroundColor Yellow
                Write-Host "  → Script sẽ tự động chuyển sang step tiếp theo sau 2 giây..." -ForegroundColor Yellow
                Write-Host "  → Bạn có thể nhấn Ctrl+Alt+C để cancel, Ctrl+Alt+F để skip, Ctrl+Alt+U để quay lại" -ForegroundColor Yellow
                Write-Host ""
                Start-Sleep -Seconds 2
            }
            
        } catch {
            Write-Host "  ⚠️  Lỗi khi gửi prompt tự động: $_" -ForegroundColor Yellow
            Write-Host "  → Đang copy prompt vào clipboard thay thế..." -ForegroundColor Yellow
            $promptText | Set-Clipboard
            Write-Host "  ✓ Prompt đã được copy vào clipboard (Ctrl+V để paste)" -ForegroundColor Green
            Write-Host "  → Vui lòng paste vào Cursor AI thủ công" -ForegroundColor Yellow
            Write-Host ""
            
            # Fallback: Ask user for manual confirmation
            Write-Host "  → Nhấn Enter sau khi AI đã hoàn thành" -ForegroundColor Yellow
            Write-Host "  → Hoặc gõ 'skip' để bỏ qua, 'exit' để dừng" -ForegroundColor Yellow
            Write-Host ""
            $response = Read-Host "  Nhập lệnh (Enter/skip/exit)"
            
            if ($response -eq "skip" -or $response -eq "s") {
                Write-Host "  ⏭️  Step skipped by user" -ForegroundColor DarkGray
                $summaryContent = $summaryContent -replace "Status: ⏳ In Progress", "Status: ⏭️ Skipped"
                continue
            }
            
            if ($response -eq "exit" -or $response -eq "e") {
                Write-Host ""
                Write-Host "  ⚠️  Workflow stopped by user" -ForegroundColor Yellow
                $summaryContent += "`n## Workflow Status`n`n"
                $summaryContent += "**Status**: ⚠️ Stopped by user`n"
                $summaryContent += "**Last Step Completed**: Step $($stepNum - 1)`n`n"
                break
            }
        }
    } else {
        # For non-Windows, just copy to clipboard
        $promptText | Set-Clipboard
        Write-Host "  → Prompt đã được copy vào clipboard (Ctrl+V để paste)" -ForegroundColor Green
        Write-Host ""
        Write-Host "  → Nhấn Enter sau khi AI đã hoàn thành" -ForegroundColor Yellow
        $response = Read-Host "  Nhập lệnh (Enter/skip/exit)"
        
        if ($response -eq "skip" -or $response -eq "s") {
            Write-Host "  ⏭️  Step skipped by user" -ForegroundColor DarkGray
            $summaryContent = $summaryContent -replace "Status: ⏳ In Progress", "Status: ⏭️ Skipped"
            continue
        }
        
        if ($response -eq "exit" -or $response -eq "e") {
            Write-Host ""
            Write-Host "  ⚠️  Workflow stopped by user" -ForegroundColor Yellow
            $summaryContent += "`n## Workflow Status`n`n"
            $summaryContent += "**Status**: ⚠️ Stopped by user`n"
            $summaryContent += "**Last Step Completed**: Step $($stepNum - 1)`n`n"
            break
        }
    }
    
    # Add prompt to summary
    $summaryContent = $summaryContent -replace "- \*\*Notes\*\*: `n`n", "- **Notes**: `n- **Prompt Used**: ``$promptText```n`n"
    
    $stepStatusLabel = "✅ Completed"
    $markStepAsComplete = $true

    if ($stepRole -eq "automation-tester") {
        $testsRootPath = Join-Path $projectRoot "tests"
        $analysis = Test-PlaywrightResults -TestsRoot $testsRootPath -FailureThreshold $script:bugFailureThreshold
        if ($analysis.HasReport) {
            $failurePercent = "{0:P0}" -f $analysis.FailureRatio
            $summaryContent += "- **Test Summary**: $($analysis.Failed)/$($analysis.Total) failed ($failurePercent).`n"
            if ($analysis.ShouldRollback) {
                $stepStatusLabel = "⚠️ Failed - $($analysis.Failed)/$($analysis.Total) tests"
                $markStepAsComplete = $true  # Mark as complete to proceed to self-healing
                $script:pendingBugReport = $analysis
                # Don't rollback, proceed to self-healing (Step 8) instead
                # Self-healing will try to fix bugs automatically

                Write-Host "  ⚠️  Detected $($analysis.Failed)/$($analysis.Total) failing tests ($failurePercent > threshold)." -ForegroundColor Yellow
                Write-Host "      Proceeding to Step 8 (Self-Healing) to automatically fix bugs." -ForegroundColor Yellow
                Write-Host "      Self-healing will analyze test results and fix bugs automatically." -ForegroundColor Cyan

                if ($analysis.FailedTests.Count -gt 0) {
                    $summaryContent += "- **Failed Cases (sample)**:`n"
                    $analysis.FailedTests | Select-Object -First 5 | ForEach-Object {
                        $summaryContent += "  - [$($_.Project)] $($_.Title)`n"
                    }
                }

                $summaryContent += "- **Report**: $($analysis.ReportPath)`n"
                $summaryContent += "- **Action**: Proceeding to Self-Healing (Step 8) to fix bugs automatically.`n"
            }
        } else {
            $summaryContent += "- **Test Summary**: Không tìm thấy tests/reports/test-results.json để phân tích.`n"
            Write-Host "  ⚠️  Không tìm thấy tests/reports/test-results.json để phân tích kết quả." -ForegroundColor Yellow
        }
    }
    
    # Handle self-healing step - receive bug report from automation-tester
    if ($stepRole -eq "self-healing" -and $script:pendingBugReport) {
        $failurePercent = "{0:P0}" -f $script:pendingBugReport.FailureRatio
        $summaryContent += "- **Bug Report Received**: $($script:pendingBugReport.Failed)/$($script:pendingBugReport.Total) tests failed ($failurePercent).`n"
        $summaryContent += "- **Report Path**: $($script:pendingBugReport.ReportPath)`n"
        
        if ($script:pendingBugReport.FailedTests.Count -gt 0) {
            $summaryContent += "- **Failed Tests (sample)**:`n"
            $script:pendingBugReport.FailedTests | Select-Object -First 10 | ForEach-Object {
                $errorSnippet = if ([string]::IsNullOrWhiteSpace($_.Error)) { "No error message" } else { ($_.Error -split "`n")[0] }
                $summaryContent += "  - [$($_.Project)] $($_.Title)`n    Error: $errorSnippet`n"
            }
        }
    }

    # Mark as completed
    $completedTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $summaryContent = $summaryContent -replace "Status: ⏳ In Progress", "Status: $stepStatusLabel"
    $summaryContent = $summaryContent -replace "Completed: TBD", "Completed: $completedTime"
    
    if ($markStepAsComplete) {
        $completedSteps += $stepNum
        $previousStepNumber = $stepNum

        # Clear pending bug report after self-healing or backend-developer fixes bugs
        if (($stepRole -eq "self-healing" -or $stepRole -eq "backend-developer") -and $script:pendingBugReport) {
            # After self-healing completes, verify if bugs are fixed by checking test results again
            if ($stepRole -eq "self-healing") {
                $testsRootPath = Join-Path $projectRoot "tests"
                $recheckAnalysis = Test-PlaywrightResults -TestsRoot $testsRootPath -FailureThreshold $script:bugFailureThreshold
                if ($recheckAnalysis.HasReport -and -not $recheckAnalysis.ShouldRollback) {
                    Write-Host "  ✓ Self-healing đã fix thành công! Tất cả tests đã pass." -ForegroundColor Green
                    $summaryContent += "- **Self-Healing Result**: ✅ All bugs fixed successfully!`n"
                    $script:pendingBugReport = $null
                } elseif ($recheckAnalysis.HasReport -and $recheckAnalysis.ShouldRollback) {
                    Write-Host "  ⚠️  Self-healing chưa fix được tất cả bugs. Một số bugs vẫn còn." -ForegroundColor Yellow
                    Write-Host "      Bugs sẽ được chuyển cho backend-developer nếu cần." -ForegroundColor Yellow
                    $summaryContent += "- **Self-Healing Result**: ⚠️ Some bugs still remain. May need backend-developer intervention.`n"
                    # Keep pendingBugReport for potential backend-developer intervention
                } else {
                    Write-Host "  ⚠️  Không thể verify fixes (không tìm thấy test results)." -ForegroundColor Yellow
                    $summaryContent += "- **Self-Healing Result**: ⚠️ Unable to verify fixes (test results not found).`n"
                    $script:pendingBugReport = $null
                }
            } else {
                # Backend-developer fixed bugs
                $script:pendingBugReport = $null
            }
        }

        Write-Host "  ✓ Step $stepNum completed" -ForegroundColor Green
        Write-Host ""
        
        # Log: Preparing to move to next step
        Write-Host "  → [LOG] Step $stepNum đã hoàn thành, đang chuẩn bị chuyển sang step tiếp theo..." -ForegroundColor Cyan
        
        # Find next step in workflow
        $nextStep = $workflow | Where-Object { $_.Step -gt $stepNum -and $_.Step -le $actualEndStep } | Select-Object -First 1
        if ($nextStep) {
            Write-Host "  → [LOG] Step tiếp theo: Step $($nextStep.Step) - $($nextStep.Name)" -ForegroundColor Cyan
            Write-Host "  → [LOG] Role tiếp theo: $($nextStep.Role)" -ForegroundColor Cyan
            Write-Host "  → [LOG] Đang tiếp tục workflow tự động..." -ForegroundColor Cyan
        } else {
            Write-Host "  → [LOG] Đã đến step cuối cùng trong workflow range (Step $actualEndStep)" -ForegroundColor Cyan
            Write-Host "  → [LOG] Workflow sẽ kết thúc sau khi hoàn thành step này" -ForegroundColor Cyan
        }
        Write-Host ""
    } else {
        $summaryContent += "- **Action**: Rollback về Step 5 (Backend Developer) để fix bugs.`n`n"
        Write-Host ""
        Write-Host "  ⚠️  Step $stepNum chưa đạt yêu cầu. Quay lại Step 5 để xử lý bugs trước khi chạy test lại." -ForegroundColor Yellow
        Write-Host ""
        continue
    }
    
    # Rollback check removed - script will automatically continue to next step
} # End of foreach ($step in $workflow)

# Finalize summary
$endTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$summaryContent += "`n---`n`n"
$summaryContent += "## Completion Summary`n`n"
if (-not [string]::IsNullOrWhiteSpace($FeatureName)) {
    $summaryContent += "**Feature**: $FeatureName`n"
}
if ($TestOnly) {
    $summaryContent += "**Mode**: Test-Only (Platform Tests)`n"
}
$summaryContent += "**Started**: $startTime`n"
$summaryContent += "**Completed**: $endTime`n"
$summaryContent += "**Total Steps in Workflow**: $($workflow.Count)`n"
$summaryContent += "**Steps in Range**: Step $actualStartStep → Step $actualEndStep ($($actualEndStep - $actualStartStep + 1) steps)`n"
$summaryContent += "**Completed Steps**: $($completedSteps.Count)`n"
$summaryContent += "**Skipped Steps**: $($workflow.Count - $completedSteps.Count)`n`n"

$summaryContent += "### Completed Steps`n"
foreach ($stepNum in $completedSteps) {
    $stepIndex = $stepNum - 1
    if ($stepIndex -ge 0 -and $stepIndex -lt $workflow.Count) {
        $summaryContent += "- Step $stepNum : $($workflow[$stepIndex].Name)`n"
    }
}
$summaryContent += "`n"

$summaryContent += "### Deliverables`n"
$summaryContent += "- [ ] Product Owner: Epic/Feature documentation`n"
$summaryContent += "- [ ] Business Analyst: Use cases and business rules`n"
$summaryContent += "- [ ] Database Engineer: Schema and migrations`n"
$summaryContent += "- [ ] Frontend Developer: Frontend code, mock data services, API contracts`n"
$summaryContent += "- [ ] Backend Developer: Backend APIs and external service integration`n"
$summaryContent += "- [ ] Automation Tester: E2E tests and reports`n"
$summaryContent += "- [ ] Self-Healing: Bug analysis, bug fix plan, and fixed bugs report`n"
$summaryContent += "- [ ] Security Tester: Security audit report`n"
$summaryContent += "- [ ] DevOps: Deployment documentation`n`n"

$summaryContent += "### Next Steps`n"
$summaryContent += "1. Review all deliverables`n"
$summaryContent += "2. Update traceability matrix`n"
$summaryContent += "3. Update service mapping if needed`n"
$summaryContent += "4. Update database mapping if needed`n"
$summaryContent += "5. Deploy to local dev environment`n"
$summaryContent += "6. Conduct user acceptance testing`n`n"

$summaryContent += "---`n`n"
$summaryContent += "**Generated by**: Orchestrator Agent`n"
$summaryContent += "**Workflow Script**: orchestrate-feature_v2.ps1`n`n"

# Save summary
$summaryContent | Out-File -FilePath $summaryFile -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Workflow Summary Saved" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "File: $summaryFile" -ForegroundColor Gray
Write-Host ""
$stepsInRange = $actualEndStep - $actualStartStep + 1
Write-Host "Completed Steps: $($completedSteps.Count)/$stepsInRange (in range Step $actualStartStep → Step $actualEndStep)" -ForegroundColor $(if ($completedSteps.Count -eq $stepsInRange) { "Green" } else { "Yellow" })
if ($actualEndStep -lt $workflow.Count) {
    Write-Host "Note: Workflow ended at Step $actualEndStep (total workflow has $($workflow.Count) steps)" -ForegroundColor Gray
}
Write-Host ""

# Open summary file if on Windows
if ($IsWindows -or $env:OS -like "*Windows*") {
    $openFile = Read-Host "Open workflow summary file? (y/n)"
    if ($openFile -eq "y" -or $openFile -eq "Y") {
        Start-Process notepad.exe $summaryFile
    }
}

Write-Host ""
Write-Host "To continue workflow, run:" -ForegroundColor Cyan
if ($TestOnly) {
    Write-Host "  .\orchestrate-feature.ps1 -TestOnly" -ForegroundColor Gray
} else {
    Write-Host "  .\orchestrate-feature.ps1 -FeatureName '$FeatureName' -Description '$Description'" -ForegroundColor Gray
}
Write-Host ""
Write-Host "To run tests only:" -ForegroundColor Cyan
Write-Host "  .\orchestrate-feature.ps1 -TestOnly" -ForegroundColor Gray
Write-Host "  .\orchestrate-feature.ps1 -StartFromRole automation-tester -EndAtRole automation-tester" -ForegroundColor Gray
Write-Host ""

