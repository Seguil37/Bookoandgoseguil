// src/features/customer/pages/MyBookingsPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Download,
  MessageSquare,
  XCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  ChevronRight
} from 'lucide-react';
import api from '../../../shared/utils/api';
import useAuthStore from '../../../store/authStore';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/bookings', { params });
      setBookings(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await api.post(`/bookings/${bookingId}/cancel`, {
        reason: 'Cancelado por el cliente'
      });
      
      // Actualizar la lista
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));

      alert('Reserva cancelada exitosamente');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err.response?.data?.message || 'Error al cancelar la reserva');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadVoucher = async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/documents/voucher`, {
        responseType: 'blob'
      });
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `voucher-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading voucher:', err);
      alert('Error al descargar el voucher. Inténtalo más tarde.');
    }
  };

  const handleContactAgency = (booking) => {
    // Navegar a mensajes o abrir modal de contacto
    navigate(`/bookings/${booking.id}/messages`);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      },
      confirmed: {
        label: 'Confirmado',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      cancelled: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800',
        icon: XCircle
      },
      completed: {
        label: 'Completado',
        color: 'bg-blue-100 text-blue-800',
        icon: CheckCircle
      },
      in_progress: {
        label: 'En progreso',
        color: 'bg-purple-100 text-purple-800',
        icon: Clock
      }
    };
    return configs[status] || configs.pending;
  };

  const canCancelBooking = (booking) => {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }
    
    // Verificar si está dentro del periodo de cancelación
    const bookingDate = new Date(booking.booking_date);
    const now = new Date();
    const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);
    
    // Asumiendo 24 horas de cancelación
    return hoursUntilBooking > 24;
  };

  const filteredBookings = bookings;

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando tus reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-gray-600">
            Gestiona y revisa todas tus experiencias reservadas
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'confirmed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmadas
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'completed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completadas
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Canceladas
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Lista de Reservas */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No tienes reservas
            </h3>
            <p className="text-gray-600 mb-6">
              Explora nuestros tours y comienza tu aventura
            </p>
            <button
              onClick={() => navigate('/tours')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Explorar Tours
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="md:flex">
                    {/* Imagen */}
                    <div className="md:w-64 h-48 md:h-auto relative">
                      <img
                        src={booking.tour?.featured_image || 'https://via.placeholder.com/400x300'}
                        alt={booking.tour?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute top-4 right-4 ${statusConfig.color} px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {booking.tour?.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.booking_date).toLocaleDateString('es-PE', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            {booking.booking_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.booking_time}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Total pagado</p>
                          <p className="text-2xl font-black text-yellow-500">
                            S/. {parseFloat(booking.total_price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Detalles */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          {booking.number_of_people} persona{booking.number_of_people > 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {booking.tour?.location_city}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleDownloadVoucher(booking.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Descargar
                        </button>

                        <button
                          onClick={() => handleContactAgency(booking)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all font-medium"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Contactar
                        </button>

                        {canCancelBooking(booking) && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-medium disabled:opacity-50"
                          >
                            {cancellingId === booking.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cancelando...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Cancelar
                              </>
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/tours/${booking.tour_id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-all font-medium ml-auto"
                        >
                          Ver tour
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Dejar reseña si está completado */}
                      {booking.status === 'completed' && !booking.review && (
                        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                          <p className="text-sm text-yellow-800 mb-2">
                            ¿Disfrutaste esta experiencia? ¡Déjanos tu reseña!
                          </p>
                          <button
                            onClick={() => navigate(`/tours/${booking.tour_id}?review=true`)}
                            className="flex items-center gap-1 text-yellow-700 hover:text-yellow-800 font-medium text-sm"
                          >
                            <Star className="w-4 h-4" />
                            Dejar reseña
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;