// src/features/booking/pages/CheckoutPage.jsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Lock, 
  AlertCircle,
  Loader2,
  Calendar,
  Users,
  Smartphone
} from 'lucide-react';
import useCartStore from '../../../store/cartStore';
import useAuthStore from '../../../store/authStore';
import api from '../../../shared/utils/api';
import PayPalButton from '../components/PayPalButton';
import YapeModal from '../components/YapeModal';
import PlinModal from '../components/PlinModal';
import MercadoPagoModal from '../components/MercadoPagoModal';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const isProcessingPayment = useRef(false);
  
  // Modales
  const [showYapeModal, setShowYapeModal] = useState(false);
  const [showPlinModal, setShowPlinModal] = useState(false);
  const [showMercadoPagoModal, setShowMercadoPagoModal] = useState(false);
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const total = getTotal();
  const totalUSD = (total / 3.75).toFixed(2);

  useEffect(() => {
    if (items.length === 0 && !isProcessingPayment.current) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardData({ ...cardData, expiryDate: formatted });
  };

  const validateCard = () => {
    const errors = [];
    
    const cardNumberDigits = cardData.cardNumber.replace(/\s/g, '');
    if (cardNumberDigits.length !== 16) {
      errors.push('Número de tarjeta debe tener 16 dígitos');
    }

    if (!cardData.cardName.trim()) {
      errors.push('Nombre en la tarjeta es requerido');
    }

    if (cardData.expiryDate.length !== 5) {
      errors.push('Fecha de expiración inválida');
    }

    if (cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      errors.push('CVV debe tener 3 o 4 dígitos');
    }

    return errors;
  };

  const createBookings = async (paymentMethodUsed, paymentDetails = {}) => {
    console.log('Creating bookings...', items);

    try {
      const bookingPromises = items.map(item => 
        api.post('/bookings', {
          tour_id: item.tour_id,
          booking_date: item.date,
          booking_time: item.time || null,
          adults: item.adults || 1,
          children: item.children || 0,
          infants: item.infants || 0,
          special_requests: item.special_requests || '',
          total_price: parseFloat(item.total_price),
          payment_method: paymentMethodUsed,
        })
      );

      const responses = await Promise.all(bookingPromises);
      console.log('Bookings created:', responses);
      
      return responses;
    } catch (error) {
      console.error('Error creating bookings:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const completePayment = (paymentMethodUsed, paymentDetails = {}) => {
    const paymentData = {
      totalPaid: total,
      bookingsCount: items.length,
      paymentMethod: paymentMethodUsed,
      ...paymentDetails,
    };

    clearCart();

    navigate('/booking/success', { 
      state: paymentData,
      replace: true
    });
  };

  const handlePayment = async () => {
    setError(null);
    isProcessingPayment.current = true;

    const validationErrors = validateCard();

    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      isProcessingPayment.current = false;
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await createBookings('card', { cardLast4: cardData.cardNumber.slice(-4) });
      completePayment('card');
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err.response?.data?.message || 'Error al procesar el pago. Por favor intenta de nuevo.');
      isProcessingPayment.current = false;
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalSuccess = async (details) => {
    setLoading(true);
    isProcessingPayment.current = true;

    try {
      console.log('PayPal payment details:', details);
      await createBookings('paypal', { transactionId: details.id });
      completePayment('paypal', { transactionId: details.id });
    } catch (err) {
      console.error('Error processing PayPal payment:', err);
      setError('Error al procesar el pago con PayPal');
      isProcessingPayment.current = false;
    } finally {
      setLoading(false);
    }
  };

  const handleYapeSuccess = async (details) => {
    setLoading(true);
    isProcessingPayment.current = true;
    
    try {
      console.log('Yape payment details:', details);
      await createBookings('yape', details);
      completePayment('yape', details);
    } catch (err) {
      console.error('Error processing Yape payment:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Error al procesar el pago con Yape');
      isProcessingPayment.current = false;
      setShowYapeModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePlinSuccess = async (details) => {
    setLoading(true);
    isProcessingPayment.current = true;
    
    try {
      await createBookings('plin', details);
      completePayment('plin', details);
    } catch (err) {
      console.error('Error processing Plin payment:', err);
      setError('Error al procesar el pago con Plin');
      isProcessingPayment.current = false;
      setShowPlinModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleMercadoPagoSuccess = async (details) => {
    setLoading(true);
    isProcessingPayment.current = true;
    
    try {
      await createBookings('mercadopago', details);
      completePayment('mercadopago', details);
    } catch (err) {
      console.error('Error processing Mercado Pago payment:', err);
      setError('Error al procesar el pago con Mercado Pago');
      isProcessingPayment.current = false;
      setShowMercadoPagoModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalError = (error) => {
    console.error('PayPal error:', error);
    setError('Error al procesar el pago con PayPal. Por favor intenta de nuevo.');
  };

  const getCardBrand = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Tarjeta';
  };

  if (items.length === 0 && !isProcessingPayment.current) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="checkout-page-container">
        <div className="container-custom max-w-6xl">
          <h1 className="text-3xl font-black text-gray-900 mb-8">
            Finalizar Reserva
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulario de Pago */}
            <div className="lg:col-span-2 space-y-6">
              {/* Métodos de Pago */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Método de Pago
                </h2>

                <div className="space-y-4">
                  {/* Tarjeta */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-500'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-yellow-500"
                    />
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      Tarjeta de Crédito/Débito
                    </span>
                  </label>

                  {/* Yape */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'yape' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-500'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="yape"
                      checked={paymentMethod === 'yape'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-yellow-500"
                    />
                    <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">Yape</span>
                      <p className="text-xs text-gray-600">BCP - Billetera digital</p>
                    </div>
                  </label>

                  {/* Plin */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'plin' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-500'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="plin"
                      checked={paymentMethod === 'plin'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-yellow-500"
                    />
                    <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">Plin</span>
                      <p className="text-xs text-gray-600">Pago móvil multibanco</p>
                    </div>
                  </label>

                  {/* Mercado Pago */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'mercadopago' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-500'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="mercadopago"
                      checked={paymentMethod === 'mercadopago'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-yellow-500"
                    />
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                      MP
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">Mercado Pago</span>
                      <p className="text-xs text-gray-600">Paga seguro y en cuotas</p>
                    </div>
                  </label>

                  {/* PayPal */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'paypal' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-500'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-yellow-500"
                    />
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                      P
                    </div>
                    <span className="font-semibold text-gray-900">PayPal</span>
                  </label>
                </div>
              </div>

              {/* Formulario de Tarjeta */}
              {paymentMethod === 'card' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Información de la Tarjeta
                  </h2>

                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                      <div className="mb-8">
                        <div className="text-xs opacity-70 mb-1">Número de Tarjeta</div>
                        <div className="text-xl font-mono tracking-wider">
                          {cardData.cardNumber || '•••• •••• •••• ••••'}
                        </div>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-70 mb-1">Titular</div>
                          <div className="font-semibold">
                            {cardData.cardName || 'NOMBRE APELLIDO'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs opacity-70 mb-1">Vence</div>
                          <div className="font-mono">
                            {cardData.expiryDate || 'MM/AA'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {getCardBrand(cardData.cardNumber)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none font-mono"
                        maxLength="19"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre en la Tarjeta
                      </label>
                      <input
                        type="text"
                        value={cardData.cardName}
                        onChange={(e) => setCardData({ ...cardData, cardName: e.target.value.toUpperCase() })}
                        placeholder="JUAN PÉREZ"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fecha de Expiración
                        </label>
                        <input
                          type="text"
                          value={cardData.expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/AA"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none font-mono"
                          maxLength="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                          placeholder="123"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none font-mono"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>Tus datos están protegidos y encriptados</span>
                  </div>
                </div>
              )}

              {/* Botón Yape */}
              {paymentMethod === 'yape' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Pago con Yape
                  </h2>

                  <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white text-center mb-6">
                    <Smartphone className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Yape</h3>
                    <p className="text-purple-200 text-sm">BCP - Billetera digital</p>
                  </div>

                  <button
                    onClick={() => setShowYapeModal(true)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Continuar con Yape'}
                  </button>
                </div>
              )}

              {/* Botón Plin */}
              {paymentMethod === 'plin' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Pago con Plin
                  </h2>

                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-white text-center mb-6">
                    <Smartphone className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Plin</h3>
                    <p className="text-cyan-100 text-sm">Pago móvil multibanco</p>
                  </div>

                  <button
                    onClick={() => setShowPlinModal(true)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Continuar con Plin'}
                  </button>
                </div>
              )}

              {/* Botón Mercado Pago */}
              {paymentMethod === 'mercadopago' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Pago con Mercado Pago
                  </h2>

                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-white text-center mb-6">
                    <CreditCard className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Mercado Pago</h3>
                    <p className="text-blue-100 text-sm">Tu dinero seguro</p>
                  </div>

                  <button
                    onClick={() => setShowMercadoPagoModal(true)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Continuar con Mercado Pago'}
                  </button>
                </div>
              )}

              {/* PayPal */}
              {paymentMethod === 'paypal' && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Pago con PayPal
                    </h2>

                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                      <p className="text-sm text-blue-900">
                        <strong>Total a pagar:</strong> ${totalUSD} USD (aprox. S/. {total.toFixed(2)})
                      </p>
                    </div>
                  </div>
                  
                  <div className="paypal-isolated-container bg-gray-50 p-6 border-t border-gray-200">
                    <div className="paypal-wrapper">
                      <PayPalButton
                        amount={parseFloat(totalUSD)}
                        onSuccess={handlePayPalSuccess}
                        onError={handlePayPalError}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resumen del Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Resumen de la Reserva
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  {items.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-3">
                        <img
                          src={item.tour_image || 'https://via.placeholder.com/100'}
                          alt={item.tour_title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {item.tour_title}
                          </h4>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.date).toLocaleDateString('es-PE', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {item.adults} adulto{item.adults > 1 ? 's' : ''}
                          {item.children > 0 && `, ${item.children} niño${item.children > 1 ? 's' : ''}`}
                          {item.infants > 0 && `, ${item.infants} infante${item.infants > 1 ? 's' : ''}`}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-gray-900">
                          S/. {parseFloat(item.total_price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">S/. {total.toFixed(2)}</span>
                  </div>
                  {paymentMethod === 'paypal' && (
                    <div className="flex justify-between text-gray-700">
                      <span>En USD</span>
                      <span className="font-semibold">${totalUSD} USD</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Impuestos y cargos</span>
                    <span className="font-semibold">S/. 0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-xl font-black text-gray-900">Total</span>
                    <span className="text-2xl font-black text-yellow-500">
                      S/. {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Botón de Pago (Solo para Card) */}
                {paymentMethod === 'card' && (
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Pagar S/. {total.toFixed(2)}
                      </>
                    )}
                  </button>
                )}

                {paymentMethod === 'paypal' && (
                  <p className="text-sm text-gray-600 text-center">
                    Usa los botones de PayPal arriba para completar tu pago
                  </p>
                )}

                {(paymentMethod === 'yape' || paymentMethod === 'plin' || paymentMethod === 'mercadopago') && (
                  <p className="text-sm text-gray-600 text-center">
                    Haz clic en el botón arriba para continuar con el pago
                  </p>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                  {paymentMethod === 'paypal' 
                    ? '✓ PayPal Sandbox - Usa tu cuenta de prueba' 
                    : '⚠️ Este es un pago simulado. No se procesarán cargos reales.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <YapeModal
        isOpen={showYapeModal}
        onClose={() => {
          setShowYapeModal(false);
          setError(null);
        }}
        amount={total}
        onSuccess={handleYapeSuccess}
      />

      <PlinModal
        isOpen={showPlinModal}
        onClose={() => {
          setShowPlinModal(false);
          setError(null);
        }}
        amount={total}
        onSuccess={handlePlinSuccess}
      />

      <MercadoPagoModal
        isOpen={showMercadoPagoModal}
        onClose={() => {
          setShowMercadoPagoModal(false);
          setError(null);
        }}
        amount={total}
        onSuccess={handleMercadoPagoSuccess}
      />
    </div>
  );
};

export default CheckoutPage;