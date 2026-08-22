import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawApiUrl = env.VITE_API_URL?.trim()
  const apiTarget =
    rawApiUrl && rawApiUrl !== '/'
      ? rawApiUrl.replace(/\/+$/, '')
      : 'http://localhost:3001'

  return {
    plugins: [react()],
    server: {
      host: 'localhost',
      port: 5178,
      strictPort: false,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
