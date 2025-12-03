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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number')->unique();
            $table->string('qr_code')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('tour_id')->constrained()->onDelete('cascade');
            $table->foreignId('agency_id')->constrained()->onDelete('cascade');
            $table->string('agency_whatsapp', 20)->nullable();
            
            $table->date('booking_date');
            $table->time('booking_time')->nullable();
            $table->text('meeting_point')->nullable();
            $table->text('agency_instructions')->nullable();
            $table->integer('number_of_people');
            
            $table->decimal('price_per_person', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2);
            
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->text('special_requirements')->nullable();
            
            $table->enum('status', [
                'pending',
                'confirmed',
                'in_progress',
                'completed',
                'cancelled',
                'refunded'
            ])->default('pending');

            $table->json('timeline')->nullable();
            
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('checked_in_at')->nullable();
            $table->boolean('reminder_sent')->default(false);
            $table->timestamp('reminder_sent_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'status']);
            $table->index(['agency_id', 'status']);
            $table->index('booking_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
