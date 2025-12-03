// src/features/agency/pages/MyToursPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
import api from '../../../shared/utils/api';

const MyToursPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await api.get('/agency/tours');
      setTours(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tourId) => {
    if (!confirm('¿Estás seguro de eliminar este tour?')) return;

    try {
      await api.delete(`/tours/${tourId}`);
      setTours(tours.filter((t) => t.id !== tourId));
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Error al eliminar el tour');
    }
  };

  const filteredTours = tours.filter((tour) =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Mis Tours
            </h1>
            <p className="text-gray-600">
              Gestiona tus experiencias publicadas
            </p>
          </div>
          <Link
            to="/agency/tours/create"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-gradient-primary text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gradient-secondary transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Crear Tour
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              placeholder="Buscar tours..."
            />
          </div>
        </div>

        {/* Tours List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredTours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron tours</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={tour.featured_image || 'https://via.placeholder.com/100'}
                      alt={tour.title}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-2">
                        {tour.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>S/. {tour.price}</span>
                        <span>·</span>
                        <span>{tour.total_bookings || 0} reservas</span>
                        <span>·</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          tour.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {tour.is_published ? 'Publicado' : 'Borrador'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/tours/${tour.id}`}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Ver"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </Link>
                      <Link
                        to={`/agency/tours/${tour.id}/edit`}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5 text-gray-600" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyToursPage;