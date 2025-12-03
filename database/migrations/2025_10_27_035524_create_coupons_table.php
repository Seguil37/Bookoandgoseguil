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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['percentage', 'fixed']); // % o monto fijo
            $table->decimal('value', 10, 2); // 10% o S/50
            $table->decimal('min_purchase', 10, 2)->nullable(); // Compra mínima
            $table->integer('max_uses')->nullable(); // Usos máximos
            $table->integer('used_count')->default(0); // Veces usado
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_until')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            $table->index('code');
            $table->index(['is_active', 'valid_from', 'valid_until']);
        });

        // Tabla pivot para cupones aplicados a bookings
        Schema::create('booking_coupon', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('coupon_id')->constrained()->onDelete('cascade');
            $table->decimal('discount_amount', 10, 2);
            $table->timestamps();
            
            $table->unique(['booking_id', 'coupon_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_coupon');
        Schema::dropIfExists('coupons');
    }
};