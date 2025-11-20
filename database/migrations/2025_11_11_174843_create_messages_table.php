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
        if (!Schema::hasTable('messages')) {
            Schema::create('messages', function (Blueprint $table) {
                $table->id('message_id');
                $table->unsignedBigInteger('conversation_id');
                $table->unsignedBigInteger('sender_id'); // المرسل
                $table->unsignedBigInteger('receiver_id'); // المستقبل
                $table->text('message');
                $table->string('message_type')->default('text'); // text, file, image
                $table->string('attachment')->nullable();
                $table->boolean('is_read')->default(false);
                $table->dateTime('read_at')->nullable();
                $table->timestamps();
                
                $table->foreign('conversation_id')->references('conversation_id')->on('conversations')->onDelete('cascade');
                $table->foreign('sender_id')->references('user_id')->on('users')->onDelete('cascade');
                $table->foreign('receiver_id')->references('user_id')->on('users')->onDelete('cascade');
                $table->index(['conversation_id', 'created_at']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};