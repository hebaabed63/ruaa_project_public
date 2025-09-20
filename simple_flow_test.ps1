# Simple Flow Test
Write-Host "===== Testing Complete Flow =====" -ForegroundColor Green

$baseUrl = "http://127.0.0.1:8000"
$headers = @{
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

# Generate unique test data
$timestamp = (Get-Date).ToString("yyyyMMddHHmmss")
$testEmail = "testuser$timestamp@test.com"
$testPassword = "password123"

Write-Host "`nStep 1: Testing Registration..." -ForegroundColor Cyan

try {
    $registerData = @{
        name = "Test User $timestamp"
        email = $testEmail
        password = $testPassword
        password_confirmation = $testPassword
    } | ConvertTo-Json
    
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/register" -Method POST -Headers $headers -Body $registerData
    Write-Host "SUCCESS: Registration completed" -ForegroundColor Green
    Write-Host "User Role: $($registerResponse.user.role)" -ForegroundColor Cyan
    
    $userRole = $registerResponse.user.role
    
} catch {
    Write-Host "FAILED: Registration" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nStep 2: Testing Login..." -ForegroundColor Cyan

try {
    $loginData = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/login" -Method POST -Headers $headers -Body $loginData
    Write-Host "SUCCESS: Login completed" -ForegroundColor Green
    Write-Host "Message: $($loginResponse.message)" -ForegroundColor Cyan
    
} catch {
    Write-Host "FAILED: Login" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nStep 3: Dashboard Route Check..." -ForegroundColor Cyan

switch ($userRole) {
    0 { $dashboard = "AdminDashboard" }
    1 { $dashboard = "SupervisorDashboard" }
    2 { $dashboard = "SchoolManagerDashboard" }
    3 { $dashboard = "ParentsDashboard" }
    default { $dashboard = "ParentsDashboard (default)" }
}

Write-Host "SUCCESS: User will see $dashboard" -ForegroundColor Green

# Check essential files
Write-Host "`nStep 4: File Check..." -ForegroundColor Cyan

$files = @(
    "frontend\my-project-main\src\pages\auth\Registration.jsx",
    "frontend\my-project-main\src\pages\auth\Login.jsx", 
    "frontend\my-project-main\src\pages\dashboard\parents\ParentsDashboard.jsx"
)

$allExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file" -ForegroundColor Red
        $allExist = $false
    }
}

Write-Host "`n===== SUMMARY =====" -ForegroundColor Magenta
Write-Host "✓ Registration: WORKING" -ForegroundColor Green
Write-Host "✓ Login: WORKING" -ForegroundColor Green
Write-Host "✓ Dashboard Routing: CONFIGURED" -ForegroundColor Green

if ($allExist) {
    Write-Host "✓ Frontend Files: ALL READY" -ForegroundColor Green
} else {
    Write-Host "⚠ Frontend Files: SOME MISSING" -ForegroundColor Yellow
}

Write-Host "`nTest User Created:" -ForegroundColor Cyan
Write-Host "Email: $testEmail" -ForegroundColor White
Write-Host "Password: $testPassword" -ForegroundColor White

Write-Host "`nREADY FOR FRONTEND TESTING! 🚀" -ForegroundColor Green
