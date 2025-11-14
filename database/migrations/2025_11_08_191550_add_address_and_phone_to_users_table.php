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
        Schema::table('users', function (Blueprint $table) {
           Schema::table('users', function (Blueprint $table) {
            $table->string('address')->nullable()->after('email'); // بعد الايميل، يسمح بأن يكون فارغ
            $table->string('phone')->nullable()->after('address'); // بعد العنوان
        });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
              Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['address', 'phone']);
        });
        });
    }
};
