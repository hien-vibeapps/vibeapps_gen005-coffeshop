# Script to switch between different Cursor AI agent roles - Generated Application
# Usage: .\docs_generated\switch-role.ps1 [role-name]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('product-owner', 'business-analyst', 'database-engineer', 'frontend-developer', 'backend-developer', 'automation-tester', 'security-tester', 'devops', 'orchestrator', 'list')]
    [string]$Role
)

# Get script directory and project root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# Project root is parent of docs_generated directory
$projectRoot = Split-Path -Parent $scriptDir

# Define role files relative to script directory
$roles = @{
    'product-owner' = Join-Path $scriptDir '.cursorrules.product-owner'
    'business-analyst' = Join-Path $scriptDir '.cursorrules.business-analyst'
    'database-engineer' = Join-Path $scriptDir '.cursorrules.database-engineer'
    'frontend-developer' = Join-Path $scriptDir '.cursorrules.frontend-developer'
    'backend-developer' = Join-Path $scriptDir '.cursorrules.backend-developer'
    'automation-tester' = Join-Path $scriptDir '.cursorrules.automation-tester'
    'security-tester' = Join-Path $scriptDir '.cursorrules.security-tester'
    'devops' = Join-Path $scriptDir '.cursorrules.devops'
    'orchestrator' = Join-Path $scriptDir '.cursorrules.orchestrator'
}

$currentRulesFile = Join-Path $projectRoot '.cursorrules'

# List all available roles
if ($Role -eq 'list') {
    Write-Host "`n=== Available Cursor AI Agent Roles - Generated Application ===" -ForegroundColor Cyan
    Write-Host ""
    foreach ($roleName in $roles.Keys) {
        $roleFile = $roles[$roleName]
        if (Test-Path $roleFile) {
            Write-Host "  [OK] $roleName" -ForegroundColor Green
        } else {
            Write-Host "  [X] $roleName (file not found)" -ForegroundColor Red
        }
    }
    Write-Host ""
    
    # Check current active role
    if (Test-Path $currentRulesFile) {
        $currentContent = Get-Content $currentRulesFile -Raw
        foreach ($roleName in $roles.Keys) {
            $roleFile = $roles[$roleName]
            if (Test-Path $roleFile) {
                $roleContent = Get-Content $roleFile -Raw
                if ($currentContent -eq $roleContent) {
                    Write-Host "Current active role: $roleName" -ForegroundColor Yellow
                    break
                }
            }
        }
    } else {
        Write-Host "No active role set (no .cursorrules file found)" -ForegroundColor Yellow
    }
    Write-Host ""
    exit 0
}

# Get the role file
$roleFile = $roles[$Role]

if (-not (Test-Path $roleFile)) {
    Write-Host "Error: Role file '$roleFile' not found!" -ForegroundColor Red
    exit 1
}

# Copy the selected role file to .cursorrules in project root
Copy-Item $roleFile $currentRulesFile -Force

Write-Host ""
Write-Host "[OK] Successfully switched to role: $Role (Generated Application)" -ForegroundColor Green
Write-Host "  Active rules file: $currentRulesFile" -ForegroundColor Gray
Write-Host "  Source file: $roleFile" -ForegroundColor Gray
Write-Host ""
Write-Host "You can now use Cursor AI with the $Role role for Generated Application." -ForegroundColor Cyan
Write-Host "To switch to another role, run: .\docs_generated\switch-role.ps1 [role-name]" -ForegroundColor Gray
Write-Host "To see all available roles: .\docs_generated\switch-role.ps1 list" -ForegroundColor Gray
Write-Host ""

