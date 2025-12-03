<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('📂 Creando categorías...');

        $categories = [
            [
                'name' => 'Aventura',
                'description' => 'Tours de aventura, deportes extremos y actividades al aire libre',
                'icon' => 'Mountain',
                'image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
                'order' => 1,
            ],
            [
                'name' => 'Cultural',
                'description' => 'Tours culturales, históricos y arqueológicos',
                'icon' => 'Landmark',
                'image' => 'https://images.unsplash.com/photo-1526392060635-9d6019884377',
                'order' => 2,
            ],
            [
                'name' => 'Naturaleza',
                'description' => 'Ecoturismo, observación de fauna y flora',
                'icon' => 'Trees',
                'image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
                'order' => 3,
            ],
            [
                'name' => 'Gastronomía',
                'description' => 'Tours gastronómicos y experiencias culinarias',
                'icon' => 'UtensilsCrossed',
                'image' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
                'order' => 4,
            ],
            [
                'name' => 'Playas',
                'description' => 'Tours de playa, deportes acuáticos y costas',
                'icon' => 'Waves',
                'image' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
                'order' => 5,
            ],
            [
                'name' => 'Trekking',
                'description' => 'Caminatas, senderismo y expediciones',
                'icon' => 'Footprints',
                'image' => 'https://images.unsplash.com/photo-1551632811-561732d1e306',
                'order' => 6,
            ],
            [
                'name' => 'Fotografía',
                'description' => 'Tours fotográficos y safaris visuales',
                'icon' => 'Camera',
                'image' => 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
                'order' => 7,
            ],
            [
                'name' => 'Familia',
                'description' => 'Actividades y tours para toda la familia',
                'icon' => 'Users',
                'image' => 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
                'order' => 8,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::create([
                'name' => $categoryData['name'],
                'slug' => Str::slug($categoryData['name']),
                'description' => $categoryData['description'],
                'icon' => $categoryData['icon'],
                'image' => $categoryData['image'],
                'is_active' => true,
                'order' => $categoryData['order'],
            ]);
        }

        $this->command->info('✅ Categorías creadas: ' . Category::count());
    }
}