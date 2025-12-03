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
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('itinerary')->nullable();
            $table->text('includes')->nullable();
            $table->text('excludes')->nullable();
            $table->text('requirements')->nullable();
            $table->text('cancellation_policy')->nullable();
            $table->enum('refund_policy', ['full', 'partial', 'none'])->default('partial');
            $table->integer('cancellation_hours')->default(24);
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('duration_days')->default(1);
            $table->integer('duration_hours')->default(0);
            $table->integer('max_people');
            $table->integer('min_people')->default(1);
            $table->string('difficulty_level')->nullable();
            $table->string('location_city');
            $table->string('location_region');
            $table->string('location_country')->default('Peru');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('featured_image');
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->integer('total_bookings')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_published')->default(false);
            $table->boolean('admin_verified')->default(false);
            $table->timestamp('admin_verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->tinyInteger('creation_step')->default(1);
            $table->json('quality_checklist')->nullable();
            $table->timestamp('available_from')->nullable();
            $table->timestamp('available_to')->nullable();
            $table->json('available_days')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['location_city', 'is_active']);
            $table->index(['price', 'is_active']);
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
