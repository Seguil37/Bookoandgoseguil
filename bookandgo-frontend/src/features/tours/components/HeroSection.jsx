// src/features/tours/components/HeroSection.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Star } from 'lucide-react';

const HeroSection = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
  });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.destination) params.append('location', searchData.destination);
    if (searchData.checkIn) params.append('from', searchData.checkIn);
    if (searchData.checkOut) params.append('to', searchData.checkOut);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <section className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10"></div>
        <img
          src="https://images.pexels.com/photos/1146708/pexels-photo-1146708.jpeg"
          alt="Travel Background"
          className="w-full h-full object-cover animate-slow-zoom"
        />
      </div>

      {/* Contenido */}
      <div className="container-custom relative z-20 text-center">
        <div className="animate-fade-in">
          {/* Logo y título principal */}
          <div className="mb-6">
            <h1 className="text-6xl lg:text-8xl font-black text-white mb-2 tracking-tight">
              BOOK<span className="text-yellow-400">&</span>GO
            </h1>
            <p className="text-xl lg:text-2xl text-yellow-400 font-semibold tracking-wide">
              Un click, mil destinos
            </p>
          </div>

          {/* Buscador */}
          <form
            onSubmit={handleSearch}
            className="max-w-5xl mx-auto mt-12 bg-white rounded-2xl shadow-2xl p-4 lg:p-6 animate-slide-up"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* ¿A dónde vas? */}
              <div className="relative">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  ¿A dónde vas?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Destino, ciudad o tour"
                    value={searchData.destination}
                    onChange={(e) =>
                      setSearchData({ ...searchData, destination: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              {/* Check In */}
              <div className="relative">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Check In
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkIn: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              {/* Check Out */}
              <div className="relative">
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Check Out
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkOut: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              {/* Botón Buscar */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Buscar
                </button>
              </div>
            </div>
          </form>

          {/* Tags populares */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-white text-sm font-medium">Búsquedas populares:</span>
            {['Machu Picchu', 'Lima', 'Cusco', 'Arequipa', 'Paracas'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchData({ ...searchData, destination: tag });
                }}
                className="px-4 py-1 bg-white/20 hover:bg-yellow-400 backdrop-blur-sm text-white hover:text-gray-900 rounded-full text-sm font-medium transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Indicadores de confianza */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Star, text: 'Más de 10,000 experiencias', count: '10K+' },
              { icon: Star, text: 'Viajeros satisfechos', count: '50K+' },
              { icon: Star, text: 'Guías certificados', count: '500+' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold">{item.count}</span>
                  </div>
                  <p className="text-sm">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;