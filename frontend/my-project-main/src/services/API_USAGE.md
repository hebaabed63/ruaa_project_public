# دليل استخدام API

## الاستيراد:
```javascript
import { authAPI, schoolsAPI, saveToken } from '../services/apiService';
```

## أمثلة:

### تسجيل الدخول:
```javascript
const response = await authAPI.login({ email, password });
saveToken(response.data.token);
```

### جلب المدارس:
```javascript
const response = await schoolsAPI.getAll();
const schools = response.data.data;
```

### البحث:
```javascript
const response = await schoolsAPI.search({ q: 'اسم المدرسة' });
```
