// src/features/booking/components/YapeModal.jsx

import { useState } from 'react';
import { Smartphone, CheckCircle, Loader2, Copy, Check } from 'lucide-react';
import PaymentModal from './PaymentModal';

const YapeModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const yapeNumber = '987 654 321';
  const yapeName = 'Book&Go Tours';

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.slice(0, 9);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(yapeNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    if (phoneNumber.length === 9) {
      setStep(2);
    }
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        method: 'yape',
        phone: phoneNumber,
        amount: amount,
        transactionId: `YAPE-${Date.now()}`,
      });
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    setStep(1);
    setPhoneNumber('');
    setLoading(false);
    onClose();
  };

  return (
    <PaymentModal isOpen={isOpen} onClose={handleClose} title="Pagar con Yape">
      {step === 1 && (
        <div className="space-y-6">
          {/* Logo Yape */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Yape</h3>
            <p className="text-purple-200">Billetera digital del BCP</p>
          </div>

          {/* Monto a pagar */}
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-sm text-purple-700 mb-1">Total a pagar</p>
            <p className="text-3xl font-black text-purple-900">
              S/ {amount.toFixed(2)}
            </p>
          </div>

          {/* Instrucciones */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-3">Instrucciones:</h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold text-purple-600">1.</span>
                  Abre tu app de Yape
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-purple-600">2.</span>
                  Selecciona "Yapear"
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-purple-600">3.</span>
                  Ingresa el número: <strong>{yapeNumber}</strong>
                  <button
                    onClick={handleCopyNumber}
                    className="ml-auto p-1 hover:bg-gray-200 rounded"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-purple-600">4.</span>
                  Yapea S/ {amount.toFixed(2)} a {yapeName}
                </li>
              </ol>
            </div>

            {/* Input de teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tu número de celular
              </label>
              <div className="flex gap-2">
                <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 font-mono">
                  +51
                </div>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
                  placeholder="987654321"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono"
                  maxLength="9"
                />
              </div>
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={handleContinue}
            disabled={phoneNumber.length !== 9}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ya Yapeé
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Confirmación */}
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Confirma tu Yape
            </h3>
            <p className="text-gray-600">
              Estamos verificando tu pago
            </p>
          </div>

          {/* Detalles */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Monto</span>
              <span className="font-bold text-gray-900">S/ {amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Destino</span>
              <span className="font-bold text-gray-900">{yapeNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tu número</span>
              <span className="font-bold text-gray-900">+51 {phoneNumber}</span>
            </div>
          </div>

          {/* Nota */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Asegúrate de haber enviado el Yape antes de confirmar.
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando pago...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirmar Pago
                </>
              )}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-all"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </PaymentModal>
  );
};

export default YapeModal;