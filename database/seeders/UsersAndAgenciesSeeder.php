<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Agency;
use Illuminate\Support\Facades\Hash;

class UsersAndAgenciesSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('👥 Creando usuarios y agencias...');

        // ===== ADMIN =====
        $admin = User::create([
            'name' => 'Administrador Principal',
            'email' => 'admin@bookandgo.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+51 999 888 777',
            'country' => 'Perú',
            'city' => 'Lima',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $this->command->info('✅ Admin creado');

        // ===== AGENCIA 1: Inca Adventures =====
        $agencyUser1 = User::create([
            'name' => 'Inca Adventures',
            'email' => 'inca@bookandgo.com',
            'password' => Hash::make('password'),
            'role' => 'agency',
            'phone' => '+51 984 123 456',
            'country' => 'Perú',
            'city' => 'Cusco',
            'bio' => 'Especialistas en tours de aventura y culturales en Cusco con más de 10 años de experiencia.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $agency1 = Agency::create([
            'user_id' => $agencyUser1->id,
            'business_name' => 'Inca Adventures SAC',
            'ruc_tax_id' => '20123456789',
            'description' => 'Somos una agencia líder en tours de aventura y culturales en Cusco. Ofrecemos experiencias únicas con guías profesionales certificados y un compromiso total con la seguridad y satisfacción de nuestros clientes.',
            'logo' => 'https://via.placeholder.com/200x200?text=Inca+Adventures',
            'phone' => '+51 984 123 456',
            'website' => 'https://incaadventures.com',
            'address' => 'Av. El Sol 123, Cusco',
            'city' => 'Cusco',
            'country' => 'Perú',
            'rating' => 4.8,
            'total_reviews' => 156,
            'is_verified' => true,
            'verified_at' => now(),
        ]);

        // ===== AGENCIA 2: Peru Mágico =====
        $agencyUser2 = User::create([
            'name' => 'Peru Mágico Tours',
            'email' => 'perumagico@bookandgo.com',
            'password' => Hash::make('password'),
            'role' => 'agency',
            'phone' => '+51 984 123 457',
            'country' => 'Perú',
            'city' => 'Lima',
            'bio' => 'Tours personalizados por todo el Perú con enfoque en gastronomía y cultura.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $agency2 = Agency::create([
            'user_id' => $agencyUser2->id,
            'business_name' => 'Peru Mágico Tours EIRL',
            'ruc_tax_id' => '20123456790',
            'description' => 'Especialistas en experiencias gastronómicas y culturales. Conectamos viajeros con la auténtica esencia del Perú a través de tours personalizados y memorables.',
            'logo' => 'https://via.placeholder.com/200x200?text=Peru+Magico',
            'phone' => '+51 984 123 457',
            'website' => 'https://perumagico.com',
            'address' => 'Jr. Trujillo 456, Miraflores',
            'city' => 'Lima',
            'country' => 'Perú',
            'rating' => 4.6,
            'total_reviews' => 98,
            'is_verified' => true,
            'verified_at' => now(),
        ]);

        // ===== AGENCIA 3: Amazonia Expeditions =====
        $agencyUser3 = User::create([
            'name' => 'Amazonia Expeditions',
            'email' => 'amazonia@bookandgo.com',
            'password' => Hash::make('password'),
            'role' => 'agency',
            'phone' => '+51 984 123 458',
            'country' => 'Perú',
            'city' => 'Iquitos',
            'bio' => 'Exploraciones únicas en la selva amazónica peruana con guías nativos.',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $agency3 = Agency::create([
            'user_id' => $agencyUser3->id,
            'business_name' => 'Amazonia Expeditions SAC',
            'ruc_tax_id' => '20123456791',
            'description' => 'Descubre la biodiversidad de la Amazonía peruana con nuestros tours ecológicos. Trabajamos con comunidades locales para ofrecer experiencias auténticas y sostenibles.',
            'logo' => 'https://via.placeholder.com/200x200?text=Amazonia',
            'phone' => '+51 984 123 458',
            'website' => 'https://amazoniaexp.com',
            'address' => 'Av. Iquitos 789, Iquitos',
            'city' => 'Iquitos',
            'country' => 'Perú',
            'rating' => 4.9,
            'total_reviews' => 203,
            'is_verified' => true,
            'verified_at' => now(),
        ]);

        $this->command->info('✅ 3 Agencias creadas');

        // ===== CLIENTES =====
        $customers = [
            [
                'name' => 'Juan Pérez García',
                'email' => 'juan@example.com',
                'phone' => '+51 987 654 321',
                'city' => 'Lima',
                'country' => 'Perú',
                'bio' => 'Amante de los viajes y la aventura. Siempre buscando nuevas experiencias.',
            ],
            [
                'name' => 'María García López',
                'email' => 'maria@example.com',
                'phone' => '+51 987 654 322',
                'city' => 'Arequipa',
                'country' => 'Perú',
                'bio' => 'Fotógrafa profesional especializada en turismo.',
            ],
            [
                'name' => 'Carlos Mendoza',
                'email' => 'carlos@example.com',
                'phone' => '+51 987 654 323',
                'city' => 'Cusco',
                'country' => 'Perú',
                'bio' => null,
            ],
            [
                'name' => 'Ana Torres',
                'email' => 'ana@example.com',
                'phone' => '+51 987 654 324',
                'city' => 'Trujillo',
                'country' => 'Perú',
                'bio' => 'Viajera frecuente, me encanta conocer nuevas culturas.',
            ],
            [
                'name' => 'Luis Ramírez',
                'email' => 'luis@example.com',
                'phone' => '+51 987 654 325',
                'city' => 'Piura',
                'country' => 'Perú',
                'bio' => null,
            ],
        ];

        foreach ($customers as $customerData) {
            User::create(array_merge($customerData, [
                'password' => Hash::make('password'),
                'role' => 'customer',
                'is_active' => true,
                'email_verified_at' => now(),
            ]));
        }

        $this->command->info('✅ 5 Clientes creados');
        $this->command->info('👥 Total usuarios: ' . User::count());
    }
}