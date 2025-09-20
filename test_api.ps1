# Test API Endpoints Script
Write-Host "===== اختبار نقاط التكامل API =====" -ForegroundColor Green

$baseUrl = "http://127.0.0.1:8000"
$headers = @{
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

# Test 1: Test basic connection
Write-Host "`n1. اختبار الاتصال الأساسي..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test" -Method GET -Headers $headers
    Write-Host "✅ نجح: $($response.message)" -ForegroundColor Green
    Write-Host "حالة: $($response.status)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ فشل: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Test CSRF token endpoint
Write-Host "`n2. اختبار نقطة CSRF Token..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/csrf-token" -Method GET -Headers $headers
    Write-Host "✅ نجح: تم الحصول على CSRF Token" -ForegroundColor Green
    Write-Host "Token: $($response.csrf_token)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ فشل: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test user endpoint (should fail without authentication)
Write-Host "`n3. اختبار نقطة المستخدم المحمية..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/user" -Method GET -Headers $headers
    Write-Host "✅ غير متوقع: تم الوصول بدون مصادقة" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ نجح: تم منع الوصول بدون مصادقة (401)" -ForegroundColor Green
    } else {
        Write-Host "❌ فشل: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Test CORS by checking response headers
Write-Host "`n4. اختبار CORS Headers..." -ForegroundColor Yellow
try {
    $webRequest = [System.Net.WebRequest]::Create("$baseUrl/api/test")
    $webRequest.Method = "OPTIONS"
    $webRequest.Headers.Add("Origin", "http://localhost:3000")
    $webRequest.Headers.Add("Access-Control-Request-Method", "GET")
    
    $response = $webRequest.GetResponse()
    $corsHeaders = @()
    
    foreach ($header in $response.Headers.AllKeys) {
        if ($header -like "Access-Control-*") {
            $corsHeaders += "$header`: $($response.Headers[$header])"
        }
    }
    
    if ($corsHeaders.Count -gt 0) {
        Write-Host "✅ نجح: CORS Headers موجودة:" -ForegroundColor Green
        foreach ($header in $corsHeaders) {
            Write-Host "  - $header" -ForegroundColor Cyan
        }
    } else {
        Write-Host "⚠️  تحذير: لم يتم العثور على CORS Headers" -ForegroundColor Yellow
    }
    
    $response.Close()
} catch {
    Write-Host "❌ فشل: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n===== انتهى الاختبار =====" -ForegroundColor Green
