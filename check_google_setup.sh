#!/bin/bash

echo "🔍 فحص جاهزية Google OAuth..."
echo "================================"

# Check Backend .env
echo "📋 فحص Backend (.env):"
if grep -q "GOOGLE_CLIENT_ID=your-google-client-id-here" .env; then
    echo "❌ GOOGLE_CLIENT_ID لم يتم تحديثه بعد"
    echo "   يجب إضافة Client ID الحقيقي من Google Console"
else
    echo "✅ GOOGLE_CLIENT_ID تم تحديثه"
fi

if grep -q "GOOGLE_CLIENT_SECRET=your-google-client-secret-here" .env; then
    echo "❌ GOOGLE_CLIENT_SECRET لم يتم تحديثه بعد"
    echo "   يجب إضافة Client Secret الحقيقي من Google Console"
else
    echo "✅ GOOGLE_CLIENT_SECRET تم تحديثه"
fi

# Check Frontend .env
echo ""
echo "📋 فحص Frontend (.env):"
if [ -f "frontend/my-project-main/.env" ]; then
    if grep -q "REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here" frontend/my-project-main/.env; then
        echo "❌ REACT_APP_GOOGLE_CLIENT_ID لم يتم تحديثه بعد"
    else
        echo "✅ REACT_APP_GOOGLE_CLIENT_ID تم تحديثه"
    fi
else
    echo "❌ Frontend .env غير موجود"
fi

# Check if servers are running
echo ""
echo "🔍 فحص الخوادم:"

# Check Laravel
if curl -s http://127.0.0.1:8000/api/user > /dev/null 2>&1; then
    echo "✅ Laravel Backend يعمل على http://127.0.0.1:8000"
else
    echo "❌ Laravel Backend لا يعمل"
    echo "   شغل: php artisan serve"
fi

# Check React
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ React Frontend يعمل على http://localhost:3000"
else
    echo "❌ React Frontend لا يعمل"
    echo "   شغل: npm start في مجلد frontend/my-project-main"
fi

echo ""
echo "📝 الخطوات التالية:"
echo "1. احصل على Google OAuth credentials من:"
echo "   https://console.cloud.google.com/"
echo "2. حدث .env في Backend و Frontend"
echo "3. شغل: php artisan config:cache"
echo "4. شغل الخوادم إذا لم تكن تعمل"
echo "5. جرب تسجيل الدخول بـ Google!"