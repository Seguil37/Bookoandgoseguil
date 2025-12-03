// src/store/couponStore.js
import create from 'zustand';
import { couponsApi } from '@/shared/utils/api';

export const useCouponStore = create((set, get) => ({
    currentCoupon: null,
    appliedDiscount: 0,
    isValidating: false,
    error: null,

    validateCoupon: async (code, amount) => {
        set({ isValidating: true, error: null });
        
        try {
            const response = await couponsApi.validate(code, amount);
            
            if (response.data.valid) {
                set({
                    currentCoupon: response.data.coupon,
                    appliedDiscount: response.data.calculation.discount,
                    isValidating: false,
                });
                return true;
            }
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error al validar cupón',
                isValidating: false,
            });
            return false;
        }
    },

    removeCoupon: () => {
        set({ currentCoupon: null, appliedDiscount: 0, error: null });
    },
}));