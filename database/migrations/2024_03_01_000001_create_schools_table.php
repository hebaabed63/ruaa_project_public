<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->id('school_id');
            $table->string('name');
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->text('address');
            $table->enum('type', ['primary', 'preparatory', 'secondary']);
            $table->json('certifications')->nullable();
            $table->json('achievements')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('schools');
    }
};
