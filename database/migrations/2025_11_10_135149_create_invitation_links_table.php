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
        Schema::create('invitation_links', function (Blueprint $table) {
            $table->id('link_id');
            $table->string('token', 64)->unique();
            $table->enum('link_type', ['supervisor', 'principal']); // supervisor or principal
            $table->unsignedBigInteger('organization_id')->nullable(); // school_id or organization_id
            $table->string('organization_name'); // school name or organization name
            $table->unsignedBigInteger('created_by'); // user_id of admin or supervisor
            $table->timestamp('expires_at')->nullable();
            $table->integer('max_uses')->nullable();
            $table->integer('uses_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('created_by')->references('user_id')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index('token');
            $table->index('link_type');
            $table->index('created_by');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitation_links');
    }
};
