import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose API_URL (in addition to the default VITE_* vars) to client code
  envPrefix: ['VITE_', 'API_URL'],
})
