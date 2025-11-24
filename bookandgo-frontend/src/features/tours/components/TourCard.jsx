// src/features/tours/components/TourCard.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Users, Heart } from 'lucide-react';

const TourCard = ({ tour }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      to={`/tours/${tour.id}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-gray-200"
    >
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={tour.featured_image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Badge de categoría */}
        <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
          {tour.category?.name || 'Aventura'}
        </div>
        
        {/* Botón de favoritos */}
        <button
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          onClick={toggleFavorite}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
          />
        </button>
        
        {/* Badge de descuento */}
        {tour.discount_price && (
          <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            -{Math.round((1 - tour.discount_price / tour.price) * 100)}%
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Ubicación */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 text-yellow-500" />
          <span>{tour.location_city || 'Perú'}</span>
        </div>

        {/* Título */}
        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-yellow-500 transition-colors">
          {tour.title}
        </h3>

        {/* Características */}
        <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
          {tour.duration_days > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{tour.duration_days} {tour.duration_days === 1 ? 'día' : 'días'}</span>
            </div>
          )}
          {tour.duration_hours > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{tour.duration_hours} {tour.duration_hours === 1 ? 'hora' : 'horas'}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Grupos</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(tour.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-900">{tour.rating || 0}</span>
          <span className="text-sm text-gray-500">({tour.total_reviews || 0})</span>
        </div>

        {/* Precio */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                S/. {tour.discount_price || tour.price}
              </span>
              {tour.discount_price && (
                <span className="text-sm text-gray-500 line-through">
                  S/. {tour.price}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">por persona</span>
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors text-sm">
            Ver más
          </button>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;