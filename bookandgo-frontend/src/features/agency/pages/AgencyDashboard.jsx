// src/features/agency/pages/AgencyDashboard.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import api from '../../../shared/utils/api';

const AgencyDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    total_tours: 0,
    active_bookings: 0,
    total_revenue: 0,
    total_reviews: 0,
  });
  const [recentTours, setRecentTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, toursRes] = await Promise.all([
        api.get('/agency/statistics'),
        api.get('/agency/tours?limit=5'),
      ]);

      setStats(statsRes.data.stats || {});
      setRecentTours(toursRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              ¡Hola, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">
              Gestiona tus tours y reservas desde aquí
            </p>
          </div>
          <Link
            to="/agency/tours/create"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Crear Tour
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Tours Activos"
            value={stats.total_tours || 0}
            color="blue"
          />
          <Link to="/agency/bookings">
            <StatCard
              icon={Users}
              title="Reservas Activas"
              value={stats.active_bookings || 0}
              color="green"
            />
          </Link>
          <StatCard
            icon={DollarSign}
            title="Ingresos Totales"
            value={`S/. ${parseFloat(stats.total_revenue || 0).toFixed(2)}`} 
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            title="Reseñas"
            value={stats.total_reviews || 0}
            color="orange"
          />
        </div>

        {/* Recent Tours */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">
              Tus Tours Recientes
            </h2>
            <Link
              to="/agency/tours"
              className="text-primary hover:text-primary-dark font-semibold"
            >
              Ver todos →
            </Link>
          </div>

          {recentTours.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Aún no has creado ningún tour
              </p>
              <Link
                to="/agency/tours/create"
                className="inline-flex items-center gap-2 bg-gradient-primary text-gray-900 font-bold px-6 py-3 rounded-xl"
              >
                <Plus className="w-5 h-5" />
                Crear mi primer tour
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTours.map((tour) => (
                <TourRow key={tour.id} tour={tour} />
              ))}
            </div>
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
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  );
};

// Tour Row Component
const TourRow = ({ tour }) => {
  const getStatusBadge = (status) => {
    const badges = {
      published: { text: 'Publicado', class: 'bg-green-100 text-green-700' },
      draft: { text: 'Borrador', class: 'bg-gray-100 text-gray-700' },
      pending: { text: 'Pendiente', class: 'bg-yellow-100 text-yellow-700' },
    };

    const badge = badges[status] || badges.draft;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors">
      <img
        src={tour.featured_image || 'https://via.placeholder.com/100'}
        alt={tour.title}
        className="w-20 h-20 rounded-lg object-cover"
      />
      
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 mb-1">{tour.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>S/. {tour.price}</span>
          <span>·</span>
          <span>{tour.total_bookings || 0} reservas</span>
          <span>·</span>
          {getStatusBadge(tour.is_published ? 'published' : 'draft')}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={`/tours/${tour.id}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Ver"
        >
          <Eye className="w-5 h-5 text-gray-600" />
        </Link>
        <Link
          to={`/agency/tours/${tour.id}/edit`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Editar"
        >
          <Edit className="w-5 h-5 text-gray-600" />
        </Link>
      </div>
    </div>
  );
};

export default AgencyDashboard;