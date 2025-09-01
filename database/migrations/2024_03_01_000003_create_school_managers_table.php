<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('school_managers', function (Blueprint $table) {
            $table->unsignedBigInteger('manager_id')->primary();
            $table->unsignedBigInteger('school_id');
            
            $table->foreign('manager_id')
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
        Schema::dropIfExists('school_managers');
    }
};
