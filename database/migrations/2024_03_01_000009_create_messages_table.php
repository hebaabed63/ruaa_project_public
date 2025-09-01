<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id('message_id');
            $table->unsignedBigInteger('conversation_id');
            $table->enum('sender_type', ['parent', 'supervisor', 'school_manager']);
            $table->unsignedBigInteger('sender_id');
            $table->text('content');
            $table->string('attachment_url')->nullable();
            $table->string('attachment_type')->nullable();
            $table->timestamp('timestamp')->useCurrent();
            
            // Define foreign keys
            $table->foreign('conversation_id')
                  ->references('conversation_id')
                  ->on('conversations')
                  ->onDelete('cascade');
                  
            $table->foreign('sender_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
            
            // Don't use timestamps() as we have our own timestamp field
        });
    }

    public function down()
    {
        Schema::dropIfExists('messages');
    }
};
