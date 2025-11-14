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
        Schema::create('student_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->string('term'); // e.g., '2024-2025-1'
            $table->json('summary')->nullable();
            $table->json('attendance')->nullable();
            $table->json('activity')->nullable();
            $table->json('grades')->nullable();
            $table->json('homeworks')->nullable();
            $table->timestamps();

            // Indexes for faster queries
            $table->index(['student_id', 'term']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_reports');
    }
};
