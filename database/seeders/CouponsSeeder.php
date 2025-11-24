<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Carbon\Carbon;

class CouponsSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🎟️  Creando cupones...');

        $admin = User::where('role', 'admin')->first();

        $coupons = [
            [
                'code' => 'BIENVENIDO2025',
                'description' => 'Descuento de bienvenida para nuevos usuarios',
                'type' => 'percentage',
                'value' => 10.00,
                'min_purchase' => 100.00,
                'max_uses' => 100,
                'used_count' => 5,
                'valid_from' => Carbon::now()->subDays(10),
                'valid_until' => Carbon::now()->addMonths(3),
                'is_active' => true,
                'created_by' => $admin->id,
            ],
            [
                'code' => 'VERANO2025',
                'description' => 'Promoción especial de verano',
                'type' => 'percentage',
                'value' => 15.00,
                'min_purchase' => 200.00,
                'max_uses' => 50,
                'used_count' => 12,
                'valid_from' => Carbon::now(),
                'valid_until' => Carbon::now()->addMonths(2),
                'is_active' => true,
                'created_by' => $admin->id,
            ],
            [
                'code' => 'BLACKFRIDAY',
                'description' => 'Super descuento Black Friday',
                'type' => 'percentage',
                'value' => 25.00,
                'min_purchase' => 300.00,
                'max_uses' => 200,
                'used_count' => 89,
                'valid_from' => Carbon::now()->subMonth(),
                'valid_until' => Carbon::now()->subDays(5),
                'is_active' => false,
                'created_by' => $admin->id,
            ],
            [
                'code' => 'PRIMERACOMPRA',
                'description' => 'Descuento para primera compra',
                'type' => 'fixed',
                'value' => 50.00,
                'min_purchase' => 250.00,
                'max_uses' => null, // Ilimitado
                'used_count' => 23,
                'valid_from' => Carbon::now()->subDays(30),
                'valid_until' => null, // Sin vencimiento
                'is_active' => true,
                'created_by' => $admin->id,
            ],
            [
                'code' => 'GRUPAL20',
                'description' => 'Descuento para grupos de 4 o más personas',
                'type' => 'percentage',
                'value' => 20.00,
                'min_purchase' => 500.00,
                'max_uses' => 30,
                'used_count' => 7,
                'valid_from' => Carbon::now(),
                'valid_until' => Carbon::now()->addMonths(6),
                'is_active' => true,
                'created_by' => $admin->id,
            ],
        ];

        foreach ($coupons as $coupon) {
            DB::table('coupons')->insert(array_merge($coupon, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        $this->command->info('✅ Cupones creados: ' . count($coupons));
    }
}