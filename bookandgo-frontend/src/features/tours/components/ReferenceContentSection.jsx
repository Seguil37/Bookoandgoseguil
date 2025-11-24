// src/features/tours/components/ReferenceContentSection.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, MapPin, Globe2, Star } from 'lucide-react';

const ReferenceContentSection = () => {
  const [activeTab, setActiveTab] = useState('attractions');

  const tabs = [
    {
      id: 'attractions',
      label: 'Atracciones Turísticas',
      icon: Landmark,
    },
    {
      id: 'destinations',
      label: 'Destinos Populares',
      icon: MapPin,
    },
    {
      id: 'countries',
      label: 'Países Populares',
      icon: Globe2,
    },
  ];

  const content = {
    attractions: [
      { name: 'Machu Picchu', count: 45, rating: 4.9 },
      { name: 'Líneas de Nazca', count: 23, rating: 4.6 },
      { name: 'Lago Titicaca', count: 31, rating: 4.7 },
      { name: 'Cañón del Colca', count: 28, rating: 4.8 },
      { name: 'Islas Ballestas', count: 19, rating: 4.5 },
      { name: 'Chan Chan', count: 12, rating: 4.4 },
      { name: 'Kuelap', count: 15, rating: 4.6 },
      { name: 'Sacsayhuamán', count: 38, rating: 4.7 },
      { name: 'Valle Sagrado', count: 42, rating: 4.8 },
      { name: 'Paracas', count: 27, rating: 4.6 },
      { name: 'Huacachina', count: 18, rating: 4.5 },
      { name: 'Montaña de 7 Colores', count: 56, rating: 4.9 },
      { name: 'Sillustani', count: 14, rating: 4.5 },
      { name: 'Gocta', count: 11, rating: 4.6 },
      { name: 'Reserva Nacional de Tambopata', count: 22, rating: 4.7 },
    ],
    destinations: [
      { name: 'Cusco', count: 145, rating: 4.8 },
      { name: 'Lima', count: 98, rating: 4.6 },
      { name: 'Arequipa', count: 67, rating: 4.7 },
      { name: 'Paracas', count: 52, rating: 4.5 },
      { name: 'Iquitos', count: 41, rating: 4.6 },
      { name: 'Puno', count: 38, rating: 4.7 },
      { name: 'Huaraz', count: 34, rating: 4.8 },
      { name: 'Trujillo', count: 29, rating: 4.5 },
      { name: 'Chiclayo', count: 25, rating: 4.6 },
      { name: 'Ayacucho', count: 21, rating: 4.5 },
      { name: 'Cajamarca', count: 19, rating: 4.6 },
      { name: 'Máncora', count: 33, rating: 4.7 },
      { name: 'Puerto Maldonado', count: 28, rating: 4.6 },
      { name: 'Huancayo', count: 17, rating: 4.5 },
      { name: 'Tarapoto', count: 24, rating: 4.6 },
    ],
    countries: [
      { name: 'Perú', count: 567, rating: 4.8 },
      { name: 'México', count: 423, rating: 4.7 },
      { name: 'Argentina', count: 389, rating: 4.6 },
      { name: 'Colombia', count: 356, rating: 4.7 },
      { name: 'Chile', count: 298, rating: 4.6 },
      { name: 'Brasil', count: 445, rating: 4.7 },
      { name: 'Ecuador', count: 234, rating: 4.6 },
      { name: 'Bolivia', count: 189, rating: 4.5 },
      { name: 'Uruguay', count: 145, rating: 4.6 },
      { name: 'Paraguay', count: 98, rating: 4.5 },
      { name: 'Venezuela', count: 167, rating: 4.6 },
      { name: 'Costa Rica', count: 278, rating: 4.7 },
      { name: 'Panamá', count: 156, rating: 4.6 },
      { name: 'Guatemala', count: 134, rating: 4.5 },
      { name: 'Cuba', count: 201, rating: 4.6 },
    ],
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Título */}
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 text-center animate-fade-in">
          Contenido Referencial
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md hover:shadow-lg'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-yellow-500'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de contenido */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
          {content[activeTab].map((item, index) => (
            <Link
              key={index}
              to={`/tours?${activeTab === 'countries' ? 'country' : 'location'}=${item.name}`}
              className="group bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-yellow-500"
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors truncate">
                {item.name}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900">{item.rating}</span>
              </div>
              
              <p className="text-sm text-gray-500">
                {item.count} {item.count === 1 ? 'tour' : 'tours'} y actividades
              </p>

              {/* Indicador de hover */}
              <div className="mt-3 h-1 w-0 group-hover:w-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 rounded-full"></div>
            </Link>
          ))}
        </div>

        {/* Ver más */}
        <div className="text-center mt-12">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explorar todos los destinos
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReferenceContentSection;