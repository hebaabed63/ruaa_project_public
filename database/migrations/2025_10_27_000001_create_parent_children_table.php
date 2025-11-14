<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * جدول أبناء أولياء الأمور
     */
    public function up()
    {
        Schema::create('parent_children', function (Blueprint $table) {
            $table->id('child_id');
            $table->foreignId('parent_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('school_id')->constrained('schools', 'school_id')->onDelete('cascade');
            $table->string('child_name');
            $table->string('child_grade')->nullable(); // الصف الدراسي
            $table->string('child_section')->nullable(); // الشعبة
            $table->enum('status', ['active', 'inactive', 'transferred'])->default('active');
            $table->date('enrollment_date')->nullable(); // تاريخ الالتحاق
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('parent_children');
    }
};
