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
        Schema::create('supervisor_invitations', function (Blueprint $table) {
            $table->id('invitation_id');
            $table->unsignedBigInteger('supervisor_id');
            $table->unsignedBigInteger('school_id');
            $table->string('invitee_name');
            $table->string('invitee_email');
            $table->string('token')->unique();
            $table->string('status')->default('pending'); // pending, accepted, rejected, expired
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('supervisor_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('school_id')->references('school_id')->on('schools')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supervisor_invitations');
    }
};
