<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * إضافة الحقول المطلوبة لـ API المدارس
     */
    public function up(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            // معلومات أساسية
            $table->string('english_name')->nullable()->after('name');
            $table->text('description')->nullable()->after('english_name');
            
            // الموقع
            $table->string('region')->nullable()->after('address'); // غزة، الضفة الغربية
            $table->string('city')->nullable()->after('region');
            $table->string('directorate')->nullable()->after('city'); // المديرية
            $table->decimal('latitude', 10, 8)->nullable()->after('directorate');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            
            // تعديل نوع المدرسة ليشمل المزيد من الخيارات
            // سنستخدم حقل جديد بدلاً من تعديل القديم
            $table->string('school_type')->nullable()->after('type'); // حكومية، خاصة، وكالة، دولية
            
            // المرحلة التعليمية - حقل جديد
            $table->string('level')->nullable()->after('school_type'); // ابتدائية، إعدادية، ثانوية
            
            // معلومات إضافية
            $table->string('principal_name')->nullable()->after('level'); // اسم المدير
            $table->integer('students_count')->default(0)->after('principal_name');
            $table->integer('teachers_count')->default(0)->after('students_count');
            $table->year('established')->nullable()->after('teachers_count');
            
            // التقييم
            $table->decimal('rating', 3, 2)->default(0)->after('established');
            $table->integer('reviews_count')->default(0)->after('rating');
            
            // معلومات الاتصال
            $table->string('phone')->nullable()->after('reviews_count');
            $table->string('email')->nullable()->after('phone');
            $table->string('website')->nullable()->after('email');
            
            // ميزات المدرسة
            $table->json('features')->nullable()->after('achievements'); // مكتبة، مختبر، ملعب
            
            // حالة المدرسة
            $table->boolean('is_active')->default(true)->after('features');
            $table->boolean('is_featured')->default(false)->after('is_active'); // مميزة
            
            // Indexes للبحث السريع
            $table->index('region');
            $table->index('city');
            $table->index('directorate');
            $table->index('school_type');
            $table->index('level');
            $table->index('rating');
            $table->index('is_active');
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropColumn([
                'english_name',
                'description',
                'region',
                'city',
                'directorate',
                'latitude',
                'longitude',
                'school_type',
                'level',
                'principal_name',
                'students_count',
                'teachers_count',
                'established',
                'rating',
                'reviews_count',
                'phone',
                'email',
                'website',
                'features',
                'is_active',
                'is_featured',
            ]);
        });
    }
};
