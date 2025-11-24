// src/features/agency/components/TourPricing.jsx

import { DollarSign, Clock, Users, TrendingDown } from 'lucide-react';

const TourPricing = ({ formData, updateFormData, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: parseFloat(value) || 0 });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Precios y Duración
      </h2>

      {/* Precios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Precio Regular (S/.) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleNumberChange}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              placeholder="650.00"
              min="0"
              step="0.01"
              required
            />
            {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Precio con Descuento (S/.) <span className="text-gray-400">(Opcional)</span>
          </label>
          <div className="relative">
            <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleNumberChange}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              placeholder="580.00"
              min="0"
              step="0.01"
            />
            {errors.discount_price && (
            <p className="mt-1 text-sm text-red-600">{errors.discount_price}</p>
            )}
          </div>
          {formData.discount_price && formData.price && (
            <p className="text-sm text-green-600 mt-1">
              Descuento: {Math.round(((formData.price - formData.discount_price) / formData.price) * 100)}%
            </p>
          )}
        </div>
      </div>

      {/* Duración */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Duración del Tour *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Días</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleNumberChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                placeholder="4"
                min="0"
              />
              {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.duration_days}</p>
            )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Horas</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="duration_hours"
                value={formData.duration_hours}
                onChange={handleNumberChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                placeholder="8"
                min="0"
                max="23"
              />
              {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.duration_hours}</p>
            )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Si el tour dura días completos, ingresa 0 en horas
        </p>
      </div>

      {/* Capacidad de personas */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mínimo de Personas *
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="min_people"
              value={formData.min_people}
              onChange={handleNumberChange}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              placeholder="1"
              min="1"
              required
            />
            {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.min_people}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Máximo de Personas *
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="max_people"
              value={formData.max_people}
              onChange={handleNumberChange}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              placeholder="16"
              min="1"
              required
            />
            {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.max_people}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nivel de dificultad */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nivel de Dificultad *
        </label>
        <div className="grid grid-cols-3 gap-4">
          {['easy', 'moderate', 'hard'].map((level) => (
            <label
              key={level}
              className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.difficulty_level === level
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="difficulty_level"
                value={level}
                checked={formData.difficulty_level === level}
                onChange={handleChange}
                className="sr-only"
              />
              {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.difficulty_level}</p>
            )}
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {level === 'easy' && '😊'}
                  {level === 'moderate' && '💪'}
                  {level === 'hard' && '🔥'}
                </div>
                <p className="font-semibold text-gray-900 capitalize">
                  {level === 'easy' && 'Fácil'}
                  {level === 'moderate' && 'Moderado'}
                  {level === 'hard' && 'Difícil'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourPricing;