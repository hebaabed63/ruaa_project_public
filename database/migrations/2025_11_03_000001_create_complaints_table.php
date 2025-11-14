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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('users', 'user_id')->cascadeOnDelete();
            $table->foreignId('school_id')->constrained('schools', 'school_id')->cascadeOnDelete();
            $table->enum('type', ['transport', 'evaluation', 'communication', 'discipline', 'other']);
            $table->text('description');
            $table->string('attachment_path')->nullable();
            $table->enum('status', ['pending', 'in_review', 'responded', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
