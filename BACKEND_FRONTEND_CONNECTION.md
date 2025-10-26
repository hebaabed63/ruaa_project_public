# دليل ربط Backend (Laravel) مع Frontend (React)

## ✅ تم إكمال الإعدادات التالية:

### 1. إعدادات Backend (Laravel):

#### ✔️ CORS Configuration
- الملف: `config/cors.php`
- تم السماح للفرونت إند بالوصول للـ API
- تم تفعيل `supports_credentials`

#### ✔️ API Routes
- الملف: `routes/api.php`
- متوفر على: `http://localhost:8000/api`
- يتضمن:
  - Auth endpoints (login, register, logout, Google OAuth)
  - Schools endpoints
  - Statistics endpoints

#### ✔️ Environment Variables
- الملف: `.env`
- `FRONTEND_URL=http://localhost:3000`
- `APP_URL=http://localhost:8000`

---

### 2. إعدادات Frontend (React):

#### ✔️ Axios Configuration
- الملف: `frontend/my-project-main/src/services/axios.instance.js`
- يضيف التوكن تلقائياً للطلبات
- معالجة الأخطاء بالعربية

#### ✔️ API Endpoints Config
- الملف: `frontend/my-project-main/src/config/api.config.js`
- يحتوي على جميع الـ endpoints

#### ✔️ API Service (جديد)
- الملف: `frontend/my-project-main/src/services/apiService.js`
- خدمة مركزية لجميع طلبات API

#### ✔️ Environment Variables
- الملف: `frontend/my-project-main/.env`
- `REACT_APP_API_URL=http://127.0.0.1:8000`
- `REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api`

---

## 🚀 خطوات التشغيل:

### 1. تشغيل Backend (Laravel):

```powershell
# في المجلد الرئيسي للمشروع
php artisan serve
```

سيعمل على: `http://localhost:8000`

### 2. تشغيل Frontend (React):

```powershell
# انتقل لمجلد الفرونت إند
cd frontend\my-project-main

# قم بتثبيت الحزم (أول مرة فقط)
npm install

# شغّل التطبيق
npm start
```

سيعمل على: `http://localhost:3000`

---

## 📝 كيفية الاستخدام في React:

### مثال بسيط - جلب المدارس:

```javascript
import React, { useEffect, useState } from 'react';
import { schoolsAPI } from './services/apiService';

function SchoolsList() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const response = await schoolsAPI.getAll();
        setSchools(response.data.data);
      } catch (error) {
        console.error('خطأ:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSchools();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div>
      {schools.map(school => (
        <div key={school.id}>
          <h3>{school.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default SchoolsList;
```

### مثال - تسجيل الدخول:

```javascript
import React, { useState } from 'react';
import { authAPI, saveToken } from './services/apiService';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login({ email, password });
      saveToken(response.data.token);
      alert('تم تسجيل الدخول بنجاح!');
    } catch (error) {
      alert('خطأ: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="البريد الإلكتروني"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="كلمة المرور"
      />
      <button type="submit">دخول</button>
    </form>
  );
}

export default LoginForm;
```

---

## 📚 الـ APIs المتاحة:

### 1. المصادقة (Auth):
```javascript
import { authAPI, saveToken, removeToken } from './services/apiService';

// تسجيل الدخول
await authAPI.login({ email, password });

// تسجيل مستخدم جديد
await authAPI.register({ name, email, password, password_confirmation });

// تسجيل الخروج
await authAPI.logout();

// الحصول على المستخدم الحالي
await authAPI.getCurrentUser();

// Google OAuth
await authAPI.loginWithGoogle(tokenId);
```

### 2. المدارس (Schools):
```javascript
import { schoolsAPI } from './services/apiService';

// جميع المدارس
await schoolsAPI.getAll();

// مدرسة واحدة
await schoolsAPI.getById(id);

// أفضل المدارس
await schoolsAPI.getBest();

// المدارس الحديثة
await schoolsAPI.getRecent();

// البحث
await schoolsAPI.search({ q: 'اسم المدرسة' });

// حسب المنطقة
await schoolsAPI.getByRegion('المنطقة');

// قائمة المناطق
await schoolsAPI.getRegions();
```

### 3. التقييمات (Ratings):
```javascript
import { ratingsAPI } from './services/apiService';

// جميع التقييمات
await ratingsAPI.getAll();

// تقييمات مدرسة معينة
await ratingsAPI.getBySchool(schoolId);

// إضافة تقييم
await ratingsAPI.create({ school_id, rating, comment });

// إحصائيات التقييمات
await ratingsAPI.getStatistics();
```

### 4. الإحصائيات (Statistics):
```javascript
import { statisticsAPI } from './services/apiService';

// إحصائيات عامة
await statisticsAPI.general();

// إحصائيات المديريات
await statisticsAPI.directorates();
```

### 5. التواصل (Contact):
```javascript
import { contactAPI } from './services/apiService';

// إرسال رسالة
await contactAPI.send({ name, email, message });
```

---

## 🔧 اختبار الاتصال:

### اختبر من الفرونت إند:

1. افتح Developer Tools في المتصفح (F12)
2. اذهب لـ Console
3. جرّب هذا الكود:

```javascript
import { schoolsAPI } from './services/apiService';

// اختبر جلب المدارس
schoolsAPI.getAll()
  .then(response => console.log('نجح!', response.data))
  .catch(error => console.error('فشل!', error));
```

---

## ⚠️ مشاكل شائعة وحلولها:

### 1. خطأ CORS:
**المشكلة:** `Access to XMLHttpRequest has been blocked by CORS policy`

**الحل:**
- تأكد أن Laravel يعمل على `http://localhost:8000`
- تحقق من `config/cors.php` في Laravel
- تأكد من `FRONTEND_URL` في `.env`

### 2. خطأ Network:
**المشكلة:** `Network Error` أو `ERR_CONNECTION_REFUSED`

**الحل:**
- تأكد أن Laravel يعمل (`php artisan serve`)
- تحقق من الرابط في `.env` الفرونت إند

### 3. خطأ 401 Unauthorized:
**المشكلة:** الطلبات المحمية ترجع 401

**الحل:**
- تأكد من تسجيل الدخول أولاً
- تحقق من وجود التوكن: `localStorage.getItem('authToken')`

### 4. خطأ 404 Not Found:
**المشكلة:** الـ endpoint غير موجود

**الحل:**
- تحقق من `routes/api.php` في Laravel
- تأكد من الـ URL صحيح في الفرونت إند

---

## 📋 Checklist - قبل البدء:

- [ ] Laravel يعمل على `http://localhost:8000`
- [ ] React يعمل على `http://localhost:3000`
- [ ] ملف `.env` موجود في مجلد Laravel
- [ ] ملف `.env` موجود في `frontend/my-project-main`
- [ ] تم تشغيل `composer install` في Laravel
- [ ] تم تشغيل `npm install` في React
- [ ] قاعدة البيانات معدّة ومتصلة
- [ ] تم تشغيل `php artisan migrate`

---

## 🎉 خلاص! الربط جاهز

الآن يمكنك استخدام الـ APIs في أي مكون React بكل سهولة!

راجع ملف `src/services/API_USAGE.md` لأمثلة إضافية.
