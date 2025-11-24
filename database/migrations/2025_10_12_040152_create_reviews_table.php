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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('tour_id')->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('agency_id')->constrained()->onDelete('cascade');
            
            $table->integer('rating');
            $table->string('title')->nullable();
            $table->text('comment');
            
            $table->integer('service_rating')->nullable();
            $table->integer('value_rating')->nullable();
            $table->integer('guide_rating')->nullable();
            
            $table->json('images')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_approved')->default(true);
            
            $table->integer('helpful_count')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['user_id', 'tour_id']);
            $table->index(['tour_id', 'is_approved']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
