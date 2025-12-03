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
        Schema::create('booking_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['voucher', 'ticket', 'invoice', 'receipt', 'contract']);
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_url');
            $table->integer('file_size'); // en bytes
            $table->string('mime_type', 50);
            $table->timestamp('generated_at')->nullable();
            $table->integer('download_count')->default(0);
            $table->timestamp('last_downloaded_at')->nullable();
            $table->timestamps();
            
            $table->index(['booking_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_documents');
    }
};