// src/features/booking/pages/BookingSuccessPage.jsx

import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Calendar, 
  Download, 
  ArrowRight, 
  Star,
  Shield,
  MapPin,
  Clock,
  Users,
  Mail,
  Phone,
  Heart,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPaid, bookingsCount, paymentMethod } = location.state || {};

  useEffect(() => {
    // Si no hay datos de pago, redirigir
    if (!totalPaid) {
      navigate('/');
      return;
    }

    // Lanzar confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 70,
        origin: { x: 0.3, y: 0.3 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#FFFF00', '#FF8C00'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 70,
        origin: { x: 0.7, y: 0.3 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#FFFF00', '#FF8C00'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [totalPaid, navigate]);

  if (!totalPaid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-16">
      <div className="container-custom max-w-4xl">
        {/* Animación de éxito */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-8 animate-bounce-slow shadow-xl">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            ¡Reserva Confirmada! 🎉
          </h1>
          
          <p className="text-2xl text-gray-600 mb-6">
            Tu pago ha sido procesado exitosamente
          </p>
          
          <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold text-lg animate-pulse">
            <CheckCircle className="w-6 h-6" />
            Pago completado: S/. {totalPaid.toFixed(2)}
          </div>
        </div>

        {/* Tarjeta de confirmación */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Mail className="w-6 h-6 text-yellow-500" />
              ¿Qué sigue?
            </h2>
            <p className="text-gray-600">
              Hemos enviado la confirmación a tu correo electrónico con todos los detalles de tu reserva
            </p>
          </div>

          {/* Pasos siguientes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Confirmación enviada</h3>
              <p className="text-sm text-gray-700">Revisa tu correo para ver los detalles completos</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Prepara tu viaje</h3>
              <p className="text-sm text-gray-700">El operador turístico se pondrá en contacto contigo</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Disfruta tu experiencia</h3>
              <p className="text-sm text-gray-700">Llega 15 minutos antes del punto de encuentro</p>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-yellow-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-yellow-600" />
              ¿Necesitas ayuda?
            </h3>
            <p className="text-gray-700 mb-4">
              Contacta a nuestro equipo de soporte si tienes alguna pregunta sobre tu reserva
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:soporte@bookandgo.com"
                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
              >
                <Mail className="w-5 h-5" />
                soporte@bookandgo.com
              </a>
              <a
                href="tel:+51987654321"
                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
              >
                <Phone className="w-5 h-5" />
                +51 987 654 321
              </a>
            </div>
          </div>
        </div>

        {/* Acciones adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/profile/bookings"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Calendar className="w-5 h-5" />
            Ver mis reservas
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-900 font-bold px-6 py-4 rounded-xl hover:bg-gray-50 transition-all"
          >
            <Download className="w-5 h-5" />
            Descargar confirmación
          </button>
        </div>

        {/* Explorar más */}
        <div className="text-center">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-600 font-bold text-lg transition-colors"
          >
            Explorar más experiencias
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            ¿Necesitas ayuda? Contacta a nuestro equipo de soporte
          </p>
        </div>

        {/* Beneficios de Book&Go */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            ¿Por qué elegir Book&Go?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Experiencias verificadas</p>
                <p className="text-sm text-gray-600">Todas nuestras agencias son revisadas y aprobadas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Pago seguro</p>
                <p className="text-sm text-gray-600">Transacciones protegidas con encriptación SSL</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Soporte 24/7</p>
                <p className="text-sm text-gray-600">Estamos aquí para ayudarte en cualquier momento</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Confirmación instantánea</p>
                <p className="text-sm text-gray-600">Recibe tu confirmación inmediatamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;