# دليل استخدام API Services

## البنية

```
services/
├── axios.instance.js      # إعداد Axios مع Interceptors
├── schools.service.js     # خدمات API للمدارس
├── ratings.service.js     # خدمات API للتقييمات (قريباً)
└── README.md             # هذا الملف
```

## كيفية الاستخدام

### 1. إعداد البيئة

قم بإنشاء ملف `.env` في جذر المشروع:

```bash
cp .env.example .env
```

ثم عدّل `REACT_APP_API_BASE_URL` ليشير إلى الباك إند:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

### 2. استخدام Schools Service

```javascript
import schoolsService from '../services/schools.service';

// جلب جميع المدارس
const schools = await schoolsService.getAllSchools({
  page: 1,
  limit: 10,
  region: 'غزة'
});

// جلب مدرسة معينة
const school = await schoolsService.getSchoolById(1);

// البحث عن المدارس
const results = await schoolsService.searchSchools({
  query: 'النجاح',
  region: 'غزة',
  type: 'حكومية'
});

// جلب أفضل المدارس
const bestSchools = await schoolsService.getBestSchools(5);
```

### 3. معالجة الأخطاء

جميع الدوال ترمي أخطاء في حالة الفشل، استخدم try-catch:

```javascript
try {
  const data = await schoolsService.getAllSchools();
  console.log(data);
} catch (error) {
  console.error('خطأ:', error.message);
  // عرض رسالة خطأ للمستخدم
}
```

### 4. Axios Interceptors

#### Request Interceptor
- يضيف التوكن تلقائياً من localStorage
- يضيف اللغة العربية في الهيدر
- يطبع معلومات الطلب في وضع التطوير

#### Response Interceptor
- يطبع الاستجابة في وضع التطوير
- يعالج الأخطاء ويحولها لرسائل عربية مفهومة
- يتعامل مع أخطاء 401, 403, 404, 500, إلخ

## الخطوات القادمة

- [ ] إنشاء `ratings.service.js` للتقييمات
- [ ] إنشاء `statistics.service.js` للإحصائيات
- [ ] إنشاء `contact.service.js` للتواصل
- [ ] إنشاء `about.service.js` لصفحة عن المنصة
- [ ] إضافة Unit Tests للخدمات

## ملاحظات مهمة

1. **التوكن**: يتم حفظ التوكن في `localStorage` بمفتاح `authToken`
2. **اللغة**: جميع الطلبات تُرسل مع `Accept-Language: ar`
3. **Timeout**: الحد الأقصى للانتظار 30 ثانية
4. **Base URL**: يُقرأ من متغير البيئة `REACT_APP_API_BASE_URL`

## مثال كامل

```javascript
import React, { useState, useEffect } from 'react';
import schoolsService from '../services/schools.service';

function SchoolsList() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const data = await schoolsService.getAllSchools();
        setSchools(data.data?.schools || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div>
      {schools.map(school => (
        <div key={school.id}>{school.name}</div>
      ))}
    </div>
  );
}
```
