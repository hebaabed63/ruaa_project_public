<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('evaluation_criteria', function (Blueprint $table) {
            $table->id('evaluation_criteria_id');
            $table->unsignedBigInteger('evaluation_id');
            $table->unsignedBigInteger('criterion_id');
            $table->integer('score');
            
            $table->foreign('evaluation_id')
                  ->references('evaluation_id')
                  ->on('evaluations')
                  ->onDelete('cascade');
                  
            $table->foreign('criterion_id')
                  ->references('criterion_id')
                  ->on('criteria')
                  ->onDelete('cascade');
                  
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluation_criteria');
    }
};
