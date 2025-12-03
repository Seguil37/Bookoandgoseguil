import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 🔄 Cambiar temporalmente a 5173
    strictPort: false, // ✅ Si está ocupado, busca otro puerto
    open: true, // Abre el navegador automáticamente
    host: true, // Escucha en todas las interfaces
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  },
  // ✅ Optimizaciones adicionales
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})