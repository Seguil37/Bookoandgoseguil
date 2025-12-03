// src/features/agency/components/TourImages.jsx

import { useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

const TourImages  = ({ formData, updateFormData, errors = {} }) => {
  const [imageUrls, setImageUrls] = useState([
    formData.featured_image || '',
    ...(formData.images || []),
  ].filter(Boolean));

  const [newImageUrl, setNewImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      setError('Ingresa una URL válida');
      return;
    }

    if (imageUrls.length >= 5) {
      setError('Máximo 5 imágenes permitidas');
      return;
    }

    // Validar URL
    try {
      new URL(newImageUrl);
    } catch {
      setError('URL inválida');
      return;
    }

    const updatedImages = [...imageUrls, newImageUrl];
    setImageUrls(updatedImages);
    
    // Actualizar formData
    updateFormData({
      featured_image: updatedImages[0] || '',
      images: updatedImages.slice(1),
    });

    setNewImageUrl('');
    setError('');
  };

  const handleRemoveImage = (index) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    
    updateFormData({
      featured_image: updatedImages[0] || '',
      images: updatedImages.slice(1),
    });
  };

  const handleSetAsFeatured = (index) => {
    const reorderedImages = [imageUrls[index], ...imageUrls.filter((_, i) => i !== index)];
    setImageUrls(reorderedImages);
    
    updateFormData({
      featured_image: reorderedImages[0],
      images: reorderedImages.slice(1),
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Imágenes del Tour
      </h2>

      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Recomendaciones:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Mínimo 3 imágenes, máximo 5</li>
              <li>La primera imagen será la imagen destacada</li>
              <li>Usa URLs de imágenes (por ahora no se suben archivos)</li>
              <li>Recomendado: 1200x800px o superior</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Image Form */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Agregar Imagen (URL)
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-6 py-3 bg-primary text-gray-900 font-bold rounded-xl hover:bg-primary/90 transition-all"
          >
            <Upload className="w-5 h-5" />
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>

      {/* Images Grid */}
      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="relative group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary transition-all"
            >
              <img
                src={url}
                alt={`Tour ${index + 1}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar';
                }}
              />
              
              {/* Badge de imagen principal */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                  Imagen Principal
                </div>
              )}

              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetAsFeatured(index)}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm"
                  >
                    Hacer Principal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No has agregado imágenes aún</p>
          <p className="text-sm text-gray-400">
            Agrega al menos 3 imágenes para publicar tu tour
          </p>
        </div>
      )}

      {/* Counter */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {imageUrls.length} de 5 imágenes
          {imageUrls.length < 3 && (
            <span className="text-red-600 ml-2">
              (Mínimo 3 requeridas)
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default TourImages;