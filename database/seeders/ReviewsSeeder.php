<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Booking;
use App\Models\User;
use App\Models\Tour;
use Carbon\Carbon;

class ReviewsSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('⭐ Creando reviews...');

        // Obtener bookings completados
        $completedBookings = Booking::where('status', 'completed')->get();
        
        if ($completedBookings->isEmpty()) {
            $this->command->warn('⚠️  No hay bookings completados para crear reviews');
            return;
        }

        $reviewTemplates = [
            // Reviews excelentes (5 estrellas)
            [
                'rating' => 5,
                'title' => '¡Experiencia inolvidable!',
                'comment' => 'Superó todas mis expectativas. El guía fue excepcional, muy conocedor y atento. La organización fue perfecta desde el inicio hasta el final. Definitivamente lo recomiendo y volvería a contratar sus servicios. Una experiencia que recordaré toda la vida.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],
            [
                'rating' => 5,
                'title' => 'Perfectamente organizado',
                'comment' => 'Todo salió como estaba planeado. El equipo fue muy profesional y nos hicieron sentir seguros en todo momento. Las vistas fueron espectaculares y valió cada centavo. Mi familia y yo quedamos encantados.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],
            [
                'rating' => 5,
                'title' => 'Lo mejor de mi viaje a Perú',
                'comment' => 'Sin duda el mejor tour que he tomado. La atención personalizada, el conocimiento de los guías y la belleza de los lugares visitados hicieron de esta una experiencia única. Totalmente recomendado para cualquiera que visite Perú.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],
            
            // Reviews muy buenas (4 estrellas)
            [
                'rating' => 4,
                'title' => 'Muy buena experiencia',
                'comment' => 'En general fue un tour excelente. El guía era muy conocedor y los lugares visitados fueron hermosos. La única razón por la que no le doy 5 estrellas es porque el transporte llegó 20 minutos tarde, pero fuera de eso todo perfecto.',
                'service_rating' => 4,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],
            [
                'rating' => 4,
                'title' => 'Recomendable',
                'comment' => 'Tour muy completo y bien organizado. Los guías fueron amables y profesionales. Me hubiera gustado tener un poco más de tiempo libre en algunos lugares, pero en general fue una gran experiencia.',
                'service_rating' => 4,
                'value_rating' => 4,
                'guide_rating' => 4,
            ],
            [
                'rating' => 4,
                'title' => 'Excelente tour, pequeños detalles a mejorar',
                'comment' => 'Disfruté mucho el tour. Los paisajes fueron increíbles y el guía muy profesional. La comida estuvo buena aunque podría ser más variada. Definitivamente lo recomendaría a otros viajeros.',
                'service_rating' => 4,
                'value_rating' => 4,
                'guide_rating' => 5,
            ],

            // Reviews buenas (3 estrellas)
            [
                'rating' => 3,
                'title' => 'Bueno pero mejorable',
                'comment' => 'El tour estuvo bien en general. Los lugares visitados fueron bonitos y el guía tenía buen conocimiento. Sin embargo, el grupo era muy grande (más de 20 personas) y a veces era difícil escuchar las explicaciones. La comida fue básica.',
                'service_rating' => 3,
                'value_rating' => 3,
                'guide_rating' => 4,
            ],
            [
                'rating' => 3,
                'title' => 'Cumple pero sin sorpresas',
                'comment' => 'Es un tour decente por el precio. No esperes lujos pero cumple con lo prometido. El guía fue correcto aunque no muy animado. Si buscas algo económico está bien, pero hay mejores opciones.',
                'service_rating' => 3,
                'value_rating' => 4,
                'guide_rating' => 3,
            ],
        ];

        $createdReviews = 0;

        // Crear reviews para los bookings completados
        foreach ($completedBookings as $booking) {
            // 80% de probabilidad de que tenga review
            if (rand(1, 10) <= 8) {
                // Verificar si ya existe una review de este usuario para este tour
                $existingReview = Review::where('user_id', $booking->user_id)
                    ->where('tour_id', $booking->tour_id)
                    ->first();
                
                if ($existingReview) {
                    continue; // Saltar si ya existe una review
                }
                
                $template = $reviewTemplates[array_rand($reviewTemplates)];
                
                Review::create([
                    'booking_id' => $booking->id,
                    'user_id' => $booking->user_id,
                    'tour_id' => $booking->tour_id,
                    'agency_id' => $booking->agency_id,
                    'rating' => $template['rating'],
                    'title' => $template['title'],
                    'comment' => $template['comment'],
                    'service_rating' => $template['service_rating'],
                    'value_rating' => $template['value_rating'],
                    'guide_rating' => $template['guide_rating'],
                    'is_verified' => true,
                    'is_approved' => true,
                    'helpful_count' => rand(0, 15),
                    'created_at' => Carbon::parse($booking->completed_at)->addDays(rand(1, 5)),
                    'updated_at' => Carbon::parse($booking->completed_at)->addDays(rand(1, 5)),
                ]);
                
                $createdReviews++;
            }
        }

        // Crear reviews adicionales para tours sin bookings (reviews antiguas)
        $tours = Tour::all();
        $customers = User::where('role', 'customer')->get();

        $additionalReviews = [
            // Camino Inca
            [
                'tour_index' => 0,
                'rating' => 5,
                'title' => 'El trek de mi vida',
                'comment' => 'Hacer el Camino Inca fue un sueño hecho realidad. Los porteadores fueron increíbles, la comida en medio de la montaña era sorprendentemente buena. Ver Machu Picchu al amanecer desde Inti Punku no tiene precio. Un esfuerzo que vale totalmente la pena.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],
            [
                'tour_index' => 0,
                'rating' => 5,
                'title' => 'Una aventura épica',
                'comment' => 'Cuatro días que nunca olvidaré. El segundo día fue duro con la subida a Warmihuañusca, pero nuestro guía Juan fue muy motivador. Las ruinas en el camino son impresionantes y menos conocidas que Machu Picchu pero igualmente fascinantes.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],
            [
                'tour_index' => 0,
                'rating' => 4,
                'title' => 'Desafiante pero gratificante',
                'comment' => 'Fue más duro físicamente de lo que esperaba, especialmente el segundo día. Pero la sensación de logro y las vistas lo compensan todo. Recomiendo entrenar antes y llegar bien aclimatado a Cusco.',
                'service_rating' => 4,
                'value_rating' => 4,
                'guide_rating' => 5,
            ],

            // City Tour Cusco
            [
                'tour_index' => 1,
                'rating' => 5,
                'title' => 'Perfecto para el primer día',
                'comment' => 'Excelente tour de introducción a Cusco. Nuestro guía Marco nos dio un contexto histórico fantástico. Sacsayhuamán es impresionante y las vistas de la ciudad son espectaculares. Perfecto para aclimatarse.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],
            [
                'tour_index' => 1,
                'rating' => 4,
                'title' => 'Muy informativo',
                'comment' => 'Tour completo que cubre los principales atractivos de Cusco. La Catedral y Qoricancha son increíbles. El grupo era grande pero el guía manejó bien. Hubiera preferido más tiempo en cada lugar.',
                'service_rating' => 4,
                'value_rating' => 4,
                'guide_rating' => 4,
            ],

            // Montaña de 7 Colores
            [
                'tour_index' => 2,
                'rating' => 5,
                'title' => '¡Los colores son reales!',
                'comment' => 'Increíble experiencia. La montaña es tal cual las fotos, incluso más impresionante en persona. La caminata es dura por la altura pero manejable. El desayuno y almuerzo estuvieron muy buenos. Totalmente recomendado.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],
            [
                'tour_index' => 2,
                'rating' => 4,
                'title' => 'Hermoso pero muy concurrido',
                'comment' => 'La montaña es espectacular pero había mucha gente. Tuvimos que esperar para tomar fotos. Aun así, vale la pena ir. Recomiendo ir entre semana si es posible para evitar multitudes.',
                'service_rating' => 4,
                'value_rating' => 4,
                'guide_rating' => 4,
            ],

            // Tour Gastronómico Lima
            [
                'tour_index' => 3,
                'rating' => 5,
                'title' => '¡Para los amantes de la comida!',
                'comment' => 'Como foodie, este tour superó mis expectativas. El mercado de Surquillo fue fascinante y aprendimos a hacer el mejor ceviche. El chef era divertido y muy profesional. El pisco sour de bienvenida fue el mejor que probé en Perú.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],
            [
                'tour_index' => 3,
                'rating' => 5,
                'title' => 'Experiencia culinaria top',
                'comment' => 'Aprendí mucho sobre la gastronomía peruana. El mercado tiene ingredientes que nunca había visto. Hacer nuestro propio ceviche fue genial y probamos varios tipos. Perfecto para entender la cultura a través de su comida.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],

            // Expedición Amazonas
            [
                'tour_index' => 6,
                'rating' => 5,
                'title' => 'Aventura amazónica auténtica',
                'comment' => 'Tres días increíbles en la selva. Ver delfines rosados en su hábitat natural fue mágico. La caminata nocturna fue emocionante y nuestro guía local conocía cada sonido de la selva. El lodge era rústico pero cómodo.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],
            [
                'tour_index' => 6,
                'rating' => 5,
                'title' => 'Inmersión total en la naturaleza',
                'comment' => 'Una experiencia que te desconecta completamente. Vimos monos, caimanes, aves exóticas y aprendimos sobre plantas medicinales de la comunidad nativa. Los sonidos de la selva por la noche son increíbles.',
                'service_rating' => 5,
                'value_rating' => 5,
                'guide_rating' => 5,
            ],

            // Paracas Islas Ballestas
            [
                'tour_index' => 8,
                'rating' => 4,
                'title' => 'Las Galápagos peruanas',
                'comment' => 'Tour excelente desde Lima. Las islas tienen muchísima fauna marina: lobos marinos, pingüinos, pelícanos. El viaje es largo desde Lima pero vale la pena. La Reserva Nacional de Paracas es hermosa.',
                'service_rating' => 4,
                'value_rating' => 4,
                'guide_rating' => 4,
            ],
        ];

        foreach ($additionalReviews as $reviewData) {
            $tour = $tours[$reviewData['tour_index']] ?? null;
            if (!$tour) continue;
            
            // Buscar un cliente que NO haya revieweado este tour
            $availableCustomers = $customers->filter(function ($customer) use ($tour) {
                return !Review::where('user_id', $customer->id)
                    ->where('tour_id', $tour->id)
                    ->exists();
            });
            
            if ($availableCustomers->isEmpty()) {
                continue; // Si no hay clientes disponibles, saltar esta review
            }
            
            $customer = $availableCustomers->random();
            $daysAgo = rand(10, 90);
            
            Review::create([
                'booking_id' => null, // Reviews sin booking (antiguas)
                'user_id' => $customer->id,
                'tour_id' => $tour->id,
                'agency_id' => $tour->agency_id,
                'rating' => $reviewData['rating'],
                'title' => $reviewData['title'],
                'comment' => $reviewData['comment'],
                'service_rating' => $reviewData['service_rating'],
                'value_rating' => $reviewData['value_rating'],
                'guide_rating' => $reviewData['guide_rating'],
                'is_verified' => true,
                'is_approved' => true,
                'helpful_count' => rand(5, 30),
                'created_at' => Carbon::now()->subDays($daysAgo),
                'updated_at' => Carbon::now()->subDays($daysAgo),
            ]);
            
            $createdReviews++;
        }

        $this->command->info('✅ Reviews creadas: ' . $createdReviews);
    }
}