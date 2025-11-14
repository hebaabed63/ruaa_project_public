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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('rating')->unsigned(); // 1=يحتاج تحسين، 2=جيد، 3=ممتاز
            $table->string('mood')->nullable();         // sad | neutral | happy
            $table->text('comment')->nullable();        // نص التعليق
            $table->timestamps();
        });
}
public function down(): void {
    Schema::dropIfExists('feedback');
}
};
