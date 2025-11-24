// src/shared/components/Layout/Header.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X, MapPin, Phone, Mail } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import useCartStore from '../../../store/cartStore';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tours?search=${searchQuery}`);
    }
  };

  const cartCount = items.length;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo y Buscador */}
          <div className="flex items-center gap-8 flex-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-gray-900">B&G</span>
              </div>
              <span className="text-2xl font-black text-gray-900 hidden sm:block">
                BOOK<span className="text-yellow-500">&</span>GO
              </span>
            </Link>

            {/* Barra de búsqueda */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="¿A dónde quieres ir?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-4 ml-6">
            {/* Contacto */}
            <div className="hidden xl:flex items-center gap-4 text-sm">
              <a href="mailto:info@bookandgo.com" className="flex items-center gap-1 text-gray-600 hover:text-yellow-500 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">Contactanos</span>
              </a>
            </div>

            {/* Hazte Proveedor */}
            {!isAuthenticated || user?.role === 'customer' ? (
              <Link
                to="/become-agency"
                className="hidden md:block text-gray-700 hover:text-yellow-500 font-semibold transition-colors"
              >
                Hazte Proveedor
              </Link>
            ) : null}

            {/* Carrito */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Usuario */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-all">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:block font-medium text-gray-700">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 hover:bg-gray-50 rounded-t-xl transition-colors"
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    to="/profile/bookings"
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    Mis Reservas
                  </Link>
                  <Link
                    to="/favorites"
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    Favoritos
                  </Link>
                  {user?.role === 'agency' && (
                    <Link
                      to="/agency/dashboard"
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors border-t"
                    >
                      Dashboard Agencia
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 rounded-b-xl transition-colors border-t"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:block">Iniciar Sesión</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="¿A dónde quieres ir?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-yellow-500 focus:outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <a href="tel:+51987654321" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-yellow-500" />
                <span>+51 987 654 321</span>
              </a>
              <a href="mailto:info@bookandgo.com" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-yellow-500" />
                <span>Contacto</span>
              </a>
              {!isAuthenticated && (
                <Link
                  to="/become-agency"
                  className="px-4 py-2 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hazte Proveedor
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;