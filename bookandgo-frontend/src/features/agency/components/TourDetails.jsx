// src/features/agency/components/TourDetails.jsx

import { FileText, CheckCircle, XCircle, AlertTriangle, Calendar } from 'lucide-react';

const TourDetails = ({ formData, updateFormData, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: parseInt(value) || 0 });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Detalles del Tour
      </h2>

      {/* Itinerario */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Itinerario *
        </label>
        <textarea
          name="itinerary"
          value={formData.itinerary}
          onChange={handleChange}
          rows="8"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none font-mono text-sm"
          placeholder="Día 1: Cusco - Km 82 - Wayllabamba (12km)&#10;Salida temprano desde Cusco. Inicio de caminata en el km 82...&#10;&#10;Día 2: Wayllabamba - Paso Warmihuañusca (11km)&#10;Día más desafiante. Ascenso al paso..."
          required
        />
        <p className="text-sm text-gray-500 mt-2">
          Describe el itinerario día a día o por actividades
        </p>
      </div>

      {/* Incluye */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          ¿Qué incluye? *
        </label>
        <textarea
          name="includes"
          value={formData.includes}
          onChange={handleChange}
          rows="6"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
          placeholder="• Guía profesional bilingüe certificado&#10;• Entrada a Machu Picchu&#10;• Transporte Cusco - Km 82&#10;• 3 noches de camping..."
          required
        />
        <p className="text-sm text-gray-500 mt-2">
          Lista todo lo que está incluido en el precio (usa • para viñetas)
        </p>
      </div>

      {/* No incluye */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          ¿Qué NO incluye? *
        </label>
        <textarea
          name="excludes"
          value={formData.excludes}
          onChange={handleChange}
          rows="5"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
          placeholder="• Propinas para guías y porteadores&#10;• Bebidas alcohólicas&#10;• Seguro de viaje personal..."
          required
        />
      </div>

      {/* Requisitos */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Requisitos *
        </label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows="5"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
          placeholder="• Buen estado físico (caminatas de 6-8 horas)&#10;• Pasaporte vigente&#10;• Edad mínima: 12 años..."
          required
        />
      </div>

      {/* Política de cancelación */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Política de Cancelación *
        </label>
        <textarea
          name="cancellation_policy"
          value={formData.cancellation_policy}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
          placeholder="Cancelación gratuita hasta 24 horas antes. Menos de 24 horas: sin reembolso."
          required
        />
      </div>

      {/* Horas de cancelación */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Horas de Cancelación Gratuita *
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            name="cancellation_hours"
            value={formData.cancellation_hours}
            onChange={handleNumberChange}
            className="w-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
            min="0"
            required
          />
          <span className="text-gray-600">horas antes del tour</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Ejemplo: 24 horas = cancelación gratuita hasta 1 día antes
        </p>
      </div>
    </div>
  );
};

export default TourDetails;