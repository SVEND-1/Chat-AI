import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
    plugins: [react()],
    server: {
        host: "localhost",
        port: 5173,
        strictPort: true,
    },
});
/*
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'react-frontend',
      'localhost',
      '.twc1.net',
      '6106779-ee569251.twc1.net'
    ],
    strictPort: true,
    hmr: {
      host: '6106779-ee569251.twc1.net',
      protocol: 'ws',
      clientPort: 80
    },
    cors: true
  },
  preview: {
    port: 5173,
    host: true,
    allowedHosts: [
      'react-frontend',
      'localhost',
      '.twc1.net',
      '6106779-ee569251.twc1.net'
    ]
  }
}) */