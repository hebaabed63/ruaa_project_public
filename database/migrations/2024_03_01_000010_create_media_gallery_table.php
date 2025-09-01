<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('media_gallery', function (Blueprint $table) {
            $table->id('media_id');
            $table->unsignedBigInteger('school_id');
            $table->enum('type', ['image', 'video']);
            $table->string('url');
            $table->text('description')->nullable();
            
            $table->foreign('school_id')
                  ->references('school_id')
                  ->on('schools')
                  ->onDelete('cascade');
                  
            $table->timestamp('uploaded_at')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('media_gallery');
    }
};
