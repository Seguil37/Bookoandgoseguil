// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../shared/utils/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login
      login: async (email, password) => {
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/auth/login', { 
            email, 
            password 
          });

          const { user, token } = response.data;

          // Guardar token en localStorage
          localStorage.setItem('token', token);
          
          // Configurar token en axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: errorMessage,
          });

          return { success: false, error: errorMessage };
        }
      },

      // Register
      register: async (userData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/auth/register', userData);

          const { user, token } = response.data;

          // Guardar token
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Error al registrarse';
          
          set({
            loading: false,
            error: errorMessage,
          });

          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        } finally {
          // Limpiar todo
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      },

      // Actualizar usuario
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      // Verificar autenticación al cargar la app
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          // Configurar token en axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Obtener usuario actual
          const response = await api.get('/auth/me');
          
          set({
            user: response.data.user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Token inválido:', error);
          
          // Token inválido, limpiar
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      // Limpiar errores
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;