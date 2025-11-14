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
        Schema::create('parent_calendar_events', function (Blueprint $table) {
            $table->id('event_id');
            $table->unsignedBigInteger('user_id'); // Parent user_id
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('event_type')->default('meeting'); // meeting, reminder, holiday, etc.
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->boolean('all_day')->default(false);
            $table->string('location')->nullable();
            $table->unsignedBigInteger('school_id')->nullable();
            $table->unsignedBigInteger('child_id')->nullable();
            $table->boolean('reminder_sent')->default(false);
            $table->integer('reminder_minutes_before')->default(30);
            $table->string('color')->default('#3b82f6');
            $table->timestamps();
            
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('school_id')->references('school_id')->on('schools')->onDelete('cascade');
            $table->index(['user_id', 'start_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parent_calendar_events');
    }
};
