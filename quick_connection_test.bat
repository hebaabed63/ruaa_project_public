@echo off
echo ========================================
echo 🚀 اختبار سريع للاتصال بين Backend و Frontend
echo ========================================
echo.

echo 📋 التحقق من حالة الخوادم...
echo.

REM التحقق من Laravel
echo 🔍 فحص Laravel Backend...
curl -s -o nul -w "Laravel Status: %%{http_code}\n" http://127.0.0.1:8000/api/schools
if %errorlevel% neq 0 (
    echo ❌ Laravel غير متاح على http://127.0.0.1:8000
    echo 💡 تأكد من تشغيل: php artisan serve
) else (
    echo ✅ Laravel يعمل بشكل صحيح
)

echo.

REM التحقق من React
echo 🔍 فحص React Frontend...
curl -s -o nul -w "React Status: %%{http_code}\n" http://localhost:3000
if %errorlevel% neq 0 (
    echo ❌ React غير متاح على http://localhost:3000
    echo 💡 تأكد من تشغيل: npm start في مجلد frontend/my-project-main
) else (
    echo ✅ React يعمل بشكل صحيح
)

echo.

REM اختبار API
echo 🧪 اختبار API...
curl -s http://127.0.0.1:8000/api/schools | findstr "success"
if %errorlevel% equ 0 (
    echo ✅ API يعمل بشكل صحيح
) else (
    echo ❌ مشكلة في API
)

echo.
echo ========================================
echo 📊 ملخص النتائج:
echo ========================================
echo.
echo إذا كانت جميع الاختبارات ✅:
echo   🎉 الاتصال يعمل بشكل مثالي!
echo   يمكنك استخدام الـ APIs في React
echo.
echo إذا كانت هناك ❌:
echo   ⚠️ تحقق من:
echo   1. تشغيل Laravel: php artisan serve
echo   2. تشغيل React: npm start
echo   3. ملف .env في كلا المشروعين
echo   4. اتصال قاعدة البيانات
echo.
echo 📖 للمزيد من التفاصيل، راجع:
echo   - COMPLETE_CONNECTION_GUIDE.md
echo   - BACKEND_FRONTEND_CONNECTION.md
echo.
pause

