// src/features/booking/components/CouponInput.jsx
import { useState } from 'react';
import { useCouponStore } from '@/store/couponStore';

export const CouponInput = ({ subtotal }) => {
    const [code, setCode] = useState('');
    const { 
        currentCoupon, 
        appliedDiscount, 
        validateCoupon, 
        removeCoupon, 
        isValidating,
        error 
    } = useCouponStore();

    const handleApply = async () => {
        if (!code.trim()) return;
        await validateCoupon(code, subtotal);
    };

    return (
        <div className="coupon-section">
            {!currentCoupon ? (
                <div className="coupon-input-group">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Código de cupón"
                        disabled={isValidating}
                    />
                    <button 
                        onClick={handleApply}
                        disabled={isValidating || !code}
                    >
                        {isValidating ? 'Validando...' : 'Aplicar'}
                    </button>
                </div>
            ) : (
                <div className="coupon-applied">
                    <span>Cupón {currentCoupon.code} aplicado</span>
                    <span>-S/ {appliedDiscount.toFixed(2)}</span>
                    <button onClick={removeCoupon}>×</button>
                </div>
            )}
            
            {error && <p className="error">{error}</p>}
        </div>
    );
};