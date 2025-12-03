// src/features/booking/components/MercadoPagoModal.jsx

import { useState } from 'react';
import { CreditCard, CheckCircle, Loader2, Shield } from 'lucide-react';
import PaymentModal from './PaymentModal';

const MercadoPagoModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleConfirmPayment = () => {
    if (email && email.includes('@')) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess({
          method: 'mercadopago',
          email: email,
          amount: amount,
          transactionId: `MP-${Date.now()}`,
        });
        onClose();
        setEmail('');
      }, 3000);
    }
  };

  return (
    <PaymentModal isOpen={isOpen} onClose={onClose} title="Pagar con Mercado Pago">
      <div className="space-y-6">
        {/* Logo Mercado Pago */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Mercado Pago</h3>
          <p className="text-blue-100">Tu dinero seguro</p>
        </div>

        {/* Monto */}
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-700 mb-1">Total a pagar</p>
          <p className="text-3xl font-black text-blue-900">
            S/ {amount.toFixed(2)}
          </p>
        </div>

        {/* Beneficios */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-3">Beneficios:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Compra protegida
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Paga en cuotas sin interés
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Devolución garantizada
            </li>
          </ul>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email de Mercado Pago
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Seguridad */}
        <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl">
          <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-900">Pago 100% seguro</p>
            <p className="text-xs text-green-700">Protegido por Mercado Pago</p>
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleConfirmPayment}
          disabled={!email || !email.includes('@') || loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Redirigiendo a Mercado Pago...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pagar con Mercado Pago
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-500">
          ⚠️ Pago simulado - Serás redirigido a Mercado Pago (simulado)
        </p>
      </div>
    </PaymentModal>
  );
};

export default MercadoPagoModal;