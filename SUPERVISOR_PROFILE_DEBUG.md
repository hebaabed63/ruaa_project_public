# 🐛 تشخيص وحل مشكلة الملف الشخصي - Dashboard المشرفين

## ❌ المشكلة
عند الضغط على "الملف الشخصي" من Sidebar في Dashboard المشرفين، يظهر الخطأ:
```
حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى لاحقاً.
```

---

## 🔍 خطوات التشخيص

### الخطوة 1: افتح Developer Tools في المتصفح
1. اضغط `F12` أو `Ctrl + Shift + I`
2. اذهب إلى تبويب **Console**
3. حاول الضغط على "الملف الشخصي" من Sidebar
4. انظر إلى الأخطاء التي تظهر

### الخطوة 2: تحقق من التوكن (Token)
في Console، اكتب:
```javascript
localStorage.getItem('token')
```

**إذا كانت النتيجة `null` أو `undefined`:**
- المشكلة: التوكن غير موجود
- الحل: سجل الدخول مرة أخرى

**إذا كانت النتيجة string طويلة (مثل: `"123|abc...xyz"`):**
- التوكن موجود ✅
- انتقل للخطوة التالية

### الخطوة 3: تحقق من نوع المستخدم (Role)
في Console، اكتب:
```javascript
localStorage.getItem('role')
```

**يجب أن تكون النتيجة: `"supervisor"`**

إذا كانت شيء آخر:
- قد تكون قد سجلت الدخول بحساب غير مشرف

### الخطوة 4: تحقق من الـ Network Request
1. اذهب إلى تبويب **Network** في Developer Tools
2. اضغط على "الملف الشخصي" من Sidebar
3. ابحث عن request اسمه `profile`
4. اضغط عليه وانظر:
   - **Status Code**: يجب أن يكون `200`
   - **Response**: انظر إلى البيانات المرجعة

**الأخطاء المحتملة:**

| Status Code | المعنى | الحل |
|-------------|--------|------|
| 401 | غير مصرح (Token خطأ أو منتهي) | سجل الدخول مرة أخرى |
| 403 | ممنوع (لست مشرف) | تأكد أن الحساب دور المشرف |
| 404 | المسار غير موجود | مشكلة في الـ backend |
| 500 | خطأ في السيرفر | تحقق من Laravel logs |

---

## 🔧 الحلول

### الحل 1: تسجيل الدخول مرة أخرى
```javascript
// في Console
localStorage.clear();
// ثم سجل الدخول مرة أخرى من الصفحة
```

### الحل 2: التأكد من Backend يعمل
```bash
# في Terminal
cd C:\laragon\www\ruaa_project
php artisan serve
```

يجب أن ترى:
```
Server running on [http://127.0.0.1:8000]
```

### الحل 3: التحقق من قاعدة البيانات
افتح phpMyAdmin أو MySQL Workbench وشغل:
```sql
-- تحقق من وجود مستخدم مشرف
SELECT user_id, name, email, role, status, avatar, phone, address 
FROM users 
WHERE role = 1 
LIMIT 5;
```

**النتيجة المتوقعة:**
- يجب أن يكون فيه صف واحد على الأقل
- `role` يجب أن يكون `1`
- `status` يجب أن يكون `approved`

**إذا لم يكن هناك نتائج:**
```sql
-- أنشئ مستخدم مشرف
INSERT INTO users (name, email, password, role, status, created_at, updated_at) 
VALUES (
  'محمد المشرف',
  'supervisor@ruaa.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  -- password = "password"
  1, 
  'approved',
  NOW(),
  NOW()
);
```

### الحل 4: تحقق من Laravel Logs
```bash
# في Terminal
cd C:\laragon\www\ruaa_project
# Windows
type storage\logs\laravel.log | findstr /I "supervisor profile"

# أو افتح الملف مباشرة
notepad storage\logs\laravel.log
```

ابحث عن أخطاء مثل:
- `SQLSTATE[42S22]: Column not found`
- `Call to a member function`
- `Unauthenticated`

### الحل 5: تحقق من الـ CORS
إذا كان الخطأ متعلق بـ CORS، عدل ملف `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

ثم شغل:
```bash
php artisan config:cache
```

---

## 🧪 اختبار يدوي بـ cURL

### اختبار 1: تسجيل الدخول والحصول على Token
```bash
curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"supervisor@ruaa.com\",\"password\":\"password\"}"
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "data": {
    "token": "1|abc123...",
    "role": "supervisor",
    "user": { ... }
  }
}
```

احفظ الـ `token` من النتيجة.

### اختبار 2: جلب بيانات الملف الشخصي
```bash
curl -X GET http://localhost:8000/api/supervisor/profile ^
  -H "Accept: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**استبدل `YOUR_TOKEN_HERE` بالتوكن من الخطوة السابقة.**

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "محمد المشرف",
    "email": "supervisor@ruaa.com",
    "phone": "+966501234567",
    "address": "الرياض",
    "profileImage": "/storage/avatars/...",
    "dateJoined": "2024-01-01",
    "status": "approved"
  }
}
```

---

## 🎯 الحل الشامل (خطوة بخطوة)

### 1. تأكد من Backend يعمل
```bash
cd C:\laragon\www\ruaa_project
php artisan serve
```

### 2. تأكد من قاعدة البيانات صحيحة
```sql
SELECT * FROM users WHERE role = 1;
```

### 3. امسح الـ Cache
```bash
php artisan config:cache
php artisan route:cache
php artisan cache:clear
```

### 4. في Frontend، امسح localStorage
```javascript
// في Console
localStorage.clear();
```

### 5. سجل الدخول مرة أخرى
- اذهب إلى: `http://localhost:3000/login`
- Email: `supervisor@ruaa.com`
- Password: `password`

### 6. انتظر حتى يتم التوجيه إلى Dashboard

### 7. جرب الدخول للملف الشخصي من Sidebar

---

## 📊 الأخطاء الشائعة وحلولها

### خطأ: "Network Error"
**السبب:** Backend لا يعمل أو CORS

**الحل:**
```bash
# تأكد من Backend
php artisan serve

# تحقق من CORS
php artisan config:cache
```

### خطأ: "401 Unauthorized"
**السبب:** Token غير صحيح أو منتهي

**الحل:**
```javascript
// امسح localStorage وسجل الدخول مرة أخرى
localStorage.clear();
```

### خطأ: "403 Forbidden"
**السبب:** المستخدم ليس مشرف (role ≠ 1)

**الحل:**
```sql
-- تحقق من الدور
SELECT user_id, name, email, role FROM users WHERE email = 'supervisor@ruaa.com';

-- عدل الدور إذا كان خطأ
UPDATE users SET role = 1 WHERE email = 'supervisor@ruaa.com';
```

### خطأ: "500 Internal Server Error"
**السبب:** خطأ في Backend code

**الحل:**
```bash
# شاهد Laravel logs
type storage\logs\laravel.log
```

---

## 🔍 Checklist النهائي

- [ ] Backend يعمل على `http://localhost:8000`
- [ ] Frontend يعمل على `http://localhost:3000`
- [ ] قاعدة البيانات تحتوي على مستخدم مشرف (role = 1, status = approved)
- [ ] Token موجود في localStorage
- [ ] Role = "supervisor" في localStorage
- [ ] API Response يرجع status 200
- [ ] لا توجد أخطاء في Console
- [ ] لا توجد أخطاء في Laravel logs

---

## 📞 إذا استمرت المشكلة

شغل هذه الأوامر وأرسل النتيجة:

```bash
# 1. تحقق من Laravel version
php artisan --version

# 2. تحقق من Routes
php artisan route:list | findstr supervisor

# 3. تحقق من Database connection
php artisan tinker
>>> DB::table('users')->where('role', 1)->first();
>>> exit

# 4. في Frontend Console
console.log({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  user: localStorage.getItem('user')
});
```

---

*تاريخ الإنشاء: الآن*  
*الحالة: جاهز للاستخدام*
