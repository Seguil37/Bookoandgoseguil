// src/features/booking/components/PaymentForm.jsx

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentForm = ({ onSubmit, loading, error }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [saveCard, setSaveCard] = useState(false);

  // Formatear número de tarjeta
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  // Formatear fecha de expiración
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

  const getCardBrand = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Tarjeta';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      paymentMethod,
      cardData: paymentMethod === 'card' ? cardData : null,
      saveCard,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Método de Pago */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Método de Pago
        </h3>

        <div className="space-y-3">
          {/* Tarjeta */}
          <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-primary"
            />
            <CreditCard className="w-6 h-6 text-gray-600" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                Tarjeta de Crédito/Débito
              </p>
              <p className="text-sm text-gray-600">
                Visa, Mastercard, American Express
              </p>
            </div>
          </label>

          {/* PayPal */}
          <label className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary">
            <input
              type="radio"
              name="payment"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-primary"
            />
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">PayPal</p>
              <p className="text-sm text-gray-600">Pago rápido y seguro</p>
            </div>
          </label>
        </div>
      </div>

      {/* Formulario de Tarjeta */}
      {paymentMethod === 'card' && (
        <div className="space-y-6">
          {/* Tarjeta Visual */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>

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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Campos */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Tarjeta *
              </label>
              <input
                type="text"
                value={cardData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-mono"
                maxLength="19"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Titular *
              </label>
              <input
                type="text"
                value={cardData.cardName}
                onChange={(e) =>
                  setCardData({ ...cardData, cardName: e.target.value.toUpperCase() })
                }
                placeholder="JUAN PÉREZ"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none uppercase"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Vencimiento *
                </label>
                <input
                  type="text"
                  value={cardData.expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/AA"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-mono"
                  maxLength="5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) =>
                    setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })
                  }
                  placeholder="123"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-mono"
                  maxLength="4"
                  required
                />
              </div>
            </div>
          </div>

          {/* Guardar tarjeta */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="w-5 h-5 text-primary rounded"
            />
            <span className="text-sm text-gray-700">
              Guardar tarjeta para futuras compras
            </span>
          </label>

          {/* Seguridad */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900 mb-1">
                  Pago 100% Seguro
                </p>
                <p className="text-sm text-green-700">
                  Tus datos están protegidos con encriptación SSL de 256 bits
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PayPal Info */}
      {paymentMethod === 'paypal' && (
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            P
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Pagar con PayPal
          </h3>
          <p className="text-gray-600 mb-4">
            Serás redirigido a PayPal para completar tu pago de forma segura
          </p>
          <div className="bg-white rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-500">
              ⚠️ Esto es una simulación - No se procesará ningún pago real
            </p>
          </div>
        </div>
      )}

      {/* Botón de Pago */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-primary hover:bg-gradient-secondary text-gray-900 font-bold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Confirmar Pago
          </>
        )}
      </button>

      {/* Disclaimer */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-700">
            <strong>Importante:</strong> Este es un sistema de pagos simulado. No se realizarán
            cargos reales a tu tarjeta. Puedes usar cualquier número de tarjeta para probar.
          </p>
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;