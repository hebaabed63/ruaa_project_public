<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id('conversation_id');
            $table->unsignedBigInteger('school_id');
            $table->enum('conversation_type', ['parent_manager', 'supervisor_manager']);
            $table->enum('status', ['open', 'closed'])->default('open');
            
            $table->foreign('school_id')
                  ->references('school_id')
                  ->on('schools')
                  ->onDelete('cascade');
                  
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('conversations');
    }
};
