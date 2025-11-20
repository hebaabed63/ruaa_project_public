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
            if (!Schema::hasColumn('schools', 'english_name')) {
                $table->string('english_name')->nullable()->after('name');
            }
            if (!Schema::hasColumn('schools', 'description')) {
                $table->text('description')->nullable()->after('english_name');
            }
            
            // الموقع
            if (!Schema::hasColumn('schools', 'region')) {
                $table->string('region')->nullable()->after('address'); // غزة، الضفة الغربية
            }
            if (!Schema::hasColumn('schools', 'city')) {
                $table->string('city')->nullable()->after('region');
            }
            if (!Schema::hasColumn('schools', 'directorate')) {
                $table->string('directorate')->nullable()->after('city'); // المديرية
            }
            if (!Schema::hasColumn('schools', 'latitude')) {
                $table->decimal('latitude', 10, 8)->nullable()->after('directorate');
            }
            if (!Schema::hasColumn('schools', 'longitude')) {
                $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            }
            
            // تعديل نوع المدرسة ليشمل المزيد من الخيارات
            if (!Schema::hasColumn('schools', 'school_type')) {
                $table->string('school_type')->nullable()->after('type'); // حكومية، خاصة، وكالة، دولية
            }
            
            // المرحلة التعليمية - حقل جديد
            if (!Schema::hasColumn('schools', 'level')) {
                $table->string('level')->nullable()->after('school_type'); // ابتدائية، إعدادية، ثانوية
            }
            
            // معلومات إضافية
            if (!Schema::hasColumn('schools', 'principal_name')) {
                $table->string('principal_name')->nullable()->after('level'); // اسم المدير
            }
            if (!Schema::hasColumn('schools', 'students_count')) {
                $table->integer('students_count')->default(0)->after('principal_name');
            }
            if (!Schema::hasColumn('schools', 'teachers_count')) {
                $table->integer('teachers_count')->default(0)->after('students_count');
            }
            if (!Schema::hasColumn('schools', 'established')) {
                $table->year('established')->nullable()->after('teachers_count');
            }
            
            // التقييم
            if (!Schema::hasColumn('schools', 'rating')) {
                $table->decimal('rating', 3, 2)->default(0)->after('established');
            }
            if (!Schema::hasColumn('schools', 'reviews_count')) {
                $table->integer('reviews_count')->default(0)->after('rating');
            }
            
            // معلومات الاتصال
            if (!Schema::hasColumn('schools', 'phone')) {
                $table->string('phone')->nullable()->after('reviews_count');
            }
            if (!Schema::hasColumn('schools', 'email')) {
                $table->string('email')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('schools', 'website')) {
                $table->string('website')->nullable()->after('email');
            }
            
            // ميزات المدرسة
            if (!Schema::hasColumn('schools', 'features')) {
                $table->json('features')->nullable()->after('achievements'); // مكتبة، مختبر، ملعب
            }
            
            // حالة المدرسة
            if (!Schema::hasColumn('schools', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('features');
            }
            if (!Schema::hasColumn('schools', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('is_active'); // مميزة
            }
            
            // Indexes للبحث السريع (check if they exist first)
            if (!Schema::hasIndex('schools', 'schools_region_index')) {
                $table->index('region');
            }
            if (!Schema::hasIndex('schools', 'schools_city_index')) {
                $table->index('city');
            }
            if (!Schema::hasIndex('schools', 'schools_directorate_index')) {
                $table->index('directorate');
            }
            if (!Schema::hasIndex('schools', 'schools_school_type_index')) {
                $table->index('school_type');
            }
            if (!Schema::hasIndex('schools', 'schools_level_index')) {
                $table->index('level');
            }
            if (!Schema::hasIndex('schools', 'schools_rating_index')) {
                $table->index('rating');
            }
            if (!Schema::hasIndex('schools', 'schools_is_active_index')) {
                $table->index('is_active');
            }
            if (!Schema::hasIndex('schools', 'schools_is_featured_index')) {
                $table->index('is_featured');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            // Check if columns exist before dropping
            $columnsToDrop = [];
            
            if (Schema::hasColumn('schools', 'english_name')) $columnsToDrop[] = 'english_name';
            if (Schema::hasColumn('schools', 'description')) $columnsToDrop[] = 'description';
            if (Schema::hasColumn('schools', 'region')) $columnsToDrop[] = 'region';
            if (Schema::hasColumn('schools', 'city')) $columnsToDrop[] = 'city';
            if (Schema::hasColumn('schools', 'directorate')) $columnsToDrop[] = 'directorate';
            if (Schema::hasColumn('schools', 'latitude')) $columnsToDrop[] = 'latitude';
            if (Schema::hasColumn('schools', 'longitude')) $columnsToDrop[] = 'longitude';
            if (Schema::hasColumn('schools', 'school_type')) $columnsToDrop[] = 'school_type';
            if (Schema::hasColumn('schools', 'level')) $columnsToDrop[] = 'level';
            if (Schema::hasColumn('schools', 'principal_name')) $columnsToDrop[] = 'principal_name';
            if (Schema::hasColumn('schools', 'students_count')) $columnsToDrop[] = 'students_count';
            if (Schema::hasColumn('schools', 'teachers_count')) $columnsToDrop[] = 'teachers_count';
            if (Schema::hasColumn('schools', 'established')) $columnsToDrop[] = 'established';
            if (Schema::hasColumn('schools', 'rating')) $columnsToDrop[] = 'rating';
            if (Schema::hasColumn('schools', 'reviews_count')) $columnsToDrop[] = 'reviews_count';
            if (Schema::hasColumn('schools', 'phone')) $columnsToDrop[] = 'phone';
            if (Schema::hasColumn('schools', 'email')) $columnsToDrop[] = 'email';
            if (Schema::hasColumn('schools', 'website')) $columnsToDrop[] = 'website';
            if (Schema::hasColumn('schools', 'features')) $columnsToDrop[] = 'features';
            if (Schema::hasColumn('schools', 'is_active')) $columnsToDrop[] = 'is_active';
            if (Schema::hasColumn('schools', 'is_featured')) $columnsToDrop[] = 'is_featured';
            
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};