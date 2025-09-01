<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id('evaluation_id');
            $table->unsignedBigInteger('school_id');
            $table->unsignedBigInteger('supervisor_id')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->date('date');
            
            $table->foreign('school_id')
                  ->references('school_id')
                  ->on('schools')
                  ->onDelete('cascade');
                  
            $table->foreign('supervisor_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('set null');
                  
            $table->foreign('parent_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('set null');
                  
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluations');
    }
};
