// src/features/booking/pages/ProfilePage.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, Shield, Star, AlertCircle } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    country: user?.country || '',
    city: user?.city || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí iría la llamada al API
      // await api.put('/profile', formData);
      
      // Simulación
      setTimeout(() => {
        updateUser({ ...user, ...formData });
        setIsEditing(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      country: user?.country || '',
      city: user?.city || '',
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        // Aquí iría la subida del avatar a un servicio de almacenamiento
        // Simulación
        setTimeout(() => {
          updateUser({ ...user, avatar: result });
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Debes iniciar sesión</h2>
          <p className="text-gray-600 mb-6">Por favor, inicia sesión para ver tu perfil</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Principal - Perfil y Formulario */}
          <div className="md:col-span-2 space-y-8">
            {/* Header con Avatar y Botón de Editar */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 animate-fade-in">
              {/* Banner de Perfil */}
              <div className="h-32 bg-gradient-to-br from-yellow-400 to-orange-500 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/50 to-orange-500/50"></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-yellow-600" />
                    <span className="text-2xl font-bold text-yellow-800">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Editar */}
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
              >
                <Edit2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Formulario de Edición */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-500" />
                    Nombre completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-yellow-500 focus:outline-none transition-all ${
                        errors.name
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-500'
                      }`}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-yellow-500" />
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-yellow-500 focus:outline-none transition-all ${
                        errors.email
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-500'
                      }`}
                      placeholder="tu@email.com"
                      disabled
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-yellow-500" />
                    Teléfono
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-yellow-500 focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-yellow-500'
                      }`}
                      placeholder="+51 999 999 999"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-yellow-500" />
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none resize-none transition-all"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                {/* País y Ciudad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      País
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-all"
                    disabled={loading}
                    >
                      <option value="">Selecciona un país</option>
                      <option value="Perú">Perú</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Chile">Chile</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="México">México</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-all"
                      placeholder="Lima"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
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
              </form>
            ) : (
              // Vista de Perfil (no edición)
              <div className="space-y-6">
                {/* Información Personal */}
                <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-yellow-500" />
                    Información Personal
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-medium w-24">Nombre:</span>
                      <span className="text-gray-900 font-medium">{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-medium w-24">Email:</span>
                      <span className="text-gray-900 font-medium truncate">{user?.email}</span>
                    </div>
                    {user?.phone && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 font-medium w-24">Teléfono:</span>
                        <span className="text-gray-900 font-medium">{user?.phone}</span>
                      </div>
                    )}
                    {user?.bio && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <p className="text-gray-700">{user.bio}</p>
                      </div>
                    )}
                  </div>

                  {/* Ubicación */}
                  {(user?.city || user?.country) && (
                    <div className="flex items-center gap-3 mt-4 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-900">
                        {user?.city}, {user?.country}
                      </span>
                    </div>
                  )}

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="w-6 h-6 text-yellow-600" />
                      </div>
                      <p className="text-gray-900 font-medium">Miembro desde</p>
                      <p className="text-gray-700 text-sm">
                        {new Date(user?.created_at).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-gray-900 font-medium">Verificado</p>
                      <p className="text-gray-700 text-sm">Email verificado</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha - Estadísticas y Actividad */}
          <div className="md:col-span-1 space-y-8">
            {/* Estadísticas del Perfil */}
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                Estadísticas
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reservas realizadas</span>
                  <span className="text-2xl font-bold text-gray-900">{user?.total_bookings || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total gastado</span>
                  <span className="text-2xl font-bold text-gray-900">S/. {user?.total_spent || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <span className="text-gray-600">Nivel de viajero</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-900 font-bold">
                    {user?.rating ? parseFloat(user.rating).toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Actividad Reciente */}
              <div className="pt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-800 font-bold text-lg">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Reservas este mes</p>
                      <p className="text-sm text-gray-600">Ver todas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-800 font-bold text-lg">12</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Reservas este año</p>
                      <p className="text-sm text-gray-600">Ver todas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 font-bold text-lg">24</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Reservas este año</p>
                      <p className="text-sm text-gray-600">Ver todas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;