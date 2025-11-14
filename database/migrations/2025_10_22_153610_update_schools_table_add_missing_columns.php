<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            // Add missing columns that the controller expects
            if (!Schema::hasColumn('schools', 'location')) {
                $table->string('location')->nullable()->after('cover_image');
            }
            
            if (!Schema::hasColumn('schools', 'region')) {
                $table->string('region')->nullable()->after('type');
            }
            
            if (!Schema::hasColumn('schools', 'capacity')) {
                $table->integer('capacity')->nullable()->after('region');
            }
            
            if (!Schema::hasColumn('schools', 'description')) {
                $table->text('description')->nullable()->after('capacity');
            }
            
            if (!Schema::hasColumn('schools', 'contact_phone')) {
                $table->string('contact_phone')->nullable()->after('description');
            }
            
            if (!Schema::hasColumn('schools', 'contact_email')) {
                $table->string('contact_email')->nullable()->after('contact_phone');
            }
            
            if (!Schema::hasColumn('schools', 'established_year')) {
                $table->integer('established_year')->nullable()->after('contact_email');
            }
            
            // Remove the old address column if it exists
            if (Schema::hasColumn('schools', 'address')) {
                $table->dropColumn('address');
            }
            
            // Update the type column to use Arabic values if it doesn't already have the correct enum
            if (Schema::hasColumn('schools', 'type')) {
                // We'll handle this differently to avoid conflicts
                // First, check if the column already has the correct enum values
                // For now, we'll just leave it as is since modifying enum columns can be complex
            } else {
                $table->enum('type', ['ابتدائي', 'متوسط', 'ثانوي'])->after('logo');
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
            if (Schema::hasColumn('schools', 'location')) $columnsToDrop[] = 'location';
            if (Schema::hasColumn('schools', 'region')) $columnsToDrop[] = 'region';
            if (Schema::hasColumn('schools', 'capacity')) $columnsToDrop[] = 'capacity';
            if (Schema::hasColumn('schools', 'description')) $columnsToDrop[] = 'description';
            if (Schema::hasColumn('schools', 'contact_phone')) $columnsToDrop[] = 'contact_phone';
            if (Schema::hasColumn('schools', 'contact_email')) $columnsToDrop[] = 'contact_email';
            if (Schema::hasColumn('schools', 'established_year')) $columnsToDrop[] = 'established_year';
            
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
            
            // Restore the old address column
            if (!Schema::hasColumn('schools', 'address')) {
                $table->text('address')->nullable();
            }
        });
    }
};