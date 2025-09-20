# 🔐 دليل نظام استعادة كلمة المرور

## نظرة عامة
تم تنفيذ نظام كامل لاستعادة كلمة المرور يتضمن:
- صفحة نسيت كلمة المرور (Frontend)
- صفحة إعادة تعيين كلمة المرور (Frontend)
- صفحة نجاح العملية (Frontend)
- APIs كاملة (Backend)
- قاعدة بيانات لحفظ tokens

## 📋 المتطلبات
- Laravel Server يعمل على المنفذ 8000
- React Frontend يعمل على المنفذ 3000
- قاعدة البيانات متصلة وتحتوي على جدول `password_reset_tokens`

## 🚀 كيفية التشغيل

### Backend (Laravel)
```bash
# في مجلد المشروع
cd C:\laragon\www\ruaa_project

# تشغيل الخادم
php artisan serve --host=127.0.0.1 --port=8000
```

### Frontend (React)
```bash
# في مجلد Frontend
cd C:\laragon\www\ruaa_project\frontend\my-project-main

# تثبيت Dependencies (إذا لم تكن مثبتة)
npm install

# تشغيل Frontend
npm start
```

## 🔄 تدفق العمل

### 1. صفحة نسيت كلمة المرور
- **المسار**: `/forgot-password`
- **الملف**: `frontend/my-project-main/src/pages/auth/ForgotPassword.jsx`
- **الوظيفة**: 
  - يدخل المستخدم بريده الإلكتروني
  - يتم إرسال طلب إلى API: `POST /api/auth/forgot-password`
  - يحصل على reset token
  - ينتقل إلى صفحة النجاح

### 2. صفحة إعادة تعيين كلمة المرور
- **المسار**: `/reset-password/:token`
- **الملف**: `frontend/my-project-main/src/pages/auth/ResetPassword.jsx`
- **الوظيفة**:
  - يدخل المستخدم كلمة المرور الجديدة
  - يؤكد كلمة المرور
  - يتم إرسال طلب إلى API: `POST /api/auth/reset-password/{token}`
  - تحديث كلمة المرور في قاعدة البيانات
  - حذف الـ token المستخدم
  - الانتقال إلى صفحة تسجيل الدخول

### 3. صفحة نجاح العملية
- **المسار**: `/password-reset-success`
- **الملف**: `frontend/my-project-main/src/pages/auth/PasswordResetSuccess.jsx`
- **الوظيفة**: عرض رسالة نجاح مع زر للانتقال لتسجيل الدخول

## 🛡️ APIs المتاحة

### 1. طلب استعادة كلمة المرور
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
    "email": "user@example.com"
}
```

**الاستجابة الناجحة**:
```json
{
    "success": true,
    "message": "تم إرسال رابط إعادة تعيين كلمة المرور بنجاح",
    "data": {
        "reset_token": "xxxxxxxxxxxx",
        "reset_url": "http://localhost:3000/reset-password/xxxxxxxxxxxx"
    }
}
```

### 2. إعادة تعيين كلمة المرور
```http
POST /api/auth/reset-password/{token}
Content-Type: application/json

{
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

**الاستجابة الناجحة**:
```json
{
    "success": true,
    "message": "تم تغيير كلمة المرور بنجاح",
    "data": {
        "user": {
            "name": "اسم المستخدم",
            "email": "user@example.com"
        }
    }
}
```

## 🧪 اختبار النظام

### الطريقة 1: صفحة الاختبار HTML
1. تأكد من تشغيل الخادم: `php artisan serve`
2. افتح في المتصفح: `http://127.0.0.1:8000/test_password_reset.html`
3. اتبع الخطوات بالترتيب:
   - إنشاء مستخدم للاختبار
   - طلب إعادة تعيين كلمة المرور
   - استخدام الـ token لتعيين كلمة مرور جديدة
   - اختبار تسجيل الدخول بكلمة المرور الجديدة

### الطريقة 2: استخدام Frontend
1. تشغيل الخادم والـ Frontend
2. الذهاب إلى `http://localhost:3000/forgot-password`
3. إدخال البريد الإلكتروني
4. استخدام الرابط/Token المُرسل
5. تعيين كلمة مرور جديدة
6. اختبار تسجيل الدخول

### الطريقة 3: اختبار API مباشر
```bash
# تشغيل ملف الاختبار PHP (إذا كان الخادم يعمل)
php test_password_reset.php
```

## 📁 الملفات المهمة

### Backend (Laravel)
- `app/Http/Controllers/AuthController.php` - Controller الأساسي
- `routes/api.php` - تعريف المسارات
- `database/migrations/*_create_password_reset_tokens_table.php` - جدول قاعدة البيانات

### Frontend (React)
- `src/pages/auth/ForgotPassword.jsx` - صفحة نسيت كلمة المرور
- `src/pages/auth/ResetPassword.jsx` - صفحة إعادة التعيين
- `src/pages/auth/PasswordResetSuccess.jsx` - صفحة النجاح
- `src/services/authService.js` - خدمات API
- `src/routes/AppRoutes.jsx` - تعريف المسارات

### اختبار
- `test_password_reset.php` - اختبار شامل للنظام
- `public/test_password_reset.html` - صفحة اختبار تفاعلية

## ✅ المميزات المُنفذة

1. **الأمان**:
   - Hash للـ tokens في قاعدة البيانات
   - انتهاء صلاحية الـ tokens بعد ساعة واحدة
   - حذف الـ token بعد الاستخدام
   - تشفير كلمات المرور

2. **تجربة المستخدم**:
   - واجهات عربية جميلة
   - رسائل واضحة للأخطاء والنجاح
   - تدفق سلس بين الصفحات

3. **المرونة**:
   - يمكن ربط الإيميل الفعلي لاحقاً
   - معالجة شاملة للأخطاء
   - اختبار مُتكامل

## 🔧 ملاحظات التطوير

- في بيئة الإنتاج، يجب عدم إرجاع الـ `reset_token` في الاستجابة
- يجب ربط نظام إرسال الإيميل الفعلي
- يمكن تخصيص مدة انتهاء صلاحية الـ tokens
- يمكن إضافة معدل تحديد للطلبات (Rate Limiting)

## 🎯 النتيجة
نظام استعادة كلمة المرور مُكتمل وجاهز للاستخدام! 🎉
