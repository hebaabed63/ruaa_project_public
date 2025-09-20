# فحص جاهزية Google OAuth
Write-Host "🔍 فحص جاهزية Google OAuth..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check Backend .env
Write-Host "`n📋 فحص Backend (.env):" -ForegroundColor Yellow
$envContent = Get-Content ".env" -Raw -ErrorAction SilentlyContinue

if ($envContent -match "GOOGLE_CLIENT_ID=your-google-client-id-here") {
    Write-Host "❌ GOOGLE_CLIENT_ID لم يتم تحديثه بعد" -ForegroundColor Red
    Write-Host "   يجب إضافة Client ID الحقيقي من Google Console" -ForegroundColor Yellow
} else {
    Write-Host "✅ GOOGLE_CLIENT_ID تم تحديثه" -ForegroundColor Green
}

if ($envContent -match "GOOGLE_CLIENT_SECRET=your-google-client-secret-here") {
    Write-Host "❌ GOOGLE_CLIENT_SECRET لم يتم تحديثه بعد" -ForegroundColor Red
    Write-Host "   يجب إضافة Client Secret الحقيقي من Google Console" -ForegroundColor Yellow
} else {
    Write-Host "✅ GOOGLE_CLIENT_SECRET تم تحديثه" -ForegroundColor Green
}

# Check Frontend .env
Write-Host "`n📋 فحص Frontend (.env):" -ForegroundColor Yellow
$frontendEnvPath = "frontend/my-project-main/.env"

if (Test-Path $frontendEnvPath) {
    $frontendEnvContent = Get-Content $frontendEnvPath -Raw
    if ($frontendEnvContent -match "REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here") {
        Write-Host "❌ REACT_APP_GOOGLE_CLIENT_ID لم يتم تحديثه بعد" -ForegroundColor Red
    } else {
        Write-Host "✅ REACT_APP_GOOGLE_CLIENT_ID تم تحديثه" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Frontend .env غير موجود" -ForegroundColor Red
}

# Check if servers are running
Write-Host "`n🔍 فحص الخوادم:" -ForegroundColor Yellow

# Check Laravel
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/user" -Method GET -TimeoutSec 3 -ErrorAction SilentlyContinue
    Write-Host "✅ Laravel Backend يعمل على http://127.0.0.1:8000" -ForegroundColor Green
} catch {
    Write-Host "❌ Laravel Backend لا يعمل" -ForegroundColor Red
    Write-Host "   شغل: php artisan serve" -ForegroundColor Yellow
}

# Check React
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 3 -ErrorAction SilentlyContinue
    Write-Host "✅ React Frontend يعمل على http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "❌ React Frontend لا يعمل" -ForegroundColor Red
    Write-Host "   شغل: npm start في مجلد frontend/my-project-main" -ForegroundColor Yellow
}

Write-Host "`n📝 الخطوات التالية:" -ForegroundColor Cyan
Write-Host "1. احصل على Google OAuth credentials من:" -ForegroundColor White
Write-Host "   https://console.cloud.google.com/" -ForegroundColor Gray
Write-Host "2. حدث .env في Backend و Frontend" -ForegroundColor White
Write-Host "3. شغل: php artisan config:cache" -ForegroundColor White
Write-Host "4. شغل الخوادم إذا لم تكن تعمل" -ForegroundColor White
Write-Host "5. جرب تسجيل الدخول بـ Google!" -ForegroundColor White

# Quick test to see if we can access Google OAuth endpoint
Write-Host "`n🧪 اختبار سريع:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/auth/google" -Method GET -MaximumRedirection 0 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 302) {
        Write-Host "✅ Google OAuth endpoint متاح" -ForegroundColor Green
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 302) {
        Write-Host "✅ Google OAuth endpoint متاح" -ForegroundColor Green
    } else {
        Write-Host "⚠️  تحقق من إعدادات Laravel" -ForegroundColor Yellow
    }
}