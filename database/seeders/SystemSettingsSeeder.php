<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('📝 Creando configuraciones del sistema...');
        
        $settings = [
            // General
            [
                'key' => 'app_name',
                'value' => 'BOOK&GO',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Nombre de la aplicación',
                'is_public' => true,
            ],
            [
                'key' => 'app_logo',
                'value' => '/images/logo.png',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Logo de la aplicación',
                'is_public' => true,
            ],
            [
                'key' => 'contact_email',
                'value' => 'info@bookandgo.com',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Email de contacto',
                'is_public' => true,
            ],
            [
                'key' => 'contact_phone',
                'value' => '+51 987 654 321',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Teléfono de contacto',
                'is_public' => true,
            ],
            [
                'key' => 'whatsapp_number',
                'value' => '51987654321',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Número de WhatsApp (sin +)',
                'is_public' => true,
            ],
            
            // Pagos
            [
                'key' => 'currency',
                'value' => 'PEN',
                'type' => 'string',
                'group' => 'payments',
                'description' => 'Moneda del sistema',
                'is_public' => true,
            ],
            [
                'key' => 'tax_rate',
                'value' => '0.18',
                'type' => 'string',
                'group' => 'payments',
                'description' => 'Tasa de IGV (18%)',
                'is_public' => false,
            ],
            [
                'key' => 'commission_rate',
                'value' => '0.10',
                'type' => 'string',
                'group' => 'payments',
                'description' => 'Comisión de la plataforma (10%)',
                'is_public' => false,
            ],
            [
                'key' => 'payment_methods',
                'value' => json_encode(['credit_card', 'debit_card', 'bank_transfer', 'yape', 'plin']),
                'type' => 'json',
                'group' => 'payments',
                'description' => 'Métodos de pago disponibles',
                'is_public' => true,
            ],
            
            // Reservas
            [
                'key' => 'booking_expiration_minutes',
                'value' => '30',
                'type' => 'integer',
                'group' => 'bookings',
                'description' => 'Minutos antes de expirar una reserva pendiente',
                'is_public' => false,
            ],
            [
                'key' => 'default_cancellation_hours',
                'value' => '24',
                'type' => 'integer',
                'group' => 'bookings',
                'description' => 'Horas por defecto para cancelación gratuita',
                'is_public' => true,
            ],
            [
                'key' => 'send_booking_reminders',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'bookings',
                'description' => 'Enviar recordatorios de reserva',
                'is_public' => false,
            ],
            [
                'key' => 'reminder_hours_before',
                'value' => '48',
                'type' => 'integer',
                'group' => 'bookings',
                'description' => 'Horas antes del tour para enviar recordatorio',
                'is_public' => false,
            ],
            
            // Tours
            [
                'key' => 'tours_require_approval',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'tours',
                'description' => 'Tours requieren aprobación de admin',
                'is_public' => false,
            ],
            [
                'key' => 'min_tour_images',
                'value' => '3',
                'type' => 'integer',
                'group' => 'tours',
                'description' => 'Mínimo de imágenes requeridas por tour',
                'is_public' => false,
            ],
            [
                'key' => 'featured_tours_count',
                'value' => '8',
                'type' => 'integer',
                'group' => 'tours',
                'description' => 'Cantidad de tours destacados en home',
                'is_public' => false,
            ],
            
            // Emails
            [
                'key' => 'send_welcome_email',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'emails',
                'description' => 'Enviar email de bienvenida al registrarse',
                'is_public' => false,
            ],
            [
                'key' => 'send_booking_confirmation',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'emails',
                'description' => 'Enviar email de confirmación de reserva',
                'is_public' => false,
            ],
            
            // Mantenimiento
            [
                'key' => 'maintenance_mode',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'maintenance',
                'description' => 'Modo mantenimiento activado',
                'is_public' => true,
            ],
            [
                'key' => 'maintenance_message',
                'value' => 'Estamos realizando mejoras. Volveremos pronto.',
                'type' => 'string',
                'group' => 'maintenance',
                'description' => 'Mensaje de mantenimiento',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('system_settings')->insert(array_merge($setting, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $this->command->info('✅ Configuraciones creadas: ' . count($settings));
    }
}