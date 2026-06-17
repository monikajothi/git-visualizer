import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/git-visualizer/',
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' }
  },
  server: {
    // Force dev server to use port 5173 so client and HMR proxy URLs match
    port: 5173,
  }
})
