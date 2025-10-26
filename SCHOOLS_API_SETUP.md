# دليل إعداد وتشغيل Schools API

## الملفات التي تم إنشاؤها:

### 1. Migration
- `database/migrations/2024_10_23_000001_add_api_fields_to_schools_table.php`

### 2. Model
- `app/Models/School.php` (تم تحديثه)

### 3. Controller
- `app/Http/Controllers/Api/SchoolController.php`

### 4. Routes
- `routes/api.php` (تم تحديثه)

### 5. Seeder
- `database/seeders/SchoolsSeeder.php`

---

## خطوات التشغيل:

### الخطوة 1: تشغيل Migration
```bash
php artisan migrate
```

### الخطوة 2: تشغيل Seeder (بيانات تجريبية)
```bash
php artisan db:seed --class=SchoolsSeeder
```

### الخطوة 3: تشغيل السيرفر
```bash
php artisan serve
```

السيرفر سيعمل على: `http://127.0.0.1:8000`

---

## API Endpoints المتاحة:

### 1. Get All Schools (مع Pagination و Filters)
```
GET http://127.0.0.1:8000/api/schools
```

**Query Parameters:**
- `page` - رقم الصفحة (default: 1)
- `limit` - عدد النتائج (default: 10)
- `region` - المنطقة (مثال: قطاع غزة)
- `city` - المدينة (مثال: غزة)
- `directorate` - المديرية
- `type` - نوع المدرسة
- `level` - المرحلة التعليمية
- `minRating` - أقل تقييم
- `sortBy` - الترتيب حسب (default: created_at)
- `order` - asc أو desc (default: desc)

**مثال:**
```
GET http://127.0.0.1:8000/api/schools?region=قطاع غزة&limit=5
```

### 2. Get Single School
```
GET http://127.0.0.1:8000/api/schools/{id}
```

**مثال:**
```
GET http://127.0.0.1:8000/api/schools/1
```

### 3. Get Best Schools
```
GET http://127.0.0.1:8000/api/schools/best?limit=10
```

### 4. Get Recently Added Schools
```
GET http://127.0.0.1:8000/api/schools/recent?limit=6
```

### 5. Search Schools
```
GET http://127.0.0.1:8000/api/schools/search?q=النجاح&region=قطاع غزة
```

**Query Parameters:**
- `q` - نص البحث
- `region` - المنطقة
- `type` - نوع المدرسة
- `level` - المرحلة
- `minRating` - أقل تقييم

### 6. Get Schools by Region
```
GET http://127.0.0.1:8000/api/schools/by-region?region=قطاع غزة
```

### 7. Get Regions List
```
GET http://127.0.0.1:8000/api/schools/regions
```

### 8. Get Statistics
```
GET http://127.0.0.1:8000/api/statistics/general
```

---

## اختبار الـ API:

### استخدام Postman:

1. افتح Postman
2. أنشئ Request جديد
3. اختر GET
4. أدخل URL: `http://127.0.0.1:8000/api/schools`
5. اضغط Send

### استخدام cURL:

```bash
# Get all schools
curl http://127.0.0.1:8000/api/schools

# Get best schools
curl http://127.0.0.1:8000/api/schools/best?limit=5

# Search
curl "http://127.0.0.1:8000/api/schools/search?q=النجاح"

# Get statistics
curl http://127.0.0.1:8000/api/statistics/general
```

### استخدام PowerShell:

```powershell
# Get all schools
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/schools" -Method Get

# Get best schools
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/schools/best?limit=5" -Method Get

# Get statistics
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/statistics/general" -Method Get
```

---

## Response Format:

جميع الاستجابات بالصيغة التالية:

### Success Response:
```json
{
    "success": true,
    "data": {
        "schools": [...],
        "total": 100,
        "current_page": 1,
        "last_page": 10
    },
    "message": "تم جلب المدارس بنجاح"
}
```

### Error Response:
```json
{
    "success": false,
    "message": "حدث خطأ أثناء جلب المدارس",
    "error": "Error details..."
}
```

---

## CORS Configuration:

إذا واجهت مشكلة CORS، تأكد من إعدادات `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

---

## الخطوات القادمة:

1. ✅ تشغيل Migration
2. ✅ تشغيل Seeder
3. ✅ تشغيل السيرفر
4. ✅ اختبار الـ APIs
5. 🔄 ربط الفرونت إند مع الباك إند
6. 🔄 إضافة APIs للتقييمات
7. 🔄 إضافة APIs للإحصائيات المتقدمة

---

## ملاحظات مهمة:

1. **Primary Key**: المدارس تستخدم `school_id` كـ primary key
2. **Soft Deletes**: غير مفعل حالياً (يمكن إضافته لاحقاً)
3. **Authentication**: الـ APIs العامة لا تحتاج authentication
4. **Validation**: يمكن إضافة Form Requests للـ validation لاحقاً
5. **Caching**: يمكن إضافة caching لتحسين الأداء

---

## Troubleshooting:

### خطأ: "Class 'Database\Seeders\School' not found"
```bash
composer dump-autoload
```

### خطأ: "SQLSTATE[42S02]: Base table or view not found"
```bash
php artisan migrate:fresh
php artisan db:seed --class=SchoolsSeeder
```

### خطأ: "Target class [ApiSchoolController] does not exist"
تأكد من namespace في Controller:
```php
namespace App\Http\Controllers\Api;
```
