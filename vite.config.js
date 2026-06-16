import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' }
  },
  server: {
    // Force dev server to use port 5173 so client and HMR proxy URLs match
    port: 5173,
    proxy: {
      // All calls to /api/claude get forwarded to Anthropic
      // This bypasses CORS — only works in dev (npm run dev)
      '/api/claude': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, ''),
        headers: {
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        }
      }
    }
  }
})