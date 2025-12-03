<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\User;
use App\Models\Tour;
use Carbon\Carbon;

class BookingsSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('📅 Creando reservas...');

        $customers = User::where('role', 'customer')->get();
        $tours = Tour::all();

        if ($customers->isEmpty() || $tours->isEmpty()) {
            $this->command->warn('⚠️  No hay clientes o tours disponibles');
            return;
        }

        // ========== RESERVAS CONFIRMADAS FUTURAS (SOLO 5 RESERVAS REALES) ==========
        $confirmedBookings = [
            [
                'customer_index' => 0,
                'tour_index' => 0, // Camino Inca
                'days_from_now' => 45,
                'people' => 2,
                'status' => 'confirmed',
                'notes' => 'Primera vez haciendo trekking de varios días. Emocionados!',
            ],
            [
                'customer_index' => 1,
                'tour_index' => 2, // Montaña 7 Colores
                'days_from_now' => 15,
                'people' => 3,
                'status' => 'confirmed',
                'notes' => 'Vamos en grupo de amigas. Confirmamos que tenemos buena aclimatación.',
            ],
            [
                'customer_index' => 2,
                'tour_index' => 3, // Tour Gastronómico Lima
                'days_from_now' => 8,
                'people' => 2,
                'status' => 'confirmed',
                'notes' => 'Somos vegetarianos, ¿es posible adaptar el menú?',
            ],
        ];

        // ========== RESERVAS PENDIENTES DE PAGO (SOLO 2) ==========
        $pendingBookings = [
            [
                'customer_index' => 1,
                'tour_index' => 7, // Canopy Amazonas
                'days_from_now' => 20,
                'people' => 2,
                'status' => 'pending',
                'hours_old' => 3,
            ],
        ];

        // ========== RESERVAS COMPLETADAS (PASADAS - SOLO 4) ==========
        $completedBookings = [
            [
                'customer_index' => 0,
                'tour_index' => 1, // City Tour Cusco
                'days_ago' => 5,
                'people' => 2,
                'status' => 'completed',
            ],
            [
                'customer_index' => 2,
                'tour_index' => 2, // Montaña 7 Colores
                'days_ago' => 8,
                'people' => 1,
                'status' => 'completed',
            ],
            [
                'customer_index' => 3,
                'tour_index' => 3, // Tour Gastronómico
                'days_ago' => 20,
                'people' => 2,
                'status' => 'completed',
            ],
        ];

        // ========== RESERVAS CANCELADAS (SOLO 1) ==========
        $cancelledBookings = [
            [
                'customer_index' => 4,
                'tour_index' => 0, // Camino Inca
                'days_from_now' => 20,
                'people' => 2,
                'status' => 'cancelled',
                'cancellation_reason' => 'Cambio de fechas de vacaciones laborales',
                'cancelled_days_ago' => 3,
            ],
        ];

        // ========== RESERVAS EN PROGRESO ==========
        $inProgressBookings = [
            [
                'customer_index' => 2,
                'tour_index' => 6, // Expedición Amazonas (3 días)
                'days_ago' => 1, // Empezó hace 1 día
                'people' => 2,
                'status' => 'in_progress',
            ],
        ];

        // Procesar reservas confirmadas
        foreach ($confirmedBookings as $data) {
            $this->createBooking(
                $customers[$data['customer_index']],
                $tours[$data['tour_index']],
                Carbon::now()->addDays($data['days_from_now']),
                $data['people'],
                $data['status'],
                $data['notes'] ?? null
            );
        }

        // Procesar reservas pendientes
        foreach ($pendingBookings as $data) {
            $booking = $this->createBooking(
                $customers[$data['customer_index']],
                $tours[$data['tour_index']],
                Carbon::now()->addDays($data['days_from_now']),
                $data['people'],
                $data['status']
            );
            
            // Actualizar created_at para simular que se creó hace X horas
            $booking->created_at = Carbon::now()->subHours($data['hours_old']);
            $booking->save();
        }

        // Procesar reservas completadas
        foreach ($completedBookings as $data) {
            $bookingDate = Carbon::now()->subDays($data['days_ago']);
            $booking = $this->createBooking(
                $customers[$data['customer_index']],
                $tours[$data['tour_index']],
                $bookingDate,
                $data['people'],
                $data['status']
            );

            // Actualizar fechas de completado
            $booking->checked_in_at = $bookingDate->copy()->setHour(8);
            $booking->completed_at = $bookingDate->copy()->addDays($tours[$data['tour_index']]->duration_days);
            $booking->reminder_sent = true;
            $booking->reminder_sent_at = $bookingDate->copy()->subDays(2);
            $booking->save();
        }

        // Procesar reservas canceladas
        foreach ($cancelledBookings as $data) {
            $bookingDate = Carbon::now()->addDays($data['days_from_now']);
            $booking = $this->createBooking(
                $customers[$data['customer_index']],
                $tours[$data['tour_index']],
                $bookingDate,
                $data['people'],
                $data['status']
            );

            $booking->cancelled_at = Carbon::now()->subDays($data['cancelled_days_ago']);
            $booking->cancellation_reason = $data['cancellation_reason'];
            $booking->save();

            // Actualizar pago a refunded
            $payment = Payment::where('booking_id', $booking->id)->first();
            if ($payment) {
                $payment->status = 'refunded';
                $payment->refunded_at = $booking->cancelled_at;
                $payment->save();
            }
        }

        // Procesar reservas en progreso
        foreach ($inProgressBookings as $data) {
            $bookingDate = Carbon::now()->subDays($data['days_ago']);
            $booking = $this->createBooking(
                $customers[$data['customer_index']],
                $tours[$data['tour_index']],
                $bookingDate,
                $data['people'],
                $data['status']
            );

            $booking->checked_in_at = $bookingDate->copy()->setHour(9);
            $booking->save();
        }

        $this->command->info('✅ Reservas creadas: ' . Booking::count());
        $this->command->info('✅ Pagos creados: ' . Payment::count());
    }

    private function createBooking(
        User $user,
        Tour $tour,
        Carbon $bookingDate,
        int $people,
        string $status,
        ?string $notes = null
    ): Booking {
        $pricePerPerson = $tour->discount_price ?? $tour->price;
        $subtotal = $pricePerPerson * $people;
        $tax = $subtotal * 0.18;
        $totalPrice = $subtotal + $tax;

        // Determinar estado del pago
        $paymentStatus = match($status) {
            'pending' => 'pending',
            'cancelled' => 'refunded',
            default => 'completed',
        };

        // Crear timeline según el estado
        $timeline = $this->createTimeline($status, $bookingDate);

        $booking = Booking::create([
            'user_id' => $user->id,
            'tour_id' => $tour->id,
            'agency_id' => $tour->agency_id,
            'booking_number' => 'BG-' . strtoupper(uniqid()),
            'qr_code' => 'QR-' . strtoupper(uniqid()),
            'booking_date' => $bookingDate,
            'booking_time' => '08:00:00',
            'number_of_people' => $people,
            'price_per_person' => $pricePerPerson,
            'subtotal' => $subtotal,
            'discount' => 0,
            'tax' => $tax,
            'total_price' => $totalPrice,
            'status' => $status,
            'confirmed_at' => in_array($status, ['confirmed', 'completed', 'in_progress', 'cancelled']) ? Carbon::now()->subDays(rand(1, 3)) : null,
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => $user->phone,
            'special_requirements' => $notes,
            'timeline' => json_encode($timeline),
            'meeting_point' => in_array($status, ['confirmed', 'completed', 'in_progress']) 
                ? $this->getMeetingPoint($tour) 
                : null,
            'agency_instructions' => in_array($status, ['confirmed', 'completed', 'in_progress']) 
                ? 'Por favor llegar 15 minutos antes. Llevar documento de identidad original.' 
                : null,
            'agency_whatsapp' => $tour->agency->phone ?? $tour->agency->user->phone,
        ]);

        // Crear pago
        Payment::create([
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'payment_method' => $this->getRandomPaymentMethod(),
            'amount' => $totalPrice,
            'currency' => 'PEN',
            'status' => $paymentStatus,
            'paid_at' => $paymentStatus === 'completed' ? $booking->confirmed_at : null,
            'refunded_at' => $paymentStatus === 'refunded' ? $booking->cancelled_at : null,
        ]);

        return $booking;
    }

    private function createTimeline(string $status, Carbon $bookingDate): array
    {
        $timeline = [
            [
                'status' => 'pending',
                'date' => Carbon::now()->subDays(rand(1, 3))->toISOString(),
                'description' => 'Reserva creada',
            ],
        ];

        if (in_array($status, ['confirmed', 'completed', 'in_progress', 'cancelled'])) {
            $timeline[] = [
                'status' => 'confirmed',
                'date' => Carbon::now()->subDays(rand(1, 3))->toISOString(),
                'description' => 'Pago confirmado',
            ];
        }

        if ($status === 'in_progress') {
            $timeline[] = [
                'status' => 'in_progress',
                'date' => $bookingDate->toISOString(),
                'description' => 'Tour iniciado',
            ];
        }

        if ($status === 'completed') {
            $timeline[] = [
                'status' => 'in_progress',
                'date' => $bookingDate->toISOString(),
                'description' => 'Tour iniciado',
            ];
            $timeline[] = [
                'status' => 'completed',
                'date' => $bookingDate->copy()->addDays(rand(1, 4))->toISOString(),
                'description' => 'Tour completado exitosamente',
            ];
        }

        if ($status === 'cancelled') {
            $timeline[] = [
                'status' => 'cancelled',
                'date' => Carbon::now()->subDays(rand(1, 2))->toISOString(),
                'description' => 'Cancelado por el cliente',
            ];
        }

        return $timeline;
    }

    private function getMeetingPoint(Tour $tour): string
    {
        $meetingPoints = [
            'Cusco' => 'Plaza de Armas de Cusco - Frente a la Catedral',
            'Lima' => 'Parque Kennedy, Miraflores - Frente a la Iglesia',
            'Iquitos' => 'Plaza de Armas de Iquitos - Frente al Reloj',
            'Paracas' => 'Terminal de buses Cruz del Sur - Paracas',
        ];

        return $meetingPoints[$tour->location_city] ?? 'Punto de encuentro a confirmar';
    }

    private function getRandomPaymentMethod(): string
    {
        $methods = ['credit_card', 'debit_card', 'yape', 'plin', 'bank_transfer'];
        return $methods[array_rand($methods)];
    }
}