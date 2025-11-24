// src/shared/utils/api.js
import axios from 'axios';

// Crea una instancia base de Axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Interceptor para agregar token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ===== EXPORTS NOMBRADOS =====

// Tours
export const toursApi = {
  list: (params) => api.get('/tours', { params }),
  show: (id) => api.get(`/tours/${id}`),
  featured: () => api.get('/tours/featured'),
  related: (id) => api.get(`/tours/${id}/related`),
};

// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};


// Documentos
export const bookingDocumentsApi = {
  list: (bookingId) => api.get(`/bookings/${bookingId}/documents`),
  
  downloadVoucher: async (bookingId) => {
    const response = await api.get(
      `/bookings/${bookingId}/documents/voucher`,
      { responseType: 'blob' }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `voucher-${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  
  generateInvoice: (bookingId, data) => 
    api.post(`/bookings/${bookingId}/documents/invoice`, data),
};

// Mensajes
export const messagesApi = {
  conversations: () => api.get('/messages/conversations'),
  unreadCount: () => api.get('/messages/unread-count'),
  list: (bookingId) => api.get(`/bookings/${bookingId}/messages`),
  
  send: async (bookingId, message, files = []) => {
    const formData = new FormData();
    formData.append('message', message);
    
    files.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
    
    return api.post(`/bookings/${bookingId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  markAllRead: (bookingId) => 
    api.post(`/bookings/${bookingId}/messages/mark-all-read`),
};

// Cupones
export const couponsApi = {
  validate: (code, amount) => 
    api.post('/coupons/validate', { code, amount }),
  
  // Admin
  list: (params) => api.get('/admin/coupons', { params }),
  create: (data) => api.post('/admin/coupons', data),
  update: (id, data) => api.put(`/admin/coupons/${id}`, data),
  delete: (id) => api.delete(`/admin/coupons/${id}`),
  toggleStatus: (id) => api.post(`/admin/coupons/${id}/toggle-status`),
  statistics: () => api.get('/admin/coupons/statistics'),
};

// Configuraciones
export const settingsApi = {
  public: () => api.get('/settings/public'),
  
  // Admin
  list: (group) => api.get('/admin/settings', { params: { group } }),
  update: (key, data) => api.put(`/admin/settings/${key}`, data),
  updateGroup: (group, settings) => 
    api.put(`/admin/settings/group/${group}`, { settings }),
  clearCache: () => api.post('/admin/settings/clear-cache'),
};

// ===== EXPORT DEFAULT =====
export default api;