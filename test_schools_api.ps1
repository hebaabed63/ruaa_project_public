# ============================================================================
# Schools API Testing Script
# سكريبت اختبار API المدارس
# ============================================================================

Write-Host "================================" -ForegroundColor Cyan
Write-Host "   Schools API Testing" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://127.0.0.1:8000/api"

# ============================================================================
# Test 1: Get All Schools
# ============================================================================
Write-Host "1️⃣  Testing: Get All Schools" -ForegroundColor Yellow
Write-Host "   GET $baseUrl/schools" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/schools" -Method Get
    Write-Host "   ✅ Success!" -ForegroundColor Green
    Write-Host "   📊 Total Schools: $($response.data.total)" -ForegroundColor Cyan
    Write-Host "   📄 Current Page: $($response.data.current_page)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# ============================================================================
# Test 2: Get Best Schools
# ============================================================================
Write-Host "2️⃣  Testing: Get Best Schools" -ForegroundColor Yellow
Write-Host "   GET $baseUrl/schools/best?limit=3" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/schools/best?limit=3" -Method Get
    Write-Host "   ✅ Success!" -ForegroundColor Green
    Write-Host "   📊 Schools Count: $($response.data.total)" -ForegroundColor Cyan
    if ($response.data.schools.Count -gt 0) {
        Write-Host "   🏆 Top School: $($response.data.schools[0].name)" -ForegroundColor Cyan
        Write-Host "   ⭐ Rating: $($response.data.schools[0].rating)" -ForegroundColor Cyan
    }
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# ============================================================================
# Test 3: Get Recently Added Schools
# ============================================================================
Write-Host "3️⃣  Testing: Get Recently Added Schools" -ForegroundColor Yellow
Write-Host "   GET $baseUrl/schools/recent?limit=3" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/schools/recent?limit=3" -Method Get
    Write-Host "   ✅ Success!" -ForegroundColor Green
    Write-Host "   📊 Schools Count: $($response.data.total)" -ForegroundColor Cyan
    if ($response.data.schools.Count -gt 0) {
        Write-Host "   🆕 Latest: $($response.data.schools[0].name)" -ForegroundColor Cyan
    }
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# ============================================================================
# Test 4: Search Schools
# ============================================================================
Write-Host "4️⃣  Testing: Search Schools" -ForegroundColor Yellow
Write-Host "   GET $baseUrl/schools/search?q=النجاح" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/schools/search?q=النجاح" -Method Get
    Write-Host "   ✅ Success!" -ForegroundColor Green
    Write-Host "   📊 Results: $($response.data.total)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# ============================================================================
# Test 5: Get Schools by Region
# ============================================================================
Write-Host "5️⃣  Testing: Get Schools by Region" -ForegroundColor Yellow
Write-Host "   GET $baseUrl/schools/by-region?region=قطاع غزة" -ForegroundColor Gray
try {
    $encodedRegion = [System.Web.HttpUtility]::UrlEncode("قطاع غزة")
    $response = Invoke-RestMethod -Uri "$baseUrl/schools/by-region?region=$encodedRegion" -Method Get
    Write-Host "   ✅ Success!" -ForegroundColor Green
    Write-Host "   📊 Schools in Gaza: $($response.data.total)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# ============================================================================
# Test 6: Get Regions List
# ============================================================================
Write-Host "6️⃣  Testing: Get Regions List" -ForegroundColor Yellow
Write-Host "   GET $baseUrl/schools/regions" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/schools/regions" -Method Get
    Write-Host "   ✅ Success!" -ForegroundColor Green
    Write-Host "   📊 Total Regions: $($response.data.Count)" -ForegroundColor Cyan
    foreach ($region in $response.data) {
        Write-Host "      📍 $($region.region): $($region.school_count) schools" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# ============================================================================
# Test 7: Get Single School
# ============================================================================
Write-Host "7️⃣  Testing: Get Single School" -ForegroundColor Yellow
Write-Host "   GET $baseUrl/schools/1" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/schools/1" -Method Get
    Write-Host "   ✅ Success!" -ForegroundColor Green
    Write-Host "   🏫 School: $($response.data.name)" -ForegroundColor Cyan
    Write-Host "   📍 Location: $($response.data.city), $($response.data.region)" -ForegroundColor Cyan
    Write-Host "   ⭐ Rating: $($response.data.rating)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# ============================================================================
# Test 8: Get Statistics
# ============================================================================
Write-Host "8️⃣  Testing: Get Statistics" -ForegroundColor Yellow
Write-Host "   GET $baseUrl/statistics/general" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/statistics/general" -Method Get
    Write-Host "   ✅ Success!" -ForegroundColor Green
    Write-Host "   📊 Total Schools: $($response.data.total_schools)" -ForegroundColor Cyan
    Write-Host "   📍 Total Regions: $($response.data.total_regions)" -ForegroundColor Cyan
    Write-Host "   👨‍🎓 Total Students: $($response.data.total_students)" -ForegroundColor Cyan
    Write-Host "   👨‍🏫 Total Teachers: $($response.data.total_teachers)" -ForegroundColor Cyan
    Write-Host "   ⭐ Average Rating: $($response.data.average_rating)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# ============================================================================
# Summary
# ============================================================================
Write-Host "================================" -ForegroundColor Cyan
Write-Host "   Testing Complete! ✅" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Start React Frontend: cd frontend/my-project-main && npm start" -ForegroundColor Gray
Write-Host "   2. Open: http://localhost:3000" -ForegroundColor Gray
Write-Host "   3. Navigate to Schools page" -ForegroundColor Gray
Write-Host ""
