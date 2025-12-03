// src/features/booking/components/BookingForm.jsx

import { useState } from 'react';
import { Calendar, Users, MessageSquare } from 'lucide-react';
import DateSelector from './DateSelector';
import GuestSelector from './GuestSelector';

const BookingForm = ({ tour, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    date: '',
    adults: 2,
    children: 0,
    infants: 0,
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Selecciona una fecha';
    }

    const totalGuests = formData.adults + formData.children;
    if (totalGuests < tour.min_people) {
      newErrors.guests = `Mínimo ${tour.min_people} personas`;
    }
    if (totalGuests > tour.max_people) {
      newErrors.guests = `Máximo ${tour.max_people} personas`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fecha */}
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-4">
          <Calendar className="w-5 h-5 inline mr-2 text-primary" />
          Fecha del Tour
        </label>
        <DateSelector
          value={formData.date}
          onChange={(date) => setFormData({ ...formData, date })}
          minDate={new Date()}
        />
        {errors.date && (
          <p className="text-red-600 text-sm mt-2">{errors.date}</p>
        )}
      </div>

      {/* Personas */}
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-4">
          <Users className="w-5 h-5 inline mr-2 text-primary" />
          Número de Personas
        </label>
        <GuestSelector
          adults={formData.adults}
          children={formData.children}
          infants={formData.infants}
          minPeople={tour.min_people}
          maxPeople={tour.max_people}
          onAdultsChange={(adults) => setFormData({ ...formData, adults })}
          onChildrenChange={(children) => setFormData({ ...formData, children })}
          onInfantsChange={(infants) => setFormData({ ...formData, infants })}
        />
        {errors.guests && (
          <p className="text-red-600 text-sm mt-2">{errors.guests}</p>
        )}
      </div>

      {/* Solicitudes Especiales */}
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-4">
          <MessageSquare className="w-5 h-5 inline mr-2 text-primary" />
          Solicitudes Especiales (Opcional)
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          rows="4"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
          placeholder="Alergias, restricciones dietéticas, necesidades especiales..."
        />
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Procesando...' : 'Continuar al Pago'}
      </button>
    </form>
  );
};

export default BookingForm;