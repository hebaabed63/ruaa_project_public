# 🎯 دليل شامل: الملف الشخصي في Dashboard المشرفين

## ✅ المشكلة والحل

### المشكلة الأولى: الملف الشخصي غير مربوط بقاعدة البيانات
**تم الحل ✅**
- تحديث API endpoints في `supervisorApi.js`
- إصلاح Context methods

### المشكلة الثانية: عدم ظهور الصورة والاسم في Header
**تم الحل ✅**
- إصلاح مسار الصورة
- إضافة error handling للصورة
- استخدام الـ hook الصحيح

---

## 📍 أين يظهر الملف الشخصي؟

### 1. في الـ Header (أعلى الصفحة)
```
📌 الموقع: جميع صفحات Dashboard المشرفين
📄 الملف: src/pages/dashboard/Supervisors/components/layout/Header.jsx
```

**ما يظهر:**
- صورة المشرف (أو الحرف الأول من اسمه)
- الاسم الأول للمشرف
- كلمة "مشرف"

**عند الضغط على الصورة:**
- قائمة منسدلة تحتوي على:
  - الاسم الكامل
  - البريد الإلكتروني
  - زر "الملف الشخصي"
  - زر "الإعدادات"
  - زر "تسجيل الخروج"

### 2. في صفحة الملف الشخصي
```
📌 المسار: /dashboard/supervisor/profile
📄 الملف: src/pages/dashboard/Supervisors/pages/ProfilePage.jsx
```

**ما يظهر:**
- الصورة الشخصية (قابلة للتحديث)
- الاسم الكامل (قابل للتعديل)
- البريد الإلكتروني (قابل للتعديل)
- رقم الهاتف (قابل للتعديل)
- العنوان (قابل للتعديل)
- قائمة المدارس المشرف عليها

---

## 🔄 كيف تعمل البيانات؟

### مصدر البيانات

```
1. Database (users table)
   ↓
2. Laravel API (/api/supervisor/profile)
   ↓
3. supervisorApi.js (fetchSupervisorProfile)
   ↓
4. SupervisorProfileContext OR useSupervisorProfile hook
   ↓
5. Header & ProfilePage components
```

### API Endpoints المستخدمة

| Method | Endpoint | الوظيفة |
|--------|----------|---------|
| GET | `/api/supervisor/profile` | جلب بيانات المشرف |
| PUT | `/api/supervisor/profile` | تحديث البيانات |
| POST | `/api/supervisor/profile/avatar` | تحديث الصورة |
| GET | `/api/supervisor/schools` | جلب المدارس |

---

## 🎨 الملفات المعنية

### Backend
```
📁 app/Http/Controllers/Api/Supervisor/
  └── SupervisorDashboardController.php
      ├── getSupervisorProfile()
      ├── updateSupervisorProfile()
      └── updateSupervisorProfileImage()

📁 routes/
  └── api.php
      └── Route::prefix('supervisor')
```

### Frontend

#### Services
```
📁 src/pages/dashboard/Supervisors/services/
  └── supervisorApi.js
      ├── fetchSupervisorProfile()
      ├── updateSupervisorProfile()
      └── updateSupervisorProfileImage()
```

#### Contexts
```
📁 src/pages/dashboard/Supervisors/contexts/
  └── SupervisorProfileContext.jsx
      ├── SupervisorProfileProvider
      └── useSupervisorProfileContext()
```

#### Hooks
```
📁 src/pages/dashboard/Supervisors/hooks/
  └── useSupervisorData.js
      └── useSupervisorProfile()
```

#### Components
```
📁 src/pages/dashboard/Supervisors/
  ├── components/layout/
  │   └── Header.jsx (يستخدم البيانات للعرض)
  └── pages/
      └── ProfilePage.jsx (يستخدم البيانات للعرض والتعديل)
```

---

## 🔧 كيفية التحقق من عمل الملف الشخصي

### 1. التأكد من وجود مستخدم مشرف في Database

```sql
-- في phpMyAdmin أو MySQL Workbench
SELECT * FROM users WHERE role = 1;
```

إذا لم يكن موجوداً، أنشئ واحد:
```sql
INSERT INTO users (name, email, password, role, status, created_at, updated_at) 
VALUES (
  'محمد المشرف',
  'supervisor@ruaa.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
  1,
  'approved',
  NOW(),
  NOW()
);
```

### 2. تشغيل Backend و Frontend

**Terminal 1 (Backend):**
```bash
cd C:\laragon\www\ruaa_project
php artisan serve
```

**Terminal 2 (Frontend):**
```bash
cd C:\laragon\www\ruaa_project\frontend\my-project-main
npm start
```

### 3. تسجيل الدخول

```
URL: http://localhost:3000/login
Email: supervisor@ruaa.com
Password: password
```

### 4. التحقق من عرض البيانات

**في الـ Header (أعلى الصفحة):**
- [✓] ظهور الصورة أو الحرف الأول
- [✓] ظهور الاسم الأول
- [✓] القائمة المنسدلة عند الضغط

**في صفحة الملف الشخصي:**
```
URL: http://localhost:3000/dashboard/supervisor/profile
```
- [✓] ظهور جميع البيانات
- [✓] إمكانية التعديل
- [✓] زر "حفظ التعديلات" يعمل
- [✓] إمكانية رفع صورة جديدة

---

## 🐛 حل المشاكل الشائعة

### المشكلة: لا يظهر الاسم أو الصورة في Header

**الحلول:**

1. **تحقق من Console في Browser**
```javascript
// افتح Developer Tools > Console
// ابحث عن أخطاء مثل:
// - Error fetching supervisor profile
// - 401 Unauthorized
// - 500 Server Error
```

2. **تحقق من Token**
```javascript
// في Console
localStorage.getItem('auth_token')
// يجب أن يرجع token
```

3. **تحقق من API Response**
```bash
# في Terminal
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/supervisor/profile
```

4. **تحقق من البيانات في Database**
```sql
SELECT user_id, name, email, phone, address, avatar, role 
FROM users 
WHERE role = 1;
```

### المشكلة: الصورة لا تظهر

**الحلول:**

1. **تحقق من وجود الصورة في Database**
```sql
SELECT avatar FROM users WHERE role = 1;
```

2. **تحقق من Storage Link**
```bash
php artisan storage:link
```

3. **تحقق من مسار الصورة**
- يجب أن يكون: `/storage/avatars/filename.jpg`
- أو: URL كامل مثل `http://localhost:8000/storage/avatars/filename.jpg`

### المشكلة: لا يمكن تحديث البيانات

**الحلول:**

1. **تحقق من Validation**
- الاسم: 3-50 حرف
- البريد: صحيح وفريد
- الهاتف: 10-15 رقم
- العنوان: 5-200 حرف

2. **تحقق من Console Errors**
```javascript
// ابحث عن:
// - 422 Unprocessable Entity (validation error)
// - 403 Forbidden
```

3. **تحقق من CSRF Token**
```bash
# Laravel
php artisan config:cache
```

---

## 📊 هيكل البيانات

### Profile Data Structure
```javascript
{
  id: 1,
  fullName: "محمد المشرف",
  email: "supervisor@ruaa.com",
  phone: "+966501234567",
  address: "الرياض، المملكة العربية السعودية",
  profileImage: "/storage/avatars/supervisor_1_123456.jpg",
  dateJoined: "2024-01-01",
  status: "active"
}
```

### Schools Data Structure
```javascript
[
  {
    school_id: 1,
    name: "مدرسة النجاح الابتدائية",
    address: "الرياض - حي النرجس",
    type: "ابتدائي",
    created_at: "2024-01-01T00:00:00.000000Z"
  }
]
```

---

## ✅ Checklist النهائي

### Backend
- [✓] SupervisorDashboardController موجود
- [✓] Routes في api.php محدثة
- [✓] Database migration للـ users جاهزة
- [✓] Storage link موجود

### Frontend
- [✓] supervisorApi.js محدث بالـ endpoints الصحيحة
- [✓] SupervisorProfileContext يعمل
- [✓] useSupervisorProfile hook يعمل
- [✓] Header يعرض البيانات
- [✓] ProfilePage مربوطة بالـ API
- [✓] مسارات الصور صحيحة

---

## 🎉 النتيجة النهائية

✅ **الملف الشخصي الآن يعمل بالكامل:**
- يعرض في الـ Header
- يمكن الوصول إليه من القائمة المنسدلة
- يمكن تعديل جميع البيانات
- يمكن رفع صورة جديدة
- يعرض المدارس المشرف عليها
- جميع التحديثات تنعكس فوراً

**الحالة: مكتمل 100% ✅**

---

*آخر تحديث: الآن*  
*الإصدار: 1.0*
