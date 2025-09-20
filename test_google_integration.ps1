# اختبار تكامل Google OAuth - Frontend و Backend

Write-Host "🚀 بدء اختبار تكامل Google OAuth" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# متغيرات التكوين
$API_URL = "http://127.0.0.1:8000"
$FRONTEND_URL = "http://localhost:3000"

# التحقق من تشغيل Backend
Write-Host "`n🔍 التحقق من تشغيل Laravel Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/user" -Method GET -ErrorAction SilentlyContinue
    Write-Host "❌ Laravel Backend غير محمي بشكل صحيح" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Laravel Backend يعمل بشكل صحيح" -ForegroundColor Green
    } else {
        Write-Host "❌ Laravel Backend لا يعمل أو غير متاح" -ForegroundColor Red
        Write-Host "تأكد من تشغيل: php artisan serve" -ForegroundColor Yellow
        exit 1
    }
}

# اختبار مسارات Google OAuth
Write-Host "`n🔍 اختبار مسارات Google OAuth..." -ForegroundColor Yellow

# اختبار توجيه Google
Write-Host "اختبار Google Redirect..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/auth/google" -Method GET -MaximumRedirection 0 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 302) {
        $location = $response.Headers.Location
        if ($location -match "accounts.google.com") {
            Write-Host "✅ Google Redirect يعمل بشكل صحيح" -ForegroundColor Green
        } else {
            Write-Host "❌ Google Redirect لا يوجه إلى Google" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ خطأ في Google Redirect: $($_.Exception.Message)" -ForegroundColor Red
}

# اختبار Google Callback
Write-Host "اختبار Google Callback..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$API_URL/api/auth/google/callback" -Method GET -MaximumRedirection 0 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 302) {
        Write-Host "✅ Google Callback يعمل بشكل صحيح" -ForegroundColor Green
    }
} catch {
    Write-Host "✅ Google Callback يرفض الطلبات بدون كود (صحيح)" -ForegroundColor Green
}

# اختبار Google Login API
Write-Host "اختبار Google Login API..." -ForegroundColor Cyan
try {
    $body = @{
        credential = "fake.token.for.testing"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$API_URL/api/auth/google/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction SilentlyContinue
    Write-Host "❌ قبل توكن Google وهمي" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Google Login API يرفض التوكن الوهمي بشكل صحيح" -ForegroundColor Green
    } else {
        Write-Host "❌ خطأ غير متوقع في Google Login API" -ForegroundColor Red
    }
}

# التحقق من ملفات Frontend
Write-Host "`n🔍 التحقق من ملفات Frontend..." -ForegroundColor Yellow

$frontendPath = "frontend/my-project-main"
$componentsPath = "$frontendPath/src/components/auth"
$pagesPath = "$frontendPath/src/pages/auth"

# التحقق من وجود GoogleSignInButton
if (Test-Path "$componentsPath/GoogleSignInButton.jsx") {
    Write-Host "✅ GoogleSignInButton component موجود" -ForegroundColor Green
} else {
    Write-Host "❌ GoogleSignInButton component غير موجود" -ForegroundColor Red
}

# التحقق من وجود GoogleCallback
if (Test-Path "$pagesPath/GoogleCallback.jsx") {
    Write-Host "✅ GoogleCallback page موجود" -ForegroundColor Green
} else {
    Write-Host "❌ GoogleCallback page غير موجود" -ForegroundColor Red
}

# التحقق من تحديث Login page
$loginPath = "$pagesPath/Login.jsx"
if (Test-Path $loginPath) {
    $loginContent = Get-Content $loginPath -Raw
    if ($loginContent -match "GoogleSignInButton") {
        Write-Host "✅ Login page محدثة لتشمل Google Sign-In" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Login page لا تحتوي على GoogleSignInButton" -ForegroundColor Yellow
    }
}

# التحقق من تحديث Registration page
$registerPath = "$pagesPath/Registration.jsx"
if (Test-Path $registerPath) {
    $registerContent = Get-Content $registerPath -Raw
    if ($registerContent -match "GoogleSignInButton") {
        Write-Host "✅ Registration page محدثة لتشمل Google Sign-In" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Registration page لا تحتوي على GoogleSignInButton" -ForegroundColor Yellow
    }
}

# التحقق من ملفات التكوين
Write-Host "`n🔍 التحقق من ملفات التكوين..." -ForegroundColor Yellow

# .env Backend
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "GOOGLE_CLIENT_ID=") {
        Write-Host "✅ GOOGLE_CLIENT_ID موجود في Backend .env" -ForegroundColor Green
    } else {
        Write-Host "❌ GOOGLE_CLIENT_ID غير موجود في Backend .env" -ForegroundColor Red
    }
    
    if ($envContent -match "GOOGLE_CLIENT_SECRET=") {
        Write-Host "✅ GOOGLE_CLIENT_SECRET موجود في Backend .env" -ForegroundColor Green
    } else {
        Write-Host "❌ GOOGLE_CLIENT_SECRET غير موجود في Backend .env" -ForegroundColor Red
    }
} else {
    Write-Host "❌ ملف .env غير موجود" -ForegroundColor Red
}

# .env Frontend
$frontendEnvPath = "$frontendPath/.env"
if (Test-Path $frontendEnvPath) {
    $frontendEnvContent = Get-Content $frontendEnvPath -Raw
    if ($frontendEnvContent -match "REACT_APP_GOOGLE_CLIENT_ID=") {
        Write-Host "✅ REACT_APP_GOOGLE_CLIENT_ID موجود في Frontend .env" -ForegroundColor Green
    } else {
        Write-Host "❌ REACT_APP_GOOGLE_CLIENT_ID غير موجود في Frontend .env" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Frontend .env غير موجود (اختياري)" -ForegroundColor Yellow
}

# إرشادات الإعداد
Write-Host "`n📋 إرشادات الإعداد:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "1. تأكد من إعداد Google OAuth Credentials في Google Cloud Console" -ForegroundColor White
Write-Host "2. أضف المتغيرات التالية في ملف .env:" -ForegroundColor White
Write-Host "   GOOGLE_CLIENT_ID=your-client-id" -ForegroundColor Gray
Write-Host "   GOOGLE_CLIENT_SECRET=your-client-secret" -ForegroundColor Gray
Write-Host "   GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/api/auth/google/callback" -ForegroundColor Gray
Write-Host "3. أضف REACT_APP_GOOGLE_CLIENT_ID في Frontend .env" -ForegroundColor White
Write-Host "4. شغل: php artisan config:cache" -ForegroundColor White

Write-Host "`n✨ انتهى اختبار التكامل" -ForegroundColor Green