<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('supervisor_link_usage', function (Blueprint $table) {
            $table->id('usage_id');
            $table->unsignedBigInteger('link_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('used_at');
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            
            // Foreign keys
            $table->foreign('link_id')
                  ->references('link_id')
                  ->on('supervisor_links')
                  ->onDelete('cascade');
                  
            $table->foreign('user_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
                  
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('supervisor_link_usage');
    }
};