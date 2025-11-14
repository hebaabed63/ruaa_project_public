# 🚀 دليل البدء السريع - منصة رؤى التعليمية

## ⚡ البدء في 5 دقائق

### 1️⃣ تشغيل قاعدة البيانات
تأكد من تشغيل MySQL في Laragon

### 2️⃣ تشغيل Backend (Laravel)
```bash
# في Terminal 1
cd C:\laragon\www\ruaa_project
php artisan serve
```
✅ Backend يعمل على: `http://localhost:8000`

### 3️⃣ تشغيل Frontend (React)
```bash
# في Terminal 2
cd C:\laragon\www\ruaa_project\frontend\my-project-main
npm start
```
✅ Frontend يعمل على: `http://localhost:3000`

---

## 🔐 حسابات تجريبية

### Admin
```
Email: admin@ruaa.com
Password: password
Role: 0 (Admin)
```

### Supervisor  
```
Email: supervisor@ruaa.com
Password: password
Role: 1 (Supervisor)
```

### School Manager
```
Email: manager@ruaa.com
Password: password
Role: 2 (School Manager)
```

### Parent
```
Email: parent@ruaa.com
Password: password
Role: 3 (Parent)
```

---

## 📱 الصفحات المتاحة

### للزوار (بدون تسجيل دخول)
- `http://localhost:3000/` - الصفحة الرئيسية
- `http://localhost:3000/contact` - صفحة التواصل
- `http://localhost:3000/login` - تسجيل الدخول
- `http://localhost:3000/register` - إنشاء حساب

### لأولياء الأمور (Parent)
- `http://localhost:3000/dashboard/parents` - اللوحة الرئيسية
- `http://localhost:3000/dashboard/parents/schools` - المدارس
- `http://localhost:3000/dashboard/parents/profile` - الملف الشخصي
- `http://localhost:3000/dashboard/parents/evaluations` - التقييمات
- `http://localhost:3000/dashboard/parents/complaints` - الشكاوى
- `http://localhost:3000/dashboard/parents/settings` - الإعدادات

### للمشرفين (Supervisor)
- `http://localhost:3000/dashboard/supervisor` - اللوحة الرئيسية
- `http://localhost:3000/dashboard/supervisor/schools` - المدارس
- `http://localhost:3000/dashboard/supervisor/profile` - الملف الشخصي
- `http://localhost:3000/dashboard/supervisor/reports` - التقارير
- `http://localhost:3000/dashboard/supervisor/chat` - المحادثات
- `http://localhost:3000/dashboard/supervisor/InvitationsPage` - الدعوات

---

## 🧪 اختبار الـ APIs

### استخدام Postman أو Thunder Client

#### 1. تسجيل الدخول
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "parent@ruaa.com",
  "password": "password"
}
```

#### 2. استخدام Token
أخذ الـ `token` من الاستجابة وإضافته للـ headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 3. اختبار Parent Dashboard
```http
GET http://localhost:8000/api/parent/dashboard
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 4. اختبار Supervisor Stats
```http
GET http://localhost:8000/api/supervisor/dashboard/stats
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🐛 حل المشاكل الشائعة

### ❌ Backend لا يعمل
```bash
# تحقق من composer
composer install

# تحقق من .env
# تأكد من وجود APP_KEY

# قم بإنشاء key إذا لم يكن موجود
php artisan key:generate

# تأكد من database connection
php artisan migrate
```

### ❌ Frontend لا يعمل
```bash
# تثبيت dependencies
npm install

# تأكد من ملف .env في frontend
# يجب أن يحتوي على:
REACT_APP_API_URL=http://127.0.0.1:8000

# مسح cache
npm start -- --reset-cache
```

### ❌ CORS Error
تأكد من إعدادات CORS في Laravel:
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
```

### ❌ Authentication Error
```bash
# تأكد من SANCTUM_STATEFUL_DOMAINS في .env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

# مسح cache
php artisan config:cache
```

---

## 📝 Quick API Tests

### 1. Get Schools (Public)
```bash
curl http://localhost:8000/api/schools
```

### 2. Get Contact Info (Public)
```bash
curl http://localhost:8000/api/contact/info
```

### 3. Get Services (Public)
```bash
curl http://localhost:8000/api/services
```

---

## 🎯 الميزات الرئيسية

✅ **صفحات الزوار**
- عرض المدارس
- نماذج التواصل
- نظام التقييمات

✅ **لوحة أولياء الأمور**
- إحصائيات حقيقية
- تقييم المدارس
- الشكاوى والتقارير

✅ **لوحة المشرفين**
- إدارة المدارس
- نظام التقارير
- المحادثات والدعوات

---

## 📚 المزيد من المعلومات

- 📖 دليل التكامل الكامل: `INTEGRATION_GUIDE.md`
- ✅ ملخص العمل المنجز: `COMPLETED_WORK.md`
- 🔗 API Documentation: `routes/api.php`

---

## 💡 نصائح سريعة

1. **استخدم Laragon لسهولة التشغيل**
2. **افتح Terminal منفصل لكل من Laravel و React**
3. **تأكد من تشغيل MySQL في الخلفية**
4. **راجع Console للأخطاء**
5. **استخدم Chrome DevTools للـ Network tab**

---

## 🆘 هل تحتاج مساعدة؟

1. راجع `INTEGRATION_GUIDE.md` للمزيد من التفاصيل
2. تحقق من `COMPLETED_WORK.md` لمعرفة ما تم إنجازه
3. افحص `routes/api.php` لرؤية جميع الـ endpoints
4. راجع Console logs في Browser و Terminal

---

**🎉 استمتع باستخدام منصة رؤى التعليمية!**

---

### 📞 Quick Reference

| Item | URL |
|------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| Laravel Admin | http://localhost:8000 |
| Database | localhost:3306 (MySQL) |

---

**⚡ Now you're ready to go!**
