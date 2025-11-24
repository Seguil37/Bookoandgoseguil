// src/features/booking/components/BookingSummary.jsx

import { Calendar, Users, MapPin, Clock } from 'lucide-react';

const BookingSummary = ({ tour, bookingData, priceBreakdown }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      {/* Imagen */}
      <img
        src={tour.featured_image}
        alt={tour.title}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      <h3 className="font-bold text-gray-900 text-lg mb-4">
        {tour.title}
      </h3>

      {/* Detalles */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
        {bookingData.date && (
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm">
              {new Date(bookingData.date).toLocaleDateString('es-PE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm">
            {bookingData.adults} adulto{bookingData.adults > 1 ? 's' : ''}
            {bookingData.children > 0 && `, ${bookingData.children} niño${bookingData.children > 1 ? 's' : ''}`}
            {bookingData.infants > 0 && `, ${bookingData.infants} infante${bookingData.infants > 1 ? 's' : ''}`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-sm">
            {tour.location_city}, {tour.location_region}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-sm">
            {tour.duration_days > 0 && `${tour.duration_days} día${tour.duration_days > 1 ? 's' : ''}`}
            {tour.duration_days > 0 && tour.duration_hours > 0 && ' y '}
            {tour.duration_hours > 0 && `${tour.duration_hours} hora${tour.duration_hours > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Desglose de Precios */}
      {priceBreakdown && (
        <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
          {priceBreakdown.items.map((item, index) => (
            <div key={index} className="flex justify-between text-gray-700 text-sm">
              <span>{item.label}</span>
              <span className="font-semibold">S/. {item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-xl font-black text-gray-900">Total</span>
        <span className="text-3xl font-black text-primary">
          S/. {priceBreakdown?.total.toFixed(2) || '0.00'}
        </span>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Cancelación gratuita hasta {tour.cancellation_hours}h antes
      </p>
    </div>
  );
};

export default BookingSummary;