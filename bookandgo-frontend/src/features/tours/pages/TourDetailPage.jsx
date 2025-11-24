// src/features/tours/pages/TourDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Star, MapPin, Clock, Users, Calendar, 
  Check, X, ChevronLeft, ChevronRight, Share2, Shield, Camera, Info
} from 'lucide-react';
import api from '../../../shared/utils/api';

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImageCounter, setShowImageCounter] = useState(false);

  useEffect(() => {
    fetchTour();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/tours/${id}`);
      console.log('Tour data:', response.data);
      
      setTour(response.data);
    } catch (err) {
      console.error('Error fetching tour:', err);
      setError('No se pudo cargar el tour');
    } finally {
      setLoading(false);
    }
  };

  // Obtener array de imágenes
  const getImageUrls = () => {
    if (!tour) return [];
    
    const images = [];
    
    // Agregar featured_image primero
    if (tour.featured_image) {
      images.push(tour.featured_image);
    }
    
    // Agregar imágenes adicionales
    if (tour.images && Array.isArray(tour.images)) {
      tour.images.forEach(img => {
        const url = typeof img === 'object' ? img.image_url : img;
        if (url && url !== tour.featured_image) {
          images.push(url);
        }
      });
    }
    
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'];
  };

  const imageUrls = getImageUrls();

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleReserveNow = () => {
    navigate(`/booking/${tour.id}`);
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando detalles del tour...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Tour no encontrado'}
          </h2>
          <Link 
            to="/tours" 
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            Volver a Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6 animate-fade-in">
          <Link to="/" className="hover:text-yellow-600 transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/tours" className="hover:text-yellow-600 transition-colors">Tours</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">{tour.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{tour.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-yellow-500" />
              <span>{tour.location_city}, {tour.location_region}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{parseFloat(tour.rating || 0).toFixed(1)}</span>
              <span>({tour.total_reviews || 0} reseñas)</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Cancelación gratuita</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galería de Imágenes */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
              <div className="relative">
                <div 
                  className="relative h-64 md:h-96 overflow-hidden"
                  onMouseEnter={() => setShowImageCounter(true)}
                  onMouseLeave={() => setShowImageCounter(false)}
                >
                  <img 
                    src={imageUrls[currentImageIndex]} 
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  
                  {imageUrls.length > 1 && (
                    <>
                      <button 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                        onClick={prevImage}
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                        onClick={nextImage}
                        aria-label="Siguiente imagen"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      {/* Contador de imágenes */}
                      <div className={`absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm transition-opacity ${showImageCounter ? 'opacity-100' : 'opacity-0'}`}>
                        {currentImageIndex + 1} / {imageUrls.length}
                      </div>
                    </>
                  )}

                  {/* Botones de acción */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                      aria-label="Compartir"
                    >
                      <Share2 size={18} />
                    </button>
                    <button 
                      className={`bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all ${isFavorite ? 'text-red-500' : 'text-gray-800'}`}
                      onClick={() => setIsFavorite(!isFavorite)}
                      aria-label="Guardar en favoritos"
                    >
                      <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                {imageUrls.length > 1 && (
                  <div className="flex p-4 gap-2 overflow-x-auto">
                    {imageUrls.slice(0, 5).map((img, index) => (
                      <button
                        key={index}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${index === currentImageIndex ? 'ring-2 ring-yellow-500 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={img}
                          alt={`Vista ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                    {imageUrls.length > 5 && (
                      <button 
                        className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center"
                        onClick={() => setCurrentImageIndex(5)}
                      >
                        <span className="text-gray-700 font-medium">+{imageUrls.length - 5}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Características Rápidas */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-yellow-500" />
                Información del Tour
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Duración:</div>
                    <div className="font-medium text-gray-900">
                      {tour.duration_days > 0 && `${tour.duration_days} día${tour.duration_days > 1 ? 's' : ''}`}
                      {tour.duration_days > 0 && tour.duration_hours > 0 && ' y '}
                      {tour.duration_hours > 0 && `${tour.duration_hours} hora${tour.duration_hours > 1 ? 's' : ''}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Ubicación:</div>
                    <div className="font-medium text-gray-900">
                      {tour.location_city}, {tour.location_region}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Grupo:</div>
                    <div className="font-medium text-gray-900">
                      {tour.min_people} - {tour.max_people} personas
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Dificultad:</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {tour.difficulty_level === 'easy' ? 'Fácil' : 
                       tour.difficulty_level === 'moderate' ? 'Moderado' : 'Difícil'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {['description', 'itinerary', 'includes', 'excludes', 'requirements'].map((tab) => (
                  <button 
                    key={tab}
                    className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all ${
                      activeTab === tab 
                        ? 'text-yellow-600 border-b-2 border-yellow-500 bg-yellow-50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'description' && 'DESCRIPCIÓN'}
                    {tab === 'itinerary' && 'ITINERARIO'}
                    {tab === 'includes' && 'INCLUYE'}
                    {tab === 'excludes' && 'NO INCLUYE'}
                    {tab === 'requirements' && 'REQUISITOS'}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">{tour.description}</p>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {tour.itinerary || 'Itinerario no disponible'}
                    </div>
                  </div>
                )}

                {activeTab === 'includes' && (
                  <div>
                    <ul className="space-y-3">
                      {tour.includes ? tour.includes.split('\n').map((item, i) => (
                        item.trim() && (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-gray-700">{item.replace(/^[•\-]\s*/, '').trim()}</span>
                          </li>
                        )
                      )) : <li className="text-gray-500">No hay información disponible</li>}
                    </ul>
                  </div>
                )}

                {activeTab === 'excludes' && (
                  <div>
                    <ul className="space-y-3">
                      {tour.excludes ? tour.excludes.split('\n').map((item, i) => (
                        item.trim() && (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <X className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="text-gray-700">{item.replace(/^[•\-]\s*/, '').trim()}</span>
                          </li>
                        )
                      )) : <li className="text-gray-500">No hay información disponible</li>}
                    </ul>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {tour.requirements || 'No hay requisitos específicos'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Opiniones */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                Opiniones de los viajeros
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-bold text-gray-900">{parseFloat(tour.rating || 0).toFixed(1)}</div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        fill={i < Math.floor(tour.rating || 0) ? "currentColor" : "none"} 
                        className="w-5 h-5 text-yellow-500" 
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Según {tour.total_reviews || 0} opiniones
                  </div>
                </div>
                
                <div className="flex-1 w-full">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm">{stars}</span>
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-yellow-500 h-full rounded-full" 
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-10 text-right">{Math.floor(Math.random() * 100)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-yellow-600 hover:text-yellow-700 font-medium">
                  Ver todas las opiniones
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Reserva */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Tarjeta de Reserva */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-1">
                  <div className="bg-white p-6">
                    <div className="text-center mb-6">
                      <div className="text-sm text-gray-500 mb-1">PRECIO POR PERSONA</div>
                      <div className="text-3xl font-bold text-gray-900">
                        S/. {parseFloat(tour.discount_price || tour.price).toFixed(2)}
                        {tour.discount_price && (
                          <span className="text-lg text-gray-500 line-through block">
                            S/. {parseFloat(tour.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Impuestos incluidos</div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">Pago 100% seguro</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">Cancelación hasta {tour.cancellation_hours}h antes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">Confirmación instantánea</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleReserveNow}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Reservar Ahora
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Selecciona fecha y cantidad en el siguiente paso
                    </p>
                  </div>
                </div>
              </div>

              {/* Info de la Agencia */}
              {tour.agency && (
                <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Operado por</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{tour.agency.business_name || 'Agencia de Tours'}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Star fill="currentColor" className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{parseFloat(tour.agency.rating || 0).toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({tour.agency.total_reviews || 0} reseñas)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Política de Cancelación */}
              <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Política de Cancelación
                </h4>
                <p className="text-sm text-gray-600">
                  {tour.cancellation_policy || `Cancelación gratuita hasta ${tour.cancellation_hours} horas antes del inicio del tour.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;