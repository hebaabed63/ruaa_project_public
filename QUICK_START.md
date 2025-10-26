# 🚀 دليل البدء السريع

## الخطوات للتشغيل:

### 1️⃣ شغّل Backend (Laravel):

```powershell
php artisan serve
```

يجب أن ترى: `Laravel development server started: http://127.0.0.1:8000`

---

### 2️⃣ شغّل Frontend (React) - في نافذة PowerShell جديدة:

```powershell
cd frontend\my-project-main
npm start
```

سيفتح المتصفح تلقائياً على: `http://localhost:3000`

---

### 3️⃣ اختبر الربط:

أضف هذا المكون لأي صفحة في React:

```javascript
import APITest from './components/APITest';

function App() {
  return (
    <div>
      <APITest />
    </div>
  );
}
```

ثم اضغط على زر "اختبر جلب المدارس"

---

## 📝 استخدام API في مكوناتك:

```javascript
import { schoolsAPI, authAPI } from './services/apiService';

// مثال: جلب المدارس
const response = await schoolsAPI.getAll();
const schools = response.data.data;

// مثال: تسجيل الدخول
const response = await authAPI.login({ email, password });
```

---

## ✅ الربط اكتمل!

راجع `BACKEND_FRONTEND_CONNECTION.md` للتفاصيل الكاملة.
