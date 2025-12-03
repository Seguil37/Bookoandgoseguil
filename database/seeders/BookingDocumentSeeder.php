<?php
// database/seeders/BookingDocumentSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BookingDocument;
use App\Models\Booking;

class BookingDocumentSeeder extends Seeder
{
    public function run()
    {
        $bookings = Booking::all();

        foreach ($bookings as $booking) {
            // Crear voucher
            BookingDocument::create([
                'booking_id' => $booking->id,
                'type' => 'voucher',
                'file_name' => "voucher_{$booking->booking_number}.pdf",
                'file_path' => "documents/vouchers/voucher_{$booking->booking_number}.pdf",
                'file_url' => url("storage/documents/vouchers/voucher_{$booking->booking_number}.pdf"),
                'file_size' => rand(50000, 200000),
                'mime_type' => 'application/pdf',
                'generated_at' => now(),
                'download_count' => rand(0, 5),
                'last_downloaded_at' => rand(0, 1) ? now()->subDays(rand(1, 7)) : null,
            ]);

            // Crear ticket (50% de probabilidad)
            if (rand(0, 1)) {
                BookingDocument::create([
                    'booking_id' => $booking->id,
                    'type' => 'ticket',
                    'file_name' => "ticket_{$booking->booking_number}.pdf",
                    'file_path' => "documents/tickets/ticket_{$booking->booking_number}.pdf",
                    'file_url' => url("storage/documents/tickets/ticket_{$booking->booking_number}.pdf"),
                    'file_size' => rand(50000, 150000),
                    'mime_type' => 'application/pdf',
                    'generated_at' => now(),
                    'download_count' => rand(0, 3),
                ]);
            }
        }
    }
}