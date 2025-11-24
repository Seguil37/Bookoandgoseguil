// src/features/agency/pages/CreateTourPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save,
  Check,
  AlertCircle
} from 'lucide-react';
import api from '../../../shared/utils/api';
import TourBasicInfo from '../components/TourBasicInfo';
import TourPricing from '../components/TourPricing';
import TourDetails from '../components/TourDetails';
import TourImages from '../components/TourImages';

const STEPS = [
  { id: 1, name: 'Información Básica', component: TourBasicInfo },
  { id: 2, name: 'Precios y Duración', component: TourPricing },
  { id: 3, name: 'Detalles del Tour', component: TourDetails },
  { id: 4, name: 'Imágenes', component: TourImages },
];

const CreateTourPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Información básica
    title: '',
    category_id: '',
    location_city: '',
    location_region: '',
    location_country: 'Peru',
    description: '',
    
    // Precios
    price: '',
    discount_price: '',
    duration_days: 0,
    duration_hours: 8,
    max_people: 10,
    min_people: 1,
    difficulty_level: 'easy',
    
    // Detalles
    itinerary: '',
    includes: '',
    excludes: '',
    requirements: '',
    cancellation_policy: '',
    cancellation_hours: 24,
    
    // Imágenes
    featured_image: '',
    images: [],
  });

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Limpiar errores del campo actualizado
    if (validationErrors) {
      const newErrors = { ...validationErrors };
      Object.keys(data).forEach(key => {
        delete newErrors[key];
      });
      setValidationErrors(newErrors);
    }
  };

  // 👇 VALIDACIONES POR PASO
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.title.trim()) errors.title = 'El título es requerido';
      if (!formData.category_id) errors.category_id = 'Selecciona una categoría';
      if (!formData.location_city.trim()) errors.location_city = 'La ciudad es requerida';
      if (!formData.location_region.trim()) errors.location_region = 'La región es requerida';
      if (!formData.description.trim()) errors.description = 'La descripción es requerida';
    }

    if (step === 2) {
      if (!formData.price || formData.price <= 0) errors.price = 'El precio es requerido';
      if (formData.discount_price && formData.discount_price >= formData.price) {
        errors.discount_price = 'El descuento debe ser menor al precio regular';
      }
      if (formData.duration_days === 0 && formData.duration_hours === 0) {
        errors.duration_hours = 'Debes ingresar al menos 1 día o 1 hora';
      }
    }

    if (step === 3) {
      if (!formData.itinerary.trim()) errors.itinerary = 'El itinerario es requerido';
      if (!formData.includes.trim()) errors.includes = 'Debes especificar qué incluye';
      if (!formData.excludes.trim()) errors.excludes = 'Debes especificar qué no incluye';
      if (!formData.requirements.trim()) errors.requirements = 'Los requisitos son requeridos';
      if (!formData.cancellation_policy.trim()) errors.cancellation_policy = 'La política de cancelación es requerida';
    }

    if (step === 4) {
      if (!formData.featured_image) errors.featured_image = 'Debes agregar al menos 1 imagen';
      const totalImages = [formData.featured_image, ...formData.images].filter(Boolean).length;
      if (totalImages < 3) errors.images = 'Debes agregar al menos 3 imágenes';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep((prev) => prev + 1);
        setError(null);
      }
    } else {
      setError('Por favor completa todos los campos requeridos');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  };

  const handleSubmit = async (publish = false) => {
    // Validar todos los pasos
    let allValid = true;
    for (let i = 1; i <= STEPS.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setError(`Hay errores en el paso ${i}. Por favor revisa todos los campos.`);
        setCurrentStep(i);
        return;
      }
    }

    if (!allValid) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        duration_days: parseInt(formData.duration_days),
        duration_hours: parseInt(formData.duration_hours),
        max_people: parseInt(formData.max_people),
        min_people: parseInt(formData.min_people),
        cancellation_hours: parseInt(formData.cancellation_hours),
        is_published: publish,
      };

      console.log('Enviando payload:', payload); // Debug

      const response = await api.post('/tours', payload);

      if (response.data.success) {
        navigate('/agency/tours');
      }
    } catch (err) {
      console.error('Error completo:', err.response?.data); // Debug
      
      if (err.response?.data?.errors) {
        // Errores de validación del backend
        setValidationErrors(err.response.data.errors);
        setError('Hay errores en el formulario. Por favor revísalos.');
      } else {
        setError(err.response?.data?.message || 'Error al crear el tour');
      }
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/agency/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al dashboard
          </button>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Crear Nuevo Tour
          </h1>
          <p className="text-gray-600">
            Completa la información para publicar tu experiencia
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step.id
                        ? 'bg-primary text-gray-900'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-xs font-semibold mt-2 text-center hidden md:block">
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 transition-all ${
                      currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 animate-fade-in flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Step Content */}
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            errors={validationErrors}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Anterior
          </button>

          <div className="flex items-center gap-4">
            {currentStep === STEPS.length ? (
              <>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/10 transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  Guardar borrador
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-primary text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gradient-secondary transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Publicar Tour
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-primary text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gradient-secondary transition-all shadow-lg hover:shadow-xl"
              >
                Siguiente
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTourPage;