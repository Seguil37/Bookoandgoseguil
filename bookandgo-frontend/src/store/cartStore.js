// src/store/cartStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Agregar item al carrito
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, { ...item, id: Date.now() }],
        }));
      },

      // Remover item del carrito
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      // Actualizar item
      updateItem: (itemId, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        }));
      },

      // Actualizar cantidad (para compatibilidad con CartPage)
      updateQuantity: (tourId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.tour_id === tourId ? { ...item, quantity } : item
          ),
        }));
      },

      // Limpiar carrito
      clearCart: () => {
        set({ items: [] });
      },

      // Obtener total - FUNCIÓN
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + (item.total_price || 0), 0);
      },

      // Obtener cantidad de items - FUNCIÓN
      getItemCount: () => {
        return get().items.length;
      },

      // Computed values (como propiedades)
      getTotal: () => {
        const items = get().items;
        return items.reduce((sum, item) => {
          const price = parseFloat(item.total_price || 0);
          return sum + price;
        }, 0);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;