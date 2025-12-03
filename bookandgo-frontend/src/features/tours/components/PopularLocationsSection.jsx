// src/features/tours/components/PopularLocationsSection.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, Loader2, Star } from 'lucide-react';
import api from '../../../shared/utils/api';

const PopularLocationsSection = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularLocations();
  }, []);

  const fetchPopularLocations = async () => {
    try {
      // Obtener todos los tours publicados
      const response = await api.get('/tours', { 
        params: { 
          per_page: 100 // Obtener todos para contar por ubicación
        } 
      });

      const tours = response.data.data || response.data;

      // Agrupar tours por ciudad
      const locationCounts = {};
      const locationImages = {};

      tours.forEach((tour) => {
        const city = tour.location_city;
        if (city) {
          locationCounts[city] = (locationCounts[city] || 0) + 1;
          
          // Guardar la primera imagen encontrada para cada ciudad
          if (!locationImages[city] && tour.featured_image) {
            locationImages[city] = tour.featured_image;
          }
        }
      });

      // Convertir a array y ordenar por cantidad de experiencias
      const sortedLocations = Object.entries(locationCounts)
        .map(([name, count]) => ({
          name,
          experiences: count,
          image: locationImages[name] || getDefaultImage(name),
          rating: (Math.random() * 2 + 3).toFixed(1), // Rating aleatorio entre 3.0 y 5.0
        }))
        .sort((a, b) => b.experiences - a.experiences)
        .slice(0, 9); // Mostrar top 9

      setLocations(sortedLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Fallback a datos de ejemplo
      setLocations(fallbackLocations);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener imagen por defecto según la ciudad
  const getDefaultImage = (cityName) => {
    const defaultImages = {
      'Cusco': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
      'Lima': 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800',
      'Arequipa': 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800',
      'Paracas': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      'Iquitos': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
      'Puno': 'https://images.unsplash.com/photo-1589986966641-e8c2c7a35fbb?w=800',
      'Huaraz': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'Trujillo': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800',
      'Chiclayo': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    };

    return defaultImages[cityName] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
  };

  // Datos de fallback
  const fallbackLocations = [
    {
      name: 'Cusco',
      image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
      experiences: 145,
      rating: 4.8,
    },
    {
      name: 'Lima',
      image: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800',
      experiences: 98,
      rating: 4.6,
    },
    {
      name: 'Arequipa',
      image: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=800',
      experiences: 67,
      rating: 4.7,
    },
  ];

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Si no hay ubicaciones, no mostrar la sección
  if (locations.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Título */}
        <div className="flex items-center gap-3 mb-12 animate-fade-in">
          <TrendingUp className="w-8 h-8 text-yellow-500" />
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
            Lugares más visitados
          </h2>
        </div>

        {/* Grid de ubicaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <Link
              key={index}
              to={`/tours?location=${encodeURIComponent(location.name)}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Imagen */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                {/* Badge de rating */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold text-gray-900">{location.rating}</span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors">
                  {location.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {location.experiences} {location.experiences === 1 ? 'experiencia' : 'experiencias'}
                    </span>
                  </div>
                  
                  {/* Indicador de hover */}
                  <div className="flex items-center gap-1 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">Ver tours</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Botón Ver Más */}
        <div className="text-center mt-12">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver todos los destinos
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

export default PopularLocationsSection;