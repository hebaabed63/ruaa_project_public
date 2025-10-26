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
        Schema::create('school_evaluations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_id');
            $table->foreign('school_id')->references('school_id')->on('schools')->onDelete('cascade');
            $table->unsignedBigInteger('evaluator_id');
            $table->foreign('evaluator_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->date('evaluation_date');
            $table->json('criteria');
            $table->json('scores');
            $table->decimal('total_score', 5, 2);
            $table->text('notes')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_evaluations');
    }
};
