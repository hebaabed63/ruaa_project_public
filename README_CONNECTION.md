# 🔗 دليل الربط بين Backend و Frontend - مشروع Ruaa

## 📋 نظرة عامة

هذا المشروع يربط بين:
- **Backend:** Laravel 10 + MySQL (API Server)
- **Frontend:** React 19 (Single Page Application)

---

## ⚡ البدء السريع

### 1. شغّل Backend:
```powershell
php artisan serve
```

### 2. شغّل Frontend:
```powershell
cd frontend\my-project-main
npm start
```

### 3. جاهز! 🎉
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API: http://localhost:8000/api

---

## 📁 هيكل المشروع

```
ruaa_project/
├── app/                    # Laravel Backend
├── config/
│   └── cors.php           # ✅ تم تعديله
├── routes/
│   └── api.php            # API Routes
├── frontend/
│   └── my-project-main/   # React Frontend
│       └── src/
│           ├── config/
│           │   └── api.config.js
│           ├── services/
│           │   ├── axios.instance.js    # ✅ تم تعديله
│           │   ├── apiService.js        # ✅ جديد
│           │   └── API_USAGE.md
│           └── components/
│               └── APITest.jsx          # ✅ جديد
├── BACKEND_FRONTEND_CONNECTION.md       # ✅ دليل شامل
├── QUICK_START.md                       # ✅ بدء سريع
└── WHAT_WAS_DONE.md                     # ✅ ملخص ما تم
```

---

## 🔌 كيف تستخدم API في React

### الطريقة البسيطة:

```javascript
import { schoolsAPI, authAPI } from './services/apiService';

// في أي مكون React
async function loadSchools() {
  try {
    const response = await schoolsAPI.getAll();
    console.log(response.data.data); // المدارس
  } catch (error) {
    console.error(error.message);
  }
}
```

### مثال كامل:

```javascript
import React, { useEffect, useState } from 'react';
import { schoolsAPI } from './services/apiService';

function SchoolsList() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    schoolsAPI.getAll()
      .then(res => setSchools(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {schools.map(school => (
        <div key={school.id}>{school.name}</div>
      ))}
    </div>
  );
}
```

---

## 🧪 اختبار الاتصال

استخدم مكون `APITest` للتأكد من أن كل شيء يعمل:

```javascript
import APITest from './components/APITest';

function App() {
  return <APITest />;
}
```

---

## 📚 APIs المتاحة

### 🔐 Auth (المصادقة)
```javascript
authAPI.login({ email, password })
authAPI.register({ name, email, password, password_confirmation })
authAPI.logout()
authAPI.getCurrentUser()
authAPI.loginWithGoogle(tokenId)
```

### 🏫 Schools (المدارس)
```javascript
schoolsAPI.getAll()
schoolsAPI.getById(id)
schoolsAPI.getBest()
schoolsAPI.getRecent()
schoolsAPI.search({ q: 'اسم' })
schoolsAPI.getByRegion('المنطقة')
```

### ⭐ Ratings (التقييمات)
```javascript
ratingsAPI.getAll()
ratingsAPI.getBySchool(schoolId)
ratingsAPI.create({ school_id, rating, comment })
```

### 📊 Statistics (الإحصائيات)
```javascript
statisticsAPI.general()
statisticsAPI.directorates()
```

---

## 🛠️ الإعدادات

### Backend `.env`:
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`:
```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## ❓ حل المشاكل

### خطأ CORS؟
✅ تأكد أن `php artisan serve` يعمل

### خطأ Network؟
✅ تحقق من `.env` في Frontend

### خطأ 401؟
✅ سجّل الدخول أولاً واحفظ التوكن

---

## 📖 المزيد من المعلومات

- **دليل شامل:** `BACKEND_FRONTEND_CONNECTION.md`
- **بدء سريع:** `QUICK_START.md`
- **ما تم إنجازه:** `WHAT_WAS_DONE.md`
- **أمثلة الاستخدام:** `frontend/my-project-main/src/services/API_USAGE.md`

---

## ✅ تم بنجاح!

الربط جاهز ويعمل. ابدأ باستخدام APIs في مكونات React!
