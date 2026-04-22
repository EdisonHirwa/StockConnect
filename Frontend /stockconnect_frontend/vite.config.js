import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      global: 'window',
    },
    server: {
      proxy: {
        // Proxy all /api requests to the Spring Boot backend (avoids CORS in dev)
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
        // Proxy WebSocket /ws endpoint
        '/ws': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  }
})


