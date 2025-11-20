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
        if (!Schema::hasTable('conversations')) {
            Schema::create('conversations', function (Blueprint $table) {
                $table->id('conversation_id');
                $table->unsignedBigInteger('parent_id'); // ولي الأمر
                $table->unsignedBigInteger('school_id'); // المدرسة
                $table->unsignedBigInteger('school_manager_id')->nullable(); // مدير المدرسة
                $table->string('title')->nullable();
                $table->dateTime('last_message_at')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
                
                $table->foreign('parent_id')->references('user_id')->on('users')->onDelete('cascade');
                $table->foreign('school_id')->references('school_id')->on('schools')->onDelete('cascade');
                $table->foreign('school_manager_id')->references('user_id')->on('users')->onDelete('set null');
                $table->unique(['parent_id', 'school_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};