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
        Schema::create('about', function (Blueprint $table) {
            $table->id();
            $table->string('goal_title');
            $table->text('goal_content');
            $table->string('vision_title');
            $table->text('vision_content');
            $table->string('story_title');
            $table->json('story_paragraphs');
            $table->json('values');
            $table->json('statistics');
            $table->json('partners');
            $table->json('development_plan');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about');
    }
};
