# Comprehensive Frontend-Backend Integration Test
Write-Host "===== اختبار التكامل الشامل بعد الإصلاحات =====" -ForegroundColor Green

$baseUrl = "http://127.0.0.1:8000"
$headers = @{
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

# Test 1: Backend API Endpoints
Write-Host "`n=== اختبار Backend API ===" -ForegroundColor Cyan

Write-Host "`n1. اختبار الاتصال الأساسي..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test" -Method GET -Headers $headers
    Write-Host "✅ نجح: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ فشل: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. اختبار نقطة CSRF Token..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/csrf-token" -Method GET -Headers $headers
    Write-Host "✅ نجح: تم الحصول على CSRF Token" -ForegroundColor Green
} catch {
    Write-Host "❌ فشل: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. اختبار نقطة المستخدم المحمية..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/user" -Method GET -Headers $headers
    Write-Host "⚠️ غير متوقع: تم الوصول بدون مصادقة" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ نجح: تم منع الوصول بدون مصادقة (401)" -ForegroundColor Green
    } else {
        Write-Host "❌ فشل: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 2: Login API with actual data
Write-Host "`n4. اختبار تسجيل الدخول مع بيانات وهمية..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "test@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/login" -Method POST -Headers $headers -Body $loginData
    Write-Host "✅ تم اختبار endpoint تسجيل الدخول" -ForegroundColor Green
    Write-Host "Response structure: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Cyan
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ نجح: رفض البيانات الوهمية كما هو متوقع (401)" -ForegroundColor Green
    } else {
        Write-Host "❌ خطأ غير متوقع: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Check Frontend Files Structure
Write-Host "`n=== فحص ملفات Frontend ===" -ForegroundColor Cyan

$frontendPath = "C:\laragon\www\ruaa_project\frontend\my-project-main\src"

Write-Host "`n5. فحص الملفات الأساسية..." -ForegroundColor Yellow
$requiredFiles = @(
    "$frontendPath\App.jsx",
    "$frontendPath\index.js",
    "$frontendPath\contexts\AuthContext.jsx",
    "$frontendPath\services\authService.js",
    "$frontendPath\api\axios.js",
    "$frontendPath\pages\auth\Login.jsx"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ موجود: $(Split-Path $file -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "❌ مفقود: $(Split-Path $file -Leaf)" -ForegroundColor Red
    }
}

# Test 4: Check package.json dependencies
Write-Host "`n6. فحص Dependencies في Frontend..." -ForegroundColor Yellow
$packageJsonPath = "C:\laragon\www\ruaa_project\frontend\my-project-main\package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    $requiredDeps = @("axios", "react", "react-router-dom", "@tanstack/react-query")
    
    foreach ($dep in $requiredDeps) {
        if ($packageJson.dependencies.$dep) {
            Write-Host "✅ $dep`: $($packageJson.dependencies.$dep)" -ForegroundColor Green
        } else {
            Write-Host "❌ مفقود: $dep" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ ملف package.json غير موجود" -ForegroundColor Red
}

# Test 5: Check API Configuration
Write-Host "`n7. فحص تكوين API..." -ForegroundColor Yellow
$axiosFile = "$frontendPath\api\axios.js"
if (Test-Path $axiosFile) {
    $axiosContent = Get-Content $axiosFile -Raw
    
    if ($axiosContent -match "localhost:8000") {
        Write-Host "✅ Base URL محدد بشكل صحيح (localhost:8000)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ تحذير: Base URL قد يحتاج تعديل" -ForegroundColor Yellow
    }
    
    if ($axiosContent -match "withCredentials.*true") {
        Write-Host "✅ CORS credentials مفعل" -ForegroundColor Green
    } else {
        Write-Host "⚠️ تحذير: CORS credentials قد يحتاج تفعيل" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ ملف axios.js غير موجود" -ForegroundColor Red
}

# Test 6: Check Laravel Routes
Write-Host "`n8. فحص Laravel Routes..." -ForegroundColor Yellow
try {
    $routesList = php artisan route:list --json 2>$null | ConvertFrom-Json
    $apiRoutes = $routesList | Where-Object { $_.uri -like "api/*" }
    
    if ($apiRoutes.Count -gt 0) {
        Write-Host "✅ تم العثور على $($apiRoutes.Count) API routes" -ForegroundColor Green
        
        $essentialRoutes = @("api/test", "api/login", "api/register", "api/user")
        foreach ($route in $essentialRoutes) {
            if ($apiRoutes | Where-Object { $_.uri -eq $route }) {
                Write-Host "✅ Route موجود: /$route" -ForegroundColor Green
            } else {
                Write-Host "❌ Route مفقود: /$route" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "⚠️ لم يتم العثور على API routes" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ تعذر فحص routes: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Final Summary
Write-Host "`n=== ملخص النتائج ===" -ForegroundColor Magenta

# Check if Node.js is available for frontend testing
$nodeAvailable = $false
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js متوفر: $nodeVersion" -ForegroundColor Green
        $nodeAvailable = $true
    }
} catch {
    Write-Host "⚠️ Node.js غير متوفر - لا يمكن تشغيل Frontend" -ForegroundColor Yellow
}

if ($nodeAvailable) {
    Write-Host "`n📋 للاختبار الكامل، قم بتشغيل:" -ForegroundColor Cyan
    Write-Host "   1. Backend: php artisan serve --port=8000" -ForegroundColor White
    Write-Host "   2. Frontend: cd frontend/my-project-main && npm start" -ForegroundColor White
    Write-Host "   3. افتح المتصفح على: http://localhost:3000" -ForegroundColor White
} else {
    Write-Host "`n⚠️ تحتاج إلى تثبيت Node.js لتشغيل Frontend" -ForegroundColor Yellow
}

Write-Host "`n🎯 حالة التكامل: جاهز للاختبار!" -ForegroundColor Green
Write-Host "===== انتهى الفحص الشامل =====" -ForegroundColor Green
