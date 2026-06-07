import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
    plugins: [
        react(),
        svgr(),
    ],
    define: {
        global: 'globalThis',
    },
    server: {
        host: "localhost",
        port: 5173,
        strictPort: true,
        proxy: {
            // Все REST запросы /api/... → Spring Boot
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            // WebSocket — SockJS сначала делает HTTP запросы к /ws/support/info
            // потом апгрейдит до ws://, поэтому нужен и ws: true
            '/ws': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                ws: true,
            },
        },
    },
})
