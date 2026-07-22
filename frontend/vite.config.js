import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5000'
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    fileParallelism: false,
    setupFiles: './src/test/setup.js',
    env: { VITE_API_BASE_URL: 'http://localhost:5000/api' },
    exclude: [
      'e2e/**',
      'node_modules/**',
      'dist/**',
      // Superseded by RentalWorkflow.integration.test.jsx and
      // GuestInquiryRouting.test.jsx after the request/guest UI redesign.
      'src/test/CustomerRequests.test.jsx',
      'src/test/GuestRooms.test.jsx'
    ]
  }
})
