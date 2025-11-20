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
        Schema::table('users', function (Blueprint $table) {
            $table->string('supervisor_verification_token')->nullable()->after('verification_token_expires_at');
            $table->timestamp('supervisor_verification_token_expires_at')->nullable()->after('supervisor_verification_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['supervisor_verification_token', 'supervisor_verification_token_expires_at']);
        });
    }
};