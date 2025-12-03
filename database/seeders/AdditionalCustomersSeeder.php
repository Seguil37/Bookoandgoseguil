<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdditionalCustomersSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('👥 Creando clientes adicionales...');

        $customers = [
            // Clientes peruanos
            [
                'name' => 'Rosa Fernández Castillo',
                'email' => 'rosa.fernandez@gmail.com',
                'phone' => '+51 987 111 222',
                'city' => 'Lima',
                'country' => 'Perú',
                'bio' => 'Profesora de historia, apasionada por conocer mi propio país.',
            ],
            [
                'name' => 'Diego Vargas Ruiz',
                'email' => 'diego.vargas@outlook.com',
                'phone' => '+51 987 333 444',
                'city' => 'Arequipa',
                'country' => 'Perú',
                'bio' => 'Ingeniero, amante del trekking y la fotografía de naturaleza.',
            ],
            [
                'name' => 'Patricia Morales',
                'email' => 'paty.morales@hotmail.com',
                'phone' => '+51 987 555 666',
                'city' => 'Trujillo',
                'country' => 'Perú',
                'bio' => null,
            ],
            [
                'name' => 'Roberto Quispe Mamani',
                'email' => 'roberto.quispe@gmail.com',
                'phone' => '+51 987 777 888',
                'city' => 'Puno',
                'country' => 'Perú',
                'bio' => 'Contador, disfruto viajar con mi familia cada vez que puedo.',
            ],

            // Clientes extranjeros - USA
            [
                'name' => 'Jennifer Thompson',
                'email' => 'jennifer.t@gmail.com',
                'phone' => '+1 305 456 7890',
                'city' => 'Miami',
                'country' => 'Estados Unidos',
                'bio' => 'Travel blogger exploring South America. Instagram: @jenntravels',
            ],
            [
                'name' => 'Michael Anderson',
                'email' => 'mike.anderson@yahoo.com',
                'phone' => '+1 415 234 5678',
                'city' => 'San Francisco',
                'country' => 'Estados Unidos',
                'bio' => 'Software engineer on sabbatical. Love hiking and adventure sports.',
            ],

            // Clientes extranjeros - Europa
            [
                'name' => 'Sophie Martin',
                'email' => 'sophie.martin@gmail.com',
                'phone' => '+33 6 12 34 56 78',
                'city' => 'Paris',
                'country' => 'Francia',
                'bio' => 'Photographe passionnée par les cultures andines.',
            ],
            [
                'name' => 'Lars Schmidt',
                'email' => 'lars.schmidt@gmx.de',
                'phone' => '+49 172 345 6789',
                'city' => 'Munich',
                'country' => 'Alemania',
                'bio' => 'Backpacker, already visited 45 countries. Peru is next!',
            ],
            [
                'name' => 'Isabella Romano',
                'email' => 'isabella.romano@libero.it',
                'phone' => '+39 340 123 4567',
                'city' => 'Roma',
                'country' => 'Italia',
                'bio' => 'Architetto, amo la storia delle civiltà antiche.',
            ],
            [
                'name' => 'Oliver Davies',
                'email' => 'oliver.davies@btinternet.com',
                'phone' => '+44 7700 900123',
                'city' => 'London',
                'country' => 'Reino Unido',
                'bio' => 'Teacher on gap year. Keen on wildlife and nature.',
            ],

            // Clientes LATAM
            [
                'name' => 'Camila Rodríguez',
                'email' => 'camila.rodriguez@gmail.com',
                'phone' => '+54 11 4567 8900',
                'city' => 'Buenos Aires',
                'country' => 'Argentina',
                'bio' => 'Médica veterinaria. Me encanta la fauna sudamericana.',
            ],
            [
                'name' => 'Felipe Silva Santos',
                'email' => 'felipe.silva@uol.com.br',
                'phone' => '+55 11 98765 4321',
                'city' => 'São Paulo',
                'country' => 'Brasil',
                'bio' => 'Empresário. Viajo com família pelo menos 2x por ano.',
            ],
            [
                'name' => 'Valentina Gómez',
                'email' => 'vale.gomez@gmail.com',
                'phone' => '+56 9 8765 4321',
                'city' => 'Santiago',
                'country' => 'Chile',
                'bio' => 'Periodista de viajes. Buscando las mejores historias de Perú.',
            ],
            [
                'name' => 'Andrés López Moreno',
                'email' => 'andres.lopez@hotmail.com',
                'phone' => '+57 310 123 4567',
                'city' => 'Bogotá',
                'country' => 'Colombia',
                'bio' => 'Chef, interesado en gastronomía peruana.',
            ],
            [
                'name' => 'Daniela Herrera',
                'email' => 'dani.herrera@gmail.com',
                'phone' => '+52 55 1234 5678',
                'city' => 'Ciudad de México',
                'country' => 'México',
                'bio' => 'Fotógrafa freelance. Documentando Latinoamérica.',
            ],

            // Clientes Asia-Pacífico
            [
                'name' => 'Yuki Tanaka',
                'email' => 'yuki.tanaka@gmail.com',
                'phone' => '+81 90 1234 5678',
                'city' => 'Tokyo',
                'country' => 'Japón',
                'bio' => 'システムエンジニア。マチュピチュが夢でした。',
            ],
            [
                'name' => 'Sarah Kim',
                'email' => 'sarah.kim@naver.com',
                'phone' => '+82 10 1234 5678',
                'city' => 'Seoul',
                'country' => 'Corea del Sur',
                'bio' => '여행 유튜버. 페루의 아름다움을 담고 싶어요.',
            ],
            [
                'name' => 'Emma Wilson',
                'email' => 'emma.wilson@gmail.com',
                'phone' => '+61 412 345 678',
                'city' => 'Sydney',
                'country' => 'Australia',
                'bio' => 'Marine biologist. Excited to see Peruvian Amazon!',
            ],

            // Más peruanos de otras ciudades
            [
                'name' => 'Javier Mendoza Ríos',
                'email' => 'javier.mendoza@gmail.com',
                'phone' => '+51 987 999 000',
                'city' => 'Chiclayo',
                'country' => 'Perú',
                'bio' => 'Abogado. Redescubriendo las maravillas de mi país.',
            ],
            [
                'name' => 'Gabriela Torres',
                'email' => 'gaby.torres@yahoo.com',
                'phone' => '+51 987 888 777',
                'city' => 'Piura',
                'country' => 'Perú',
                'bio' => null,
            ],
            [
                'name' => 'Fernando Campos Lara',
                'email' => 'fernando.campos@hotmail.com',
                'phone' => '+51 987 666 555',
                'city' => 'Iquitos',
                'country' => 'Perú',
                'bio' => 'Biólogo. Trabajo en conservación de fauna amazónica.',
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

        $this->command->info('✅ Clientes adicionales creados: ' . count($customers));
        $this->command->info('👥 Total clientes: ' . User::where('role', 'customer')->count());
    }
}