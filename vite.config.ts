import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Crucial for Docker
    port: 8080,      // Must match Fly.io internal_port
    strictPort: true
  },
  preview: {
    host: '0.0.0.0',
    port: 8080
  }
})