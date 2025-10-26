# Backend API Documentation for Public Pages

## Overview
هذا التوثيق يغطي جميع API endpoints المتعلقة بالصفحات العامة (Public Pages) للفرونت إند.

## Base URL
```
http://localhost:8000/api
```

## Authentication
معظم endpoints عامة ولا تحتاج authentication. فقط endpoints التقييمات تحتاج token.

---

## 1. About Page API

### Get About Page Data
**Endpoint:** `GET /api/about`

**Response:**
```json
{
  "success": true,
  "data": {
    "pageInfo": {
      "title": "عن المنصّة",
      "lastUpdated": "2025-01-25T09:00:00.000000Z",
      "description": "منصة رؤى للتقييم التعليمي في فلسطين"
    },
    "goalVision": {
      "goal": {
        "title": "الهدف",
        "content": "..."
      },
      "vision": {
        "title": "الرؤية",
        "content": "..."
      }
    },
    "values": [...],
    "story": {...},
    "statistics": [...],
    "partners": [...],
    "developmentPlan": [...]
  }
}
```

---

## 2. Contact API

### Get Contact Info
**Endpoint:** `GET /api/contact/info`

**Response:**
```json
{
  "success": true,
  "data": {
    "contactInfo": {
      "email": "info@ruaa-platform.ps",
      "phone": "+970-2-123-4567",
      "address": "رام الله، فلسطين",
      "workingHours": "السبت - الخميس: 8:00 - 16:00"
    },
    "mapData": {
      "coordinates": {
        "lat": 31.8,
        "lng": 35.0
      },
      "embedUrl": "...",
      "zoomLevel": 8
    }
  }
}
```

### Submit Contact Form
**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "phone": "+970-599-123456",
  "subject": "استفسار عن المنصة",
  "message": "أريد معرفة المزيد..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً",
  "data": {...}
}
```

---

## 3. Schools API

### Get All Schools
**Endpoint:** `GET /api/schools`

**Query Parameters:**
- `region` - Filter by region (الضفة الغربية / قطاع غزة)
- `city` - Filter by city
- `type` - Filter by school type
- `directorate_code` - Filter by directorate
- `search` - Search term

**Example:** `GET /api/schools?region=قطاع غزة&type=ابتدائية`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "مدرسة دار الأرقم",
      "englishName": "Dar Al-Arqam School",
      "coordinates": {
        "lat": 31.5203,
        "lng": 34.4776
      },
      "address": "حي الشجاعية، غزة الشرقية",
      "region": "قطاع غزة",
      "directorate": "مديرية شرق غزة",
      "directorateCode": "east_gaza",
      "city": "غزة",
      "type": "أساسية",
      "rating": 4.3,
      "studentsCount": 620,
      "subjects": ["التربية الإسلامية", "العربية", "الرياضيات"],
      "description": "مدرسة إسلامية معروفة...",
      "phone": "+970-8-789-0123",
      "established": 1990,
      "features": ["مسجد", "مكتبة إسلامية", "قاعة محاضرات"]
    }
  ]
}
```

### Get Single School
**Endpoint:** `GET /api/schools/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "...",
    "ratings": [...]
  }
}
```

### Get Best Schools
**Endpoint:** `GET /api/schools/best-schools`

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

### Get Schools Statistics
**Endpoint:** `GET /api/schools/statistics`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSchools": 700,
    "totalStudents": 150000,
    "avgRating": 4.2,
    "schoolTypes": 8,
    "byRegion": {
      "westBank": 400,
      "gaza": 300
    }
  }
}
```

---

## 4. Ratings API

### Get Evaluation Criteria
**Endpoint:** `GET /api/ratings/criteria`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "جودة التعليم",
      "description": "مستوى التدريس والمناهج",
      "icon": "book"
    }
  ]
}
```

### Get School Ratings
**Endpoint:** `GET /api/ratings/school/{schoolId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "school": {
      "id": 1,
      "name": "...",
      "averageRating": 4.3
    },
    "ratings": [...],
    "pagination": {
      "currentPage": 1,
      "lastPage": 5,
      "perPage": 10,
      "total": 50
    }
  }
}
```

### Submit Rating (Requires Authentication)
**Endpoint:** `POST /api/ratings`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "school_id": 1,
  "parent_name": "أحمد محمد",
  "rating": 4.5,
  "comment": "مدرسة ممتازة...",
  "criteria": {
    "teaching_quality": 5,
    "environment": 4,
    "activities": 4
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إرسال تقييمك بنجاح. سيتم مراجعته قريباً",
  "data": {...}
}
```

---

## 5. Services API

### Get All Services
**Endpoint:** `GET /api/services`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "تقييم شامل للمدارس",
      "description": "...",
      "icon": "star",
      "features": [...],
      "order": 1
    }
  ]
}
```

---

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "message": "البيانات غير موجودة"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "بيانات غير صالحة",
  "errors": {
    "email": ["البريد الإلكتروني مطلوب"]
  }
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "حدث خطأ أثناء جلب البيانات",
  "error": "..."
}
```

---

## Setup Instructions

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Run Seeders
```bash
php artisan db:seed --class=AboutSeeder
php artisan db:seed --class=ServicesSeeder
```

### 3. Update Frontend API Calls
استبدل الـ Mock API calls في الفرونت بالـ API الحقيقي:

```javascript
// Before (Mock)
const aboutApiService = {
  getPageData: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockData;
  }
};

// After (Real API)
const aboutApiService = {
  getPageData: async () => {
    const response = await fetch('http://localhost:8000/api/about');
    return await response.json();
  }
};
```

---

## Models Created
✅ About
✅ Contact
✅ SchoolRating
✅ SchoolEvaluation
✅ Service

## Controllers Created
✅ AboutController
✅ ContactController
✅ RatingController
✅ ServiceController

## Migrations Created
✅ about table
✅ contacts table
✅ school_ratings table
✅ school_evaluations table
✅ services table

## Routes Created
✅ /api/about
✅ /api/contact/*
✅ /api/schools/*
✅ /api/ratings/*
✅ /api/services

## Seeders Created
✅ AboutSeeder
✅ ServicesSeeder
