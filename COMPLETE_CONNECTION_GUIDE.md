# 🔗 دليل الربط الكامل بين Backend و Frontend

## 📋 نظرة عامة

تم ربط الباك اند (Laravel) بالفرونت اند (React) بنجاح عبر الـ API. هذا الدليل يوضح كيفية الاستخدام والصيانة.

---

## ✅ ما تم إنجازه

### 1. إعدادات Backend (Laravel)
- ✅ **API Routes**: تم إعداد جميع المسارات في `routes/api.php`
- ✅ **CORS Configuration**: تم تكوين CORS في `config/cors.php`
- ✅ **Controllers**: تم إنشاء controllers للـ API
- ✅ **Authentication**: تم إعداد Laravel Sanctum للمصادقة

### 2. إعدادات Frontend (React)
- ✅ **Axios Instance**: تم إعداد axios مع interceptors في `src/services/axios.instance.js`
- ✅ **API Service**: تم إنشاء خدمة مركزية في `src/services/apiService.js`
- ✅ **API Config**: تم إعداد ملف التكوين في `src/config/api.config.js`
- ✅ **Test Component**: تم إنشاء مكون اختبار في `src/components/APIConnectionTest.jsx`

---

## 🚀 كيفية التشغيل

### 1. تشغيل Backend
```powershell
# في المجلد الرئيسي للمشروع
php artisan serve --host=127.0.0.1 --port=8000
```

### 2. تشغيل Frontend
```powershell
# انتقل لمجلد الفرونت اند
cd frontend\my-project-main

# قم بتثبيت الحزم (أول مرة فقط)
npm install

# شغّل التطبيق
npm start
```

### 3. التحقق من التشغيل
- **Backend**: http://127.0.0.1:8000
- **Frontend**: http://localhost:3000
- **API**: http://127.0.0.1:8000/api

---

## 📚 استخدام الـ APIs في React

### مثال بسيط - جلب المدارس

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
          <p>{school.address}</p>
        </div>
      ))}
    </div>
  );
}

export default SchoolsList;
```

### مثال - تسجيل الدخول

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

## 🔧 الـ APIs المتاحة

### 1. المصادقة (Auth)
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

// نسيت كلمة المرور
await authAPI.forgotPassword(email);

// إعادة تعيين كلمة المرور
await authAPI.resetPassword(token, password, passwordConfirmation);
```

### 2. المدارس (Schools)
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

### 3. التقييمات (Ratings)
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

### 4. الإحصائيات (Statistics)
```javascript
import { statisticsAPI } from './services/apiService';

// إحصائيات عامة
await statisticsAPI.general();

// إحصائيات المديريات
await statisticsAPI.directorates();
```

### 5. التواصل (Contact)
```javascript
import { contactAPI } from './services/apiService';

// إرسال رسالة
await contactAPI.send({ name, email, message });
```

---

## 🧪 اختبار الاتصال

### استخدام مكون الاختبار
```javascript
import APIConnectionTest from './components/APIConnectionTest';

function App() {
  return <APIConnectionTest />;
}
```

### اختبار يدوي من Console
```javascript
// افتح Developer Tools (F12) في المتصفح
// اذهب لـ Console وجرّب:

import { schoolsAPI } from './services/apiService';

// اختبر جلب المدارس
schoolsAPI.getAll()
  .then(response => console.log('نجح!', response.data))
  .catch(error => console.error('فشل!', error));
```

---

## ⚠️ حل المشاكل الشائعة

### 1. خطأ CORS
**المشكلة:** `Access to XMLHttpRequest has been blocked by CORS policy`

**الحل:**
- تأكد أن Laravel يعمل على `http://127.0.0.1:8000`
- تحقق من `config/cors.php` في Laravel
- تأكد من `FRONTEND_URL` في `.env`

### 2. خطأ Network
**المشكلة:** `Network Error` أو `ERR_CONNECTION_REFUSED`

**الحل:**
- تأكد أن Laravel يعمل (`php artisan serve`)
- تحقق من الرابط في `.env` الفرونت اند
- تأكد من أن البورت 8000 غير مستخدم

### 3. خطأ 401 Unauthorized
**المشكلة:** الطلبات المحمية ترجع 401

**الحل:**
- تأكد من تسجيل الدخول أولاً
- تحقق من وجود التوكن: `localStorage.getItem('authToken')`
- تأكد من إرسال التوكن في Header

### 4. خطأ 404 Not Found
**المشكلة:** الـ endpoint غير موجود

**الحل:**
- تحقق من `routes/api.php` في Laravel
- تأكد من الـ URL صحيح في الفرونت اند
- تأكد من أن Controller موجود

### 5. خطأ 500 Internal Server Error
**المشكلة:** خطأ في الخادم

**الحل:**
- تحقق من logs Laravel: `storage/logs/laravel.log`
- تأكد من اتصال قاعدة البيانات
- تأكد من أن `.env` صحيح

---

## 📁 ملفات مهمة

### Backend
- `routes/api.php` - مسارات الـ API
- `config/cors.php` - إعدادات CORS
- `app/Http/Controllers/Api/` - Controllers الـ API
- `.env` - متغيرات البيئة

### Frontend
- `src/services/apiService.js` - خدمة الـ API المركزية
- `src/services/axios.instance.js` - إعداد Axios
- `src/config/api.config.js` - تكوين الـ API
- `src/components/APIConnectionTest.jsx` - مكون الاختبار

---

## 🔄 تحديثات مستقبلية

### إضافة API جديد
1. أضف المسار في `routes/api.php`
2. أنشئ Controller في `app/Http/Controllers/Api/`
3. أضف الدالة في `src/services/apiService.js`
4. اختبر باستخدام `APIConnectionTest`

### إضافة مصادقة جديدة
1. أضف المسار في `routes/api.php`
2. أضف الدالة في `authAPI` في `apiService.js`
3. اختبر تسجيل الدخول

---

## 📞 الدعم والمساعدة

إذا واجهت أي مشاكل:

1. **تحقق من التشغيل**: تأكد أن كلا الخادمين يعملان
2. **استخدم مكون الاختبار**: `APIConnectionTest` يساعد في التشخيص
3. **تحقق من Console**: ابحث عن أخطاء JavaScript
4. **تحقق من Network Tab**: في Developer Tools
5. **تحقق من Laravel Logs**: `storage/logs/laravel.log`

---

## 🎉 خلاصة

الربط بين الباك اند والفرونت اند جاهز ويعمل بشكل صحيح! يمكنك الآن:

- ✅ استخدام جميع الـ APIs في React
- ✅ تسجيل الدخول والخروج
- ✅ جلب البيانات من قاعدة البيانات
- ✅ إرسال البيانات للخادم
- ✅ التعامل مع الأخطاء بالعربية

ابدأ ببناء مكوناتك واستخدام الـ APIs! 🚀

