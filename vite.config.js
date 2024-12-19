import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-files',
      closeBundle() {
        const files = ['_headers', '_routes.json', '_redirects', '_worker.js']
        files.forEach(file => {
          copyFileSync(
            resolve(__dirname, file),
            resolve(__dirname, 'dist', file)
          )
        })
      }
    }
  ],
  base: '/hot-money-dashboard/',
  server: {
    port: 3000
  },
  build: {
    sourcemap: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'pinyin-pro']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}) 