import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jspdf', 'qrcode.react'],
    exclude: ['html2canvas']
  },
  build: {
    rollupOptions: {
      external: ['html2canvas']
    }
  }
})
