// src/features/tours/components/FilterSidebar.jsx

import { useState, useEffect } from 'react';
import { DollarSign, Star, Clock, TrendingUp, X, Filter } from 'lucide-react';
import api from '../../../shared/utils/api';

const FilterSidebar = ({ filters, onFilterChange, onApply, onClear, isMobile = false, onClose }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleApply = () => {
    onApply();
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 relative">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-yellow-500" />
            Filtros
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      {!isMobile && <h3 className="text-xl font-bold text-gray-900">Filtros</h3>}

      {/* Rango de Precios */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-yellow-500" />
          Rango de precio
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/.</span>
            <input
              type="number"
              placeholder="Mínimo"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-all"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/.</span>
            <input
              type="number"
              placeholder="Máximo"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Categoría
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-all"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          Calificación mínima
        </label>
        <div className="space-y-2">
          {[5, 4, 3, 2].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating.toString()}
                onChange={(e) => onFilterChange('rating', e.target.value)}
                className="text-yellow-500 focus:ring-yellow-500"
              />
              <div className="flex items-center gap-1">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="text-sm text-gray-600">y más</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Duración */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-500" />
          Duración
        </label>
        <select
          value={filters.duration}
          onChange={(e) => onFilterChange('duration', e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-all"
        >
          <option value="">Cualquier duración</option>
          <option value="short">Menos de 4 horas</option>
          <option value="medium">4-8 horas</option>
          <option value="day">1 día completo</option>
          <option value="multi">Más de 1 día</option>
        </select>
      </div>

      {/* Dificultad */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-yellow-500" />
          Dificultad
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'easy', label: 'Fácil', color: 'bg-green-100 text-green-700' },
            { value: 'moderate', label: 'Moderado', color: 'bg-yellow-100 text-yellow-700' },
            { value: 'hard', label: 'Difícil', color: 'bg-red-100 text-red-700' },
          ].map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onFilterChange('difficulty', filters.difficulty === level.value ? '' : level.value)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                filters.difficulty === level.value
                  ? `${level.color} border-2 border-current`
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ordenar por */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Ordenar por
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-all"
        >
          <option value="created_at">Más recientes</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="rating">Mejor calificados</option>
          <option value="popular">Más populares</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onClear}
          className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
        >
          Limpiar
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;