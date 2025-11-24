// src/features/tours/pages/ToursPage.jsx

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Filter } from 'lucide-react';
import TourCard from '../components/TourCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import api from '../../../shared/utils/api';

const ToursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    lastPage: 1,
    perPage: 12,
  });

  // Estados de filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('min_price') || '',
    maxPrice: searchParams.get('max_price') || '',
    category: searchParams.get('category_id') || '',
    rating: searchParams.get('min_rating') || '',
    duration: searchParams.get('duration') || '',
    difficulty: searchParams.get('difficulty') || '',
    sortBy: searchParams.get('sort_by') || 'created_at',
  });

  useEffect(() => {
    fetchTours();
  }, [searchParams]);

  const fetchTours = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        search: searchParams.get('search'),
        location: searchParams.get('location'),
        min_price: searchParams.get('min_price'),
        max_price: searchParams.get('max_price'),
        category_id: searchParams.get('category_id'),
        min_rating: searchParams.get('min_rating'),
        duration: searchParams.get('duration'),
        difficulty: searchParams.get('difficulty'),
        sort_by: searchParams.get('sort_by'),
        per_page: 12,
        page,
      };

      // Filtrar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await api.get('/tours', { params });

      // Manejar respuesta paginada o array simple
      if (response.data.data) {
        setTours(response.data.data);
        setPagination({
          total: response.data.total || 0,
          currentPage: response.data.current_page || 1,
          lastPage: response.data.last_page || 1,
          perPage: response.data.per_page || 12,
        });
      } else {
        setTours(response.data);
        setPagination({
          total: response.data.length,
          currentPage: 1,
          lastPage: 1,
          perPage: 12,
        });
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours([]);
      setPagination({
        total: 0,
        currentPage: 1,
        lastPage: 1,
        perPage: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Mapeo de filtros del frontend a parámetros de API
    const apiMapping = {
      search: 'search',
      location: 'location',
      minPrice: 'min_price',
      maxPrice: 'max_price',
      category: 'category_id',
      rating: 'min_rating',
      duration: 'duration',
      difficulty: 'difficulty',
      sortBy: 'sort_by',
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const apiKey = apiMapping[key] || key;
        params.append(apiKey, value);
      }
    });
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      category: '',
      rating: '',
      duration: '',
      difficulty: '',
      sortBy: 'created_at',
    });
    setSearchParams({});
  };

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.lastPage) {
      fetchTours(pagination.currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de búsqueda superior */}
      <div className="bg-white border-b sticky top-20 z-40 shadow-sm">
        <div className="container-custom py-4">
          <SearchBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={applyFilters}
          />
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar de Filtros - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-36">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={applyFilters}
                onClear={clearFilters}
              />
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            {/* Header con resultados y botón de filtros móvil */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
                  {filters.location && <MapPin className="w-6 h-6 text-yellow-500" />}
                  {filters.location || 'Todas las atracciones'}
                </h1>
                <p className="text-gray-600">
                  {loading ? 'Cargando...' : (
                    <span>
                      <span className="font-semibold">{pagination.total}</span> experiencias encontradas
                    </span>
                  )}
                </p>
              </div>

              {/* Botón filtros móvil */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md"
              >
                <Filter className="w-5 h-5" />
                Filtros
              </button>
            </div>

            {/* Filtros activos */}
            {Object.values(filters).some(v => v && v !== 'created_at') && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-semibold text-gray-700">Filtros activos:</span>
                {filters.search && (
                  <span className="px-3 py-1 bg-white text-yellow-700 rounded-full text-sm flex items-center gap-2 border border-yellow-300">
                    Búsqueda: {filters.search}
                    <button 
                      onClick={() => {
                        handleFilterChange('search', '');
                        applyFilters();
                      }}
                      className="hover:text-yellow-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="px-3 py-1 bg-white text-yellow-700 rounded-full text-sm flex items-center gap-2 border border-yellow-300">
                    Ubicación: {filters.location}
                    <button 
                      onClick={() => {
                        handleFilterChange('location', '');
                        applyFilters();
                      }}
                      className="hover:text-yellow-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="px-3 py-1 bg-white text-yellow-700 rounded-full text-sm flex items-center gap-2 border border-yellow-300">
                    S/. {filters.minPrice || '0'} - {filters.maxPrice || '∞'}
                    <button 
                      onClick={() => {
                        handleFilterChange('minPrice', '');
                        handleFilterChange('maxPrice', '');
                        applyFilters();
                      }}
                      className="hover:text-yellow-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="px-3 py-1 bg-white text-yellow-700 rounded-full text-sm flex items-center gap-2 border border-yellow-300">
                    Categoría
                    <button 
                      onClick={() => {
                        handleFilterChange('category', '');
                        applyFilters();
                      }}
                      className="hover:text-yellow-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.rating && (
                  <span className="px-3 py-1 bg-white text-yellow-700 rounded-full text-sm flex items-center gap-2 border border-yellow-300">
                    Rating: {filters.rating}⭐+
                    <button 
                      onClick={() => {
                        handleFilterChange('rating', '');
                        applyFilters();
                      }}
                      className="hover:text-yellow-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.duration && (
                  <span className="px-3 py-1 bg-white text-yellow-700 rounded-full text-sm flex items-center gap-2 border border-yellow-300">
                    Duración
                    <button 
                      onClick={() => {
                        handleFilterChange('duration', '');
                        applyFilters();
                      }}
                      className="hover:text-yellow-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Limpiar todos
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-56 bg-gray-200"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tours.length > 0 ? (
              <>
                {/* Grid de Tours */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>

                {/* Paginación */}
                {pagination.lastPage > 1 && (
                  <div className="text-center mt-12">
                    {pagination.currentPage < pagination.lastPage ? (
                      <button 
                        onClick={handleLoadMore}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                      >
                        Ver más ({pagination.total - tours.length} restantes)
                      </button>
                    ) : (
                      <p className="text-gray-600">
                        Mostrando todos los resultados ({pagination.total} tours)
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="mb-4">
                  <Search className="w-16 h-16 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar tus filtros o buscar algo diferente
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar de Filtros - Móvil */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-in">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={applyFilters}
              onClear={clearFilters}
              isMobile={true}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ToursPage;