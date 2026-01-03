import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Rahul Catering & Events',
        short_name: 'Rahul Catering',
        description: 'Catering management system',
        theme_color: '#ff9800',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-192.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})