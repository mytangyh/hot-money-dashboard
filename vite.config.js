import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/hot-money-dashboard/',
  server: {
    port: 3000
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'pinyin-pro']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}) 