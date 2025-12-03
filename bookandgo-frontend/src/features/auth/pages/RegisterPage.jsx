// src/features/auth/pages/RegisterPage.jsx

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UserPlus, Mail, Lock, User, Phone, Eye, EyeOff,
  Loader2, AlertCircle, Shield, Building2, UserCircle
} from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, loading, error, clearError } = useAuthStore();

  const [step, setStep] = useState(0); // 0: selector, 1: formulario, 2: términos
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: 'customer',
    // Campos de agencia
    business_name: '',
    ruc_tax_id: '',
    address: '',
    city: '',
    description: '',
    website: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role');

    if (role === 'agency') {
      setUserType('agency');
      setFormData((prev) => ({ ...prev, role: 'agency' }));
      setStep(1);
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setFormData({ ...formData, role: type === 'agency' ? 'agency' : 'customer' });
    setStep(1);
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';

    // Validaciones para agencias
    if (userType === 'agency') {
      if (!formData.business_name.trim()) newErrors.business_name = 'Razón social requerida';
      if (!formData.ruc_tax_id.trim()) newErrors.ruc_tax_id = 'RUC requerido';
      if (!formData.address.trim()) newErrors.address = 'Dirección requerida';
      if (!formData.city.trim()) newErrors.city = 'Ciudad requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await registerUser(formData);

    if (result.success) {
      navigate('/');
    } else {
      setErrors({ general: result.error });
    }
  };

  // PASO 0: Selector de tipo de usuario
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-6 shadow-xl">
              <UserPlus className="w-12 h-12 text-gray-900" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              ¿Cómo deseas registrarte?
            </h2>
            <p className="text-gray-600">
              Elige el tipo de cuenta que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Opción Cliente */}
            <button
              onClick={() => handleUserTypeSelect('customer')}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 text-left group hover:scale-105"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <UserCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Soy Cliente
              </h3>
              <p className="text-gray-600 mb-6">
                Explora y reserva experiencias únicas alrededor del mundo
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Reserva tours y experiencias
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Guarda tus favoritos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Gestiona tus reservas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Deja reseñas y calificaciones
                </li>
              </ul>
            </button>

            {/* Opción Agencia */}
            <button
              onClick={() => handleUserTypeSelect('agency')}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 text-left group hover:scale-105"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-200 transition-colors">
                <Building2 className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Soy Proveedor
              </h3>
              <p className="text-gray-600 mb-6">
                Ofrece tus tours y llega a miles de viajeros
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  Crea y gestiona tus tours
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  Administra reservas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  Panel de estadísticas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  Aumenta tus ventas
                </li>
              </ul>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-yellow-500 hover:text-yellow-600 font-bold transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // PASO 2: Términos y condiciones
  if (step === 2) {
    return (
      <TermsAndConditionsStep
        formData={formData}
        onBack={() => setStep(1)}
        isAgency={userType === 'agency'}
        onSubmit={handleSubmit}
        loading={loading}
        apiError={error}
      />
    );
  }

  // PASO 1: Formulario de registro
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <button
            onClick={() => setStep(0)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Volver a selección
          </button>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-6 shadow-xl">
            {userType === 'agency' ? (
              <Building2 className="w-12 h-12 text-gray-900" />
            ) : (
              <UserCircle className="w-12 h-12 text-gray-900" />
            )}
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            {userType === 'agency' ? 'Regístrate como Proveedor' : 'Crea tu cuenta'}
          </h2>
          <p className="text-gray-600">
            {userType === 'agency'
              ? 'Únete a nuestra red de agencias de viajes'
              : 'Únete a Book&Go y descubre experiencias únicas'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
          <form onSubmit={handleNext} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-yellow-500" />
                Información Personal
              </h3>

              <InputField
                icon={User}
                label="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="Juan Pérez"
              />

              <InputField
                icon={Mail}
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="tu@email.com"
              />

              <InputField
                icon={Phone}
                label="Teléfono"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="+51 999 999 999"
              />
            </div>

            {/* Datos de Agencia */}
            {userType === 'agency' && (
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  Datos de la Agencia
                </h3>

                <InputField
                  label="Razón Social"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  error={errors.business_name}
                  placeholder="Nombre de la empresa"
                />

                <InputField
                  label="RUC"
                  name="ruc_tax_id"
                  value={formData.ruc_tax_id}
                  onChange={handleChange}
                  error={errors.ruc_tax_id}
                  placeholder="20123456789"
                  maxLength="11"
                />

                <InputField
                  label="Dirección"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  placeholder="Av. Principal 123"
                />

                <InputField
                  label="Ciudad"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="Lima"
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500"
                    placeholder="Cuéntanos sobre tu agencia..."
                  />
                </div>

                <InputField
                  label="Sitio web (opcional)"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://tuagencia.com"
                />
              </div>
            )}

            {/* Contraseñas */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-500" />
                Seguridad
              </h3>

              <PasswordField
                label="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="Mínimo 8 caracteres"
              />

              <PasswordField
                label="Confirmar contraseña"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                error={errors.password_confirmation}
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="Repite tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Continuar
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-yellow-500 hover:text-yellow-600 font-bold transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente reutilizable para inputs
const InputField = ({
  icon: Icon,
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  focusedField,
  setFocusedField,
  placeholder,
  maxLength
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-yellow-500" />}
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
          focusedField === name ? 'text-yellow-500' : 'text-gray-400'
        }`} />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField && setFocusedField(name)}
        onBlur={() => setFocusedField && setFocusedField('')}
        maxLength={maxLength}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
          error
            ? 'border-red-500 focus:border-red-500'
            : focusedField === name
            ? 'border-yellow-500 bg-yellow-50'
            : 'border-gray-200 focus:border-yellow-500'
        }`}
        placeholder={placeholder}
      />
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600 animate-fade-in flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

// Componente para campos de contraseña
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  error,
  show,
  onToggle,
  focusedField,
  setFocusedField,
  placeholder
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      <Lock className="w-4 h-4 text-yellow-500" />
      {label}
    </label>
    <div className="relative">
      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
        focusedField === name ? 'text-yellow-500' : 'text-gray-400'
      }`} />
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField('')}
        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
          error
            ? 'border-red-500 focus:border-red-500'
            : focusedField === name
            ? 'border-yellow-500 bg-yellow-50'
            : 'border-gray-200 focus:border-yellow-500'
        }`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600 animate-fade-in flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

// Componente de términos y condiciones
const TermsAndConditionsStep = ({ formData, onBack, isAgency, onSubmit, loading, apiError }) => {
  const [accepted, setAccepted] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accepted) {
      setLocalError('Debes aceptar los términos y condiciones');
      return;
    }

    setLocalError(null);
    await onSubmit(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-6 shadow-xl">
            <Shield className="w-12 h-12 text-gray-900" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Términos y Condiciones
          </h2>
          <p className="text-gray-600">
            Revisa y acepta nuestros términos para continuar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
          {(localError || apiError) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 animate-fade-in flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{localError || apiError}</p>
            </div>
          )}

          <div className="border border-gray-200 rounded-xl p-6 max-h-64 overflow-y-auto mb-6">
            <div className="space-y-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">1. Aceptación de términos</p>
              <p>Al crear una cuenta en Book&Go, aceptas nuestros términos y condiciones.</p>

              {isAgency && (
                <>
                  <p className="font-semibold text-gray-900">2. Verificación de agencias</p>
                  <p>Tu cuenta de agencia será revisada por nuestro equipo antes de ser activada completamente.</p>
                </>
              )}

              <p className="font-semibold text-gray-900">{isAgency ? '3' : '2'}. Uso del servicio</p>
              <p>Debes utilizar nuestros servicios de manera responsable y legal.</p>

              <p className="font-semibold text-gray-900">{isAgency ? '4' : '3'}. Privacidad</p>
              <p>Tus datos serán protegidos según nuestra política de privacidad.</p>

              <p className="font-semibold text-gray-900">{isAgency ? '5' : '4'}. Pagos</p>
              <p>Todos los pagos se procesan de forma segura a través de nuestros partners de pago.</p>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-yellow-500 cursor-pointer transition-all mb-6">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-yellow-500 focus:ring-yellow-500 rounded"
            />
            <span className="text-sm text-gray-700">
              Acepto los términos y condiciones, la política de privacidad y el acuerdo de la comunidad de Book&Go.
            </span>
          </label>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Atrás
            </button>
            <button
              onClick={handleSubmit}
              disabled={!accepted || loading}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
