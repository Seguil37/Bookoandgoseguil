// src/features/booking/pages/CartPage.jsx

import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Calendar, Users, MapPin, Clock, Check, ShoppingBag, AlertCircle, Plus, Minus, Shield, Star, CreditCard, Tag } from 'lucide-react';
import useCartStore from '../../../store/cartStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, getTotal, updateQuantity } = useCartStore();

  // Calcular totales
  const subtotal = getTotal();
  const discount = subtotal > 500 ? subtotal * 0.1 : 0; // 10% de descuento en compras mayores a S/. 500
  const taxes = subtotal * 0.18; // 18% de IGV
  const total = subtotal - discount + taxes;

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    }
  };

  const updateItemQuantity = (id, newQuantity) => {
    // Asegurar que la cantidad esté dentro de los límites
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    const minQuantity = item.adults + item.children + item.infants > 0 ? 1 : 0;
    const maxQuantity = 20; // Límite máximo de personas por reserva
    
    if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
      updateQuantity(id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-custom max-w-md">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-6 shadow-lg">
              <ShoppingBag className="w-12 h-12 text-gray-900" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-6">
              Explora nuestros tours y comienza a planificar tu próxima aventura
            </p>
            <Link to="/tours" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
              Explorar Tours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8">
      <div className="container-custom">
        {/* Header con título y botón de limpiar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 sm:mb-0">
            Mi Carrito ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
          <button
            onClick={clearCart}
            className="text-sm bg-white hover:bg-gray-100 text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-xl transition-all border border-red-200"
          >
            Limpiar carrito
          </button>
        </div>

        {/* Alerta de reserva */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300 rounded-xl p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-gray-800 font-medium">Completa tu reserva para asegurar tu lugar</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex gap-4">
                        {/* Imagen */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                          <img 
                            src={item.tour_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'} 
                            alt={item.tour_title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Detalles */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-gray-900 line-clamp-2">
                              {item.tour_title}
                            </h4>
                            <div className="flex gap-2">
                              {item.category && (
                                <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                  {item.category}
                                </span>
                              )}
                              {item.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm text-gray-600">({item.rating})</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-yellow-500" />
                              <span>{formatDate(item.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-yellow-500" />
                              <span>
                                {item.adults} adulto{item.adults > 1 ? 's' : ''}
                                {item.children > 0 && `, ${item.children} niño${item.children > 1 ? 's' : ''}`}
                                {item.infants > 0 && `, ${item.infants} infante${item.infants > 1 ? 's' : ''}`}
                              </span>
                            </div>
                            {item.special_requests && (
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 text-xs bg-yellow-50 px-2 py-1 rounded">
                                  {item.special_requests}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>Cancelación gratuita</span>
                            </div>
                          </div>

                          {/* Controles */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-full flex items-center justify-center transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                              <button 
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-full flex items-center justify-center transition-colors"
                              disabled={item.quantity >= 20}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button 
                              className="text-red-500 hover:text-red-700 p-2"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen de compra */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 animate-fade-in">
                {/* Imagen destacada del primer tour */}
                {items.length > 0 && (
                  <div className="relative mb-6 rounded-xl overflow-hidden h-48">
                    <img
                      src={items[0].tour_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'}
                      alt={items[0].tour_title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">Carrito de Compras</h3>
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h3>
                
                {/* Detalles del precio */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'tour' : 'tours'})</span>
                    <span className="font-semibold text-gray-900">S/. {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Descuento (10%)</span>
                      <span className="font-semibold text-green-600">-S/. {discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span>Impuestos (18%)</span>
                    <span className="font-semibold text-gray-900">S/. {taxes.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-yellow-500">S/. {total.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Todos los cargos incluidos</div>
                  </div>
                </div>

                {/* Botón de checkout */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Proceder al Pago
                </button>

                {/* Beneficios */}
                <div className="mt-6 space-y-4">
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Pago Seguro</p>
                        <p className="text-sm text-gray-600">Tus datos están protegidos</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Cancelación Flexible</p>
                        <p className="text-sm text-gray-600">Hasta 24 horas antes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Beneficios adicionales */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    ¿Por qué reservar con nosotros?
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Pago 100% seguro</p>
                        <p className="text-sm text-gray-600">Transacciones protegidas</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Mejor precio garantizado</p>
                        <p className="text-sm text-gray-600">Si encuentras el mismo tour más barato, te reembolsamos la diferencia</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Atención al cliente 24/7</p>
                        <p className="text-sm text-gray-600">Estamos aquí para ayudarte en cualquier momento</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Confirmación instantánea</p>
                        <p className="text-sm text-gray-600">Recibe tu confirmación inmediatamente</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;