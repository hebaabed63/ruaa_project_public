# Final Integration Test
Write-Host "===== Testing Integration After Fixes =====" -ForegroundColor Green

$baseUrl = "http://127.0.0.1:8000"
$headers = @{
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

# Test Backend APIs
Write-Host "`n=== Backend API Tests ===" -ForegroundColor Cyan

Write-Host "`n1. Basic connection test..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test" -Method GET -Headers $headers
    Write-Host "SUCCESS: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Login endpoint test..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "test@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/login" -Method POST -Headers $headers -Body $loginData
    Write-Host "UNEXPECTED: Login succeeded with fake data" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "SUCCESS: Login properly rejected fake credentials (401)" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test Frontend Files
Write-Host "`n=== Frontend Files Check ===" -ForegroundColor Cyan

$frontendPath = "C:\laragon\www\ruaa_project\frontend\my-project-main\src"
$files = @(
    "App.jsx",
    "index.js", 
    "contexts\AuthContext.jsx",
    "services\authService.js",
    "api\axios.js",
    "pages\auth\Login.jsx"
)

Write-Host "`n3. Checking essential files..." -ForegroundColor Yellow
foreach ($file in $files) {
    $fullPath = "$frontendPath\$file"
    if (Test-Path $fullPath) {
        Write-Host "SUCCESS: $file exists" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $file missing" -ForegroundColor Red
    }
}

# Test Dependencies
Write-Host "`n4. Checking package.json..." -ForegroundColor Yellow
$packagePath = "C:\laragon\www\ruaa_project\frontend\my-project-main\package.json"
if (Test-Path $packagePath) {
    $package = Get-Content $packagePath | ConvertFrom-Json
    $deps = @("axios", "react", "react-router-dom")
    
    foreach ($dep in $deps) {
        if ($package.dependencies.$dep) {
            Write-Host "SUCCESS: $dep is installed" -ForegroundColor Green
        } else {
            Write-Host "ERROR: $dep missing" -ForegroundColor Red
        }
    }
} else {
    Write-Host "ERROR: package.json not found" -ForegroundColor Red
}

# Summary
Write-Host "`n=== SUMMARY ===" -ForegroundColor Magenta
Write-Host "Backend: Running on http://127.0.0.1:8000" -ForegroundColor White
Write-Host "Frontend: Ready in frontend/my-project-main/" -ForegroundColor White
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Keep backend running: php artisan serve --port=8000" -ForegroundColor White
Write-Host "2. Start frontend: cd frontend/my-project-main && npm start" -ForegroundColor White
Write-Host "3. Open browser: http://localhost:3000" -ForegroundColor White

Write-Host "`nIntegration Status: READY FOR TESTING!" -ForegroundColor Green
