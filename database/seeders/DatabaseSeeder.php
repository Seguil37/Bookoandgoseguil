<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🚀 Iniciando proceso de seeders...');
        $this->command->newLine();
        
        // Orden importante para respetar relaciones
        $this->call([
            SystemSettingsSeeder::class,
            UsersAndAgenciesSeeder::class,
            AdditionalCustomersSeeder::class,
            CategoriesSeeder::class,
            ToursSeeder::class,
            // ❌ COMENTAMOS BOOKINGS Y REVIEWS - Se crearán naturalmente
            // BookingsSeeder::class,
            // ReviewsSeeder::class,
            CouponsSeeder::class,
            // BookingDocumentSeeder::class,
        ]);
        
        $this->command->newLine();
        $this->command->info('✅ ¡Seeders completados exitosamente!');
        $this->command->newLine();
        
        // Estadísticas
        $this->command->info('📊 ESTADÍSTICAS DEL SISTEMA:');
        $this->command->table(
            ['Modelo', 'Cantidad'],
            [
                ['Usuarios Total', \App\Models\User::count()],
                ['├─ Admins', \App\Models\User::where('role', 'admin')->count()],
                ['├─ Agencias', \App\Models\User::where('role', 'agency')->count()],
                ['└─ Clientes', \App\Models\User::where('role', 'customer')->count()],
                ['Agencias Verificadas', \App\Models\Agency::where('is_verified', true)->count()],
                ['Categorías', \App\Models\Category::count()],
                ['Tours Publicados', \App\Models\Tour::where('is_published', true)->count()],
                ['Tours Destacados', \App\Models\Tour::where('is_featured', true)->count()],
                ['Cupones Activos', \App\Models\Coupon::where('is_active', true)->count()],
            ]
        );
        
        $this->command->newLine();
        $this->command->info('📧 CREDENCIALES DE ACCESO:');
        $this->command->table(
            ['Rol', 'Email', 'Password', 'Notas'],
            [
                ['👨‍💼 Admin', 'admin@bookandgo.com', 'password', 'Acceso total al sistema'],
                ['🏢 Agencia 1', 'inca@bookandgo.com', 'password', 'Inca Adventures - Cusco'],
                ['🏢 Agencia 2', 'perumagico@bookandgo.com', 'password', 'Peru Mágico - Lima'],
                ['🏢 Agencia 3', 'amazonia@bookandgo.com', 'password', 'Amazonia Expeditions - Iquitos'],
                ['👤 Cliente 1', 'juan@example.com', 'password', 'Cliente con reservas'],
                ['👤 Cliente 2', 'maria@example.com', 'password', 'Cliente con reviews'],
                ['👤 Cliente 3', 'carlos@example.com', 'password', 'Cliente activo'],
                ['🌍 Cliente Int.', 'jennifer.t@gmail.com', 'password', 'USA - Travel blogger'],
                ['🌍 Cliente Int.', 'sophie.martin@gmail.com', 'password', 'Francia - Photographer'],
            ]
        );

        $this->command->newLine();
        $this->command->info('💡 TIPS:');
        $this->command->line('  • Los tours están listos con información completa');
        $this->command->line('  • Las reservas y reviews se crearán cuando los usuarios las hagan');
        $this->command->line('  • Los cupones están configurados y listos para usar');
        $this->command->line('  • Los clientes son de diferentes países para simular mercado internacional');
        
        $this->command->newLine();
        $this->command->info('🎯 PRÓXIMOS PASOS:');
        $this->command->line('  1. php artisan storage:link (si no lo has hecho)');
        $this->command->line('  2. Inicia el servidor: php artisan serve');
        $this->command->line('  3. Inicia el frontend: npm run dev');
        $this->command->line('  4. Crea tu primera reserva como customer');
        $this->command->line('  5. Gestiona las reservas como agency');
        
        $this->command->newLine();
    }
}