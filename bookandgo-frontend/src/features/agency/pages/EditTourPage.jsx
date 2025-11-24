// src/features/agency/pages/EditTourPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import api from '../../../shared/utils/api';
import TourBasicInfo from '../components/TourBasicInfo';
import TourPricing from '../components/TourPricing';
import TourDetails from '../components/TourDetails';
import TourImages from '../components/TourImages';

const EditTourPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    location_city: '',
    location_region: '',
    location_country: 'Peru',
    description: '',
    price: '',
    discount_price: '',
    duration_days: 0,
    duration_hours: 8,
    max_people: 10,
    min_people: 1,
    difficulty_level: 'easy',
    itinerary: '',
    includes: '',
    excludes: '',
    requirements: '',
    cancellation_policy: '',
    cancellation_hours: 24,
    featured_image: '',
    images: [],
  });

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      const response = await api.get(`/tours/${id}`);
      const tour = response.data;
      
      setFormData({
        title: tour.title || '',
        category_id: tour.category_id || '',
        location_city: tour.location_city || '',
        location_region: tour.location_region || '',
        location_country: tour.location_country || 'Peru',
        description: tour.description || '',
        price: tour.price || '',
        discount_price: tour.discount_price || '',
        duration_days: tour.duration_days || 0,
        duration_hours: tour.duration_hours || 8,
        max_people: tour.max_people || 10,
        min_people: tour.min_people || 1,
        difficulty_level: tour.difficulty_level || 'easy',
        itinerary: tour.itinerary || '',
        includes: tour.includes || '',
        excludes: tour.excludes || '',
        requirements: tour.requirements || '',
        cancellation_policy: tour.cancellation_policy || '',
        cancellation_hours: tour.cancellation_hours || 24,
        featured_image: tour.featured_image || '',
        images: tour.images?.map(img => img.image_url) || [],
      });
    } catch (error) {
      console.error('Error fetching tour:', error);
      setError('Error al cargar el tour');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      };

      const response = await api.put(`/tours/${id}`, payload);

      if (response.data.success) {
        navigate('/agency/tours');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el tour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'basic', name: 'Información Básica', component: TourBasicInfo },
    { id: 'pricing', name: 'Precios', component: TourPricing },
    { id: 'details', name: 'Detalles', component: TourDetails },
    { id: 'images', name: 'Imágenes', component: TourImages },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/agency/tours')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a mis tours
          </button>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Editar Tour
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-semibold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <ActiveComponent
            formData={formData}
            updateFormData={updateFormData}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-primary text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-gradient-secondary transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTourPage;