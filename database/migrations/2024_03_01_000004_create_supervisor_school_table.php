<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('supervisor_school', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('supervisor_id');
            $table->unsignedBigInteger('school_id');
            
            $table->foreign('supervisor_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
                  
            $table->foreign('school_id')
                  ->references('school_id')
                  ->on('schools')
                  ->onDelete('cascade');
                  
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('supervisor_school');
    }
};
