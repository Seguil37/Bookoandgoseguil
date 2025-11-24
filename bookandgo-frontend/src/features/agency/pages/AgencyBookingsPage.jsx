// src/features/agency/pages/AgencyBookingsPage.jsx

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';
import api from '../../../shared/utils/api';

const AgencyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await api.get('/agency/bookings', { params });
      
      const bookingsData = response.data.data || response.data;
      setBookings(bookingsData);
      
      // Calcular estadísticas
      calculateStats(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData) => {
    const stats = {
      total: bookingsData.length,
      confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
      pending: bookingsData.filter(b => b.status === 'pending').length,
      completed: bookingsData.filter(b => b.status === 'completed').length,
    };
    setStats(stats);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.post(`/bookings/${bookingId}/${newStatus}`);
      fetchBookings(); // Recargar lista
      alert('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.booking_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Gestión de Reservas
          </h1>
          <p className="text-gray-600">
            Administra todas las reservas de tus tours
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Total Reservas"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            title="Confirmadas"
            value={stats.confirmed}
            color="green"
          />
          <StatCard
            icon={Clock}
            title="Pendientes"
            value={stats.pending}
            color="yellow"
          />
          <StatCard
            icon={CheckCircle}
            title="Completadas"
            value={stats.completed}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                placeholder="Buscar por cliente, tour o número de reserva..."
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none appearance-none bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No se encontraron reservas
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  );
};

// Booking Card Component
const BookingCard = ({ booking, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { 
        text: 'Pendiente', 
        class: 'bg-yellow-100 text-yellow-700',
        icon: Clock
      },
      confirmed: { 
        text: 'Confirmada', 
        class: 'bg-green-100 text-green-700',
        icon: CheckCircle
      },
      in_progress: { 
        text: 'En Progreso', 
        class: 'bg-blue-100 text-blue-700',
        icon: AlertCircle
      },
      completed: { 
        text: 'Completada', 
        class: 'bg-purple-100 text-purple-700',
        icon: CheckCircle
      },
      cancelled: { 
        text: 'Cancelada', 
        class: 'bg-red-100 text-red-700',
        icon: XCircle
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        <Icon className="w-4 h-4" />
        {badge.text}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-lg text-gray-900">
                {booking.tour?.title || 'Tour eliminado'}
              </h3>
              {getStatusBadge(booking.status)}
            </div>
            <p className="text-sm text-gray-500">
              #{booking.booking_number}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-black text-primary">
              S/. {parseFloat(booking.total_price).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {booking.number_of_people} {booking.number_of_people === 1 ? 'persona' : 'personas'}
            </p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{booking.customer_name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(booking.booking_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{booking.booking_time || '08:00'}</span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Información del Cliente
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{booking.customer_email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Teléfono</p>
                    <p className="text-sm text-gray-600">{booking.customer_phone || 'No especificado'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Detalles de la Reserva
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fecha de reserva</p>
                  <p className="text-sm text-gray-600">{formatDate(booking.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Número de personas</p>
                  <p className="text-sm text-gray-600">{booking.number_of_people}</p>
                </div>
                {booking.special_requirements && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Requerimientos especiales</p>
                    <p className="text-sm text-gray-600">{booking.special_requirements}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4">Información de Pago</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Subtotal</p>
                <p className="font-semibold">S/. {parseFloat(booking.subtotal).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Descuento</p>
                <p className="font-semibold text-green-600">-S/. {parseFloat(booking.discount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Impuestos</p>
                <p className="font-semibold">S/. {parseFloat(booking.tax || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Total</p>
                <p className="font-bold text-lg text-primary">S/. {parseFloat(booking.total_price).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {booking.status === 'pending' && (
            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => onStatusChange(booking.id, 'confirm')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Confirmar Reserva
              </button>
            </div>
          )}
          
          {booking.status === 'confirmed' && (
            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => onStatusChange(booking.id, 'check-in')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Iniciar Check-in
              </button>
            </div>
          )}
          
          {booking.status === 'in_progress' && (
            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => onStatusChange(booking.id, 'complete')}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Marcar como Completada
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgencyBookingsPage;