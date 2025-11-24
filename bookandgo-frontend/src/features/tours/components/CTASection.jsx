// src/features/tours/components/CTASection.jsx

import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Star, Shield, Gift } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const CTASection = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return null;

  return (
    <section className="py-20 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 relative overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Título principal */}
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 animate-fade-in">
            Inicia sesión para gestionar tus reservas
          </h2>

          {/* Subtítulo */}
          <p className="text-xl text-gray-800 mb-8 animate-fade-in">
            ¿Aún no tienes una cuenta? Regístrate ahora y accede a ofertas exclusivas
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              to="/login"
              className="group bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3 min-w-[200px] justify-center"
            >
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Iniciar Sesión
            </Link>

            <Link
              to="/register"
              className="group bg-white hover:bg-gray-50 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3 min-w-[200px] justify-center border-2 border-gray-900"
            >
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Registrarse
            </Link>
          </div>

          {/* Beneficios */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Gift, text: 'Ofertas exclusivas', color: 'from-yellow-400 to-orange-500' },
              { icon: Star, text: 'Puntos de recompensa', color: 'from-blue-400 to-blue-600' },
              { icon: Shield, text: 'Gestión fácil y rápida', color: 'from-green-400 to-green-600' },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;