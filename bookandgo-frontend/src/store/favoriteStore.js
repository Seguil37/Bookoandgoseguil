// src/store/favoriteStore.js
import { create } from 'zustand';
import api from '../shared/utils/api';
import useAuthStore from './authStore';

const useFavoriteStore = create((set, get) => ({
  favorites: [],
  favoriteTours: [],
  loading: false,
  error: null,
  hasFetched: false,

  fetchFavorites: async (force = false) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role !== 'customer') {
      set({ favorites: [], hasFetched: false });
      return;
    }

    if (get().loading || (get().hasFetched && !force)) return;

    set({ loading: true, error: null });
    try {
      const response = await api.get('/favorites');
      const data = response.data.data || response.data || [];
      const favoriteIds = data.map((item) => item.id || item.tour_id || item.tour?.id).filter(Boolean);
      set({ favorites: favoriteIds, favoriteTours: data, hasFetched: true });
    } catch (error) {
      set({ error: error.response?.data?.message || 'No se pudieron cargar tus favoritos' });
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: async (tourId) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role !== 'customer') {
      throw new Error('AUTH_REQUIRED');
    }

    const response = await api.post(`/favorites/${tourId}/toggle`);
    const isFavorite = response.data?.is_favorite;

    set((state) => ({
      favorites: isFavorite
        ? [...new Set([...state.favorites, tourId])]
        : state.favorites.filter((id) => id !== tourId),
      favoriteTours: isFavorite
        ? state.favoriteTours
        : state.favoriteTours.filter((tour) => (tour.id || tour.tour_id) !== tourId),
    }));

    return response.data;
  },

  reset: () => set({ favorites: [], favoriteTours: [], hasFetched: false, error: null }),
}));

export default useFavoriteStore;
