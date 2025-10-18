import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <-- allows access from other devices on the network
    port: 3000,
     sourcemap: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  preview: {
    port: 3000,
    host: true,
  }
})
