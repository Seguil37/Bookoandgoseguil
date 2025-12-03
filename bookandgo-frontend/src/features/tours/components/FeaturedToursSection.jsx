import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- IMPORTACIÓN AÑADIDA
import { Sparkles, Star, MapPin, Clock, Users, Heart } from 'lucide-react';
import TourCard from './TourCard';
import api from '../../../shared/utils/api';

const FeaturedToursSection = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        const response = await api.get('/tours/featured');
        setTours(response.data.slice(0, 8)); // Mostrar solo 8 tours
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  // Data de ejemplo por si falla el backend
  const exampleTours = [
    {
      id: 1,
      title: 'RUTA AL VALLE DEL COLCA Y DOMA...',
      category: { name: 'Aventura' },
      featured_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      duration_days: 0,
      duration_hours: 9,
      rating: 4.5,
      total_reviews: 50,
      price: 500,
      discount_price: 420,
      location_city: 'Arequipa',
    },
    {
      id: 2,
      title: 'CAMINO INCA CLÁSICO 4 DÍAS',
      category: { name: 'Aventura' },
      featured_image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
      duration_days: 4,
      duration_hours: 0,
      rating: 4.9,
      total_reviews: 87,
      price: 650,
      discount_price: 580,
      location_city: 'Cusco',
    },
    {
      id: 3,
      title: 'EXCURSIÓN A LAS ISLAS BALLESTAS',
      category: { name: 'Naturaleza' },
      featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      duration_days: 0,
      duration_hours: 6,
      rating: 4.7,
      total_reviews: 62,
      price: 280,
      discount_price: 240,
      location_city: 'Paracas',
    },
    {
      id: 4,
      title: 'TOUR POR LA LÍNEA DE NAZCA',
      category: { name: 'Cultura' },
      featured_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      duration_days: 0,
      duration_hours: 4,
      rating: 4.6,
      total_reviews: 41,
      price: 350,
      discount_price: null,
      location_city: 'Nazca',
    },
    {
      id: 5,
      title: 'MONTAÑA DE 7 COLORES FULL DAY',
      category: { name: 'Aventura' },
      featured_image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      duration_days: 0,
      duration_hours: 12,
      rating: 4.8,
      total_reviews: 93,
      price: 420,
      discount_price: 380,
      location_city: 'Cusco',
    },
    {
      id: 6,
      title: 'LAGO TITICACA - ISLAS UROS Y TAQUILE',
      category: { name: 'Cultura' },
      featured_image: 'https://images.unsplash.com/photo-1589986966641-e8c2c7a35fbb?w=800',
      duration_days: 1,
      duration_hours: 0,
      rating: 4.7,
      total_reviews: 76,
      price: 380,
      discount_price: 340,
      location_city: 'Puno',
    },
    {
      id: 7,
      title: 'CANOPY EN EL VALLE SAGRADO',
      category: { name: 'Aventura' },
      featured_image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      duration_days: 0,
      duration_hours: 4,
      rating: 4.9,
      total_reviews: 58,
      price: 290,
      discount_price: null,
      location_city: 'Cusco',
    },
    {
      id: 8,
      title: 'TOUR POR LA CIUDAD DE LIMA',
      category: { name: 'Cultura' },
      featured_image: 'https://images.unsplash.com/photo-1568992688045-55c1a3d0dd0c?w=800',
      duration_days: 0,
      duration_hours: 5,
      rating: 4.5,
      total_reviews: 43,
      price: 180,
      discount_price: 150,
      location_city: 'Lima',
    },
  ];

  const displayTours = tours.length > 0 ? tours : exampleTours;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando experiencias...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Título */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
              Experiencias más buscadas
            </h2>
          </div>
          <Link
            to="/tours"
            className="hidden md:flex items-center gap-2 text-yellow-500 hover:text-yellow-600 font-semibold"
          >
            Ver todas
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Grid de tours - 4 cards por fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTours.map((tour, index) => (
            <div
              key={tour.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <TourCard tour={tour} />
            </div>
          ))}
        </div>

        {/* Ver más - visible solo en móvil */}
        <div className="text-center mt-12 md:hidden">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver todas las experiencias
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedToursSection;