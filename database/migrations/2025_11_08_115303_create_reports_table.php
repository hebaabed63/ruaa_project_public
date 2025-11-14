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
        Schema::create('reports', function (Blueprint $table) {
            $table->id('report_id');
            $table->unsignedBigInteger('supervisor_id');
            $table->unsignedBigInteger('school_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path')->nullable();
            $table->string('status')->default('draft'); // draft, submitted, reviewed, approved, rejected
            $table->string('priority')->default('medium'); // low, medium, high, urgent
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->text('review_comments')->nullable();
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('supervisor_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('school_id')->references('school_id')->on('schools')->onDelete('set null');
            $table->foreign('reviewed_by')->references('user_id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
