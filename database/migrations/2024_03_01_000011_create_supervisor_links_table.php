<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('supervisor_links', function (Blueprint $table) {
            $table->id('link_id');
            $table->string('token')->unique();
            $table->enum('link_type', ['supervisor', 'principal']);
            $table->unsignedBigInteger('organization_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('expires_at')->nullable();
            $table->integer('max_uses')->nullable();
            $table->integer('used_count')->default(0);
            $table->timestamps();
            
            // Foreign key for organization_id
            $table->foreign('organization_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('supervisor_links');
    }
};
