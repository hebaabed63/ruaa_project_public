# Test API Endpoints Script
Write-Host "===== Testing API Integration Points =====" -ForegroundColor Green

$baseUrl = "http://127.0.0.1:8000"
$headers = @{
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

# Test 1: Test basic connection
Write-Host "`n1. Testing basic connection..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test" -Method GET -Headers $headers
    Write-Host "Success: $($response.message)" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor Cyan
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Test CSRF token endpoint
Write-Host "`n2. Testing CSRF Token endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/csrf-token" -Method GET -Headers $headers
    Write-Host "Success: CSRF Token retrieved" -ForegroundColor Green
    Write-Host "Token: $($response.csrf_token)" -ForegroundColor Cyan
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test user endpoint (should fail without authentication)
Write-Host "`n3. Testing protected user endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/user" -Method GET -Headers $headers
    Write-Host "Unexpected: Access granted without authentication" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "Success: Access denied without authentication (401)" -ForegroundColor Green
    } else {
        Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Test CSRF endpoint
Write-Host "`n4. Testing CSRF endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test-csrf" -Method GET -Headers $headers
    Write-Host "Success: CSRF endpoint working" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor Cyan
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n===== Test Complete =====" -ForegroundColor Green
