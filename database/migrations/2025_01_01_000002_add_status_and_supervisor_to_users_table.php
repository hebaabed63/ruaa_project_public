<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['pending', 'active', 'suspended'])->default('active');
            $table->unsignedBigInteger('supervisor_id')->nullable();
            $table->string('phone')->nullable();
            
            // Foreign key for supervisor_id
            $table->foreign('supervisor_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['supervisor_id']);
            $table->dropColumn(['status', 'supervisor_id', 'phone']);
        });
    }
};