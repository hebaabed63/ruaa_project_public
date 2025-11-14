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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('notification_id');
            $table->unsignedBigInteger('user_id'); // المستخدم المستلم للإشعار
            $table->string('type'); // نوع الإشعار: report, message, evaluation, request, etc.
            $table->string('title'); // عنوان الإشعار
            $table->text('content'); // محتوى الإشعار
            $table->text('data')->nullable(); // بيانات إضافية JSON
            $table->string('link')->nullable(); // رابط الإشعار
            $table->boolean('is_read')->default(false); // هل قرأه المستخدم
            $table->timestamp('read_at')->nullable(); // وقت القراءة
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index(['user_id', 'is_read']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
